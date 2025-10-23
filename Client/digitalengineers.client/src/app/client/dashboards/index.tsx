import { lazy } from 'react';
import { Outlet, Route, Routes } from 'react-router';

const Ecommerce = lazy(() => import('./ecommerce/page'));
const Analytics = lazy(() => import('./analytics/page'));
const Project = lazy(() => import('./project/page'));
const CRM = lazy(() => import('./crm/page'));
const EWallet = lazy(() => import('./e-wallet/page'));

export default function Dashboard() {
    return (
        <Routes>
            <Route path="/*" element={<Outlet />}>
                <Route index element={<Ecommerce />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="ecommerce" element={<Ecommerce />} />
                <Route path="project" element={<Project />} />
                <Route path="crm" element={<CRM />} />
                <Route path="e-wallet" element={<EWallet />} />
            </Route>
        </Routes>
    );
}
