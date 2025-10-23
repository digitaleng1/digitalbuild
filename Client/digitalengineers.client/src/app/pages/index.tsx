import { lazy } from 'react';
import { Outlet, Route, Routes } from 'react-router';

const Profile = lazy(() => import('./profile/page'));
const Profile2 = lazy(() => import('./profile2/page'));
const Invoice = lazy(() => import('./invoice/page'));
const FAQ = lazy(() => import('./faq/page'));
const Pricing = lazy(() => import('./pricing/page'));
const Error404Alt = lazy(() => import('./404-alt/page'));
const Starter = lazy(() => import('./starter/page'));
const Timeline = lazy(() => import('./timeline/page'));

export default function OtherPages() {
    return (
        <Routes>
            <Route path="/*" element={<Outlet />}>
                <Route path="profile" element={<Profile />} />
                <Route path="profile2" element={<Profile2 />} />
                <Route path="invoice" element={<Invoice />} />
                <Route path="faq" element={<FAQ />} />
                <Route path="pricing" element={<Pricing />} />
                <Route path="404-alt" element={<Error404Alt />} />
                <Route path="starter" element={<Starter />} />
                <Route path="timeline" element={<Timeline />} />
            </Route>
        </Routes>
    );
}
