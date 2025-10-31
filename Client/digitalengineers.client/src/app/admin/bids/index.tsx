import { lazy } from 'react';
import { Outlet, Route, Routes } from 'react-router';

const BidsListPage = lazy(() => import('./list/page'));
const BidResponsesByProjectPage = lazy(() => import('./responses/project-responses'));

export default function AdminBids() {
    return (
        <Routes>
            <Route path="/*" element={<Outlet />}>
                <Route index element={<BidsListPage />} />
                <Route path="responces/project/:id" element={<BidResponsesByProjectPage />} />
            </Route>
        </Routes>
    );
}
