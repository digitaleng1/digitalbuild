import { useState, useEffect, useMemo } from 'react';
import { Alert, Spinner } from 'react-bootstrap';
import type { Profession, ProfessionTypeDetailDto } from '@/types/lookup';
import lookupService from '@/services/lookupService';
import ProfessionBadge from './ProfessionBadge';
import ProfessionTypeModal from './ProfessionTypeModal';
import ProfessionTypeBadge from './ProfessionTypeBadge';

interface ProfessionTypeSelectorProps {
	value: number[]; // professionTypeIds
	onChange: (professionTypeIds: number[]) => void;
}

const ProfessionTypeSelector = ({ value, onChange }: ProfessionTypeSelectorProps) => {
	const [professions, setProfessions] = useState<Profession[]>([]);
	const [selectedProfessionTypes, setSelectedProfessionTypes] = useState<ProfessionTypeDetailDto[]>([]);
	const [loading, setLoading] = useState(true);
	const [loadingTypes, setLoadingTypes] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [modalState, setModalState] = useState<{
		show: boolean;
		profession: Profession | null;
	}>({ show: false, profession: null });

	// Load professions on mount
	useEffect(() => {
		loadProfessions();
	}, []);

	// Load selected profession types when value changes
	useEffect(() => {
		if (value.length > 0) {
			loadSelectedProfessionTypes();
		} else {
			setSelectedProfessionTypes([]);
		}
	}, [value]);

	const loadProfessions = async () => {
		setLoading(true);
		setError(null);
		try {
			const data = await lookupService.getProfessions();
			setProfessions(data);
		} catch (err) {
			console.error('Failed to load professions:', err);
			setError('Failed to load professions. Please try again.');
		} finally {
			setLoading(false);
		}
	};

	const loadSelectedProfessionTypes = async () => {
		setLoadingTypes(true);
		try {
			const types = await Promise.all(
				value.map((id) => lookupService.getProfessionTypeDetail(id))
			);
			setSelectedProfessionTypes(types);
		} catch (err) {
			console.error('Failed to load profession type details:', err);
		} finally {
			setLoadingTypes(false);
		}
	};

	const handleProfessionClick = (profession: Profession) => {
		setModalState({ show: true, profession });
	};

	const handleConfirm = (selectedIds: number[]) => {
		onChange(selectedIds);
		setModalState({ show: false, profession: null });
	};

	const removeProfessionType = (id: number) => {
		onChange(value.filter((ptId) => ptId !== id));
	};

	// Group selected profession types by profession
	const professionTypeCounts = useMemo(() => {
		const counts: Record<number, number> = {};
		selectedProfessionTypes.forEach((pt) => {
			counts[pt.professionId] = (counts[pt.professionId] || 0) + 1;
		});
		return counts;
	}, [selectedProfessionTypes]);

	if (loading) {
		return (
			<div className="text-center py-4">
				<Spinner animation="border" variant="primary" />
				<p className="mt-2 text-muted">Loading professions...</p>
			</div>
		);
	}

	if (error) {
		return (
			<Alert variant="danger" dismissible onClose={() => setError(null)}>
				{error}
			</Alert>
		);
	}

	return (
		<div className="profession-type-selector">
			{/* Profession badges */}
			<div className="professions-badges mb-3">
				{professions.map((profession) => (
					<ProfessionBadge
						key={profession.id}
						profession={profession}
						selectedCount={professionTypeCounts[profession.id] || 0}
						onClick={() => handleProfessionClick(profession)}
					/>
				))}
			</div>

			{/* Selected profession types */}
			{loadingTypes && (
				<div className="text-center py-2">
					<Spinner animation="border" size="sm" variant="primary" />
					<span className="ms-2 text-muted">Loading selected types...</span>
				</div>
			)}

			<div className="selected-profession-types mt-3">
				{selectedProfessionTypes.length > 0 && (
					<div className="mb-2">
						<small className="text-muted">
							<i className="mdi mdi-information-outline me-1" />
							Selected: {selectedProfessionTypes.length} profession type(s)
							<span className="ms-2 text-primary" style={{ fontSize: '0.75rem' }}>
								Click badge to view licenses
							</span>
						</small>
					</div>
				)}

				{loadingTypes ? (
					<Spinner animation="border" size="sm" variant="primary" />
				) : selectedProfessionTypes.length === 0 ? (
					<Alert variant="info" className="mb-0">
						<i className="mdi mdi-information-outline me-2"></i>
						Please select at least one profession type by clicking on a profession category above.
					</Alert>
				) : (
					selectedProfessionTypes.map((spt) => (
						<ProfessionTypeBadge
							key={spt.id}
							professionType={spt}
							onRemove={() => removeProfessionType(spt.id)}
						/>
					))
				)}
			</div>

			<ProfessionTypeModal
				show={modalState.show}
				onHide={() => setModalState({ show: false, profession: null })}
				profession={modalState.profession}
				selectedProfessionTypeIds={value}
				onConfirm={handleConfirm}
			/>
		</div>
	);
};

export default ProfessionTypeSelector;
