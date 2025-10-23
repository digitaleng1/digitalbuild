import { lazy } from 'react';
import { Outlet, Route, Routes } from 'react-router';

const Accordions = lazy(() => import('./accordions/page'));
const Alerts = lazy(() => import('./alerts/page'));
const Avatars = lazy(() => import('./avatars/page'));
const Badges = lazy(() => import('./badges/page'));
const Breadcrumb = lazy(() => import('./breadcrumb/page'));
const Buttons = lazy(() => import('./buttons/page'));
const Cards = lazy(() => import('./cards/page'));
const Carousel = lazy(() => import('./carousel/page'));
const Dropdowns = lazy(() => import('./dropdowns/page'));
const Embed = lazy(() => import('./embed/page'));
const Grid = lazy(() => import('./grid/page'));
const ListGroup = lazy(() => import('./listgroups/page'));
const Modals = lazy(() => import('./modals/page'));
const Notifications = lazy(() => import('./notifications/page'));
const Offcanvas = lazy(() => import('./offcanvas/page'));
const Placeholders = lazy(() => import('./placeholders/page'));
const Pagination = lazy(() => import('./pagination/page'));
const Popover = lazy(() => import('./popovers/page'));
const Progress = lazy(() => import('./progress/page'));
const Ribbons = lazy(() => import('./ribbons/page'));
const Spinners = lazy(() => import('./spinners/page'));
const Tabs = lazy(() => import('./tabs/page'));
const Tooltips = lazy(() => import('./tooltips/page'));
const Links = lazy(() => import('./links/page'));
const Typography = lazy(() => import('./typography/page'));
const Utilities = lazy(() => import('./utilities/page'));


export default function BaseUI() {
    return (
        <Routes>
            <Route path="/*" element={<Outlet />}>
                <Route path="accordions" element={<Accordions />} />
                <Route path="alerts" element={<Alerts />} />
                <Route path="avatars" element={<Avatars />} />
                <Route path="badges" element={<Badges />} />
                <Route path="breadcrumb" element={<Breadcrumb />} />
                <Route path="buttons" element={<Buttons />} />
                <Route path="cards" element={<Cards />} />
                <Route path="carousel" element={<Carousel />} />
                <Route path="dropdowns" element={<Dropdowns />} />
                <Route path="embed" element={<Embed />} />
                <Route path="grid" element={<Grid />} />
                <Route path="listgroups" element={<ListGroup />} />
                <Route path="modals" element={<Modals />} />
                <Route path="notifications" element={<Notifications />} />
                <Route path="offcanvas" element={<Offcanvas />} />
                <Route path="placeholders" element={<Placeholders />} />
                <Route path="pagination" element={<Pagination />} />
                <Route path="popovers" element={<Popover />} />
                <Route path="progress" element={<Progress />} />
                <Route path="ribbons" element={<Ribbons />} />
                <Route path="spinners" element={<Spinners />} />
                <Route path="tabs" element={<Tabs />} />
                <Route path="tooltips" element={<Tooltips />} />
                <Route path="links" element={<Links />} />
                <Route path="typography" element={<Typography />} />
                <Route path="utilities" element={<Utilities />} />
            </Route>
        </Routes>
    );
}
