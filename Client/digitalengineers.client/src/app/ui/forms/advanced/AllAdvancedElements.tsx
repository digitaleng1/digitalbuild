import CustomFlatpickr from '@/components/CustomFlatpickr';
import { useState } from 'react';
import { Card, CardBody, Col, Form, Row } from 'react-bootstrap';
import { Typeahead } from 'react-bootstrap-typeahead';
import Select from 'react-select';
import { NumericFormat, PatternFormat } from 'react-number-format';

import { CustomDatePicker } from '@/components/Form';
import { useTypeahead } from '../hooks';

// styles
import 'react-bootstrap-typeahead/css/Typeahead.css';

const ReactSelect = () => {
	return (
		<Card>
			<Card.Body>
				<h4 className="header-title">React select</h4>
				<Row>
					<Col lg={6}>
						<p className="mb-1 mt-2 fw-bold text-muted">Single Selection</p>
						<p className="text-muted font-14">React-Select based Select element</p>
						<Select
							className="react-select"
							classNamePrefix="react-select"
							options={[
								{ value: 'chocolate', label: 'Chocolate' },
								{ value: 'strawberry', label: 'Strawberry' },
								{ value: 'vanilla', label: 'Vanilla' },
							]}
						></Select>
					</Col>

					<Col lg={6}>
						<p className="mb-1 mt-2 fw-bold text-muted">Multiple Selection</p>
						<p className="text-muted font-14">React-Select based Select (Multiple) element</p>
						<Select
							isMulti={true}
							options={[
								{ value: 'chocolate', label: 'Chocolate' },
								{ value: 'strawberry', label: 'Strawberry' },
								{ value: 'vanilla', label: 'Vanilla' },
							]}
							className="react-select"
							classNamePrefix="react-select"
						></Select>
					</Col>
				</Row>
			</Card.Body>
		</Card>
	);
};

const Typeaheads = () => {
	const { options, singleSelections, multiSelections, onChangeSingleSelection, onChangeMultipleSelection } = useTypeahead();

	return (
		<Card>
			<Card.Body>
				<h4 className="header-title">Typeahead</h4>
				<Row>
					<Col lg={6}>
						<p className="mb-1 mt-3 fw-bold text-muted">Single Selection</p>
						<p className="text-muted font-14">Typeahead based Select element</p>
						<Typeahead
							id="select2"
							labelKey={'label'}
							multiple={false}
							onChange={onChangeSingleSelection}
							options={options}
							placeholder="Choose a state..."
							selected={singleSelections}
						/>
					</Col>
					<Col lg={6}>
						<p className="mb-1 mt-3 fw-bold text-muted">Multiple Selection</p>
						<p className="text-muted font-14">Typeahead based Select (Multiple) element</p>
						<Typeahead
							id="select3"
							labelKey="label"
							multiple
							onChange={onChangeMultipleSelection}
							options={options}
							placeholder="Choose a state..."
							selected={multiSelections}
						/>
					</Col>
				</Row>
			</Card.Body>
		</Card>
	);
};

