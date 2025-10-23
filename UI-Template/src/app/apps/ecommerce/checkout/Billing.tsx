import { Button, Col, Row } from 'react-bootstrap';
import * as yup from 'yup';
import ReactSelect from 'react-select';
import { countries } from './data';
import { Form, TextAreaInput, TextInput } from '@/components/Form';
import { Link } from 'react-router';
import { PatternFormat } from 'react-number-format';

const Billing = () => {
	/*
	 * form validation schema
	 */
	const schema = yup.object().shape({
		billing_firstname: yup.string().required('Please enter firstname'),
		billing_lastname: yup.string().required('Please enter lastname'),
		billing_email: yup.string().required('Please enter Email address'),
	});

	/*
	 * form methods
	 */

	return (
		<Row>
			<Col>
				<h4 className="mt-2">Billing information</h4>
				<p className="text-muted mb-4">Fill the form below in order to send you the order&apos;s invoice.</p>

				<Form onSubmit={() => {}} schema={schema}>
					<Row>
						<Col md={6}>
							<TextInput
								label="First Name"
								type="text"
								name="billing_firstname"
								placeholder="Enter your first name"
								containerClass={'mb-3'}
								key="firstname"
							/>
						</Col>
						<Col md={6}>
							<TextInput
								label="Last Name"
								type="text"
								name="billing_lastname"
								placeholder="Enter your last name"
								containerClass={'mb-3'}
								key="lastname"
							/>
						</Col>
					</Row>
					<Row>
						<Col md={6}>
							<TextInput label="Email address" type="email" name="billing_email" placeholder="Enter your email" containerClass={'mb-3'} key="email" />
						</Col>
						<Col md={6}>
							<div className="form-group mb-3">
								<label className="form-label">Phone</label>
								<PatternFormat className="form-control" format="(##) ####-####" mask="_" />
							</div>
						</Col>
					</Row>
					<Row>
						<Col md={12}>
							<TextInput label="Address" type="text" name="billing_address" placeholder="Enter your state" containerClass={'mb-3'} key="address" />
						</Col>
					</Row>
					<Row>
						<Col md={4}>
							<TextInput
								label="Town / City"
								type="text"
								name="billing_towncity"
								placeholder="Enter your city name"
								containerClass={'mb-3'}
								key="towncity"
							/>
						</Col>
						<Col md={4}>
							<TextInput label="State" type="text" name="billing_state" placeholder="Enter your state" containerClass={'mb-3'} key="state" />
						</Col>
						<Col md={4}>
							<TextInput
								label="Zip / Postal Code"
								type="text"
								name="billing_zippostal"
								placeholder="Enter your zip code"
								containerClass={'mb-3'}
								key="zippostal"
							/>
						</Col>
					</Row>
					<Row>
						<Col md={12}>
							<div className="form-group mb-3">
								<label className="form-label">Country</label>
								<ReactSelect name="country" className="react-select" classNamePrefix="react-select" options={countries} />
							</div>
						</Col>
					</Row>
					<Row>
						<Col md={12}>
							<TextAreaInput label="Order Notes:" rows={3} name="billing_notes" placeholder="Write some note.." containerClass={'mb-3'} key="notes" />
						</Col>
					</Row>
					<Row>
						<Col sm={6}>
							<Link to="/apps/ecommerce/shopping-cart" className="btn text-muted d-none d-sm-inline-block btn-link fw-semibold">
								<i className="mdi mdi-arrow-left"></i> Back to Shopping Cart
							</Link>
						</Col>
						<Col sm={6} className="text-sm-end">
							<Button variant="danger" type="submit">
								<i className="mdi mdi-truck-fast me-1"></i> Proceed to Shipping
							</Button>
						</Col>
					</Row>
				</Form>
			</Col>
		</Row>
	);
};

export default Billing;
