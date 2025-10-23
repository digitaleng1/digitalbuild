import { useLocation } from 'react-router';

type RolePrefix = 'admin' | 'client' | 'provider' | null;

export const useRolePrefix = (): RolePrefix => {
	const location = useLocation();
	const pathname = location.pathname;

	if (pathname.startsWith('/admin')) {
		return 'admin';
	}
	if (pathname.startsWith('/client')) {
		return 'client';
	}
	if (pathname.startsWith('/provider')) {
		return 'provider';
	}

	return null;
};