const DatePickers = () => {
	const [selectedDate, setSelectedDate] = useState<Date>(new Date());

	return (
		<Card>
			<Card.Body>
				<h4 className="header-title">Date &amp; Time Picker</h4>
				<p className="text-muted font-14">
					A simple date picker using
					<a rel="noreferrer" href="https://reactdatepicker.com/" target="_blank">
						ReactJS Datepicker
					</a>
				</p>

				<Row>
					<Col lg={6}>
						<div className="mb-3">
							<label>Single Date</label> <br />
							<CustomDatePicker
								hideAddon={true}
								value={selectedDate}
								onChange={(date) => {
									setSelectedDate(date);
								}}
							/>
						</div>
					</Col>
					<Col lg={6}>
						<div className="mb-3">
							<label>Single Date with multiple months</label> <br />
							<CustomDatePicker
								hideAddon={true}
								monthsShown={2}
								value={selectedDate}
								onChange={(date) => {
									setSelectedDate(date);
								}}
							/>
						</div>
					</Col>
				</Row>

				<Row>
					<Col lg={6}>
						<div className="form-group mb-3">
							<label className="form-label">Custom date format</label> <br />
							<CustomDatePicker
								hideAddon={true}
								dateFormat="yyyy-MM-dd"
								value={selectedDate}
								onChange={(date) => {
									setSelectedDate(date);
								}}
							/>
						</div>
					</Col>
					<Col lg={6}>
						<div className="mb-3">
							<label>Specific date range</label> <br />
							<CustomDatePicker
								hideAddon={true}
								minDate={new Date()}
								maxDate={new Date(new Date().setDate(new Date().getDate() + 7))}
								value={selectedDate}
								onChange={(date) => {
									setSelectedDate(date);
								}}
							/>
						</div>
					</Col>
				</Row>

				<Row>
					<Col lg={6}>
						<div className="mb-3">
							<label>Select Time</label> <br />
							<CustomDatePicker
								hideAddon={true}
								showTimeSelect
								timeFormat="HH:mm"
								tI={60}
								dateFormat="MMMM d, yyyy h:mm aa"
								timeCaption="time"
								value={selectedDate}
								onChange={(date) => {
									setSelectedDate(date);
								}}
							/>
						</div>
					</Col>
					<Col lg={6}>
						<div className="mb-3">
							<label>Time only</label> <br />
							<CustomDatePicker
								hideAddon={true}
								showTimeSelect
								showTimeSelectOnly
								tI={60}
								dateFormat="h:mm aa"
								timeCaption="Time"
								value={selectedDate}
								onChange={(date) => {
									setSelectedDate(date);
								}}
							/>
						</div>
					</Col>
				</Row>
			</Card.Body>
		</Card>
	);
};

const InputMasks = () => {
	return (
		<Card>
			<Card.Body>
				<h4 className="header-title">Input Masks</h4>
				<p className="text-muted font-14">A jQuery Plugin to make masks on form fields and HTML elements.</p>

				<Row>
					<Col md={6}>
						<form action="#">
							<div className="mb-3">
								<label className="form-label">Date</label>
								<PatternFormat className="form-control" format="##/##/####" mask="_" />
								<span className="font-13 text-muted">e.g &quot;DD/MM/YYYY&quot;</span>
							</div>
							<div className="mb-3">
								<label className="form-label">Hour</label>
								<PatternFormat className="form-control" format="##:##:##" mask="_" />
								<span className="font-13 text-muted">e.g &quot;HH:MM:SS&quot;</span>
							</div>
							<div className="mb-3">
								<label className="form-label">Date &amp; Hour</label>
								<PatternFormat className="form-control" format="##/##/#### ##:##:##" mask="_" />
								<span className="font-13 text-muted">e.g &quot;DD/MM/YYYY HH:MM:SS&quot;</span>
							</div>
							<div className="mb-3">
								<label className="form-label">ZIP Code</label>
								<PatternFormat className="form-control" format="#####-###" mask="_" />
								<span className="font-13 text-muted">e.g &quot;xxxxx-xxx&quot;</span>
							</div>
							<div className="mb-3">
								<label className="form-label">Crazy Zip Code</label>
								<PatternFormat className="form-control" format="#-##-##-##" mask="_" />
								<span className="font-13 text-muted">e.g &quot;x-xx-xx-xx&quot;</span>
							</div>
							<div className="mb-3">
								<label className="form-label">Money</label>
								<NumericFormat
									className="form-control"
									thousandSeparator="."
									decimalSeparator=","
									decimalScale={2}
									fixedDecimalScale
									allowNegative={false}
								/>
								<span className="font-13 text-muted">e.g &quot;Your money&quot;</span>
							</div>
							<div>
								<label className="form-label">Money 2</label>
								<NumericFormat
									className="form-control"
									thousandSeparator="."
									decimalSeparator=","
									decimalScale={2}
									fixedDecimalScale
									prefix={'$'}
									allowNegative={false}
								/>
								<span className="font-13 text-muted">e.g &quot;#.##0,00&quot;</span>
							</div>
						</form>
					</Col>
					<div className="col-md-6">
						<form action="#">
							<div className="mb-3">
								<label className="form-label">Telephone</label>
								<PatternFormat className="form-control" format="####-####" mask="_" />
								<span className="font-13 text-muted">e.g &quot;xxxx-xxxx&quot;</span>
							</div>
							<div className="mb-3">
								<label className="form-label">Telephone with Code Area</label>
								<PatternFormat className="form-control" format="(##) ####-####" mask="_" />
								<span className="font-13 text-muted">e.g &quot;(xx) xxxx-xxxx&quot;</span>
							</div>
							<div className="mb-3">
								<label className="form-label">US Telephone</label>
								<PatternFormat className="form-control" format="(###) ###-####" mask="_" />
								<span className="font-13 text-muted">e.g &quot;(xxx) xxx-xxxx&quot;</span>
							</div>
							<div className="mb-3">
								<label className="form-label">São Paulo Celphones</label>
								<PatternFormat className="form-control" format="(##) #####-####" mask="_" />
								<span className="font-13 text-muted">e.g &quot;(xx) xxxxx-xxxx&quot;</span>
							</div>
							<div className="mb-3">
								<label className="form-label">CPF</label>
								<PatternFormat className="form-control" format="###.###.###-##" mask="_" />
								<span className="font-13 text-muted">e.g &quot;xxx.xxx.xxxx-xx&quot;</span>
							</div>
							<div className="mb-3">
								<label className="form-label">CNPJ</label>
								<PatternFormat className="form-control" format="##.###.###/####-##" mask="_" />
								<span className="font-13 text-muted">e.g &quot;xx.xxx.xxx/xxxx-xx&quot;</span>
							</div>
							<div>
								<label className="form-label">IP Address</label>
								<PatternFormat className="form-control" format="###.###.###.###" mask="_" />
								<span className="font-13 text-muted">e.g &quot;xxx.xxx.xxx.xxx&quot;</span>
							</div>
						</form>
					</div>
				</Row>
			</Card.Body>
		</Card>
	);
};

