import { lazy } from 'react';
import { Outlet, Route, Routes } from 'react-router';

const List = lazy(() => import('./list/page'));
const Details = lazy(() => import('./details/page'));
const Kanban = lazy(() => import('./kanban/page'));

export default function Dashboard() {
    return (
        <Routes>
            <Route path="/*" element={<Outlet />}>
                <Route path="list" element={<List />} />1
                <Route path="details" element={<Details />} />
                <Route path="kanban" element={<Kanban />} />
            </Route>
        </Routes>
    );
}
