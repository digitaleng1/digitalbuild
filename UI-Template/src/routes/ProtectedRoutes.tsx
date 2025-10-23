import { ThemeSettings, useThemeContext } from '@/common';
import { lazy } from 'react';
import { Navigate, Route, Routes as ReactRoutes } from 'react-router';
import VerticalLayout from '@/layouts/Vertical';
import HorizontalLayout from '@/layouts/Horizontal';
import Root from './Root';
import {useAuthContext} from "@/common/context/useAuthContext";

/**
 * routes import
 */
const Dashboard = lazy(() => import('../app/dashboards'));
const Apps = lazy(() => import('../app/apps'));
const OtherPages = lazy(() => import('../app/pages'));
const UI = lazy(() => import('../app/ui'));
const Error404Alt = lazy(() => import('../app/pages/404-alt/page'));

export default function ProtectedRoutes() {
    const { settings } = useThemeContext();
    const Layout =
        settings.layout.type == ThemeSettings.layout.type.vertical
            ? VerticalLayout
            : HorizontalLayout;

    const { user } = useAuthContext();

    return user ? (
        <ReactRoutes>
            <Route path="/*" element={<Layout />}>
                <Route index element={<Root />} />
                <Route path="dashboard/*" element={<Dashboard />} />
                <Route path="apps/*" element={<Apps />} />
                <Route path="pages/*" element={<OtherPages />} />
                <Route path="ui/*" element={<UI />} />
                <Route path="*" element={<Error404Alt />} />
            </Route>
        </ReactRoutes>
    ) : (
        <Navigate to="/account/login" replace />
    );
}
