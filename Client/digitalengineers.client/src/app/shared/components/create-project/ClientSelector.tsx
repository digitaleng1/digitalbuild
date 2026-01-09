import { useState, useEffect, useMemo, useCallback } from 'react';
import { Form, FormGroup, FormLabel, Alert } from 'react-bootstrap';
import Select, { type SingleValue } from 'react-select';
import clientService from '@/services/clientService';
import type { ClientListItem } from '@/types/client';

interface ClientSelectorProps {
	value?: string;
	onChange: (clientId: string | null) => void;
	disabled?: boolean;
	required?: boolean;
}

interface ClientOption {
	value: string;
	label: string;
	data: ClientListItem;
}

const ClientSelector = ({ value, onChange, disabled, required }: ClientSelectorProps) => {
	const [clients, setClients] = useState<ClientListItem[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [searchTerm, setSearchTerm] = useState('');

	const loadClients = useCallback(async (search?: string) => {
		try {
			setLoading(true);
			setError(null);
			const data = await clientService.getClientList(search || undefined);
			setClients(data);
		} catch (err: unknown) {
			const errorMessage = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to load clients';
			setError(errorMessage);
			setClients([]);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		loadClients(searchTerm);
	}, [loadClients, searchTerm]);

	const options: ClientOption[] = useMemo(() => {
		return clients.map(client => ({
			value: client.userId,
			label: client.companyName 
				? `${client.name} (${client.companyName})` 
				: client.name,
			data: client
		}));
	}, [clients]);

	const selectedOption = useMemo(() => {
		return options.find(opt => opt.value === value) || null;
	}, [options, value]);

	const handleChange = (newValue: SingleValue<ClientOption>) => {
		onChange(newValue ? newValue.value : null);
	};

	const handleInputChange = (inputValue: string) => {
		setSearchTerm(inputValue);
	};

	const formatOptionLabel = (option: ClientOption) => (
		<div className="d-flex align-items-center">
			{option.data.profilePictureUrl ? (
				<img
					src={option.data.profilePictureUrl}
					alt={option.data.name}
					className="rounded-circle me-2"
					style={{ width: '32px', height: '32px', objectFit: 'cover' }}
				/>
			) : (
				<div
					className="rounded-circle d-flex align-items-center justify-content-center bg-primary text-white me-2"
					style={{ width: '32px', height: '32px', fontSize: '14px', fontWeight: 'bold' }}
				>
					{option.data.name.charAt(0)}
				</div>
			)}
			<div>
				<div style={{ fontWeight: '500' }}>{option.data.name}</div>
				<small className="text-muted">
					{option.data.companyName ? `${option.data.companyName} • ` : ''}
					{option.data.email}
				</small>
			</div>
		</div>
	);

	if (error) {
		return (
			<FormGroup className="mb-3">
				<FormLabel>
					Select Client {required && <span className="text-danger">*</span>}
				</FormLabel>
				<Alert variant="danger">{error}</Alert>
			</FormGroup>
		);
	}

	return (
		<FormGroup className="mb-3">
			<FormLabel>
				Select Client {required && <span className="text-danger">*</span>}
			</FormLabel>
			<Select
				value={selectedOption}
				onChange={handleChange}
				onInputChange={handleInputChange}
				options={options}
				isLoading={loading}
				isDisabled={disabled}
				isClearable
				placeholder="Search and select client..."
				formatOptionLabel={formatOptionLabel}
				noOptionsMessage={() => 'No clients found'}
				styles={{
					control: (base) => ({
						...base,
						minHeight: '48px',
					}),
					menu: (base) => ({
						...base,
						zIndex: 9999,
					})
				}}
			/>
			{required && !value && (
				<Form.Text className="text-danger">
					Please select a client for this project
				</Form.Text>
			)}
		</FormGroup>
	);
};

export default ClientSelector;
