
import { columns, sizePerPageList } from './ColumnsSet';
import type { Product } from '../types';
import { products } from '../data';
import ReactTable from '@/components/table/ReactTable';

const ProductTable = () => {
	return (
		<ReactTable<Product>
			columns={columns}
			data={products}
			pageSize={5}
			rowsPerPageList={sizePerPageList}
			theadClass="bg-light bg-opacity-50 thead-sm"
			showPagination
			isSearchable
			isSelectable
			searchBoxClass="mb-2"
		/>
	);
};

export default ProductTable;
