import PageBreadcrumb from '@/components/PageBreadcrumb';
import {Link} from "react-router";
import { Button, Card, CardBody, Col, Row } from 'react-bootstrap';
import ProductTable from './ProductTable';




const ProductsEcom = () => {
	return (
		<>
			<PageBreadcrumb title="Products" subName="E-commerce" />

			<Row>
				<Col xs={12}>
					<Card>
						<CardBody>
							<Row className="mb-2">
								<Col sm={5}>
									<Link to="" className="btn btn-danger mb-2">
										<i className="mdi mdi-plus-circle me-2"></i> Add Products
									</Link>
								</Col>

								<Col sm={7}>
									<div className="text-sm-end">
										<Button variant="success" className="mb-2 me-1">
											<i className="mdi mdi-cog-outline"></i>
										</Button>

										<Button variant="light" className="mb-2 me-1">
											Import
										</Button>

										<Button variant="light" className="mb-2">
											Export
										</Button>
									</div>
								</Col>
							</Row>

							<ProductTable />
						</CardBody>
					</Card>
				</Col>
			</Row>
		</>
	);
};

export default ProductsEcom;
