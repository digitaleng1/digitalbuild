import DefaultLayout from '@/layouts/Default';
import { lazy } from 'react';
import { Route, Routes } from 'react-router';

const PageNotFound = lazy(() => import('./404/page'));
const ServerError = lazy(() => import('./500/page'));
const Maintenance = lazy(() => import('./maintenance/page'));

const ErrorPages = () => {
    return (
        <Routes>
            <Route path="/*" element={<DefaultLayout />}>
                <Route path="404" element={<PageNotFound />} />
                <Route path="500" element={<ServerError />} />
                <Route path="maintenance" element={<Maintenance />} />
            </Route>
        </Routes>
    );
};

export default ErrorPages;
