import type { ColumnDef } from '@tanstack/react-table';
import { Link, useLocation } from 'react-router';
import type { AdminBidListItem } from '@/types/admin-bid';
import ProjectStatusBadge from '@/components/badges/ProjectStatusBadge';

// Determine path prefix based on current location
const usePathPrefix = () => {
    const location = useLocation();
    return location.pathname.startsWith('/client') ? '/client' : '/admin';
};

const columns: ColumnDef<AdminBidListItem>[] = [
    {
        header: 'PROJECT',
        accessorKey: 'projectName',
        sortingFn: 'alphanumeric',
        cell: ({ row }) => {
            const pathPrefix = usePathPrefix();
            return (
                <div>
                    <Link to={`${pathPrefix}/bids/responces/project/${row.original.projectId}`} className="text-body fw-semibold">
                        {row.original.projectName}
                    </Link>
                </div>
            );
        },
    },
    {
        header: 'STATUS',
        accessorKey: 'projectStatus',
        sortingFn: 'alphanumeric',
        cell: ({ row }) => (
            <ProjectStatusBadge status={row.original.projectStatus} />
        ),
    },
    {
        header: 'BIDS SUMMARY',
        accessorKey: 'pendingBidsCount',
        enableSorting: false,
        cell: ({ row }) => {
            const total = 
                row.original.pendingBidsCount + 
                row.original.respondedBidsCount + 
                row.original.acceptedBidsCount + 
                row.original.rejectedBidsCount;
            
            return (
                <div className="small">
                    <div className="">
                        <span className="text-muted">Total:</span> <span className="fw-semibold">{total}</span>
                    </div>
                    <div className="">
                        <span className="text-muted">Submitted:</span> {row.original.respondedBidsCount}
                    </div>
                    <div className="">
                        <span className="text-muted">Pending:</span> {row.original.pendingBidsCount}
                    </div>
                    <div>
                        <span className="text-muted">Selected:</span> {row.original.acceptedBidsCount}
                    </div>
                </div>
            );
        },
    },
    {
        header: 'PRICE RANGE',
        accessorKey: 'projectBudget',
        sortingFn: 'alphanumeric',
        cell: ({ row }) => {
            const budget = row.original.projectBudget;
            const minPrice = Math.round(budget * 0.8);
            const maxPrice = Math.round(budget * 1.2);
            
            return (
                <div className="small">
                    <div className="fw-semibold mb-1">
                        ${minPrice.toLocaleString()} - ${maxPrice.toLocaleString()}
                    </div>
                    <div className="text-muted">
                        Avg: ${budget.toLocaleString()}
                    </div>
                </div>
            );
        },
    },
    {
        header: 'DURATION RANGE',
        id: 'durationRange',
        enableSorting: false,
        cell: ({ row }) => {
            const days = 30;
            const minDays = Math.round(days * 0.8);
            const maxDays = Math.round(days * 1.2);
            
            return (
                <div className="small">
                    <div className="fw-semibold mb-1">
                        {minDays} days - {maxDays} days
                    </div>
                    <div className="text-muted">
                        Avg: {days} days
                    </div>
                </div>
            );
        },
    },
    {
        header: 'LATEST ACTIVITY',
        accessorKey: 'startDate',
        enableSorting: true,
        cell: ({ row }) => {
            if (!row.original.startDate) {
                return <span className="text-muted">—</span>;
            }
            
            const date = new Date(row.original.startDate);
            const now = new Date();
            const daysAgo = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
            
            return (
                <div className="small">
                    <div className="fw-semibold mb-1">
                        {date.toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                        })}
                    </div>
                    <div className="text-muted">
                        {daysAgo === 0 ? 'Today' : `${daysAgo} days ago`}
                    </div>
                </div>
            );
        },
    },
];

const sizePerPageList = [5, 10, 20, 50];

export { columns, sizePerPageList };
