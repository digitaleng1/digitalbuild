import PageBreadcrumb from '@/components/PageBreadcrumb';

import { Row, Col, Card, ListGroup, Badge, CardBody, ListGroupItem } from 'react-bootstrap';



const Basic = () => {
	return (
		<Card>
			<CardBody>
				<h4 className="header-title">Basic example</h4>

				<p className="text-muted font-14">
					The most basic list group is an unordered list with list items and the proper classes. Build upon it with the options that follow, or with
					your own CSS as needed.
				</p>

				<ListGroup>
					<ListGroupItem>
						<i className="uil-google-drive-alt me-1"></i> Google Drive
					</ListGroupItem>
					<ListGroupItem>
						<i className="uil-facebook-messenger me-1"></i> Facebook Messenger
					</ListGroupItem>
					<ListGroupItem>
						<i className="uil-apple me-1"></i> Apple Technology Company
					</ListGroupItem>
					<ListGroupItem>
						<i className="uil-intercom me-1"></i> Intercom Support System
					</ListGroupItem>
					<ListGroupItem>
						<i className="uil-paypal me-1"></i> Paypal Payment Gateway
					</ListGroupItem>
				</ListGroup>
			</CardBody>
		</Card>
	);
};

const ActiveItems = () => {
	return (
		<Card>
			<CardBody>
				<h4 className="header-title">Active items</h4>

				<p className="text-muted font-14">
					Add <code>.active</code> to a <code>ListGroup.Item</code> to indicate the current active selection.
				</p>

				<ListGroup>
					<ListGroupItem className="active">
						<i className="uil-google-drive-alt me-1"></i> Google Drive
					</ListGroupItem>
					<ListGroupItem>
						<i className="uil-facebook-messenger me-1"></i> Facebook Messenger
					</ListGroupItem>
					<ListGroupItem>
						<i className="uil-apple me-1"></i> Apple Technology Company
					</ListGroupItem>
					<ListGroupItem>
						<i className="uil-intercom me-1"></i> Intercom Support System
					</ListGroupItem>
					<ListGroupItem>
						<i className="uil-paypal me-1"></i> Paypal Payment Gateway
					</ListGroupItem>
				</ListGroup>
			</CardBody>
		</Card>
	);
};

const DisabledItems = () => {
	return (
		<Card>
			<CardBody>
				<h4 className="header-title">Disabled items</h4>

				<p className="text-muted font-14">
					Add <code>.disabled</code> to a <code>ListGroup.Item</code> to make it
					<em>appear</em> disabled.
				</p>

				<ListGroup>
					<ListGroupItem className="disabled">
						<i className="uil-google-drive-alt me-1"></i> Google Drive
					</ListGroupItem>
					<ListGroupItem>
						<i className="uil-facebook-messenger me-1"></i> Facebook Messenger
					</ListGroupItem>
					<ListGroupItem>
						<i className="uil-apple me-1"></i> Apple Technology Company
					</ListGroupItem>
					<ListGroupItem>
						<i className="uil-intercom me-1"></i> Intercom Support System
					</ListGroupItem>
					<ListGroupItem>
						<i className="uil-paypal me-1"></i> Paypal Payment Gateway
					</ListGroupItem>
				</ListGroup>
			</CardBody>
		</Card>
	);
};

const LinksButtons = () => {
	return (
		<Card>
			<CardBody>
				<h4 className="header-title">Links and Buttons</h4>

				<p className="text-muted font-14">
					Use <code>tag</code> attribute along with <code>action</code> to create
					<em>actionable</em> list group items with hover, disabled, and active states.
				</p>

				<ListGroup>
					<ListGroupItem action className="active">
						Google Drive
					</ListGroupItem>
					<ListGroupItem action>Facebook Messenger</ListGroupItem>
					<ListGroupItem as="button" action>
						Apple Technology Company
					</ListGroupItem>
					<ListGroupItem as="button" action>
						Intercom Support System
					</ListGroupItem>
					<ListGroupItem as="button" action>
						Paypal Payment Gateway
					</ListGroupItem>
				</ListGroup>
			</CardBody>
		</Card>
	);
};

const Flush = () => {
	return (
		<Card>
			<CardBody>
				<h4 className="header-title">Flush</h4>

				<p className="text-muted font-14">
					Add <code>flush</code> attribute to remove some borders and rounded corners to render list group items edge-to-edge in a parent container
					(e.g., cards).
				</p>

				<ListGroup variant="flush">
					<ListGroupItem>Google Drive</ListGroupItem>
					<ListGroupItem>Facebook Messenger</ListGroupItem>
					<ListGroupItem>Apple Technology Company</ListGroupItem>
					<ListGroupItem>Intercom Support System</ListGroupItem>
					<ListGroupItem>Paypal Payment Gateway</ListGroupItem>
				</ListGroup>
			</CardBody>
		</Card>
	);
};

