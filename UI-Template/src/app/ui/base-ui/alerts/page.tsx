import { toSentenceCase } from '@/common';
import { extendedColorVariants } from '@/common/color-variants';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import classNames from 'classnames';
import {Link} from "react-router";
import { Alert, Card, CardBody, Col, Row } from 'react-bootstrap';
import AlertsWithIcon from './AlertsWithIcon';
import DismissibleAlerts from './DismissibleAlerts';
import LiveAlert from './LiveAlert';




const DefaultAlerts = () => {
	return (
		<Card>
			<CardBody>
				<h4 className="header-title">Default Alert</h4>
				<p className="text-muted font-14 mb-3">
					Provide contextual feedback messages for typical user actions with the handful of available and flexible alert messages. Alerts are
					available for any length of text, as well as an optional dismiss button.
				</p>
				<p>
					For proper styling, use one of the eight
					<strong>required</strong> contextual classes (e.g.,
					<code>.alert-success</code>). For background color use class
					<code>.bg-* </code>, <code>.text-white </code>
				</p>

				{(extendedColorVariants || []).map((variant, index) => {
					return (
						<Alert variant={variant} key={index.toString()} className={classNames(variant === 'light' ? 'text-dark' : 'text-' + variant)}>
							<strong>{toSentenceCase(variant)} - </strong> A simple {variant}
							alert—check it out!
						</Alert>
					);
				})}
			</CardBody>
		</Card>
	);
};

const AlertsWithRichContent = () => {
	return (
		<Card>
			<CardBody>
				<h4 className="header-title">Additional content</h4>
				<p className="text-muted font-14">Alerts can also contain additional HTML elements like headings, paragraphs and dividers.</p>

				<Alert variant="success">
					<h4 className="alert-heading">Well done!</h4>
					<p>
						Aww yeah, you successfully read this important alert message. This example text is going to run a bit longer so that you can see how
						spacing within an alert works with this kind of content.
					</p>
					<hr />
					<p className="mb-0">Whenever you need to, be sure to use margin utilities to keep things nice and tidy.</p>
				</Alert>
			</CardBody>
		</Card>
	);
};

const CustomAlerts = () => {
	return (
		<Card>
			<CardBody>
				<h4 className="header-title">Custom Alerts</h4>
				<p className="text-muted font-14">
					Display alert with transparent background and with contextual text color. Use classes <code>.bg-white</code>, and <code>.text-*</code>. E.g.
					<code>bg-white text-primary</code>.
				</p>

				{(extendedColorVariants || []).map((color, index) => {
					return (
						<Alert variant={color} className={classNames('bg-transparent', 'text-' + color)} key={index.toString()}>
							This is a <strong>{color}</strong> alert—check it out!
						</Alert>
					);
				})}
			</CardBody>
		</Card>
	);
};

const AlertsWithLink = () => {
	return (
		<Card>
			<CardBody>
				<h4 className="header-title">Link Color</h4>
				<p className="text-muted font-14">
					Use the <code>.alert-link</code> utility class to quickly provide matching colored links within any alert.
				</p>

				{(extendedColorVariants || []).map((color, index) => {
					return (
						<Alert variant={color} key={index.toString()}>
							A simple {color} alert with
							<Link to="" className="alert-link">
								an example link
							</Link>
							. Give it a click if you like.
						</Alert>
					);
				})}
			</CardBody>
		</Card>
	);
};

const AlertsUI = () => {
	return (
		<>
			<PageBreadcrumb title="Alerts" subName="Base UI" />

			<Row>
				<Col lg={6}>
					<DefaultAlerts />
				</Col>

				<Col lg={6}>
					<DismissibleAlerts />
				</Col>
			</Row>

			<Row>
				<Col lg={6}>
					<CustomAlerts />
				</Col>
				<Col lg={6}>
					<AlertsWithLink />
				</Col>
			</Row>

			<Row>
				<Col>
					<AlertsWithIcon />
				</Col>
				<Col>
					<AlertsWithRichContent />
				</Col>
			</Row>
			<Row>
				<Col lg={6}>
					<LiveAlert />
				</Col>
			</Row>
		</>
	);
};

export default AlertsUI;
