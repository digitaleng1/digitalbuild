import PageBreadcrumb from '@/components/PageBreadcrumb';
import {
	Button,
	Card,
	CardBody,
	Col,
	DropdownButton,
	DropdownDivider,
	DropdownItem,
	FloatingLabel,
	FormCheck,
	FormControl,
	FormLabel,
	FormSelect,
	FormText,
	InputGroup,
	Row,
} from 'react-bootstrap';
import InputGroupText from 'react-bootstrap/esm/InputGroupText';
import BasicInputElements from './BasicInputElements';
import InlineForm from './InlineForm';




const FloatingLabels = () => {
	return (
		<Card>
			<CardBody>
				<h4 className="header-title">Floating labels</h4>
				<p className="text-muted">
					Wrap a <code>&lt;Form.Control&gt;</code> element in
					<code>&lt;FloatingLabel&gt;</code>
					to enable floating labels with Bootstrap’s textual form fields. A<code>placeholder</code>
					is required on each <code>&lt;Form.Control&gt;</code> as our method of CSS-only floating labels uses the <code>:placeholder-shown</code>{' '}
					pseudo-element.
				</p>

				<Row>
					<Col lg={6}>
						<h5 className="mb-3">Example</h5>
						<FloatingLabel label="Email address" className="mb-3">
							<FormControl type="email" placeholder="name@example.com" />
						</FloatingLabel>
						<FloatingLabel label="Password">
							<FormControl type="password" placeholder="Password" />
						</FloatingLabel>

						<h5 className="mb-3 mt-4">Textareas</h5>
						<FloatingLabel label="Comments">
							<FormControl as="textarea" placeholder="Leave a comment here" style={{ height: '100px' }} />
						</FloatingLabel>
					</Col>

					<Col lg={6}>
						<h5 className="mb-3">Selects</h5>
						<FloatingLabel label="Works with selects">
							<FormSelect aria-label="Floating label select example">
								<option>Open this select menu</option>
								<option value="1">One</option>
								<option value="2">Two</option>
								<option value="3">Three</option>
							</FormSelect>
						</FloatingLabel>

						<h5 className="mb-3 mt-4">Layout</h5>
						<Row className="g-2">
							<Col md>
								<FloatingLabel label="Email address">
									<FormControl type="email" placeholder="name@example.com" />
								</FloatingLabel>
							</Col>
							<Col md>
								<FloatingLabel label="Works with selects">
									<FormSelect aria-label="Floating label select example">
										<option>Open this select menu</option>
										<option value="1">One</option>
										<option value="2">Two</option>
										<option value="3">Three</option>
									</FormSelect>
								</FloatingLabel>
							</Col>
						</Row>
					</Col>
				</Row>
			</CardBody>
		</Card>
	);
};

const SelectInputDemo = () => {
	return (
		<>
			<h4 className="header-title">Select menu</h4>
			<p className="text-muted">
				Custom <code>&lt;select&gt;</code> menus need only a custom class,
				<code>.custom-select</code> to trigger the custom styles.
			</p>

			<div className="form-group">
				<FormSelect className="custom-select mt-3" aria-label="Default select example">
					<option>1</option>
					<option>2</option>
					<option>3</option>
					<option>4</option>
					<option>5</option>
				</FormSelect>
			</div>
		</>
	);
};

const Switches = () => {
	return (
		<>
			<h4 className="header-title mt-4">Switches</h4>
			<p className="text-muted">
				A switch has the markup of a custom checkbox but uses the
				<code>.custom-switch</code> class to render a toggle switch. Switches also support the <code>disabled</code> attribute.
			</p>

			<form>
				<FormCheck type="switch" id="custom-switch" label="Toggle this switch element" />
				<FormCheck disabled type="switch" label="Disabled switch element" id="disabled-custom-switch" className="mt-1" />
			</form>
		</>
	);
};

const CustomCheckboxes = () => {
	return (
		<div className="form-group">
			<FormLabel className="form-label" htmlFor="exampleCheckbox">
				Checkboxes
			</FormLabel>
			<div>
				<FormCheck type="checkbox" id="default-checkbox" label="Check this custom checkbox" />
				<FormCheck type="checkbox" id="default-checkbox" label="But not this disabled one" disabled />
			</div>
		</div>
	);
};

const InlineCustomCheckboxes = () => {
	return (
		<div className="mt-2">
			<FormLabel className="form-check-label" htmlFor="exampleCheckbox">
				Inline
			</FormLabel>
			<div>
				<FormCheck type="checkbox" id="inline-checkbox" label="An inline custom input" />
				<FormCheck type="checkbox" id="inline-checkbox" label="and another one" />
			</div>
		</div>
	);
};

const CustomRadios = () => {
	return (
		<div className="mt-2">
			<FormLabel className="form-label" htmlFor="exampleCheckbox">
				Radios
			</FormLabel>
			<div>
				<FormCheck type="radio" id="default-radio1" label="Check this custom checkbox" />
				<FormCheck type="radio" id="default-radio1" label="But not this disabled one" disabled={true} />
			</div>
		</div>
	);
};

