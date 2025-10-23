
import { Form, PasswordInput, TextInput } from '@/components/Form';
import { Button, Card, CardBody, Col, FormCheck, FormControl, FormLabel, InputGroup, Row } from 'react-bootstrap';
import InputGroupText from 'react-bootstrap/esm/InputGroupText';

const InlineForm = () => {
	return (
		<Card>
			<CardBody>
				<h4 className="mb-3 header-title">Inline Form Example</h4>
				<Form onSubmit={() => {}} className="row row-cols-lg-auto g-3 align-items-center" defaultValues={{ password: '1234556' }}>
					<Col>
						<TextInput
							type="email"
							name="email"
							id={'exampleEmail4'}
							containerClass="mb-2 me-sm-2 mb-sm-0"
							placeholder="email@example.com"
							bsPrefix="form-control-plaintext"
							readOnly
						/>
					</Col>

					<Col>
						<PasswordInput type="password" name="password" id="examplePassword5" placeholder="password placeholder" />
					</Col>

					<Col>
						<Button color="primary" type="submit">
							Confirm identity
						</Button>
					</Col>
				</Form>

				<h6 className="font-13 mt-3">Auto-sizing</h6>

				<form>
					<Row className="align-items-center">
						<Col xs="auto">
							<FormLabel htmlFor="inlineFormInput" visuallyHidden>
								Name
							</FormLabel>
							<FormControl className="mb-2" id="inlineFormInput" placeholder="Jane Doe" />
						</Col>
						<Col xs="auto">
							<FormLabel htmlFor="inlineFormInputGroup" visuallyHidden>
								Username
							</FormLabel>
							<InputGroup className="mb-2">
								<InputGroupText>@</InputGroupText>
								<FormControl id="inlineFormInputGroup" placeholder="Username" />
							</InputGroup>
						</Col>
						<Col xs="auto">
							<FormCheck type="checkbox" id="autoSizingCheck" className="mb-2" label="Remember me" />
						</Col>
						<Col xs="auto">
							<Button type="submit" className="mb-2">
								Submit
							</Button>
						</Col>
					</Row>
				</form>
			</CardBody>
		</Card>
	);
};

export default InlineForm;
