import { lazy } from 'react';
import { Outlet, Route, Routes } from 'react-router';

const ListProject = lazy(() => import('./list/page'));
const ProjectDetails = lazy(() => import('./details/page'));
const Error404Alt = lazy(() => import('../../pages/404-alt/page'));

export default function Projects() {
	return (
		<Routes>
			<Route path="/*" element={<Outlet />}>
				<Route index element={<ListProject />} />
				<Route path=":id" element={<ProjectDetails />} />
				<Route path="*" element={<Error404Alt />} />
			</Route>
		</Routes>
	);
}
