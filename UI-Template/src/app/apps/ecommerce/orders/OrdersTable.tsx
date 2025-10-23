
import ReactTable from '@/components/table/ReactTable';
import useOrders from '../hooks/useOrders';
import type { Order } from '../types';
import { columns, sizePerPageList } from './ColumnsSet';

const OrdersTable = () => {
	const { orderList } = useOrders();

	return (
		<ReactTable<Order>
			columns={columns}
			data={orderList}
			pageSize={10}
			rowsPerPageList={sizePerPageList}
			showPagination
			isSearchable={true}
			theadClass="bg-light bg-opacity-50 thead-sm"
			isSelectable
			searchBoxClass="mb-2"
		/>
	);
};

export default OrdersTable;
