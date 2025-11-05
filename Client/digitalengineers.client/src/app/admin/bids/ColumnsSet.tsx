import type { ColumnDef } from '@tanstack/react-table';
import { Link } from 'react-router';
import type { AdminBidListItem } from '@/types/admin-bid';
import ProjectStatusBadge from '@/components/badges/ProjectStatusBadge';

const columns: ColumnDef<AdminBidListItem>[] = [
    {
        header: 'PROJECT',
        accessorKey: 'projectName',
        sortingFn: 'alphanumeric',
        cell: ({ row }) => (
            <div>
                <Link to={`/admin/projects/${row.original.projectId}`} className="text-body fw-semibold">
                    {row.original.projectName}
                </Link>
                <p className="mb-0 text-muted font-13">
                    {row.original.projectId}
                </p>
            </div>
        ),
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
                    <div className="mb-1">
                        <span className="text-muted">Total:</span> <span className="fw-semibold">{total}</span>
                    </div>
                    <div className="mb-1">
                        <span className="text-muted">Submitted:</span> {row.original.respondedBidsCount}
                    </div>
                    <div className="mb-1">
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
    {
        header: 'ACTIONS',
        id: 'actions',
        enableSorting: false,
        cell: ({ row }) => (
            <Link
                to={`/admin/bids/responces/project/${row.original.projectId}`}
                className="text-primary d-flex align-items-center gap-1"
                style={{ textDecoration: 'none' }}
            >
                <i className="mdi mdi-eye"></i>
                <span className="fw-bold">View Bids</span>
            </Link>
        ),
    },
];

const sizePerPageList = [5, 10, 20, 50];

export { columns, sizePerPageList };
