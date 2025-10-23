import { Suspense } from 'react';
import { Outlet } from 'react-router';
import PageLoader from "@/components/PageLoader";

const DefaultLayout = () => {
    return (
        <Suspense fallback={<PageLoader />}>
            <Outlet />
        </Suspense>
    );
};
export default DefaultLayout;