const Horizontal = () => {
	return (
		<Card>
			<CardBody>
				<h4 className="header-title">Horizontal</h4>

				<p className="text-muted font-14">
					Add <code>horizontal</code> prop to change the layout of list group items from vertical to horizontal across all breakpoints.
				</p>

				<ListGroup horizontal className="mb-3">
					<ListGroupItem>Google</ListGroupItem>
					<ListGroupItem>Whatsapp</ListGroupItem>
					<ListGroupItem>Facebook</ListGroupItem>
				</ListGroup>

				<ListGroup horizontal="sm" className="mb-3">
					<ListGroupItem>Apple</ListGroupItem>
					<ListGroupItem>PayPal</ListGroupItem>
					<ListGroupItem>Intercom</ListGroupItem>
				</ListGroup>

				<ListGroup horizontal="md">
					<ListGroupItem>Google</ListGroupItem>
					<ListGroupItem>Whatsapp</ListGroupItem>
					<ListGroupItem>Facebook</ListGroupItem>
				</ListGroup>
			</CardBody>
		</Card>
	);
};

const Contextual = () => {
	return (
		<Card>
			<CardBody>
				<h4 className="header-title">Contextual classes</h4>

				<p className="text-muted font-14">Use contextual classes to style list items with a stateful background and color.</p>

				<ListGroup>
					<ListGroupItem variant="link">Dapibus ac facilisis in</ListGroupItem>
					<ListGroupItem variant="primary">A simple primary list group item</ListGroupItem>
					<ListGroupItem variant="secondary">A simple secondary list group item</ListGroupItem>
					<ListGroupItem variant="success">A simple success list group item</ListGroupItem>
					<ListGroupItem variant="info">A simple info list group item</ListGroupItem>
					<ListGroupItem variant="warning">A simple warning list group item</ListGroupItem>
					<ListGroupItem variant="danger">A simple danger list group item</ListGroupItem>
					<ListGroupItem variant="light">A simple light list group item</ListGroupItem>
					<ListGroupItem variant="dark">A simple dark list group item</ListGroupItem>
				</ListGroup>
			</CardBody>
		</Card>
	);
};

const ContextualLinks = () => {
	return (
		<Card>
			<CardBody>
				<h4 className="header-title">Contextual classes with Link</h4>

				<p className="text-muted font-14">Use contextual classes to style list items with a stateful background and color.</p>

				<ListGroup>
					<ListGroupItem variant="link" as="a" href="" action>
						Porta ac consectetur ac
					</ListGroupItem>
					<ListGroupItem variant="primary" as="a" href="" action>
						A simple primary list group item
					</ListGroupItem>
					<ListGroupItem variant="secondary" as="a" href="" action>
						A simple secondary list group item
					</ListGroupItem>
					<ListGroupItem variant="success" as="a" href="" action>
						A simple success list group item
					</ListGroupItem>
					<ListGroupItem variant="info" as="a" href="" action>
						A simple info list group item
					</ListGroupItem>
					<ListGroupItem variant="warning" as="a" href="" action>
						A simple warning list group item
					</ListGroupItem>
					<ListGroupItem variant="danger" as="a" href="" action>
						A simple danger list group item
					</ListGroupItem>
					<ListGroupItem variant="light" as="a" href="" action>
						A simple light list group item
					</ListGroupItem>
					<ListGroupItem variant="dark" as="a" href="" action>
						A simple dark list group item
					</ListGroupItem>
				</ListGroup>
			</CardBody>
		</Card>
	);
};

const CustomContent = () => {
	return (
		<Card>
			<CardBody>
				<h4 className="header-title">Custom content</h4>

				<p className="text-muted font-14">
					Add nearly any HTML within, even for linked list groups like the one below, with the help of flexbox utilities.
				</p>

				<ListGroup>
					<ListGroupItem active>
						<div className="d-flex w-100 justify-content-between">
							<h5 className="mb-1">List group item heading</h5>
							<small className="text-muted">3 days ago</small>
						</div>
						<p className="mb-1">Donec id elit non mi porta gravida at eget metus. Maecenas sed diam eget risus varius blandit.</p>
						<small className="text-muted">Donec id elit non mi porta.</small>
					</ListGroupItem>
					<ListGroupItem>
						<div className="d-flex w-100 justify-content-between">
							<h5 className="mb-1">List group item heading</h5>
							<small className="text-muted">3 days ago</small>
						</div>
						<p className="mb-1">Donec id elit non mi porta gravida at eget metus. Maecenas sed diam eget risus varius blandit.</p>
						<small className="text-muted">Donec id elit non mi porta.</small>
					</ListGroupItem>
					<ListGroupItem>
						<div className="d-flex w-100 justify-content-between">
							<h5 className="mb-1">List group item heading</h5>
							<small className="text-muted">3 days ago</small>
						</div>
						<p className="mb-1">Donec id elit non mi porta gravida at eget metus. Maecenas sed diam eget risus varius blandit.</p>
						<small className="text-muted">Donec id elit non mi porta.</small>
					</ListGroupItem>
				</ListGroup>
			</CardBody>
		</Card>
	);
};

