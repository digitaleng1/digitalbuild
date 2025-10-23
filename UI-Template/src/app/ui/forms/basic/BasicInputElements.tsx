import { ColorInput, DateInput, FileInput, Form, PasswordInput, SelectInput, TextAreaInput, TextInput } from '@/components/Form';
import { Card, CardBody, Col, FormControl, FormLabel, FormText, Row } from 'react-bootstrap';
import FormRange from 'react-bootstrap/esm/FormRange';

const BasicInputElements = () => {
	return (
		<Card>
			<CardBody>
				<h4 className="header-title">Input Types</h4>
				<p className="text-muted">
					Most common form control, text-based input fields. Includes support for all HTML5 types: <code>text</code>, <code>password</code>,{' '}
					<code>datetime</code>,<code>datetime-local</code>, <code>date</code>, <code>month</code>,<code>time</code>, <code>week</code>,{' '}
					<code>number</code>, <code>email</code>,<code>url</code>, <code>search</code>, <code>tel</code>, and <code>color</code>.
				</p>

				<Row>
					<Col lg={6}>
						<Form onSubmit={() => {}}>
							<TextInput label="Text" type="text" name="text" containerClass={'mb-3'} key="text" />

							<TextInput label="Email" type="email" name="email" placeholder="Email" containerClass={'mb-3'} key="email" />

							<PasswordInput label="Show/Hide Password" name="password" placeholder="password placeholder" containerClass={'mb-3'} key="password" />

							<TextInput label="Placeholder" type="text" name="placeholder" placeholder="placeholder" containerClass={'mb-3'} key="placeholder" />

							<TextAreaInput label="Text Area" name="textarea" rows={5} containerClass={'mb-3'} key="textarea" />

							<TextInput
								label="Read only"
								type="text"
								name="text1"
								id="text1"
								placeholder="Readonly value"
								containerClass={'mb-3'}
								key="text1"
								readOnly
							/>

							<TextInput
								label="Disabled"
								type="text"
								name="text2"
								id="text2"
								placeholder="Disabled value"
								containerClass={'mb-3'}
								key="text2"
								disabled
							/>

							<div className="mb-3">
								<FormLabel>Static control</FormLabel>
								<FormControl plaintext readOnly defaultValue="email@example.com" />
							</div>

							<div className="mb-3">
								<FormLabel htmlFor="text3" className="form-label">
									Helping text
								</FormLabel>
								<FormControl type="text" name="text" id="text3" placeholder="Helping text" />
								<FormText>A block of help text that breaks onto a new line and may extend beyond one line.</FormText>
							</div>
						</Form>
					</Col>

					<Col lg={6}>
						<Form onSubmit={() => {}}>
							<SelectInput name="select" label="Input Select" containerClass="mb-3" className="form-select" key="select">
								<option>1</option>
								<option>2</option>
								<option>3</option>
								<option>4</option>
								<option>5</option>
							</SelectInput>

							{/* <SelectInput
                name="selectMulti"
                label="Multiple Select"
                multiple={true}
                containerClass="mb-3"
                className="form-select"
                key="selectMulti"
              >
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>5</option>
              </SelectInput> */}

							<FileInput label="Default file input" type="file" name="file" containerClass={'mb-3'} key="file" />

							<DateInput label="Date" type="date" name="date" containerClass={'mb-3'} key="date" />

							<DateInput label="Month" type="month" name="month" containerClass={'mb-3'} key="month" />

							<DateInput label="Time" type="time" name="time" containerClass={'mb-3'} key="time" />

							<DateInput label="Week" type="week" name="week" containerClass={'mb-3'} key="week" />

							<TextInput label="Number" type="number" name="number" placeholder="number placeholder" containerClass={'mb-3'} key="number" />

							<ColorInput
								label="Color"
								type="color"
								name="color"
								placeholder="color placeholder"
								className="w-100"
								containerClass={'mb-3'}
								key="color"
							/>

							<div className="mb-0">
								<FormLabel htmlFor="exampleRange" className="form-label">
									Range
								</FormLabel>
								<FormRange />
							</div>
						</Form>
					</Col>
				</Row>
			</CardBody>
		</Card>
	);
};

export default BasicInputElements;
