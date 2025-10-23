import type { ColumnDef } from '@tanstack/react-table';
import classNames from 'classnames';
import {Link} from "react-router";
import type { Customer } from '../types';

// Todo: Generic's values are not provided from the library itself
// const columns: ReadonlyArray<Column<Customer>> = [
const columns: ColumnDef<Customer>[] = [
	{
		header: 'Customer',
		accessorKey: 'name',
		cell: ({ row }) => (
			<div className="table-user">
				<img src={row.original.avatar} alt="" className="me-2 rounded-circle" />
				<Link to="" className="text-body fw-semibold">
					{row.original.name}
				</Link>
			</div>
		),
	},
	{
		header: 'Phone',
		accessorKey: 'phone',
	},
	{
		header: 'Email',
		accessorKey: 'email',
	},
	{
		header: 'Location',
		accessorKey: 'location',
	},
	{
		header: 'Created On',
		accessorKey: 'created_on',
	},
	{
		header: 'Status',
		accessorKey: 'status',
		cell: ({ row }) => (
			<span
				className={classNames('badge', {
					'badge-success-lighten': row.original.status === 'Active',
					'badge-danger-lighten': row.original.status === 'Blocked',
				})}
			>
				{row.original.status}
			</span>
		),
	},
	{
		header: 'Action',
		accessorKey: 'id',
		cell: () => (
			<>
				<Link to="" className="action-icon">
					<i className="mdi mdi-eye"></i>
				</Link>
				<Link to="" className="action-icon">
					<i className="mdi mdi-square-edit-outline"></i>
				</Link>
				<Link to="" className="action-icon">
					<i className="mdi mdi-delete"></i>
				</Link>
			</>
		),
	},
];

const sizePerPageList = [2, 5, 10, 20, 25, 50];

export { columns, sizePerPageList };