const Badges = () => {
	return (
		<Card>
			<CardBody>
				<h4 className="header-title">With badges</h4>

				<p className="text-muted font-14">
					Add badges to any list group item to show unread counts, activity, and more with the help of some utilities.
				</p>

				<ListGroup>
					<ListGroupItem className="d-flex justify-content-between align-items-center">
						Gmail Emails
						<Badge pill className="badge bg-primary">
							14
						</Badge>
					</ListGroupItem>
					<ListGroupItem className="d-flex justify-content-between align-items-center">
						Pending Payments
						<Badge pill className="badge bg-success">
							2
						</Badge>
					</ListGroupItem>
					<ListGroupItem className="d-flex justify-content-between align-items-center">
						Action Needed
						<Badge pill className="badge bg-danger">
							99+
						</Badge>
					</ListGroupItem>
					<ListGroupItem className="d-flex justify-content-between align-items-center">
						Payments Done
						<Badge pill className="badge bg-success">
							20+
						</Badge>
					</ListGroupItem>
				</ListGroup>
			</CardBody>
		</Card>
	);
};

const CheckboxesandRadios = () => {
	return (
		<Card>
			<CardBody>
				<h4 className="header-title">Checkboxes and radios</h4>
				<p className="text-muted font-14">
					Place Bootstrap’s checkboxes and radios within list group items and customize as needed. You can use them without <code>&lt;label&gt;</code>
					s, but please remember to include an <code>aria-label</code> attribute and value for accessibility.
				</p>

				<ListGroup>
					<ListGroupItem>
						<input className="form-check-input me-1" type="checkbox" id="listgroupcheckbox1" value="" aria-label="..." />
						<label htmlFor="listgroupcheckbox1">First checkbox</label>
					</ListGroupItem>
					<ListGroupItem>
						<input className="form-check-input me-1" type="checkbox" id="listgroupcheckbox2" value="" aria-label="..." />
						<label htmlFor="listgroupcheckbox2">Second checkbox</label>
					</ListGroupItem>
					<ListGroupItem>
						<input className="form-check-input me-1" type="checkbox" id="listgroupcheckbox3" value="" aria-label="..." />
						<label htmlFor="listgroupcheckbox3">Third checkbox</label>
					</ListGroupItem>
					<ListGroupItem>
						<input className="form-check-input me-1" type="checkbox" id="listgroupcheckbox4" value="" aria-label="..." />
						<label htmlFor="listgroupcheckbox4">Fourth checkbox</label>
					</ListGroupItem>
				</ListGroup>
			</CardBody>
		</Card>
	);
};

const Numbered = () => {
	return (
		<Card>
			<CardBody>
				<h4 className="header-title">Numbered</h4>
				<p className="text-muted font-14">
					Numbers are generated by <code>counter-reset</code> on the
					<code>&lt;ol&gt;</code>, and then styled and placed with a <code>::before</code>
					psuedo-element on the <code>&lt;li&gt;</code> with
					<code>counter-increment</code> and <code>content</code>.
				</p>

				<ListGroup as="ol" className="list-group-numbered">
					<ListGroupItem as="li" className="d-flex justify-content-between align-items-center">
						<div className="ms-2 me-auto">
							<div className="fw-bold">Subheading</div>
							Cras justo odio
						</div>
						<Badge pill className="badge bg-primary">
							14
						</Badge>
					</ListGroupItem>
					<ListGroupItem as="li" className="d-flex justify-content-between align-items-center">
						<div className="ms-2 me-auto">
							<div className="fw-bold">Subheading</div>
							Cras justo odio
						</div>
						<Badge pill className="badge bg-primary">
							14
						</Badge>
					</ListGroupItem>
					<ListGroupItem as="li" className="d-flex justify-content-between align-items-center">
						<div className="ms-2 me-auto">
							<div className="fw-bold">Subheading</div>
							Cras justo odio
						</div>
						<Badge pill className="badge bg-primary">
							14
						</Badge>
					</ListGroupItem>
				</ListGroup>
			</CardBody>
		</Card>
	);
};

const ListGroupUI = () => {
	return (
		<>
			<PageBreadcrumb title="List Group" subName="Base UI" />

			<Row>
				<Col xl={4}>
					<Basic />
				</Col>

				<Col xl={4}>
					<ActiveItems />
				</Col>

				<Col xl={4}>
					<DisabledItems />
				</Col>
			</Row>

			<Row>
				<Col xl={4}>
					<LinksButtons />
				</Col>
				<Col xl={4}>
					<Flush />
				</Col>
				<Col xl={4}>
					<Horizontal />
				</Col>
			</Row>

			<Row>
				<Col xl={4}>
					<Contextual />
				</Col>
				<Col xl={4}>
					<ContextualLinks />
				</Col>
				<Col xl={4}>
					<CustomContent />
				</Col>
			</Row>

			<Row>
				<Col xl={4}>
					<Badges />
				</Col>
				<Col xl={4}>
					<CheckboxesandRadios />
				</Col>
				<Col xl={4}>
					<Numbered />
				</Col>
			</Row>
		</>
	);
};

export default ListGroupUI;
