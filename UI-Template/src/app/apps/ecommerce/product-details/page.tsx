import { Card, CardBody, Col, Row } from 'react-bootstrap';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import Stocks from './Stocks';
import Details from '@/app/apps/ecommerce/product-details/Details';

const ProductDetailsEcom = () => {
	return (
		<>
			<PageBreadcrumb title="Product Details" subName="E-Commerce" />

			<Row>
				<Col>
					<Card>
						<CardBody>
							<Details />
							<Stocks />
						</CardBody>
					</Card>
				</Col>
			</Row>
		</>
	);
};

export default ProductDetailsEcom;
