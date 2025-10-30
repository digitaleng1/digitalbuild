import ReactTable from '@/components/table/ReactTable';
import { columns, sizePerPageList } from './ColumnsSet';
import type { AdminBidListItem } from '@/types/admin-bid';

type BidsTableProps = {
    data: AdminBidListItem[];
};

const BidsTable = ({ data }: BidsTableProps) => {
    return (
        <ReactTable<AdminBidListItem>
            columns={columns}
            data={data}
            pageSize={10}
            rowsPerPageList={sizePerPageList}
            theadClass="bg-light bg-opacity-50 thead-sm"
            showPagination
            isSearchable
            searchBoxClass="mb-2"
        />
    );
};

export default BidsTable;
