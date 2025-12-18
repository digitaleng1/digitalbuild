import httpClient from '@/common/helpers/httpClient';
import type { 
	State, 
	Profession, 
	LicenseType, 
	CreateProfessionDto, 
	CreateLicenseTypeDto, 
	ProfessionViewModel, 
	LicenseTypeViewModel, 
	ProfessionManagementDto, 
	LicenseTypeManagementDto, 
	UpdateProfessionDto, 
	UpdateLicenseTypeDto, 
	ApproveProfessionDto, 
	ApproveLicenseTypeDto, 
	ExportDictionaries, 
	ImportDictionaries, 
	ImportResult,
	ProfessionType,
	ProfessionTypeManagementDto,
	ProfessionTypeDetailDto,
	CreateProfessionTypeDto,
	UpdateProfessionTypeDto,
	ApproveProfessionTypeDto,
	LicenseRequirement,
	CreateLicenseRequirementDto,
	UpdateLicenseRequirementDto
} from '@/types/lookup';

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

	// ==================== PROFESSIONS ====================

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

	async getAllProfessionsForManagement(): Promise<ProfessionManagementDto[]> {
		const response = await httpClient.get<ProfessionManagementDto[]>('/api/lookup/professions/management');
		return response as ProfessionManagementDto[];
	}

	async createProfession(dto: CreateProfessionDto): Promise<ProfessionViewModel> {
		const response = await httpClient.post<ProfessionViewModel>('/api/lookup/professions', dto);
		this.clearCache();
		return response as ProfessionViewModel;
	}

	async updateProfession(id: number, dto: UpdateProfessionDto): Promise<ProfessionManagementDto> {
		const response = await httpClient.put<ProfessionManagementDto>(`/api/lookup/professions/${id}`, dto);
		this.clearCache();
		return response as ProfessionManagementDto;
	}

	async approveProfession(id: number, dto: ApproveProfessionDto): Promise<ProfessionManagementDto> {
		const response = await httpClient.put<ProfessionManagementDto>(`/api/lookup/professions/${id}/approve`, dto);
		this.clearCache();
		return response as ProfessionManagementDto;
	}

	async deleteProfession(id: number): Promise<void> {
		await httpClient.delete(`/api/lookup/professions/${id}`);
		this.clearCache();
	}

	// ==================== PROFESSION TYPES ====================

	async getProfessionTypes(professionId: number): Promise<ProfessionType[]> {
		const cacheKey = `profession-types-${professionId}`;
		const cached = this.getCachedData<ProfessionType[]>(cacheKey);

		if (cached) {
			return cached;
		}

		const response = await httpClient.get<ProfessionType[]>(
			`/api/lookup/professions/${professionId}/profession-types`
		);
		const data = response as ProfessionType[];
		this.setCachedData(cacheKey, data);

		return data;
	}

	async getProfessionTypeDetail(id: number): Promise<ProfessionTypeDetailDto> {
		const response = await httpClient.get<ProfessionTypeDetailDto>(`/api/profession-types/${id}`);
		return response as ProfessionTypeDetailDto;
	}

	async getAllProfessionTypesForManagement(): Promise<ProfessionTypeManagementDto[]> {
		const response = await httpClient.get<ProfessionTypeManagementDto[]>('/api/profession-types');
		return response as ProfessionTypeManagementDto[];
	}

	async createProfessionType(dto: CreateProfessionTypeDto): Promise<ProfessionTypeManagementDto> {
		const response = await httpClient.post<ProfessionTypeManagementDto>('/api/profession-types', dto);
		this.clearCache();
		return response as ProfessionTypeManagementDto;
	}

	async updateProfessionType(id: number, dto: UpdateProfessionTypeDto): Promise<ProfessionTypeManagementDto> {
		const response = await httpClient.put<ProfessionTypeManagementDto>(`/api/profession-types/${id}`, dto);
		this.clearCache();
		return response as ProfessionTypeManagementDto;
	}

	async approveProfessionType(id: number, dto: ApproveProfessionTypeDto): Promise<ProfessionTypeManagementDto> {
		const response = await httpClient.put<ProfessionTypeManagementDto>(`/api/profession-types/${id}/approve`, dto);
		this.clearCache();
		return response as ProfessionTypeManagementDto;
	}

	async deleteProfessionType(id: number): Promise<void> {
		await httpClient.delete(`/api/profession-types/${id}`);
		this.clearCache();
	}

	// ==================== LICENSE TYPES ====================

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

	async getAllLicenseTypesForManagement(): Promise<LicenseTypeManagementDto[]> {
		const response = await httpClient.get<LicenseTypeManagementDto[]>('/api/lookup/license-types/management');
		return response as LicenseTypeManagementDto[];
	}

	async createLicenseType(dto: CreateLicenseTypeDto): Promise<LicenseTypeViewModel> {
		const response = await httpClient.post<LicenseTypeViewModel>('/api/lookup/license-types', dto);
		this.clearCache();
		return response as LicenseTypeViewModel;
	}

	async updateLicenseType(id: number, dto: UpdateLicenseTypeDto): Promise<LicenseTypeManagementDto> {
		const response = await httpClient.put<LicenseTypeManagementDto>(`/api/lookup/license-types/${id}`, dto);
		this.clearCache();
		return response as LicenseTypeManagementDto;
	}

	async approveLicenseType(id: number, dto: ApproveLicenseTypeDto): Promise<LicenseTypeManagementDto> {
		const response = await httpClient.put<LicenseTypeManagementDto>(`/api/lookup/license-types/${id}/approve`, dto);
		this.clearCache();
		return response as LicenseTypeManagementDto;
	}

	async deleteLicenseType(id: number): Promise<void> {
		await httpClient.delete(`/api/lookup/license-types/${id}`);
		this.clearCache();
	}

	// ==================== LICENSE REQUIREMENTS ====================

	async getLicenseRequirements(professionTypeId: number): Promise<LicenseRequirement[]> {
		const response = await httpClient.get<LicenseRequirement[]>(
			`/api/profession-types/${professionTypeId}/license-requirements`
		);
		return response as LicenseRequirement[];
	}

	async createLicenseRequirement(professionTypeId: number, dto: CreateLicenseRequirementDto): Promise<LicenseRequirement> {
		const response = await httpClient.post<LicenseRequirement>(
			`/api/profession-types/${professionTypeId}/license-requirements`, 
			dto
		);
		this.clearCache();
		return response as LicenseRequirement;
	}

	async updateLicenseRequirement(id: number, dto: UpdateLicenseRequirementDto): Promise<LicenseRequirement> {
		const response = await httpClient.put<LicenseRequirement>(`/api/license-requirements/${id}`, dto);
		this.clearCache();
		return response as LicenseRequirement;
	}

	async deleteLicenseRequirement(id: number): Promise<void> {
		await httpClient.delete(`/api/license-requirements/${id}`);
		this.clearCache();
	}

	// ==================== STATES ====================

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

	// ==================== IMPORT/EXPORT ====================

	async exportDictionaries(): Promise<ExportDictionaries> {
		const response = await httpClient.get<ExportDictionaries>('/api/lookup/export');
		return response as ExportDictionaries;
	}

	async importDictionaries(data: ImportDictionaries): Promise<ImportResult> {
		const response = await httpClient.post<ImportResult>('/api/lookup/import', data);
		this.clearCache();
		return response as ImportResult;
	}

	// ==================== LEGACY (backward compatibility) ====================

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

	clearCache(): void {
		this.cache.clear();
	}
}

export default new LookupService();
