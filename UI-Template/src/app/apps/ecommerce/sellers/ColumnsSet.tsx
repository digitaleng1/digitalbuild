import type { ColumnDef } from '@tanstack/react-table';
import type { ApexOptions } from 'apexcharts';
import {Link} from "react-router";

import type { Seller } from '../types';
import ReactApexChart from 'react-apexcharts';


const options: ApexOptions = {
	chart: {
		type: 'line',
		sparkline: {
			enabled: true,
		},
	},
	series: [],
	stroke: {
		width: 2,
		curve: 'smooth',
	},
	markers: {
		size: 0,
	},
	colors: ['#727cf5'],
	tooltip: {
		fixed: {
			enabled: false,
		},
		x: {
			show: false,
		},
		y: {
			title: {
				formatter: function () {
					return '';
				},
			},
		},
		marker: {
			show: false,
		},
	},
};

const series = [{ name: 'data', data: [66, 95, 53, 66, 70, 41, 27, 62, 87, 69, 17] }];

/* action column render */
const ActionColumn = () => {
	return (
		<>
			<Link to="" className="action-icon">
				<i className="mdi mdi-square-edit-outline"></i>
			</Link>
			<Link to="" className="action-icon">
				<i className="mdi mdi-delete"></i>
			</Link>
		</>
	);
};

// get all columns
// Todo: Generic's values are not provided from the library itself
// const columns: ReadonlyArray<Column<Seller>> =
const columns: ColumnDef<Seller>[] = [
	{
		header: 'Seller',
		accessorKey: 'name',
		cell: ({ row }) => (
			<div className="table-user">
				<img src={row.original.image} alt="" className="me-2 rounded-circle" />
				<Link to="" className="text-body fw-semibold">
					{row.original.name}
				</Link>
			</div>
		),
	},
	{
		header: 'Store Name',
		accessorKey: 'store',
	},
	{
		header: 'Products',
		accessorKey: 'products',
	},
	{
		header: 'Wallet Balance',
		accessorKey: 'balance',
	},
	{
		header: 'Created Date',
		accessorKey: 'created_on',
	},
	{
		header: 'Revenue',
		accessorKey: 'id',
		cell: () => <ReactApexChart options={options} series={series} height={35} width={80} />,
	},
	{
		header: 'Action',
		accessorKey: 'image',
		cell: ActionColumn,
	},
];

// get pagelist to display
const sizePerPageList = [2, 5, 10, 20, 50];

export { columns, sizePerPageList };
