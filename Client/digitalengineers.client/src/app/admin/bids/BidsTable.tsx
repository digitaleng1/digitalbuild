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
            tableClass="table-sm"
            rowsPerPageList={sizePerPageList}
            theadClass="bg-light bg-opacity-50"
            showPagination
            isSearchable
            searchBoxClass="mb-3"
            searchPlaceholder="Search projects..."
        />
    );
};

export default BidsTable;
