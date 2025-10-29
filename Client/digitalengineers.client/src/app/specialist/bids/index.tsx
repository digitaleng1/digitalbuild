import { lazy } from 'react';
import { Outlet, Route, Routes } from 'react-router';

const List = lazy(() => import('./list/page'));
const Details = lazy(() => import('./details/page'));

export default function Bids() {
	return (
		<Routes>
			<Route path="/*" element={<Outlet />}>
				<Route index element={<List />} />
				<Route path=":id" element={<Details />} />
			</Route>
		</Routes>
	);
}
