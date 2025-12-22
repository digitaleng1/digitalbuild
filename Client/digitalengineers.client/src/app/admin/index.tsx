import { lazy } from 'react';
import { Outlet, Route, Routes } from 'react-router';
const Error404Alt = lazy(() => import('../error/404-alt/page'));

const Dashboards = lazy(() => import('./dashboards'));
const Projects = lazy(() => import('./projects'));
const Bids = lazy(() => import('./bids'));
const Tasks = lazy(() => import('./tasks'));
const ProvidersPage = lazy(() => import('./providers/page'));
const ClientsPage = lazy(() => import('./clients/page'));
const Licenses = lazy(() => import('./licenses'));
const ProfessionsLicenseTypes = lazy(() => import('./professions-license-types'));
const ProfilePage = lazy(() => import('./profile/page'));

export default function Admin() {
    return (
        <Routes>
            <Route path="/*" element={<Outlet />}>
                <Route path="dashboard/*" element={<Dashboards />} />
                <Route path="projects/*" element={<Projects />} />
                <Route path="bids/*" element={<Bids />} />
                <Route path="tasks/*" element={<Tasks />} />
                <Route path="providers" element={<ProvidersPage />} />
                <Route path="clients" element={<ClientsPage />} />
                <Route path="licenses/*" element={<Licenses />} />
                <Route path="professions-license-types/*" element={<ProfessionsLicenseTypes />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="*" element={<Error404Alt />} />
            </Route>
        </Routes>
    );
}