import type { ColumnDef } from '@tanstack/react-table';
import classNames from 'classnames';
import { Link } from 'react-router';
import type { AdminBidListItem } from '@/types/admin-bid';

const columns: ColumnDef<AdminBidListItem>[] = [
    {
        header: 'Project',
        accessorKey: 'projectName',
        sortingFn: 'alphanumeric',
        cell: ({ row }) => (
            <div>
                <Link to={`/admin/projects/${row.original.projectId}`} className="text-body fw-semibold">
                    {row.original.projectName}
                </Link>
                <p className="mb-0 text-muted font-13">ID: {row.original.projectId}</p>
            </div>
        ),
    },
    {
        header: 'Project Status',
        accessorKey: 'projectStatus',
        sortingFn: 'alphanumeric',
        cell: ({ row }) => (
            <span
                className={classNames('badge', {
                    'bg-success': row.original.projectStatus === 'Active',
                    'bg-info': row.original.projectStatus === 'Completed',
                    'bg-warning': row.original.projectStatus === 'OnHold',
                    'bg-danger': row.original.projectStatus === 'Cancelled',
                })}
            >
                {row.original.projectStatus}
            </span>
        ),
    },
    {
        header: 'Project Budget',
        accessorKey: 'projectBudget',
        sortingFn: 'alphanumeric',
        cell: ({ row }) => (
            <span className="fw-semibold">
                ${row.original.projectBudget.toLocaleString()}
            </span>
        ),
    },
    {
        header: 'Start Date',
        accessorKey: 'startDate',
        enableSorting: true,
        cell: ({ row }) => {
            const date = new Date(row.original.startDate);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            });
        },
    },
    {
        header: 'Bids Status',
        accessorKey: 'pendingBidsCount',
        cell: ({ row }) => (
            <div>
                <span className="badge bg-warning me-1">
                    {row.original.pendingBidsCount} Pending
                </span>
                <span className="badge bg-success">
                    {row.original.respondedBidsCount} Responded
                </span>
            </div>
        ),
    },
    {
        header: 'Action',
        accessorKey: 'projectId',
        cell: ({ row }) => (
            <Link
                to={`/admin/bids/responces/project/${row.original.projectId}`}
                className="btn btn-sm btn-primary"
            >
                <i className="mdi mdi-eye me-1"></i>
                View Details
            </Link>
        ),
    },
];

const sizePerPageList = [5, 10, 20, 50];

export { columns, sizePerPageList };
