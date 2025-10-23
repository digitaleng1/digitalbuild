import PageBreadcrumb from '@/components/PageBreadcrumb';
import { Button, Card, CardBody, Col, Row } from 'react-bootstrap';
import SellerTable from './SellerTable';




const SellersEcom = () => {
	return (
		<>
			<PageBreadcrumb title="Sellers" subName="E-commerce" />

			<Row>
				<Col xs={12}>
					<Card>
						<CardBody>
							<Row className="mb-2">
								<Col sm={5}>
									<Button variant="danger" className="mb-2">
										<i className="mdi mdi-plus-circle me-2"></i> Add Sellers
									</Button>
								</Col>

								<Col sm={7}>
									<div className="text-sm-end">
										<Button variant="success" className="mb-2 me-1">
											<i className="mdi mdi-cog"></i>
										</Button>

										<Button variant="light" className="mb-2 me-1">
											Import
										</Button>

										<Button variant="light" className="mb-2 me-1">
											Export
										</Button>
									</div>
								</Col>
							</Row>

							<SellerTable />
						</CardBody>
					</Card>
				</Col>
			</Row>
		</>
	);
};

export default SellersEcom;