const Switches = () => {
	return (
		<Card>
			<CardBody>
				<h4 className="header-title">Switch</h4>
				<p className="text-muted font-14">Here are a few types of switches.</p>
				<div className="d-flex gap-1 flex-wrap items-center">
					<input type="checkbox" id="switch0" data-switch="none" />
					<label htmlFor="switch0" data-on-label data-off-label />
					<input type="checkbox" id="switch1" defaultChecked data-switch="bool" />
					<label htmlFor="switch1" data-on-label="On" data-off-label="Off" />
					<input type="checkbox" id="switch2" defaultChecked data-switch="primary" />
					<label htmlFor="switch2" data-on-label="On" data-off-label="Off" />
					<input type="checkbox" id="switch3" defaultChecked data-switch="success" />
					<label htmlFor="switch3" data-on-label="Yes" data-off-label="No" />
					<input type="checkbox" id="switch4" defaultChecked data-switch="info" />
					<label htmlFor="switch4" data-on-label="On" data-off-label="Off" />
					<input type="checkbox" id="switch5" defaultChecked data-switch="warning" />
					<label htmlFor="switch5" data-on-label="Yes" data-off-label="No" />
					<input type="checkbox" id="switch6" defaultChecked data-switch="danger" />
					<label htmlFor="switch6" data-on-label="On" data-off-label="Off" />
					<input type="checkbox" id="switch7" defaultChecked data-switch="secondary" />
					<label htmlFor="switch7" data-on-label="Yes" data-off-label="No" />
					<input type="checkbox" id="switchdis" data-switch="primary" defaultChecked disabled />
					<label htmlFor="switchdis" data-on-label="On" data-off-label="Off" />
				</div>
			</CardBody>
		</Card>
	);
};

