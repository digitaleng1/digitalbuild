import { lazy } from 'react';
import { Outlet, Route, Routes } from 'react-router';

const ProfessionsLicenseTypesPage = lazy(() => import('./page'));

export default function ProfessionsLicenseTypes() {
	return (
		<Routes>
			<Route path="/*" element={<Outlet />}>
				<Route index element={<ProfessionsLicenseTypesPage />} />
			</Route>
		</Routes>
	);
}
