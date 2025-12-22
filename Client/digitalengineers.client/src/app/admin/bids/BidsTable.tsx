import { Row, Col } from 'react-bootstrap';
import ReactTable from '@/components/table/ReactTable';
import { bidColumns, bidSizePerPageList } from '@/app/shared/components/bids';
import BidStatusFilter from './components/BidStatusFilter';
import ProjectStatusFilter from './components/ProjectStatusFilter';
import type { AdminBidListItem, BidStatusFilter as BidStatusFilterType, ProjectStatusFilter as ProjectStatusFilterType } from '@/types/admin-bid';

type BidsTableProps = {
    data: AdminBidListItem[];
    bidStatusFilter: BidStatusFilterType;
    onBidStatusChange: (value: BidStatusFilterType) => void;
    projectStatusFilter: ProjectStatusFilterType;
    onProjectStatusChange: (value: ProjectStatusFilterType) => void;
};

const BidsTable = ({ 
    data, 
    bidStatusFilter, 
    onBidStatusChange,
    projectStatusFilter,
    onProjectStatusChange
}: BidsTableProps) => {
    return (
        <>
            <Row className="mb-3">
                <Col xs={12} md={4}>
                    <ProjectStatusFilter 
                        value={projectStatusFilter} 
                        onChange={onProjectStatusChange}
                    />
                </Col>
                <Col xs={12} md={4} className="mt-3 mt-md-0">
                    <BidStatusFilter 
                        value={bidStatusFilter} 
                        onChange={onBidStatusChange}
                    />
                </Col>
            </Row>

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
        </>
    );
};

export default BidsTable;
