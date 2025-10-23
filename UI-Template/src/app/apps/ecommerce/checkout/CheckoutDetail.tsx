
import classnames from 'classnames';
import { Card, CardBody, Col, Nav, Row, Tab, TabContainer } from 'react-bootstrap';
import useCheckout from '../hooks/useCheckout';
import Billing from './Billing';
import Payment from './Payment';
import Shipping from './Shipping';
import Summary from './Summary';

const CheckoutDetail = () => {
	const { cart, updateShipping } = useCheckout();

	return (
		<TabContainer defaultActiveKey="1">
			<Row>
				<Col>
					<Card>
						<CardBody>
							<Nav as="ul" variant="pills" className="nav nav-pills bg-nav-pills nav-justified mb-3">
								<Nav.Item as="li" className="nav-item">
									<Nav.Link href="" eventKey="1" className="nav-link rounded-0">
										<i className={classnames('mdi mdi-account-circle', 'font-18')}></i>
										<span className="d-none d-lg-block">Billing Info</span>
									</Nav.Link>
								</Nav.Item>
								<Nav.Item as="li" className="nav-item">
									<Nav.Link href="" eventKey="2" className="nav-link rounded-0">
										<i className={classnames('mdi mdi-truck-fast', 'font-18')}></i>
										<span className="d-none d-lg-block">Shipping Info</span>
									</Nav.Link>
								</Nav.Item>
								<Nav.Item as="li">
									<Nav.Link href="" eventKey="3" className="nav-link rounded-0">
										<i className={classnames('mdi mdi-cash-multiple', 'font-18')}></i>
										<span className="d-none d-lg-block">Payment Info</span>
									</Nav.Link>
								</Nav.Item>
							</Nav>

							<Row>
								<Col lg={8}>
									<Tab.Content>
										<Tab.Pane eventKey="1">
											<Billing />
										</Tab.Pane>
										<Tab.Pane eventKey="2">
											<Shipping updateShipping={updateShipping} />
										</Tab.Pane>
										<Tab.Pane eventKey="3">
											<Payment />
										</Tab.Pane>
									</Tab.Content>
								</Col>
								<Col lg={4}>
									<Summary cart={cart} />
								</Col>
							</Row>
						</CardBody>
					</Card>
				</Col>
			</Row>
		</TabContainer>
	);
};

export default CheckoutDetail;
