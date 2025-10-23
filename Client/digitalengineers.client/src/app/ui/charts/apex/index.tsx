import { lazy } from 'react';
import { Outlet, Route, Routes } from 'react-router';

const Area = lazy(() => import('./area/page'));
const Bar = lazy(() => import('./bar/page'));
const Bubble = lazy(() => import('./bubble/page'));
const Candlestick = lazy(() => import('./candlestick/page'));
const Column = lazy(() => import('./column/page'));
const Heatmap = lazy(() => import('./heatmap/page'));
const Line = lazy(() => import('./line/page'));
const Mixed = lazy(() => import('./mixed/page'));
const Timeline = lazy(() => import('./timeline/page'));
const Boxplot = lazy(() => import('./boxplot/page'));
const Treemap = lazy(() => import('./treemap/page'));
const Pie = lazy(() => import('./pie/page'));
const Radar = lazy(() => import('./radar/page'));
const Radialbar = lazy(() => import('./radialbar/page'));
const Scatter = lazy(() => import('./scatter/page'));
const PolarArea = lazy(() => import('./polararea/page'));
const Sparklines = lazy(() => import('./sparklines/page'));


export default function BaseUI() {
    return (
        <Routes>
            <Route path="/*" element={<Outlet />}>
                <Route path="area" element={<Area />} />
                <Route path="bar" element={<Bar />} />
                <Route path="bubble" element={<Bubble />} />
                <Route path="candlestick" element={<Candlestick />} />
                <Route path="column" element={<Column />} />
                <Route path="heatmap" element={<Heatmap />} />
                <Route path="line" element={<Line />} />
                <Route path="mixed" element={<Mixed />} />
                <Route path="timeline" element={<Timeline />} />
                <Route path="boxplot" element={<Boxplot />} />
                <Route path="treemap" element={<Treemap />} />
                <Route path="pie" element={<Pie />} />
                <Route path="radar" element={<Radar />} />
                <Route path="radialbar" element={<Radialbar />} />
                <Route path="scatter" element={<Scatter />} />
                <Route path="polararea" element={<PolarArea />} />
                <Route path="sparklines" element={<Sparklines />} />
            </Route>
        </Routes>
    );
}
