import { lazy } from 'react';
import { Outlet, Route, Routes } from 'react-router';

const Inbox = lazy(() => import('./inbox/page'));
const Read = lazy(() => import('./read/page'));

export default function Dashboard() {
    return (
        <Routes>
            <Route path="/*" element={<Outlet />}>
                <Route path="inbox" element={<Inbox />} />
                <Route path="read" element={<Read />} />
            </Route>
        </Routes>
    );
}
