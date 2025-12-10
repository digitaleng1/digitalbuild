import { Navigate, Route, Routes as ReactRoutes } from 'react-router';
import ProtectedRoutes from './ProtectedRoutes';
import ErrorPages from '@/app/error';
import Account from '@/app/account';
import ErrorPageNotFound from '@/app/error/404/page';

export default function AppRoutes() {
    return (
        <ReactRoutes>
            {/* Public routes - MUST BE FIRST */}
            {/* Temporarily redirect landing to login */}
            <Route path="/" element={<Navigate to="/account/login" replace />} />
            <Route path="/main" element={<Navigate to="/account/login" replace />} />
            <Route path="/account/*" element={<Account />} />
            <Route path="/error/*" element={<ErrorPages />} />
            
            {/* Protected routes - comes after public routes */}
            <Route path="/*" element={<ProtectedRoutes />} />
            
            {/* 404 fallback - MUST BE LAST */}
            <Route path="*" element={<ErrorPageNotFound />} />
        </ReactRoutes>
    );
}
