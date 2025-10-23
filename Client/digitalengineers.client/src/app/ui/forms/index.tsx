import { lazy } from 'react';
import { Outlet, Route, Routes } from 'react-router';

const BasicElements = lazy(() => import('./basic/page'));
const FormAdvanced = lazy(() => import('./advanced/page'));
const Validation = lazy(() => import('./validation/page'));
const Wizard = lazy(() => import('./wizard/page'));
const FileUploads = lazy(() => import('./upload/page'));
const Editors = lazy(() => import('./editors/page'));

export default function FormsUI() {
    return (
        <Routes>
            <Route path="/*" element={<Outlet />}>
                <Route path="basic" element={<BasicElements />} />
                <Route path="advanced" element={<FormAdvanced />} />
                <Route path="validation" element={<Validation />} />
                <Route path="wizard" element={<Wizard />} />
                <Route path="upload" element={<FileUploads />} />
                <Route path="editors" element={<Editors />} />
            </Route>
        </Routes>
    );
}
