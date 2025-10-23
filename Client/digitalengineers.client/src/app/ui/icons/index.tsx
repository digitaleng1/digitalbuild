import { lazy } from 'react';
import { Outlet, Route, Routes } from 'react-router';

const LucideIcons = lazy(() => import('./lucide/page'));
const Remix = lazy(() => import('./remix/page'));
const MaterialDesign = lazy(() => import('./mdi/page'));
const Unicons = lazy(() => import('./unicons/page'));

export default function IconsUI() {
    return (
        <Routes>
            <Route path="/*" element={<Outlet />}>
                <Route path="remix" element={<Remix />} />
                <Route path="mdi" element={<MaterialDesign />} />
                <Route path="unicons" element={<Unicons />} />
                <Route path="lucide" element={<LucideIcons />} />
            </Route>
        </Routes>
    );
}
