import { createContext, useContext, useState, useCallback, type ReactNode, useEffect } from 'react';
import type { User } from '@/types/User';
import { tokenService } from '@/services/tokenService';

interface AuthContextType {
	user: User | null;
	isAuthenticated: boolean;
	saveSession: (user: User, accessToken: string, refreshToken: string, expiresAt: string) => void;
	removeSession: () => void;
	updateUser: (user: User) => void;
	hasRole: (role: string) => boolean;
	hasAnyRole: (roles: string[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuthContext() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error('useAuthContext must be used within an AuthProvider');
	}
	return context;
}

const authSessionKey = '_ACTIVE_USER';

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<User | null>(() => {
		const savedUser = localStorage.getItem(authSessionKey);
		return savedUser ? JSON.parse(savedUser) : null;
	});

	useEffect(() => {
		const token = tokenService.getAccessToken();
		const savedUser = localStorage.getItem(authSessionKey);
		
		if (!token && savedUser) {
			localStorage.removeItem(authSessionKey);
			setUser(null);
		}
	}, []);

	const saveSession = useCallback(
		(userData: User, accessToken: string, refreshToken: string, expiresAt: string) => {
			const userWithTokens: User = {
				...userData,
				accessToken,
				refreshToken,
				expiresAt,
			};
			
			localStorage.setItem(authSessionKey, JSON.stringify(userWithTokens));
			tokenService.setTokens(accessToken, refreshToken, expiresAt);
			setUser(userWithTokens);
		},
		[]
	);

	const removeSession = useCallback(() => {
		localStorage.removeItem(authSessionKey);
		tokenService.clearTokens();
		setUser(null);
	}, []);

	const updateUser = useCallback((userData: User) => {
		setUser((prevUser) => {
			if (!prevUser) return userData;
			const updated = { ...prevUser, ...userData };
			localStorage.setItem(authSessionKey, JSON.stringify(updated));
			return updated;
		});
	}, []);

	const hasRole = useCallback(
		(role: string): boolean => {
			if (!user?.roles) return false;
			return user.roles.includes(role);
		},
		[user]
	);

	const hasAnyRole = useCallback(
		(roles: string[]): boolean => {
			if (!user?.roles) return false;
			return roles.some((role) => user.roles.includes(role));
		},
		[user]
	);

	return (
		<AuthContext.Provider
			value={{
				user,
				isAuthenticated: Boolean(user && tokenService.getAccessToken()),
				saveSession,
				removeSession,
				updateUser,
				hasRole,
				hasAnyRole,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}
