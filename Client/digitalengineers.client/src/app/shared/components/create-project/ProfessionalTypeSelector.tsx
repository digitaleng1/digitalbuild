import { useState, useEffect, useCallback } from 'react';
import { Row, Col, Spinner } from 'react-bootstrap';
import lookupService from '@/services/lookupService';
import type { Profession, LicenseType, SelectedProfession, ProfessionViewModel, LicenseTypeViewModel } from '@/types/lookup';
import ProfessionBadge from './ProfessionBadge';
import LicenseTypeModal from './LicenseTypeModal';
import CreateProfessionModal from './CreateProfessionModal';
import CreateLicenseTypeModal from './CreateLicenseTypeModal';

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
	const [createProfessionModalShow, setCreateProfessionModalShow] = useState(false);
	const [createLicenseTypeModalShow, setCreateLicenseTypeModalShow] = useState(false);
	const [selectedProfessionForNewLicense, setSelectedProfessionForNewLicense] = useState<Profession | null>(null);

	useEffect(() => {
		const loadData = async () => {
			try {
				const [professionsData, licenseTypesData] = await Promise.all([
					lookupService.getProfessions(),
					lookupService.getLicenseTypes(),
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

	const handleCreateProfessionSuccess = useCallback(async (newProfession: ProfessionViewModel) => {
		try {
			const [professionsData, licenseTypesData] = await Promise.all([
				lookupService.getProfessions(),
				lookupService.getLicenseTypes(),
			]);
			setProfessions(professionsData);
			setAllLicenseTypes(licenseTypesData);

			// Auto-open license type modal for the new profession
			const profession = professionsData.find(p => p.id === newProfession.id);
			if (profession) {
				openModal(profession);
			}
		} catch (error) {
			console.error('Failed to reload data after profession creation:', error);
		}
	}, [openModal]);

	const handleCreateLicenseTypeClick = useCallback(() => {
		if (modalState.profession) {
			setSelectedProfessionForNewLicense(modalState.profession);
			closeModal();
			setCreateLicenseTypeModalShow(true);
		}
	}, [modalState.profession, closeModal]);

	const handleCreateLicenseTypeSuccess = useCallback(async (newLicenseType: LicenseTypeViewModel) => {
		try {
			const licenseTypesData = await lookupService.getLicenseTypes();
			setAllLicenseTypes(licenseTypesData);

			// Auto-select the new license type
			if (selectedProfessionForNewLicense) {
				const profession = selectedProfessionForNewLicense;
				const licenseType = licenseTypesData.find(lt => lt.id === newLicenseType.id);
				
				if (licenseType) {
					setSelectedProfessions((prev) => {
						const existing = prev.find(sp => sp.profession.id === profession.id);
						const filtered = prev.filter(sp => sp.profession.id !== profession.id);
						
						const newLicenseTypes = existing 
							? [...existing.licenseTypes, licenseType]
							: [licenseType];
						
						filtered.push({
							profession,
							licenseTypes: newLicenseTypes,
						});

						const allSelectedIds = filtered.flatMap((sp) => sp.licenseTypes.map((lt) => lt.id));
						onChange(allSelectedIds);

						return filtered;
					});
				}
			}

			// Reopen the license type modal
			if (selectedProfessionForNewLicense) {
				openModal(selectedProfessionForNewLicense);
			}
		} catch (error) {
			console.error('Failed to reload license types after creation:', error);
		}
	}, [selectedProfessionForNewLicense, onChange, openModal]);

	const allSelectedLicenseTypes = selectedProfessions.flatMap((sp) => sp.licenseTypes);

	if (loading) {
		return (
			<div className="d-flex align-items-center justify-content-center py-5">
				<Spinner animation="border" variant="primary" className="me-2" />
				<span className="text-muted">Loading professions...</span>
			</div>
		);
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
				
				{/* Create New Profession Badge */}
				<ProfessionBadge
					profession={{ id: -1, name: '', description: '' }}
					selectedLicenseTypes={[]}
					onClick={() => {}}
					onCreateNew={() => setCreateProfessionModalShow(true)}
				/>
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
				onCreateNew={handleCreateLicenseTypeClick}
			/>

			<CreateProfessionModal
				show={createProfessionModalShow}
				onHide={() => setCreateProfessionModalShow(false)}
				onSuccess={handleCreateProfessionSuccess}
			/>

			{selectedProfessionForNewLicense && (
				<CreateLicenseTypeModal
					show={createLicenseTypeModalShow}
					onHide={() => {
						setCreateLicenseTypeModalShow(false);
						setSelectedProfessionForNewLicense(null);
					}}
					profession={selectedProfessionForNewLicense}
					onSuccess={handleCreateLicenseTypeSuccess}
				/>
			)}
		</div>
	);
};

export default ProfessionalTypeSelector;
