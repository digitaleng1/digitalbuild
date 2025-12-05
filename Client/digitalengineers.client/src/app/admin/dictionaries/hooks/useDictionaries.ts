import { useState, useEffect, useCallback } from 'react';
import lookupService from '@/services/lookupService';
import { useToast } from '@/contexts/ToastContext';
import type { 
	ProfessionManagementDto, 
	LicenseTypeManagementDto, 
	UpdateProfessionDto, 
	UpdateLicenseTypeDto, 
	ApproveProfessionDto, 
	ApproveLicenseTypeDto 
} from '@/types/lookup';

export const useDictionaries = () => {
	const [professions, setProfessions] = useState<ProfessionManagementDto[]>([]);
	const [licenseTypes, setLicenseTypes] = useState<LicenseTypeManagementDto[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const { showSuccess, showError } = useToast();

	const loadData = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);
			const [professionsData, licenseTypesData] = await Promise.all([
				lookupService.getAllProfessionsForManagement(),
				lookupService.getAllLicenseTypesForManagement(),
			]);
			setProfessions(professionsData);
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

	const deleteProfession = useCallback(async (id: number) => {
		try {
			await lookupService.deleteProfession(id);
			setProfessions(prev => prev.filter(p => p.id !== id));
			setLicenseTypes(prev => prev.filter(lt => lt.professionId !== id));
			showSuccess('Success', 'Profession deleted successfully');
		} catch (err: any) {
			const errorMessage = err.response?.data?.message || 'Failed to delete profession';
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

	return {
		professions,
		licenseTypes,
		loading,
		error,
		refresh: loadData,
		updateProfession,
		updateLicenseType,
		approveProfession,
		approveLicenseType,
		deleteProfession,
		deleteLicenseType,
	};
};
