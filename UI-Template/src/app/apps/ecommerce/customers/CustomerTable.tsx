
import ReactTable from '@/components/table/ReactTable';
import type { Customer } from '../types';
import { columns, sizePerPageList } from './ColumnsSet';
import { customers } from '../data';




const CustomerTable = () => {
	return (
		<ReactTable<Customer>
			columns={columns}
			data={customers}
			pageSize={10}
			rowsPerPageList={sizePerPageList}
			tableClass="table-striped"
			showPagination
			isSearchable
			isSelectable
			searchBoxClass="mt-2 mb-3"
		/>
	);
};

export default CustomerTable;
