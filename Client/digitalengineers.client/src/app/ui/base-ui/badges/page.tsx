import { toSentenceCase } from '@/common';
import { extendedColorVariants } from '@/common/color-variants';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import classNames from 'classnames';

import {Link} from "react-router";
import { Badge, Button, Card, CardBody, Col, Row } from 'react-bootstrap';



const DefaultBadges = () => {
	return (
		<Card>
			<CardBody>
				<h4 className="header-title">Default</h4>
				<p className="text-muted font-14 mb-3">
					A simple labeling component. Badges scale to match the size of the immediate parent element by using relative font sizing and{' '}
					<code>em</code> units.
				</p>

				<h1>
					h1.Example heading <span className="badge bg-secondary text-light">New</span>
				</h1>
				<h2>
					h2.Example heading <span className="badge badge-success-lighten">New</span>
				</h2>
				<h3>
					h3.Example heading <span className="badge bg-primary">New</span>
				</h3>
				<h4>
					h4.Example heading
					<Link to="" className="badge badge-info-lighten">
						Info Link
					</Link>
				</h4>
				<h5>
					h5.Example heading <span className="badge badge-outline-warning">New</span>
				</h5>
				<h6>
					h6.Example heading <span className="badge bg-danger">New</span>
				</h6>
			</CardBody>
		</Card>
	);
};

const ContexualBadges = () => {
	return (
		<Card>
			<CardBody>
				<h4 className="header-title">Contexual variations</h4>
				<p className="text-muted font-14 mb-3">
					Add any of the below mentioned modifier classes to change the appearance of a badge. Badge can be more contextual as well. Just use regular
					convention e.g.
					<code>badge-*color</code>,<code>bg-primary</code> to have badge with different background.
				</p>

				{extendedColorVariants.map((color, index) => {
					return (
						<Badge
							className={classNames('me-1', 'bg-' + color, color === 'light' ? 'text-dark' : null, {
								'text-light': ['secondary', 'dark'].includes(color),
							})}
							key={index.toString()}
						>
							{toSentenceCase(color)}
						</Badge>
					);
				})}

				<h5 className="mt-4">Lighten Badges</h5>
				<p className="text-muted font-14 mb-3">
					Using the <code>.badge-*-lighten</code> modifier class, you can have more soften variation.
				</p>

				{extendedColorVariants.map((color, index) => {
					return (
						<Badge bg="" className={classNames('me-1', 'badge-' + color + '-lighten')} key={index.toString()}>
							{toSentenceCase(color)}
						</Badge>
					);
				})}

				<h5 className="mt-4">Outline Badges</h5>
				<p className="text-muted font-14 mb-3">
					Using the <code>.badge-outline-*</code> to quickly create a bordered badges.
				</p>

				{extendedColorVariants.map((color, index) => {
					return (
						<Badge bg="" className={classNames('me-1', 'badge-outline-' + color)} key={index.toString()}>
							{toSentenceCase(color)}
						</Badge>
					);
				})}
			</CardBody>
		</Card>
	);
};

const PillBadges = () => {
	return (
		<Card>
			<CardBody>
				<h4 className="header-title">Pill Badges</h4>
				<p className="text-muted font-14 mb-3">
					Use the <code>.rounded-pill</code> modifier class to make badges more rounded.
				</p>

				{extendedColorVariants.map((color, index) => {
					return (
						<Badge
							pill
							className={classNames('me-1', 'bg-' + color, color === 'light' ? 'text-dark' : null, {
								'text-light': ['secondary', 'dark'].includes(color),
							})}
							key={index.toString()}
						>
							{toSentenceCase(color)}
						</Badge>
					);
				})}

				<h5 className="mt-4">Lighten Badges</h5>
				<p className="text-muted font-14 mb-3">
					Use the <code>.badge-*-lighten</code> modifier class to make badges lighten.
				</p>

				{extendedColorVariants.map((color, index) => {
					return (
						<Badge bg="" pill className={classNames('me-1', 'badge-' + color + '-lighten')} key={index.toString()}>
							{toSentenceCase(color)}
						</Badge>
					);
				})}

				<h5 className="mt-4">Outline Badges</h5>
				<p className="text-muted font-14 mb-3">
					Using the <code>.badge-outline-*</code> to quickly create a bordered badges.
				</p>

				{extendedColorVariants.map((color, index) => {
					return (
						<Badge bg="" pill className={classNames('me-1', 'badge-outline-' + color)} key={index.toString()}>
							{toSentenceCase(color)}
						</Badge>
					);
				})}
			</CardBody>
		</Card>
	);
};

const BadgePosition = () => {
	return (
		<Card>
			<CardBody>
				<h4 className="header-title">Badge Positioned</h4>
				<p className="text-muted font-14 mb-3">
					Use utilities to modify a <code>.badge</code> and position it in the corner of a link or button.
				</p>

				<Row>
					<Col className="col-6">
						<Button variant="primary" className="position-relative">
							Inbox
							<span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
								99+
								<span className="visually-hidden">unread messages</span>
							</span>
						</Button>
					</Col>
					<Col className="col-6">
						<Button variant="primary" className="position-relative">
							Profile
							<span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle">
								<span className="visually-hidden">New alerts</span>
							</span>
						</Button>
					</Col>
					<Col className="col-6">
						<Button variant="success" className="mt-4">
							Notifications <span className="badge bg-light text-dark ms-1">4</span>
						</Button>
					</Col>
				</Row>
			</CardBody>
		</Card>
	);
};

const BadgesUI = () => {
	return (
		<>
			<PageBreadcrumb title="Badges" subName="Base UI" />

			<Row>
				<Col xl={6}>
					<DefaultBadges />
					<PillBadges />
				</Col>

				<Col xl={6}>
					<ContexualBadges />
					<BadgePosition />
				</Col>
			</Row>
		</>
	);
};

export default BadgesUI;
