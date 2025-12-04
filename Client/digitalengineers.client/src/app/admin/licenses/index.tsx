import { lazy } from 'react';
import { Route, Routes } from 'react-router';
const LicensesPage = lazy(() => import('./page'));

export default function Licenses() {
    return (
        <Routes>
            <Route path="/" element={<LicensesPage />} />
        </Routes>
    );
}
