import { Card, CardBody, Col, Row } from 'react-bootstrap';
import CartDetail from './CartDetail';
import PageBreadcrumb from '@/components/PageBreadcrumb';




const ShoppingCartEcom = () => {
	return (
		<>
			<PageBreadcrumb title="Shopping Cart" subName="E-commerce" />

			<Row>
				<Col xs={12}>
					<Card>
						<CardBody>
							<CartDetail />
						</CardBody>
					</Card>
				</Col>
			</Row>
		</>
	);
};

export default ShoppingCartEcom;
