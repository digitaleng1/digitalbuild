import { lazy } from 'react';
import { Outlet, Route, Routes } from 'react-router';

const Management = lazy(() => import('./management/page'));
const Details = lazy(() => import('./details/page'));

export default function Projects() {
    return (
        <Routes>
            <Route path="/*" element={<Outlet />}>
                <Route path="*" element={<Management />} />
                <Route path="details/:id" element={<Details />} />
            </Route>
        </Routes>
    );
}
