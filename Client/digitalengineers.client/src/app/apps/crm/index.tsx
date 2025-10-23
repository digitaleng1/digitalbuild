import {lazy} from 'react';
import {Outlet, Route, Routes} from 'react-router';

const Projects = lazy(() => import('./projects/page'));
const Orders = lazy(() => import('./orders/page'));
const Client = lazy(() => import('./clients/page'));
const Management = lazy(() => import('./management/page'));

export default function Dashboard() {
    return (
        <Routes>
            <Route path="/*" element={<Outlet/>}>
                <Route path="projects" element={<Projects/>}/>
                <Route path="orders" element={<Orders/>}/>
                <Route path="clients" element={<Client/>}/>
                <Route path="management" element={<Management/>}/>
            </Route>
        </Routes>
    );
}
