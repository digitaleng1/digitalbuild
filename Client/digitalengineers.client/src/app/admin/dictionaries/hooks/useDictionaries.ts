import { useState, useEffect, useCallback } from 'react';
import lookupService from '@/services/lookupService';
import { useToast } from '@/contexts/ToastContext';
import type { 
	ProfessionManagementDto, 
	LicenseTypeManagementDto,
	ProfessionTypeManagementDto,
	UpdateProfessionDto, 
	UpdateLicenseTypeDto, 
	ApproveProfessionDto, 
	ApproveLicenseTypeDto,
	CreateProfessionTypeDto,
	UpdateProfessionTypeDto,
	ApproveProfessionTypeDto,
	LicenseRequirement,
	CreateLicenseRequirementDto,
	UpdateLicenseRequirementDto
} from '@/types/lookup';

export const useDictionaries = () => {
	const [professions, setProfessions] = useState<ProfessionManagementDto[]>([]);
	const [professionTypes, setProfessionTypes] = useState<ProfessionTypeManagementDto[]>([]);
	const [licenseTypes, setLicenseTypes] = useState<LicenseTypeManagementDto[]>([]);
	const [licenseRequirements, setLicenseRequirements] = useState<Map<number, LicenseRequirement[]>>(new Map());
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const { showSuccess, showError } = useToast();

	const loadData = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);
			const [professionsData, professionTypesData, licenseTypesData] = await Promise.all([
				lookupService.getAllProfessionsForManagement(),
				lookupService.getAllProfessionTypesForManagement(),
				lookupService.getAllLicenseTypesForManagement(),
			]);
			setProfessions(professionsData);
			setProfessionTypes(professionTypesData);
			setLicenseTypes(licenseTypesData);
		} catch (err: any) {
			const errorMessage = err.response?.data?.message || err.message || 'Failed to load data';
			setError(errorMessage);
			showError('Error', errorMessage);
		} finally {
			setLoading(false);
		}
	}, [showError]);

	useEffect(() => {
		loadData();
	}, [loadData]);

	// ==================== PROFESSIONS ====================

	const updateProfession = useCallback(async (id: number, dto: UpdateProfessionDto) => {
		try {
			const updated = await lookupService.updateProfession(id, dto);
			setProfessions(prev => prev.map(p => p.id === id ? updated : p));
			showSuccess('Success', 'Profession updated successfully');
			return updated;
		} catch (err: any) {
			const errorMessage = err.response?.data?.message || 'Failed to update profession';
			showError('Error', errorMessage);
			throw err;
		}
	}, [showSuccess, showError]);

	const approveProfession = useCallback(async (id: number, dto: ApproveProfessionDto) => {
		try {
			const updated = await lookupService.approveProfession(id, dto);
			setProfessions(prev => prev.map(p => p.id === id ? updated : p));
			const message = dto.isApproved ? 'Profession approved successfully' : 'Profession rejected';
			showSuccess('Success', message);
			return updated;
		} catch (err: any) {
			const errorMessage = err.response?.data?.message || 'Failed to approve/reject profession';
			showError('Error', errorMessage);
			throw err;
		}
	}, [showSuccess, showError]);

	const deleteProfession = useCallback(async (id: number) => {
		try {
			await lookupService.deleteProfession(id);
			setProfessions(prev => prev.filter(p => p.id !== id));
			setProfessionTypes(prev => prev.filter(pt => pt.professionId !== id));
			showSuccess('Success', 'Profession deleted successfully');
		} catch (err: any) {
			const errorMessage = err.response?.data?.message || 'Failed to delete profession';
			showError('Error', errorMessage);
			throw err;
		}
	}, [showSuccess, showError]);

	// ==================== PROFESSION TYPES ====================

	const createProfessionType = useCallback(async (dto: CreateProfessionTypeDto) => {
		try {
			const created = await lookupService.createProfessionType(dto);
			setProfessionTypes(prev => [...prev, created]);
			setProfessions(prev => prev.map(p => 
				p.id === dto.professionId 
					? { ...p, professionTypesCount: p.professionTypesCount + 1 }
					: p
			));
			showSuccess('Success', 'Profession type created successfully');
			return created;
		} catch (err: any) {
			const errorMessage = err.response?.data?.message || 'Failed to create profession type';
			showError('Error', errorMessage);
			throw err;
		}
	}, [showSuccess, showError]);

	const updateProfessionType = useCallback(async (id: number, dto: UpdateProfessionTypeDto) => {
		try {
			const updated = await lookupService.updateProfessionType(id, dto);
			setProfessionTypes(prev => prev.map(pt => pt.id === id ? updated : pt));
			showSuccess('Success', 'Profession type updated successfully');
			return updated;
		} catch (err: any) {
			const errorMessage = err.response?.data?.message || 'Failed to update profession type';
			showError('Error', errorMessage);
			throw err;
		}
	}, [showSuccess, showError]);

	const approveProfessionType = useCallback(async (id: number, dto: ApproveProfessionTypeDto) => {
		try {
			const updated = await lookupService.approveProfessionType(id, dto);
			setProfessionTypes(prev => prev.map(pt => pt.id === id ? updated : pt));
			const message = dto.isApproved ? 'Profession type approved successfully' : 'Profession type rejected';
			showSuccess('Success', message);
			return updated;
		} catch (err: any) {
			const errorMessage = err.response?.data?.message || 'Failed to approve/reject profession type';
			showError('Error', errorMessage);
			throw err;
		}
	}, [showSuccess, showError]);

	const deleteProfessionType = useCallback(async (id: number, professionId: number) => {
		try {
			await lookupService.deleteProfessionType(id);
			setProfessionTypes(prev => prev.filter(pt => pt.id !== id));
			setProfessions(prev => prev.map(p => 
				p.id === professionId 
					? { ...p, professionTypesCount: Math.max(0, p.professionTypesCount - 1) }
					: p
			));
			setLicenseRequirements(prev => {
				const newMap = new Map(prev);
				newMap.delete(id);
				return newMap;
			});
			showSuccess('Success', 'Profession type deleted successfully');
		} catch (err: any) {
			const errorMessage = err.response?.data?.message || 'Failed to delete profession type';
			showError('Error', errorMessage);
			throw err;
		}
	}, [showSuccess, showError]);

	// ==================== LICENSE TYPES ====================

	const updateLicenseType = useCallback(async (id: number, dto: UpdateLicenseTypeDto) => {
		try {
			const updated = await lookupService.updateLicenseType(id, dto);
			setLicenseTypes(prev => prev.map(lt => lt.id === id ? updated : lt));
			showSuccess('Success', 'License type updated successfully');
			return updated;
		} catch (err: any) {
			const errorMessage = err.response?.data?.message || 'Failed to update license type';
			showError('Error', errorMessage);
			throw err;
		}
	}, [showSuccess, showError]);

	const approveLicenseType = useCallback(async (id: number, dto: ApproveLicenseTypeDto) => {
		try {
			const updated = await lookupService.approveLicenseType(id, dto);
			setLicenseTypes(prev => prev.map(lt => lt.id === id ? updated : lt));
			const message = dto.isApproved ? 'License type approved successfully' : 'License type rejected';
			showSuccess('Success', message);
			return updated;
		} catch (err: any) {
			const errorMessage = err.response?.data?.message || 'Failed to approve/reject license type';
			showError('Error', errorMessage);
			throw err;
		}
	}, [showSuccess, showError]);

	const deleteLicenseType = useCallback(async (id: number) => {
		try {
			await lookupService.deleteLicenseType(id);
			setLicenseTypes(prev => prev.filter(lt => lt.id !== id));
			showSuccess('Success', 'License type deleted successfully');
		} catch (err: any) {
			const errorMessage = err.response?.data?.message || 'Failed to delete license type';
			showError('Error', errorMessage);
			throw err;
		}
	}, [showSuccess, showError]);

	// ==================== LICENSE REQUIREMENTS ====================

	const loadLicenseRequirements = useCallback(async (professionTypeId: number) => {
		try {
			const requirements = await lookupService.getLicenseRequirements(professionTypeId);
			setLicenseRequirements(prev => {
				const newMap = new Map(prev);
				newMap.set(professionTypeId, requirements);
				return newMap;
			});
			return requirements;
		} catch (err: any) {
			const errorMessage = err.response?.data?.message || 'Failed to load license requirements';
			showError('Error', errorMessage);
			throw err;
		}
	}, [showError]);

	const createLicenseRequirement = useCallback(async (professionTypeId: number, dto: CreateLicenseRequirementDto) => {
		try {
			const created = await lookupService.createLicenseRequirement(professionTypeId, dto);
			setLicenseRequirements(prev => {
				const newMap = new Map(prev);
				const existing = newMap.get(professionTypeId) || [];
				newMap.set(professionTypeId, [...existing, created]);
				return newMap;
			});
			setProfessionTypes(prev => prev.map(pt => 
				pt.id === professionTypeId 
					? { ...pt, licenseRequirementsCount: pt.licenseRequirementsCount + 1 }
					: pt
			));
			showSuccess('Success', 'License requirement added successfully');
			return created;
		} catch (err: any) {
			const errorMessage = err.response?.data?.message || 'Failed to add license requirement';
			showError('Error', errorMessage);
			throw err;
		}
	}, [showSuccess, showError]);

	const updateLicenseRequirement = useCallback(async (id: number, professionTypeId: number, dto: UpdateLicenseRequirementDto) => {
		try {
			const updated = await lookupService.updateLicenseRequirement(id, dto);
			setLicenseRequirements(prev => {
				const newMap = new Map(prev);
				const existing = newMap.get(professionTypeId) || [];
				newMap.set(professionTypeId, existing.map(r => r.id === id ? updated : r));
				return newMap;
			});
			showSuccess('Success', 'License requirement updated successfully');
			return updated;
		} catch (err: any) {
			const errorMessage = err.response?.data?.message || 'Failed to update license requirement';
			showError('Error', errorMessage);
			throw err;
		}
	}, [showSuccess, showError]);

	const deleteLicenseRequirement = useCallback(async (id: number, professionTypeId: number) => {
		try {
			await lookupService.deleteLicenseRequirement(id);
			setLicenseRequirements(prev => {
				const newMap = new Map(prev);
				const existing = newMap.get(professionTypeId) || [];
				newMap.set(professionTypeId, existing.filter(r => r.id !== id));
				return newMap;
			});
			setProfessionTypes(prev => prev.map(pt => 
				pt.id === professionTypeId 
					? { ...pt, licenseRequirementsCount: Math.max(0, pt.licenseRequirementsCount - 1) }
					: pt
			));
			showSuccess('Success', 'License requirement deleted successfully');
		} catch (err: any) {
			const errorMessage = err.response?.data?.message || 'Failed to delete license requirement';
			showError('Error', errorMessage);
			throw err;
		}
	}, [showSuccess, showError]);

	return {
		professions,
		professionTypes,
		licenseTypes,
		licenseRequirements,
		loading,
		error,
		refresh: loadData,
		// Professions
		updateProfession,
		approveProfession,
		deleteProfession,
		// Profession Types
		createProfessionType,
		updateProfessionType,
		approveProfessionType,
		deleteProfessionType,
		// License Types
		updateLicenseType,
		approveLicenseType,
		deleteLicenseType,
		// License Requirements
		loadLicenseRequirements,
		createLicenseRequirement,
		updateLicenseRequirement,
		deleteLicenseRequirement,
	};
};
