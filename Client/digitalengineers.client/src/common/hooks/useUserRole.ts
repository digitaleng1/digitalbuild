import { useAuthContext } from '../context/useAuthContext';

type UserRole = 'SuperAdmin' | 'Admin' | 'Client' | 'Provider' | null;

export const useUserRole = (): UserRole => {
	const { user } = useAuthContext();
	
	if (!user || !user.roles || user.roles.length === 0) {
		return null;
	}

	if (user.roles.includes('SuperAdmin')) {
		return 'SuperAdmin';
	}
	if (user.roles.includes('Admin')) {
		return 'Admin';
	}
	if (user.roles.includes('Client')) {
		return 'Client';
	}
	if (user.roles.includes('Provider')) {
		return 'Provider';
	}

	return null;
};
