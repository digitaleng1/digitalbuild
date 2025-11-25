import { lazy } from 'react';
import { Route, Routes } from 'react-router';

const KanbanPage = lazy(() => import('./kanban/page'));
const ListPage = lazy(() => import('./list/page'));

export default function Tasks() {
    return (
        <Routes>
            <Route path="/" element={<KanbanPage />} />
            <Route path="/kanban" element={<KanbanPage />} />
            <Route path="/list" element={<ListPage />} />
        </Routes>
    );
}
