import { Route, Routes as ReactRoutes } from 'react-router';
import ProtectedRoutes from './ProtectedRoutes';
import ErrorPages from '@/app/error';
import Account from '@/app/account';
import MainPage from '@/app/main/page';
import ErrorPageNotFound from '@/app/error/404/page';

export default function AppRoutes() {
    return (
        <ReactRoutes>
            <Route path="/" element={<MainPage />} />
            <Route path="/main" element={<MainPage />} />
            <Route path="account/*" element={<Account />} />
            <Route path="/*" element={<ProtectedRoutes />} />
            <Route path="/error/*" element={<ErrorPages />} />
            <Route path="*" element={<ErrorPageNotFound />} />
        </ReactRoutes>
    );
}
