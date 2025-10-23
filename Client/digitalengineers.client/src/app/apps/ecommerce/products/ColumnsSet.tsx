import type { ColumnDef } from '@tanstack/react-table';
import classNames from 'classnames';
import {Link} from "react-router";
import type { Product } from '../types';

// get all columns
// Todo: Generic's values are not provided from the library itself
// const columns: ReadonlyArray<Column<Product>> = [
const columns: ColumnDef<Product>[] = [
	{
		header: 'Product',
		accessorKey: 'name',
		sortingFn: 'alphanumeric',
		cell: ({ row }) => {
			const rating = row.original.rating;
			const emptyStars = rating < 5 ? 5 - rating : 0;
			return (
				<>
					<img src={row.original.image} alt={row.original.name} title={row.original.name} className="rounded me-3" height="48" />
					<p className="m-0 d-inline-block align-middle font-16">
						<Link to="/apps/ecommerce/details" className="text-body">
							{row.original.name}
						</Link>
						<br />
						{[...Array(rating)].map((_x:any, index) => (
							<span key={index.toString()} className="text-warning mdi mdi-star"></span>
						))}
						{[...Array(emptyStars)].map((_x:any, index) => (
							<span key={index.toString()} className="text-warning mdi mdi-star-outline"></span>
						))}
					</p>
				</>
			);
		},
	},
	{
		header: 'Category',
		accessorKey: 'category',
		sortingFn: 'alphanumeric',
	},
	{
		header: 'Added Date',
		accessorKey: 'added_date',
		enableSorting: true,
	},
	{
		header: 'Price',
		accessorKey: 'price',
		sortingFn: 'alphanumeric',
	},
	{
		header: 'Quantity',
		accessorKey: 'quantity',
	},
	{
		header: 'Status',
		accessorKey: 'status',
		cell: ({ row }) => (
			<span
				className={classNames('badge', {
					'bg-success': row.original.status,
					'bg-danger': !row.original.status,
				})}
			>
				{row.original.status ? 'Active' : 'Deactivated'}
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

// get pagelist to display
const sizePerPageList = [2, 5, 10, 20, 50];

export { columns, sizePerPageList };
