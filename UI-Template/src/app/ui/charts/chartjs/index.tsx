import { lazy } from 'react';
import { Outlet, Route, Routes } from 'react-router';

const Area = lazy(() => import('./area/page'));
const Bar = lazy(() => import('./bar/page'));
const Line = lazy(() => import('./line/page'));
const Other = lazy(() => import('./other/page'));

export default function BaseUI() {
    return (
        <Routes>
            <Route path="/*" element={<Outlet />}>
                <Route path="area" element={<Area />} />
                <Route path="bar" element={<Bar />} />
                <Route path="line" element={<Line />} />
                <Route path="other" element={<Other />} />
            </Route>
        </Routes>
    );
}
