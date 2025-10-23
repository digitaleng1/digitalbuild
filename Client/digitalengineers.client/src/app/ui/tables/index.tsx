import { lazy } from 'react';
import { Outlet, Route, Routes } from 'react-router';

const Basic = lazy(() => import('./basic/page'));
const Advanced = lazy(() => import('./advanced/page'));

export default function BaseUI() {
    return (
        <Routes>
            <Route path="/*" element={<Outlet />}>
                <Route path="basic" element={<Basic />} />
                <Route path="advanced" element={<Advanced />} />
            </Route>
        </Routes>
    );
}
