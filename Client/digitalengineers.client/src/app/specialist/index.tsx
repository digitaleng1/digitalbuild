import { lazy } from 'react';
import { Outlet, Route, Routes } from 'react-router';

const Dashboards = lazy(() => import('./dashboards'));
const Bids = lazy(() => import('./bids'));
const Error404Alt = lazy(() => import('../pages/404-alt/page'));

export default function Specialist() {
    return (
        <Routes>
            <Route path="/*" element={<Outlet />}>
                <Route path="dashboard/*" element={<Dashboards />} />
                <Route path="bids/*" element={<Bids />} />
                <Route path="*" element={<Error404Alt />} />
            </Route>
        </Routes>
    );
}
