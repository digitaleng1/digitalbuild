import { lazy } from 'react';
import { Outlet, Route, Routes } from 'react-router';

const Vector = lazy(() => import('./vectormaps/page'));

export default function MapsUI() {
    return (
        <Routes>
            <Route path="/*" element={<Outlet />}>
                <Route path="vectormaps" element={<Vector />} />
            </Route>
        </Routes>
    );
}
