import { lazy } from 'react';
import { Outlet, Route, Routes } from 'react-router';

const Base = lazy(() => import('./base-ui'));
const Extended = lazy(() => import('./extended'));
const Widgets = lazy(() => import('./widgets/page'));
const Icons = lazy(() => import('./icons'));
const Forms = lazy(() => import('./forms'));
const Charts = lazy(() => import('./charts'));
const Tables = lazy(() => import('./tables'));
const Maps = lazy(() => import('./maps'));

export default function Apps() {
    return (
        <Routes>
            <Route path="/*" element={<Outlet />}>
                <Route path="base-ui/*" element={<Base />} />
                <Route path="extended/*" element={<Extended />} />
                <Route path="widgets" element={<Widgets />} />
                <Route path="icons/*" element={<Icons />} />
                <Route path="forms/*" element={<Forms />} />
                <Route path="charts/*" element={<Charts />} />
                <Route path="tables/*" element={<Tables />} />
                <Route path="maps/*" element={<Maps />} />
            </Route>
        </Routes>
    );
}
