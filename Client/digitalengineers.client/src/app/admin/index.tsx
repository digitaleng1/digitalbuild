import { lazy } from 'react';
import { Outlet, Route, Routes } from 'react-router';
const Error404Alt = lazy(() => import('../error/404-alt/page'));

const Dashboards = lazy(() => import('./dashboards'));
const Projects = lazy(() => import('./projects'));
const Bids = lazy(() => import('./bids'));
const ProvidersPage = lazy(() => import('./providers/page'));
const ClientsPage = lazy(() => import('./clients/page'));

export default function Admin() {
    return (
        <Routes>
            <Route path="/*" element={<Outlet />}>
                <Route path="dashboard/*" element={<Dashboards />} />
                <Route path="projects/*" element={<Projects />} />
                <Route path="bids/*" element={<Bids />} />
                <Route path="providers" element={<ProvidersPage />} />
                <Route path="clients" element={<ClientsPage />} />
                <Route path="*" element={<Error404Alt />} />
            </Route>
        </Routes>
    );
}