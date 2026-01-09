import { lazy } from 'react';
import { Outlet, Route, Routes } from 'react-router';

const Management = lazy(() => import('./management/page'));
const Details = lazy(() => import('./details/page'));
const Tasks = lazy(() => import('./tasks/page'));
const Create = lazy(() => import('./create/page'));

export default function Projects() {
    return (
        <Routes>
            <Route path="/*" element={<Outlet />}>
                <Route path="*" element={<Management />} />
                <Route path="details/:id" element={<Details />} />
                <Route path="tasks/:id" element={<Tasks />} />
                <Route path="create" element={<Create />} />
            </Route>
        </Routes>
    );
}
