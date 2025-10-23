import { useState, useEffect, useCallback } from 'react';
import { Row, Col } from 'react-bootstrap';
import dictionaryService from '@/services/dictionaryService';
import type { Profession, LicenseType, SelectedProfession } from '@/types/dictionary';
import ProfessionBadge from './ProfessionBadge';
import LicenseTypeModal from './LicenseTypeModal';

interface ProfessionalTypeSelectorProps {
	value: number[];
	onChange: (licenseTypeIds: number[]) => void;
}

const ProfessionalTypeSelector = ({ value, onChange }: ProfessionalTypeSelectorProps) => {
	const [professions, setProfessions] = useState<Profession[]>([]);
	const [allLicenseTypes, setAllLicenseTypes] = useState<LicenseType[]>([]);
	const [selectedProfessions, setSelectedProfessions] = useState<SelectedProfession[]>([]);
	const [loading, setLoading] = useState(true);
	const [modalState, setModalState] = useState<{
		show: boolean;
		profession: Profession | null;
	}>({ show: false, profession: null });

	useEffect(() => {
		const loadData = async () => {
			try {
				const [professionsData, licenseTypesData] = await Promise.all([
					dictionaryService.getProfessions(),
					dictionaryService.getLicenseTypes(),
				]);
				setProfessions(professionsData);
				setAllLicenseTypes(licenseTypesData);

				if (value.length > 0) {
					const grouped = new Map<number, LicenseType[]>();
					licenseTypesData
						.filter((lt) => value.includes(lt.id))
						.forEach((lt) => {
							if (!grouped.has(lt.professionId)) {
								grouped.set(lt.professionId, []);
							}
							grouped.get(lt.professionId)!.push(lt);
						});

					const restored: SelectedProfession[] = [];
					grouped.forEach((licenseTypes, professionId) => {
						const profession = professionsData.find((p) => p.id === professionId);
						if (profession) {
							restored.push({ profession, licenseTypes });
						}
					});
					setSelectedProfessions(restored);
				}
			} catch (error) {
				console.error('Failed to load data:', error);
			} finally {
				setLoading(false);
			}
		};

		loadData();
	}, [value]);

	const openModal = useCallback((profession: Profession) => {
		setModalState({ show: true, profession });
	}, []);

	const closeModal = useCallback(() => {
		setModalState({ show: false, profession: null });
	}, []);

	const getSelectedLicenseTypes = useCallback(
		(professionId: number): LicenseType[] => {
			const found = selectedProfessions.find((sp) => sp.profession.id === professionId);
			return found ? found.licenseTypes : [];
		},
		[selectedProfessions]
	);

	const getAvailableLicenseTypes = useCallback(
		(professionId: number | undefined): LicenseType[] => {
			if (!professionId) return [];
			return allLicenseTypes.filter((lt) => lt.professionId === professionId);
		},
		[allLicenseTypes]
	);

	const handleConfirm = useCallback(
		(selectedIds: number[]) => {
			if (!modalState.profession) return;

			const licenseTypes = allLicenseTypes.filter((lt) => selectedIds.includes(lt.id));

			setSelectedProfessions((prev) => {
				const filtered = prev.filter((sp) => sp.profession.id !== modalState.profession!.id);

				if (licenseTypes.length > 0) {
					filtered.push({
						profession: modalState.profession!,
						licenseTypes,
					});
				}

				const allSelectedIds = filtered.flatMap((sp) => sp.licenseTypes.map((lt) => lt.id));
				onChange(allSelectedIds);

				return filtered;
			});
		},
		[modalState.profession, allLicenseTypes, onChange]
	);

	const removeProfession = useCallback(
		(professionId: number) => {
			setSelectedProfessions((prev) => {
				const filtered = prev.filter((sp) => sp.profession.id !== professionId);
				const allSelectedIds = filtered.flatMap((sp) => sp.licenseTypes.map((lt) => lt.id));
				onChange(allSelectedIds);
				return filtered;
			});
		},
		[onChange]
	);

	const removeLicenseType = useCallback(
		(licenseTypeId: number) => {
			setSelectedProfessions((prev) => {
				const updated = prev
					.map((sp) => ({
						...sp,
						licenseTypes: sp.licenseTypes.filter((lt) => lt.id !== licenseTypeId),
					}))
					.filter((sp) => sp.licenseTypes.length > 0);

				const allSelectedIds = updated.flatMap((sp) => sp.licenseTypes.map((lt) => lt.id));
				onChange(allSelectedIds);

				return updated;
			});
		},
		[onChange]
	);

	const allSelectedLicenseTypes = selectedProfessions.flatMap((sp) => sp.licenseTypes);

	if (loading) {
		return <div className="text-muted">Loading professions...</div>;
	}

	return (
		<div className="professional-type-selector">
			<div className="professions-badges mb-3">
				{professions.map((profession) => (
					<ProfessionBadge
						key={profession.id}
						profession={profession}
						selectedLicenseTypes={getSelectedLicenseTypes(profession.id)}
						onClick={() => openModal(profession)}
						onRemove={
							getSelectedLicenseTypes(profession.id).length > 0
								? () => removeProfession(profession.id)
								: undefined
						}
					/>
				))}
			</div>

			{allSelectedLicenseTypes.length > 0 && (
				<Row>
					{allSelectedLicenseTypes.map((licenseType) => (
						<Col md={4} key={licenseType.id} className="mb-2">
							<div className="border rounded p-3 d-flex align-items-center justify-content-between">
								<span>{licenseType.name}</span>
								<i
									className="mdi mdi-close text-danger"
									style={{ cursor: 'pointer', fontSize: '18px' }}
									onClick={() => removeLicenseType(licenseType.id)}
								></i>
							</div>
						</Col>
					))}
				</Row>
			)}

			<LicenseTypeModal
				show={modalState.show}
				onHide={closeModal}
				profession={modalState.profession}
				availableLicenseTypes={getAvailableLicenseTypes(modalState.profession?.id)}
				selectedLicenseTypes={getSelectedLicenseTypes(modalState.profession?.id ?? 0)}
				onConfirm={handleConfirm}
			/>
		</div>
	);
};

export default ProfessionalTypeSelector;
