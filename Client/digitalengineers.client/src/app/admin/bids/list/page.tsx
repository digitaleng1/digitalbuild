import PageBreadcrumb from '@/components/PageBreadcrumb';
import { Button, Card, CardBody, Col, Row, Spinner, Alert } from 'react-bootstrap';
import BidsTable from '../BidsTable';
import { useAdminBids } from '../hooks/useAdminBids';

const AdminBidsListPage = () => {
    const { 
        bids, 
        loading, 
        error, 
        refetch, 
        bidStatusFilter, 
        setBidStatusFilter,
        projectStatusFilter,
        setProjectStatusFilter
    } = useAdminBids();

    if (loading) {
        return (
            <div className="text-center py-5">
                <Spinner animation="border" />
            </div>
        );
    }

    if (error) {
        return <Alert variant="danger">{error}</Alert>;
    }

    return (
        <>
            <PageBreadcrumb title="Projects with Bids" subName="Admin" />

            <Row>
                <Col xs={12}>
                    <Card>
                        <CardBody>
                            <Row className="mb-3">
                                <Col sm={8}>
                                    <h4 className="header-title mb-1">Projects with Bids</h4>
                                    <p className="text-muted mb-0">View and manage all projects with bid information</p>
                                </Col>

                                <Col sm={4}>
                                    <div className="text-sm-end">
                                        <Button 
                                            variant="primary" 
                                            className="mb-2"
                                            onClick={refetch}
                                            disabled={loading}
                                        >
                                            <i className="mdi mdi-refresh me-1"></i>
                                            Refresh
                                        </Button>
                                    </div>
                                </Col>
                            </Row>

                            <BidsTable 
                                data={bids}
                                bidStatusFilter={bidStatusFilter}
                                onBidStatusChange={setBidStatusFilter}
                                projectStatusFilter={projectStatusFilter}
                                onProjectStatusChange={setProjectStatusFilter}
                            />
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default AdminBidsListPage;
