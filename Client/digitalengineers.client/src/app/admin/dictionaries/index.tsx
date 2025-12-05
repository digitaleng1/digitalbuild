import { lazy } from 'react';
import { Outlet, Route, Routes } from 'react-router';

const DictionariesPage = lazy(() => import('./page'));

export default function AdminDictionaries() {
	return (
		<Routes>
			<Route path="/*" element={<Outlet />}>
				<Route index element={<DictionariesPage />} />
			</Route>
		</Routes>
	);
}
