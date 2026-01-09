import { lazy } from 'react';
import { Outlet, Route, Routes } from 'react-router';

const Dashboards = lazy(() => import('./dashboards'));
const Projects = lazy(() => import('./projects'));
const Tasks = lazy(() => import('./tasks'));
const Bids = lazy(() => import('./bids'));
const Profile = lazy(() => import('./profile/page'));
const Error404Alt = lazy(() => import('../error/404-alt/page'));


export default function Client() {
    return (
        <Routes>
            <Route path="/*" element={<Outlet />}>
                {/*<Route path="dashboard/*" element={<Dashboards />} />*/}
                <Route path="projects/*" element={<Projects />} />
                <Route path="tasks/*" element={<Tasks />} />
                <Route path="bids/*" element={<Bids />} />
                <Route path="profile" element={<Profile />} />
                <Route path="*" element={<Error404Alt />} />
            </Route>
        </Routes>
    );
}