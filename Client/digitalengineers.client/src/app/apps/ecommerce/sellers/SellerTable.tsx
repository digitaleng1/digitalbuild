
import ReactTable from '@/components/table/ReactTable';
import type { Seller } from '../types';
import { columns, sizePerPageList } from './ColumnsSet';
import { sellers } from '../data';

const SellerTable = () => {
	return (
		<ReactTable<Seller>
			columns={columns}
			data={sellers}
			pageSize={10}
			rowsPerPageList={sizePerPageList}
			showPagination
			isSearchable={true}
			isSelectable={true}
			theadClass="bg-light bg-opacity-50 thead-sm"
			searchBoxClass="mt-2 mb-3"
		/>
	);
};

export default SellerTable;
