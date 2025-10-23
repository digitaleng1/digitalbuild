import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuthContext } from '@/common/context/useAuthContext';
import { useEffect } from 'react';

interface RoleProtectedLayoutProps {
    allowedRoles: string[];
}

const RoleProtectedLayout = ({ allowedRoles }: RoleProtectedLayoutProps) => {
    const { user, isAuthenticated } = useAuthContext();
    const location = useLocation();

    if (!isAuthenticated || !user) {
        return <Navigate to="/account/login" state={{ from: location }} replace />;
    }

    const hasAccess = user.roles.some((role) => allowedRoles.includes(role));

    if (!hasAccess) {
        const primaryRole = user.roles[0];
        let redirectPath = '/';

        if (primaryRole === 'Admin' || primaryRole === 'SuperAdmin') {
            redirectPath = '/admin/dashboard';
        } else if (primaryRole === 'Provider') {
            redirectPath = '/provider/dashboard';
        } else if (primaryRole === 'Client') {
            redirectPath = '/client/dashboard';
        }

        return <Navigate to={redirectPath} replace />;
    }

    return <Outlet />;
};

export default RoleProtectedLayout;
