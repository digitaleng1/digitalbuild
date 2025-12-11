import httpClient from '@/common/helpers/httpClient';
import type { State, Profession, LicenseType, CreateProfessionDto, CreateLicenseTypeDto, ProfessionViewModel, LicenseTypeViewModel, ProfessionManagementDto, LicenseTypeManagementDto, UpdateProfessionDto, UpdateLicenseTypeDto, ApproveProfessionDto, ApproveLicenseTypeDto, ExportDictionaries, ImportDictionaries, ImportResult } from '@/types/lookup';

interface CacheEntry<T> {
	data: T;
	timestamp: number;
}

class LookupService {
	private cache: Map<string, CacheEntry<any>> = new Map();
	private readonly CACHE_TTL = 5 * 60 * 1000;

	private getCachedData<T>(key: string): T | null {
		const cached = this.cache.get(key);
		if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
			return cached.data as T;
		}
		this.cache.delete(key);
		return null;
	}

	private setCachedData<T>(key: string, data: T): void {
		this.cache.set(key, {
			data,
			timestamp: Date.now(),
		});
	}

	async getProfessions(): Promise<Profession[]> {
		const cacheKey = 'professions';
		const cached = this.getCachedData<Profession[]>(cacheKey);

		if (cached) {
			return cached;
		}

		const response = await httpClient.get<Profession[]>('/api/lookup/professions');
		const data = response as Profession[];
		this.setCachedData(cacheKey, data);

		return data;
	}

	async getLicenseTypes(): Promise<LicenseType[]> {
		const cacheKey = 'license-types';
		const cached = this.getCachedData<LicenseType[]>(cacheKey);

		if (cached) {
			return cached;
		}

		const response = await httpClient.get<LicenseType[]>('/api/lookup/license-types');
		const data = response as LicenseType[];
		this.setCachedData(cacheKey, data);

		return data;
	}

	async getLicenseTypesByProfessionId(professionId: number): Promise<LicenseType[]> {
		const cacheKey = `license-types-${professionId}`;
		const cached = this.getCachedData<LicenseType[]>(cacheKey);

		if (cached) {
			return cached;
		}

		const response = await httpClient.get<LicenseType[]>(
			`/api/lookup/professions/${professionId}/license-types`
		);
		const data = response as LicenseType[];
		this.setCachedData(cacheKey, data);

		return data;
	}

	async getStates(): Promise<State[]> {
		const cacheKey = 'states';
		const cached = this.getCachedData<State[]>(cacheKey);

		if (cached) {
			return cached;
		}

		const response = await httpClient.get<State[]>('/api/lookup/states');
		const data = response as State[];
		this.setCachedData(cacheKey, data);

		return data;
	}

	// ==================== CLIENT OPERATIONS ====================

	async createProfession(dto: CreateProfessionDto): Promise<ProfessionViewModel> {
		const response = await httpClient.post<ProfessionViewModel>('/api/lookup/professions', dto);
		this.clearCache();
		return response as ProfessionViewModel;
	}

	async createLicenseType(dto: CreateLicenseTypeDto): Promise<LicenseTypeViewModel> {
		const response = await httpClient.post<LicenseTypeViewModel>('/api/lookup/license-types', dto);
		this.clearCache();
		return response as LicenseTypeViewModel;
	}

	// ==================== ADMIN OPERATIONS ====================

	async getAllProfessionsForManagement(): Promise<ProfessionManagementDto[]> {
		const response = await httpClient.get<ProfessionManagementDto[]>('/api/lookup/professions/management');
		return response as ProfessionManagementDto[];
	}

	async getAllLicenseTypesForManagement(): Promise<LicenseTypeManagementDto[]> {
		const response = await httpClient.get<LicenseTypeManagementDto[]>('/api/lookup/license-types/management');
		return response as LicenseTypeManagementDto[];
	}

	async updateProfession(id: number, dto: UpdateProfessionDto): Promise<ProfessionManagementDto> {
		const response = await httpClient.put<ProfessionManagementDto>(`/api/lookup/professions/${id}`, dto);
		this.clearCache();
		return response as ProfessionManagementDto;
	}

	async updateLicenseType(id: number, dto: UpdateLicenseTypeDto): Promise<LicenseTypeManagementDto> {
		const response = await httpClient.put<LicenseTypeManagementDto>(`/api/lookup/license-types/${id}`, dto);
		this.clearCache();
		return response as LicenseTypeManagementDto;
	}

	async approveProfession(id: number, dto: ApproveProfessionDto): Promise<ProfessionManagementDto> {
		const response = await httpClient.put<ProfessionManagementDto>(`/api/lookup/professions/${id}/approve`, dto);
		this.clearCache();
		return response as ProfessionManagementDto;
	}

	async approveLicenseType(id: number, dto: ApproveLicenseTypeDto): Promise<LicenseTypeManagementDto> {
		const response = await httpClient.put<LicenseTypeManagementDto>(`/api/lookup/license-types/${id}/approve`, dto);
		this.clearCache();
		return response as LicenseTypeManagementDto;
	}

	async deleteProfession(id: number): Promise<void> {
		await httpClient.delete(`/api/lookup/professions/${id}`);
		this.clearCache();
	}

	async deleteLicenseType(id: number): Promise<void> {
		await httpClient.delete(`/api/lookup/license-types/${id}`);
		this.clearCache();
	}

	async exportDictionaries(): Promise<ExportDictionaries> {
		const response = await httpClient.get<ExportDictionaries>('/api/lookup/export');
		return response as ExportDictionaries;
	}

	async importDictionaries(data: ImportDictionaries): Promise<ImportResult> {
		const response = await httpClient.post<ImportResult>('/api/lookup/import', data);
		this.clearCache();
		return response as ImportResult;
	}

	clearCache(): void {
		this.cache.clear();
	}
}

export default new LookupService();