const FlatpickrDatepicker = () => {
	return (
		<Card>
			<CardBody>
				<h4 className="header-title">Flatpickr - Date picker</h4>
				<p className="text-muted font-14">A lightweight and powerful datetimepicker</p>

				<Row>
					<Col lg={6}>
						<div className="mb-3">
							<label className="form-label">Basic</label>
							<CustomFlatpickr className="form-control" placeholder="Basic datepicker" options={{ enableTime: false }} />
						</div>
						<div className="mb-3">
							<label className="form-label">DateTime</label>

							<CustomFlatpickr
								className="form-control"
								placeholder="Date and Time"
								options={{
									enableTime: true,
									dateFormat: 'Y-m-d H:i',
								}}
							/>
						</div>
						<div className="mb-3">
							<label className="form-label">Human-friendly Dates</label>

							<CustomFlatpickr
								className="form-control"
								placeholder="October 9,2018"
								options={{
									altInput: true,
									enableTime: false,
									altFormat: 'F j, Y',
									dateFormat: 'Y-m-d',
								}}
							/>
						</div>
						<div className="mb-3">
							<label className="form-label">MinDate and MaxDate</label>
							<CustomFlatpickr
								className="form-control"
								placeholder="mindate - maxdate"
								options={{
									enableTime: false,
									minDate: '2020-01-01',
									maxDate: '2020-03-05',
								}}
							/>
						</div>
						<div className="mb-3">
							<label className="form-label">Disabling dates</label>
							<CustomFlatpickr
								className="form-control"
								placeholder="Disabling dates"
								options={{
									disable: ['2025-01-10', '2025-01-21', '2025-01-30'],
									enableTime: false,
									defaultDate: '2025-01',
								}}
							/>
						</div>
						<div className="mb-3">
							<label className="form-label">Selecting multiple dates</label>
							<CustomFlatpickr
								className="form-control"
								placeholder="Multiple dates"
								options={{
									enableTime: false,
									mode: 'multiple',
									dateFormat: 'Y-m-d',
								}}
							/>
						</div>
					</Col>
					<Col lg={6} className="mt-3 mt-lg-0">
						<div className="mb-3">
							<label className="form-label">Selecting multiple dates - Conjunction</label>
							<CustomFlatpickr
								className="form-control"
								placeholder="2018-10-10 :: 2018-10-11"
								options={{
									mode: 'multiple',
									dateFormat: 'Y-m-d',
									conjunction: ' :: ',
									enableTime: false,
								}}
							/>
						</div>
						<div className="mb-3">
							<label className="form-label">Range Calendar</label>
							<CustomFlatpickr
								className="form-control"
								placeholder="2018-10-03 to 2018-10-10"
								options={{
									mode: 'range',
									enableTime: false,
								}}
							/>
						</div>
						<div>
							<label className="form-label">Inline Calendar</label>
							<CustomFlatpickr
								className="form-control"
								placeholder="Inline Calender"
								options={{
									inline: true,
									enableTime: false,
								}}
							/>
						</div>
					</Col>
				</Row>
			</CardBody>
		</Card>
	);
};

const FlatpickrTimePicker = () => {
	return (
		<Card>
			<CardBody>
				<h4 className="header-title">Flatpickr - Time Picker </h4>
				<p className="text-muted font-14">A lightweight and powerful datetimepicker</p>

				<Row>
					<Col lg={6}>
						<div className="mb-3">
							<label className="form-label">Default Time Picker</label>
							<div className="input-group">
								<CustomFlatpickr
									className="form-control"
									placeholder="Basic timepicker"
									options={{
										noCalendar: true,
										dateFormat: 'H:i',
									}}
								/>
								<span className="input-group-text">
									<i className="ri-time-line" />
								</span>
							</div>
						</div>
						<div className="mb-0">
							<label className="form-label">24-hour Time Picker</label>
							<div className="input-group">
								<CustomFlatpickr
									className="form-control"
									placeholder="16:21"
									options={{
										noCalendar: true,
										dateFormat: 'H:i',
										time_24hr: true,
									}}
								/>
								<span className="input-group-text">
									<i className="ri-time-line" />
								</span>
							</div>
						</div>
					</Col>
					<Col lg={6} className="col-lg-6 mt-3 mt-lg-0">
						<div className="mb-3">
							<label className="form-label">Time Picker w/ Limits</label>
							<div className="input-group">
								<CustomFlatpickr
									className="form-control"
									placeholder="Limits"
									options={{
										noCalendar: true,
										dateFormat: 'H:i',
										minTime: '16:00',
										maxTime: '22:30',
									}}
								/>
								<span className="input-group-text">
									<i className="ri-time-line" />
								</span>
							</div>
						</div>
						<div className="mb-0">
							<label className="form-label">Preloading Time</label>
							<div className="input-group">
								<CustomFlatpickr
									className="form-control"
									placeholder="01:45"
									options={{
										noCalendar: true,
										enableTime: true,
										dateFormat: 'H:i',
										defaultDate: '13:45',
									}}
								/>
								<span className="input-group-text">
									<i className="ri-time-line" />
								</span>
							</div>
						</div>
					</Col>
				</Row>
			</CardBody>
		</Card>
	);
};

