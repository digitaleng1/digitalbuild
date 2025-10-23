import httpClient from '@/common/helpers/httpClient';
import type { State, Profession, LicenseType } from '@/types/dictionary';

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

	clearCache(): void {
		this.cache.clear();
	}
}

export default new LookupService();
