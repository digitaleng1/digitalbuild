import PageBreadcrumb from '@/components/PageBreadcrumb';
import { Button, Card, CardBody, Col, Row } from 'react-bootstrap';
import OrdersTable from './OrdersTable';
import StatusSelect from './StatusSelect';




const OrdersEcom = () => {
	return (
		<>
			<PageBreadcrumb title="Orders" subName="E-Commerce" />

			<Row>
				<Col xs={12}>
					<Card>
						<CardBody>
							<Row className="mb-2">
								<Col xl={8}>
									<form className="row gy-2 gx-2 align-items-center justify-content-xl-start justify-content-between">
										<div className="col-auto">
											<div className="d-flex align-items-center w-auto">
												<label htmlFor="status-select" className="me-2">
													Status
												</label>
												<StatusSelect />
											</div>
										</div>
									</form>
								</Col>

								<Col xl={4}>
									<div className="text-lg-end mt-xl-0 mt-2">
										<Button variant="danger" className="mb-2 me-2">
											<i className="mdi mdi-basket me-1"></i> Add New Order
										</Button>
										<Button variant="light" className="mb-2">
											Export
										</Button>
									</div>
								</Col>
							</Row>

							<OrdersTable />
						</CardBody>
					</Card>
				</Col>
			</Row>
		</>
	);
};

export default OrdersEcom;
