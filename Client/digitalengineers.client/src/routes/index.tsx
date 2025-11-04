import { Route, Routes as ReactRoutes } from 'react-router';
import ProtectedRoutes from './ProtectedRoutes';
import ErrorPages from '@/app/error';
import Account from '@/app/account';
import MainPage from '@/app/main/page';
import ErrorPageNotFound from '@/app/error/404/page';

export default function AppRoutes() {
    return (
        <ReactRoutes>
            {/* Public routes - MUST BE FIRST */}
            <Route path="/" element={<MainPage />} />
            <Route path="/main" element={<MainPage />} />
            <Route path="/account/*" element={<Account />} />
            <Route path="/error/*" element={<ErrorPages />} />
            
            {/* Protected routes - comes after public routes */}
            <Route path="/*" element={<ProtectedRoutes />} />
            
            {/* 404 fallback - MUST BE LAST */}
            <Route path="*" element={<ErrorPageNotFound />} />
        </ReactRoutes>
    );
}
