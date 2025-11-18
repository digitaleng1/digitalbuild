import { useState, useEffect, useCallback } from 'react';
import { userManagementService } from '@/services/userManagementService';
import type { UserManagement } from '@/types/user-management';

export const useUserManagement = (role: string) => {
    const [users, setUsers] = useState<UserManagement[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await userManagementService.getUsersByRole(role);
            setUsers(data || []);
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Failed to load users';
            setError(errorMessage);
            setUsers([]);
        } finally {
            setLoading(false);
        }
    }, [role]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const toggleUserStatus = useCallback(async (userId: string, isActive: boolean) => {
        try {
            await userManagementService.toggleUserStatus(userId, isActive);
            setUsers(prevUsers =>
                prevUsers.map(user =>
                    user.id === userId ? { ...user, isActive } : user
                )
            );
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Failed to update user status';
            setError(errorMessage);
            throw err;
        }
    }, []);

    return {
        users,
        loading,
        error,
        refetch: fetchUsers,
        toggleUserStatus,
    };
};
