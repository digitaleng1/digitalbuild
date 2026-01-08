import httpClient from '@/common/helpers/httpClient';
import type { UserManagement, CreateAdminRequest } from '@/types/user-management';

const API_URL = '/api/usermanagement';

export const userManagementService = {
    getUsersByRole: async (role: string): Promise<UserManagement[]> => {
        const data = await httpClient.get<UserManagement[]>(`${API_URL}/role/${role}`);
        return data as UserManagement[];
    },

    toggleUserStatus: async (userId: string, isActive: boolean): Promise<void> => {
        await httpClient.put(`${API_URL}/${userId}/toggle-status`, { isActive });
    },

    createAdmin: async (data: CreateAdminRequest): Promise<UserManagement> => {
        const result = await httpClient.post<UserManagement>(`${API_URL}/admin`, data);
        return result as UserManagement;
    },
};
