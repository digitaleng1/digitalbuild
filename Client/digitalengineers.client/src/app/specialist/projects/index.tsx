import { lazy } from 'react';
import { Outlet, Route, Routes } from 'react-router';

const ListProject = lazy(() => import('./list/page'));
const ProjectDetails = lazy(() => import('./details/page'));
const Tasks = lazy(() => import('./tasks/page'));
const Error404Alt = lazy(() => import('../../error/404-alt/page'));

export default function Projects() {
	return (
		<Routes>
			<Route path="/*" element={<Outlet />}>
				<Route index element={<ListProject />} />
				<Route path="details/:id" element={<ProjectDetails />} />
				<Route path="tasks/:id" element={<Tasks />} />
				<Route path="*" element={<Error404Alt />} />
			</Route>
		</Routes>
	);
}
