import PageBreadcrumb from '@/components/PageBreadcrumb';
import { Button, Card, CardBody, Col, Row, Spinner, Alert } from 'react-bootstrap';
import BidsTable from '../BidsTable';
import { useAdminBids } from '../hooks/useAdminBids';

const AdminBidsListPage = () => {
    const { bids, loading, error } = useAdminBids();

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
            <PageBreadcrumb title="Bids Management" subName="Projects" />

            <Row>
                <Col xs={12}>
                    <Card>
                        <CardBody>
                            <Row className="mb-2">
                                <Col sm={5}>
                                    <h4 className="header-title mb-0">Project Bids Overview</h4>
                                </Col>

                                <Col sm={7}>
                                    <div className="text-sm-end">
                                        <Button variant="success" className="mb-2 me-1">
                                            <i className="mdi mdi-cog-outline"></i>
                                        </Button>

                                        <Button variant="light" className="mb-2 me-1">
                                            Export
                                        </Button>
                                    </div>
                                </Col>
                            </Row>

                            <BidsTable data={bids} />
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default AdminBidsListPage;
