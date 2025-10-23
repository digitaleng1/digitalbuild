
import { Form, TextAreaInput, TextInput } from '@/components/Form';
import { Col, Row } from 'react-bootstrap';
import * as yup from 'yup';

const ContactForm = () => {
	/*
	 * form validation schema
	 */
	const schema = yup.object().shape({
		fullname: yup.string().required('Please enter your name'),
		emailaddress: yup.string().required('Please enter your email'),
		subject: yup.string().required('Please enter subject'),
		comments: yup.string().required('Please enter your message'),
	});

	return (
		<Form onSubmit={() => {}} schema={schema}>
			<Row className="mt-4">
				<Col lg={6}>
					<TextInput
						type="text"
						label="Your Name"
						name="fullname"
						className="form-control form-control-light"
						placeholder="Name..."
						containerClass={'mb-2'}
						key="fullname"
					/>
				</Col>
				<Col lg={6}>
					<TextInput
						type="email"
						label="Your Email"
						name="emailaddress"
						className="form-control form-control-light"
						placeholder="Enter your email..."
						containerClass={'mb-2'}
						key="emailaddress"
					/>
				</Col>
			</Row>
			<Row className="mt-1">
				<Col lg={12}>
					<TextInput
						type="text"
						label="Your Subject"
						name="subject"
						className="form-control form-control-light"
						placeholder="Enter subject..."
						containerClass={'mb-2'}
						key="subject"
					/>
				</Col>
			</Row>
			<Row className="mt-1">
				<Col lg={12}>
					<TextAreaInput
						label="Message"
						name="comments"
						className="form-control form-control-light"
						placeholder="Type your message here..."
						containerClass={'mb-2'}
						rows={4}
						key="comments"
					/>
				</Col>
			</Row>
			<Row className="mt-2">
				<Col className="col-12 text-end">
					<button className="btn btn-primary">
						Send a Message <i className="mdi mdi-telegram ms-1"></i>
					</button>
				</Col>
			</Row>
		</Form>
	);
};

export default ContactForm;
