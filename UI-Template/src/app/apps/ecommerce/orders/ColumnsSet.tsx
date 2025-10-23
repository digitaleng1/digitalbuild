import type { ColumnDef } from '@tanstack/react-table';
import type { Order } from '../types';
import classNames from 'classnames';
import {Link} from "react-router";

// get all columns
const columns: ColumnDef<Order>[] = [
	{
		header: 'Order ID',
		accessorKey: 'order_id',
		cell: ({ row }) => (
			<Link to="" className="text-body fw-bold">
				#BM{row.original.order_id}
			</Link>
		),
	},
	{
		header: 'Date',
		accessorKey: 'order_date',
		cell: ({ row }) => (
			<>
				{row.original.order_date}
				<small className="text-muted">{row.original.order_time}</small>
			</>
		),
	},
	{
		header: 'Payment Status',
		accessorKey: 'payment_status',
		cell: ({ row }) => (
			<h5>
				<span
					className={classNames('badge', {
						'badge-success-lighten': row.original.payment_status === 'Paid',
						'badge-danger-lighten': row.original.payment_status === 'Payment Failed',
						'badge-info-lighten': row.original.payment_status === 'Unpaid',
						'badge-warning-lighten': row.original.payment_status === 'Awaiting Authorization',
					})}
				>
					{row.original.payment_status === 'Paid' && <i className="mdi mdi-bitcoin me-1"></i>}
					{row.original.payment_status === 'Payment Failed' && <i className="mdi mdi-cancel me-1"></i>}
					{row.original.payment_status === 'Unpaid' && <i className="mdi mdi-cash me-1"></i>}
					{row.original.payment_status === 'Awaiting Authorization' && <i className="mdi mdi-timer-sand me-1"></i>}
					{row.original.payment_status}
				</span>
			</h5>
		),
	},
	{
		header: 'Total',
		accessorKey: 'total',
	},
	{
		header: 'Payment Method',
		accessorKey: 'payment_method',
	},
	{
		header: 'Status',
		accessorKey: 'order_status',
		cell: ({ row }) => (
			<h5>
				<span
					className={classNames('badge', {
						'badge-success-lighten': row.original.order_status === 'Delivered',
						'badge-danger-lighten': row.original.order_status === 'Cancelled',
						'badge-info-lighten': row.original.order_status === 'Shipped',
						'badge-warning-lighten': row.original.order_status === 'Processing',
					})}
				>
					{row.original.order_status}
				</span>
			</h5>
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

// get pagelist to display
const sizePerPageList = [2, 5, 10, 20, 50];

export { columns, sizePerPageList };
