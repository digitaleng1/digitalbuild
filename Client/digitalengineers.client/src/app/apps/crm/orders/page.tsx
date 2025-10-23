import PageBreadcrumb from '@/components/PageBreadcrumb';
import { Button, Card, CardBody, Col, Row } from 'react-bootstrap';
import OrderStatus from './OrderStatus';
import Orders from './Orders';
import { orderData } from './data';




const OrdersCRM = () => {
	return (
		<>
			<PageBreadcrumb title="Orders List" subName="CRM" />

			<Row>
				<Col xs={12}>
					<Card>
						<CardBody>
							<div className="mb-2 row">
								<OrderStatus />
								<Col xl={4}>
									<div className="text-xl-end mt-xl-0 mt-2">
										<Button variant="danger" className="mb-2 me-2">
											<i className="mdi mdi-basket me-1"></i> Add New Order
										</Button>
										<Button variant="light" className="mb-2">
											Export
										</Button>
									</div>
								</Col>
							</div>

							<Orders orderData={orderData} />
						</CardBody>
					</Card>
				</Col>
			</Row>
		</>
	);
};

export default OrdersCRM;
