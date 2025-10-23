import type { ColumnDef, PaginationState, Table, TableOptions } from '@tanstack/react-table';
import type { ReactNode } from 'react';

export type ChildrenType = Readonly<{ children: ReactNode }>;

export type ReactTableProps<RowType> = {
	options?: TableOptions<RowType>;
	columns: ColumnDef<RowType>[];
	data: RowType[];
	showPagination?: boolean;
	rowsPerPageList?: number[];
	isSearchable?: boolean;
	isSelectable?: boolean;
	isExpandable?: boolean;
	pageSize?: number;
	tableClass?: string;
	theadClass?: string;
	searchBoxClass?: string;
};

export type ReactTablePaginationProps<RowType> = {
	table: Table<RowType>;
	rowsPerPageList?: number[];
	currentPage: number;
	totalPages: number;
	pagination: PaginationState;
};
