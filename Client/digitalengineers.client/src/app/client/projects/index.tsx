import { lazy } from 'react';
import { Outlet, Route, Routes } from 'react-router';

const List = lazy(() => import('./list/page'));
const Details = lazy(() => import('./details/page'));
const Gantt = lazy(() => import('./gantt/page'));
const Create = lazy(() => import('./create/page'));

export default function Projects() {
    return (
        <Routes>
            <Route path="/*" element={<Outlet />}>
                <Route path="*" element={<List />} />
                <Route path="details/:id" element={<Details />} />
                <Route path="gantt" element={<Gantt />} />
                <Route path="create" element={<Create />} />
            </Route>
        </Routes>
    );
}