const InputSizes = () => {
	return (
		<Card>
			<CardBody>
				<h4 className="header-title">Input Sizes</h4>
				<p className="text-muted">
					Use size on <code>&lt;FormControl&gt;</code> and <code>&lt;FormLabel&gt;</code>
					to change the size of inputs and labels respectively.
				</p>

				<form>
					<div className="mb-3">
						<FormLabel htmlFor="small">Small</FormLabel>
						<FormControl type="text" name="small" id="small" placeholder="Small" size="sm" />
					</div>

					<div className="mb-3">
						<FormLabel htmlFor="Normal">Normal</FormLabel>
						<FormControl type="text" name="Normal" id="Normal" placeholder="Normal" />
					</div>

					<div className="mb-3">
						<FormLabel htmlFor="Large">Large</FormLabel>
						<FormControl type="text" name="Large" id="Large" placeholder="Large" size="lg" />
					</div>

					<div className="mb-0">
						<FormLabel htmlFor="grid">Grid Sizes</FormLabel>
						<Row>
							<Col sm={4}>
								<FormControl type="text" name="grid" id="grid" placeholder=".col-sm-4" />
							</Col>
						</Row>
					</div>
				</form>
			</CardBody>
		</Card>
	);
};

const InputGroups = () => {
	return (
		<Card>
			<CardBody>
				<h4 className="header-title">Input Group</h4>
				<p className="text-muted">
					Easily extend form conrols by adding text, buttons, or button groups on either side of textual inputs, custom selects, and custom file
					inputs
				</p>

				<form>
					<div className="form-group">
						<FormLabel htmlFor="Static">Static</FormLabel>
						<InputGroup className="mb-3">
							<InputGroupText id="basic-addon1">@</InputGroupText>
							<FormControl placeholder="Username" aria-label="Username" aria-describedby="basic-addon1" />
						</InputGroup>
					</div>

					<div className="form-group">
						<FormLabel htmlFor="Dropdown">Dropdown</FormLabel>
						<InputGroup className="mb-3">
							<DropdownButton variant="primary" title="Dropdown" id="input-group-dropdown-1">
								<DropdownItem href="">Action</DropdownItem>
								<DropdownItem href="">Another action</DropdownItem>
								<DropdownItem href="">Something else here</DropdownItem>
								<DropdownDivider />
								<DropdownItem href="">Separated link</DropdownItem>
							</DropdownButton>
							<FormControl aria-label="Text input with dropdown button" />
						</InputGroup>
					</div>

					<div className="form-group">
						<FormLabel htmlFor="Button">Button</FormLabel>
						<InputGroup className="mb-3">
							<FormControl placeholder="Recipient's username" aria-label="Recipient's username" aria-describedby="basic-addon2" />
							<Button variant="dark" id="button-addon2">
								Button
							</Button>
						</InputGroup>
					</div>

					<Row className="g-2">
						<Col sm={6}>
							<div className="form-group">
								<FormLabel htmlFor="file">File input</FormLabel>
								<FormControl type="file" />
							</div>
						</Col>
						<Col sm={6}>
							<div className="form-group">
								<FormLabel htmlFor="formFileMultiple01">Multiple input</FormLabel>
								{/* <FormControl type="file" multiple={true} /> */}
							</div>
						</Col>
					</Row>
				</form>
			</CardBody>
		</Card>
	);
};

const DefaultForm = () => {
	return (
		<Card>
			<CardBody>
				<h4 className="mb-3 header-title">Basic Example</h4>

				<form>
					<div className="mb-3">
						<FormLabel htmlFor="exampleEmail2">Email</FormLabel>
						<FormControl type="email" name="email" id="exampleEmail2" placeholder="Enter your email" />
						<FormText>We&apos;ll never share your email with anyone else.</FormText>
					</div>

					<div className="mb-3">
						<FormLabel htmlFor="examplePassword2">Password</FormLabel>
						<FormControl type="password" name="password" id="examplePassword2" placeholder="password placeholder" defaultValue="12345" />
					</div>

					<div className="mb-3" id="formGridCheckbox">
						<FormCheck type="checkbox" label="Check me out" />
					</div>

					<Button variant="primary" type="submit">
						Submit
					</Button>
				</form>
			</CardBody>
		</Card>
	);
};

