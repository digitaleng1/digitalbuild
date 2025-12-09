import ReactTable from '@/components/table/ReactTable';
import { bidColumns, bidSizePerPageList } from '@/app/shared/components/bids';
import type { AdminBidListItem } from '@/types/admin-bid';

type BidsTableProps = {
    data: AdminBidListItem[];
};

const BidsTable = ({ data }: BidsTableProps) => {
    return (
        <ReactTable<AdminBidListItem>
            columns={bidColumns}
            data={data}
            pageSize={10}
            tableClass="table-sm"
            rowsPerPageList={bidSizePerPageList}
            theadClass="bg-light bg-opacity-50"
            showPagination
            isSearchable
            searchBoxClass="mb-3"
        />
    );
};

export default BidsTable;
