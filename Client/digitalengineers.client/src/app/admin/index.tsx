import { lazy } from 'react';
import { Outlet, Route, Routes } from 'react-router';
import Error404Alt from '../pages/404-alt/page';

const Dashboards = lazy(() => import('../dashboards'));
const Projects = lazy(() => import('./projects'));

export default function Admin() {
    return (
        <Routes>
            <Route path="/*" element={<Outlet />}>
                <Route path="dashboard/*" element={<Dashboards />} />
                <Route path="projects/*" element={<Projects />} />
                <Route path="*" element={<Error404Alt />} />
            </Route>
        </Routes>
    );
}