const HorizontalForm = () => {
	return (
		<Card>
			<CardBody>
				<h4 className="mb-3 header-title">Horizontal Form</h4>
				<form>
					<Row className="mb-3 form-group">
						<FormLabel htmlFor="exampleEmail3" column sm={3}>
							Email
						</FormLabel>
						<Col sm={9}>
							<FormControl type="email" name="email" id="exampleEmail3" placeholder="Enter your email" />
							<FormText>We&apos;ll never share your email with anyone else.</FormText>
						</Col>
					</Row>

					<Row className="mb-3 form-group">
						<FormLabel htmlFor="examplePassword3" column sm={3}>
							Password
						</FormLabel>
						<Col sm={9}>
							<FormControl type="password" name="password" id="examplePassword3" placeholder="password placeholder" defaultValue="12345" />
						</Col>
					</Row>

					<Row className="mb-3 form-group">
						<FormLabel htmlFor="examplePassword4" column sm={3}>
							Re-Password
						</FormLabel>
						<Col sm={9}>
							<FormControl type="password" name="password" id="examplePassword4" placeholder="password placeholder" defaultValue="12345" />
						</Col>
					</Row>

					<Row className="mb-3 form-group">
						<Col sm={{ span: 9, offset: 3 }}>
							<FormCheck label="Remember me" />
						</Col>
					</Row>

					<Row className="mb-0 form-group">
						<Col sm={{ span: 9, offset: 3 }}>
							<Button variant="primary" type="submit">
								Sign in
							</Button>
						</Col>
					</Row>
				</form>
			</CardBody>
		</Card>
	);
};

const HorizontalFormLabelSizing = () => {
	return (
		<Card>
			<CardBody>
				<h4 className="header-title">Horizontal form label sizing</h4>
				<p className="text-muted font-14">
					You can size the <code>&lt;FormLabel&gt;</code> using the column prop as shown.
				</p>

				<Row>
					<FormLabel column="lg" lg={2}>
						Large Text
					</FormLabel>
					<Col>
						<FormControl size="lg" type="text" placeholder="Large text" />
					</Col>
				</Row>
				<br />
				<Row>
					<FormLabel column lg={2}>
						Normal Text
					</FormLabel>
					<Col>
						<FormControl type="text" placeholder="Normal text" />
					</Col>
				</Row>
				<br />
				<Row>
					<FormLabel column="sm" lg={2}>
						Small Text
					</FormLabel>
					<Col>
						<FormControl size="sm" type="text" placeholder="Small text" />
					</Col>
				</Row>
			</CardBody>
		</Card>
	);
};

const FormGrid = () => {
	return (
		<Card>
			<CardBody>
				<h4 className="header-title">Form Grid</h4>

				<form>
					<Row className="mb-3">
						<Col className="form-group">
							<FormLabel>Email</FormLabel>
							<FormControl type="email" placeholder="Enter email" />
						</Col>

						<Col className="form-group">
							<FormLabel>Password</FormLabel>
							<FormControl type="password" placeholder="Password" />
						</Col>
					</Row>

					<div className="mb-3">
						<FormLabel>Address</FormLabel>
						<FormControl placeholder="1234 Main St" />
					</div>

					<div className="mb-3">
						<FormLabel>Address 2</FormLabel>
						<FormControl placeholder="Apartment, studio, or floor" />
					</div>

					<Row className="mb-3">
						<Col className="form-group">
							<FormLabel>City</FormLabel>
							<FormControl />
						</Col>

						<Col className="form-group">
							<FormLabel>State</FormLabel>
							<FormSelect defaultValue="Choose...">
								<option>Choose...</option>
								<option>...</option>
							</FormSelect>
						</Col>

						<Col className="form-group">
							<FormLabel>Zip</FormLabel>
							<FormControl />
						</Col>
					</Row>

					<div className="mb-3" id="formGridCheckbox2">
						<FormCheck type="checkbox" label="Check me out" />
					</div>

					<Button variant="primary" type="submit">
						Submit
					</Button>
				</form>
			</CardBody>
		</Card>
	);
};

const BasicElementsForm = () => {
	return (
		<>
			<PageBreadcrumb title="Basic Elements" subName="Forms" />

			<Row>
				<Col>
					<BasicInputElements />
				</Col>
			</Row>

			<Row>
				<Col>
					<FloatingLabels />
				</Col>
			</Row>

			<Row>
				<Col>
					<Card>
						<CardBody>
							<Row>
								<Col lg={6}>
									<SelectInputDemo />
									<Switches />
								</Col>

								<Col lg={6}>
									<h4 className="header-title mt-5 mt-sm-0">Checkboxes and radios</h4>
									<div className="mt-3">
										<CustomCheckboxes />
										<CustomRadios />
										<InlineCustomCheckboxes />
									</div>
								</Col>
							</Row>
						</CardBody>
					</Card>
				</Col>
			</Row>

			<Row>
				<Col lg={6}>
					<InputSizes />
				</Col>

				<Col lg={6}>
					<InputGroups />
				</Col>
			</Row>

			<Row>
				<Col lg={6}>
					<DefaultForm />
				</Col>

				<Col lg={6}>
					<HorizontalForm />
				</Col>
			</Row>

			<Row>
				<Col>
					<InlineForm />
				</Col>
			</Row>

			<Row>
				<Col>
					<HorizontalFormLabelSizing />
				</Col>
			</Row>

			<Row>
				<Col>
					<FormGrid />
				</Col>
			</Row>
		</>
	);
};

export default BasicElementsForm;
