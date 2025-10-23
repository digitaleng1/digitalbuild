
import { Form as RHForm, SelectInput, TextInput } from '@/components/Form';
import { Col, Form, Row } from 'react-bootstrap';
import * as yup from 'yup';
const OrderStatus = () => {
	const orderSchema = yup.object({
		email: yup.string().email('Please enter valid email').required('Please enter email'),
		password: yup.string().required('Please enter password'),
	});
	return (
		<RHForm onSubmit={() => {}} schema={orderSchema} className="col-xl-8">
			<Row className="gy-2 gx-2 align-items-center justify-content-xl-start justify-content-between">
				<Col xs="auto">
					<TextInput type="text" name="search" placeholder="Search..." />
				</Col>
				<Col xs="auto">
					<Form.Group as={Row} className="align-items-center">
						<Form.Label htmlFor="exampleEmail3" as={Col} sm={3} className="mb-0 fw-medium">
							Status
						</Form.Label>
						<Col sm={9}>
							<SelectInput name="select" className="form-select" key="select">
								<option>Choose...</option>
								<option>Paid</option>
								<option>Awaiting Authorization</option>
								<option>Payment failed</option>
								<option>Cash On Delivery</option>
								<option>Fulfilled</option>
								<option>Unfulfilled</option>
							</SelectInput>
						</Col>
					</Form.Group>
				</Col>
			</Row>
		</RHForm>
	);
};

export default OrderStatus;