const FormMaxLength = () => {
	const [isInvalid1, setisInvalid1] = useState(false);
	const [isInvalid2, setisInvalid2] = useState(false);

	const changeHandler = (e: any, id: string) => {
		if (id === 'input' && e.target.value.length === 25) return setisInvalid1(true);
		if (id === 'textarea' && e.target.value.length === 225) return setisInvalid2(true);
		setisInvalid1(false);
		setisInvalid2(false);
	};
	return (
		<Card>
			<CardBody>
				<div>
					<h4 className="header-title">Bootstrap Maxlength</h4>
					<p className="text-muted font-14">
						Uses the HTML5 attribute &quot;maxlength&quot; to work. Just specify <code>data-toggle=&quot;maxlength&quot;</code> attribute to have
						maxlength indication on any input.
					</p>
				</div>

				<Row>
					<Col lg={6}>
						<div className="mb-3 position-relative">
							<label className="form-label">Default usage</label>
							<p className="text-muted font-13">The badge will show up by default when the remaining chars are 10 or less:</p>
							<Form.Control
								isInvalid={isInvalid1}
								type="text"
								placeholder="Max 25"
								maxLength={25}
								data-toggle="maxlength"
								onChange={(e) => changeHandler(e, 'input')}
							/>
							<Form.Control.Feedback type="invalid" tooltip>
								You typed 25 chars available
							</Form.Control.Feedback>
						</div>
					</Col>
					<div className="col-lg-6 mt-3 mt-lg-0">
						<div className="position-relative">
							<label className="form-label">Textareas</label>
							<p className="text-muted font-13">Bootstrap maxlength supports textarea as well as inputs. Even on old IE.</p>
							<Form.Control
								isInvalid={isInvalid2}
								as="textarea"
								data-toggle="maxlength"
								maxLength={225}
								rows={3}
								placeholder="This textarea has a limit of 225 chars."
								onChange={(e) => changeHandler(e, 'textarea')}
							></Form.Control>
							<Form.Control.Feedback type="invalid" tooltip>
								You typed 225 chars available
							</Form.Control.Feedback>
						</div>
					</div>
				</Row>
			</CardBody>
		</Card>
	);
};

const AllAdvancedElements = () => {
	return (
		<>
			<Row>
				<Col xs={12}>
					<ReactSelect />
				</Col>
			</Row>

			<Row>
				<Col>
					<DatePickers />
				</Col>
			</Row>

			<Row>
				<Col xs={12}>
					<Switches />
				</Col>
			</Row>

			<Row>
				<Col xs={12}>
					<FlatpickrDatepicker />
				</Col>
			</Row>

			<Row>
				<Col xs={12}>
					<FlatpickrTimePicker />
				</Col>
			</Row>

			<Row>
				<Col>
					<InputMasks />
				</Col>
			</Row>
			<Row>
				<Col>
					<FormMaxLength />
				</Col>
			</Row>
			<Row>
				<Col xs={12}>
					<Typeaheads />
				</Col>
			</Row>
		</>
	);
};

export default AllAdvancedElements;
