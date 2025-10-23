import PageBreadcrumb from '@/components/PageBreadcrumb';
import { Button, Card, CardBody, Col, Row } from 'react-bootstrap';
import CustomerTable from './CustomerTable';




const CustomersEcom = () => {
	return (
		<>
			<PageBreadcrumb title="Customers" subName="E-commerce" />

			<Row>
				<Col xs={12}>
					<Card>
						<CardBody>
							<Row>
								<Col sm={5}>
									<Button className="btn btn-danger mb-2">
										<i className="mdi mdi-plus-circle me-2"></i> Add Customers
									</Button>
								</Col>

								<Col sm={7}>
									<div className="text-sm-end">
										<Button className="btn btn-success mb-2 me-1">
											<i className="mdi mdi-cog"></i>
										</Button>

										<Button className="btn btn-light mb-2 me-1">Import</Button>

										<Button className="btn btn-light mb-2">Export</Button>
									</div>
								</Col>
							</Row>

							<CustomerTable />
						</CardBody>
					</Card>
				</Col>
			</Row>
		</>
	);
};

export default CustomersEcom;
