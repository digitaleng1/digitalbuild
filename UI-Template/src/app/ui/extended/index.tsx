import { lazy } from 'react';
import { Outlet, Route, Routes } from 'react-router';

const DragNDrop = lazy(() => import('./dragdrop/page'));
const Range = lazy(() => import('./rangesliders/page'));
const Ratings = lazy(() => import('./ratings/page'));
const Scrollbar = lazy(() => import('./scrollbar/page'));

export default function BaseUI() {
    return (
        <Routes>
            <Route path="/*" element={<Outlet />}>
                <Route path="dragdrop" element={<DragNDrop />} />
                <Route path="rangesliders" element={<Range />} />
                <Route path="ratings" element={<Ratings />} />
                <Route path="scrollbar" element={<Scrollbar />} />
            </Route>
        </Routes>
    );
}
