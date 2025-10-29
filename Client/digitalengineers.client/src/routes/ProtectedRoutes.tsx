import { ThemeSettings, useThemeContext } from '@/common';
import { lazy } from 'react';
import { Route, Routes as ReactRoutes } from 'react-router';
import VerticalLayout from '@/layouts/Vertical';
import HorizontalLayout from '@/layouts/Horizontal';
import Root from './Root';
import RoleProtectedLayout from '@/layouts/RoleProtectedLayout';

const Dashboard = lazy(() => import('../app/dashboards'));
const Apps = lazy(() => import('../app/apps'));
const Client = lazy(() => import('../app/client'));
const Admin = lazy(() => import('../app/admin'));
const Specialist = lazy(() => import('../app/specialist'));
const OtherPages = lazy(() => import('../app/pages'));
const UI = lazy(() => import('../app/ui'));
const Error404Alt = lazy(() => import('../app/pages/404-alt/page'));

export default function ProtectedRoutes() {
    const { settings } = useThemeContext();
    const Layout =
        settings.layout.type == ThemeSettings.layout.type.vertical
            ? VerticalLayout
            : HorizontalLayout;

    return (
        <ReactRoutes>
            <Route element={<RoleProtectedLayout allowedRoles={['Client']} />}>
                <Route path="/client/*" element={<Layout />}>
                    {/*Client role menu items*/}
                    <Route index element={<Root />} />
                    <Route path="*" element={<Client />} />
                    {/*Template menu items*/}
                    <Route path="dashboards/*" element={<Dashboard />} />
                    <Route path="apps/*" element={<Apps />} />
                    <Route path="pages/*" element={<OtherPages />} />
                    <Route path="ui/*" element={<UI />} />
                    <Route path="*" element={<Error404Alt />} />
                </Route>
            </Route>

            <Route element={<RoleProtectedLayout allowedRoles={['Provider']} />}>
                <Route path="/specialist/*" element={<Layout />}>
                    <Route index element={<Root />} />
                    <Route path="*" element={<Specialist />} />
                    {/*Template menu items*/}
                    <Route path="dashboards/*" element={<Dashboard />} />
                    <Route path="apps/*" element={<Apps />} />
                    <Route path="pages/*" element={<OtherPages />} />
                    <Route path="ui/*" element={<UI />} />
                    <Route path="*" element={<Error404Alt />} />
                </Route>
            </Route>

            <Route element={<RoleProtectedLayout allowedRoles={['Admin', 'SuperAdmin']} />}>
                <Route path="/admin/*" element={<Layout />}>
                    <Route index element={<Root />} />
                    <Route path="*" element={<Admin />} />
                    {/*Template menu items*/}
                    <Route path="dashboards/*" element={<Dashboard />} />
                    <Route path="apps/*" element={<Apps />} />
                    <Route path="pages/*" element={<OtherPages />} />
                    <Route path="ui/*" element={<UI />} />
                    <Route path="*" element={<Error404Alt />} />
                </Route>
            </Route>
        </ReactRoutes>
    );
}
