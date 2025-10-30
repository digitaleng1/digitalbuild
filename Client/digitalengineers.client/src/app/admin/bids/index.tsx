import { lazy } from 'react';
import { Outlet, Route, Routes } from 'react-router';

const BidsListPage = lazy(() => import('./list/page'));

export default function AdminBids() {
    return (
        <Routes>
            <Route path="/*" element={<Outlet />}>
                <Route index element={<BidsListPage />} />
            </Route>
        </Routes>
    );
}
