import { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Badge } from 'react-bootstrap';
import { ProjectStatus } from '@/types/project';

export interface ProjectFiltersData {
	status: string;
	search: string;
}

interface ProjectFiltersProps {
	onFilterChange: (filters: ProjectFiltersData) => void;
	filters: ProjectFiltersData;
}

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
	const [debouncedValue, setDebouncedValue] = useState<T>(value);

	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedValue(value);
		}, delay);

		return () => {
			clearTimeout(handler);
		};
	}, [value, delay]);

	return debouncedValue;
}

const ProjectFilters = ({ onFilterChange, filters }: ProjectFiltersProps) => {
	const [localSearch, setLocalSearch] = useState(filters.search);
	const debouncedSearch = useDebounce(localSearch, 300);

	// Update parent when debounced search changes
	useEffect(() => {
		onFilterChange({ ...filters, search: debouncedSearch });
	}, [debouncedSearch]);

	const handleStatusChange = (newStatus: string) => {
		onFilterChange({ ...filters, status: newStatus });
	};

	const handleClearFilters = () => {
		setLocalSearch('');
		onFilterChange({ status: 'All', search: '' });
	};

	return (
		<>
			<Row className="mb-3 align-items-end">
				<Col md={4}>
					<Form.Group>
						<Form.Label>
							<i className="mdi mdi-filter-outline me-1"></i>
							Filter by Status
						</Form.Label>
						<Form.Select 
							value={filters.status} 
							onChange={(e) => handleStatusChange(e.target.value)}
						>
							<option value="All">All Statuses</option>
							{Object.values(ProjectStatus).map(status => (
								<option key={status} value={status}>
									{status.replace(/([A-Z])/g, ' $1').trim()}
								</option>
							))}
						</Form.Select>
					</Form.Group>
				</Col>
				<Col md={6}>
					<Form.Group>
						<Form.Label>
							<i className="mdi mdi-magnify me-1"></i>
							Search Projects
						</Form.Label>
						<Form.Control
							type="text"
							placeholder="Search by name, description, or location..."
							value={localSearch}
							onChange={(e) => setLocalSearch(e.target.value)}
						/>
					</Form.Group>
				</Col>
				<Col md={2}>
					<Button 
						variant="light" 
						onClick={handleClearFilters}
						className="w-100"
						disabled={filters.status === 'All' && !filters.search}
					>
						<i className="mdi mdi-refresh me-1"></i>
						Clear
					</Button>
				</Col>
			</Row>

			{/* Active Filters Summary */}
			{(filters.status !== 'All' || filters.search) && (
				<Row className="mb-2">
					<Col>
						<div className="d-flex align-items-center gap-2">
							<small className="text-muted">Active filters:</small>
							{filters.status !== 'All' && (
								<Badge 
									bg="primary" 
									className="d-flex align-items-center gap-1"
									style={{ cursor: 'pointer' }}
									onClick={() => onFilterChange({ ...filters, status: 'All' })}
								>
									Status: {filters.status.replace(/([A-Z])/g, ' $1').trim()}
									<i className="mdi mdi-close-circle"></i>
								</Badge>
							)}
							{filters.search && (
								<Badge 
									bg="info" 
									className="d-flex align-items-center gap-1"
									style={{ cursor: 'pointer' }}
									onClick={() => {
										setLocalSearch('');
										onFilterChange({ ...filters, search: '' });
									}}
								>
									Search: "{filters.search}"
									<i className="mdi mdi-close-circle"></i>
								</Badge>
							)}
						</div>
					</Col>
				</Row>
			)}
		</>
	);
};

export default ProjectFilters;
