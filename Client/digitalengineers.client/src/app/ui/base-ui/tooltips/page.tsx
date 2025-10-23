import {Link} from "react-router";
import { Row, Col, Card, OverlayTrigger, Tooltip, Button, CardBody } from 'react-bootstrap';
import type { PopoverDirection } from '../types';
import PageBreadcrumb from '@/components/PageBreadcrumb';




const Basic = () => {
	return (
		<Card>
			<CardBody>
				<h4 className="header-title">Examples</h4>
				<p className="text-muted font-14">Hover over the links below to see tooltips.</p>

				<p className="muted mb-0">
					Tight pants next level keffiyeh
					<OverlayTrigger placement="top" overlay={<Tooltip id="overlay-example"> Default title </Tooltip>}>
						<Link to=""> you probably </Link>
					</OverlayTrigger>
					haven&apos;t heard of them. Photo booth beard raw denim letterpress vegan messenger bag stumptown. Farm-to-table seitan, mcsweeney&apos;
					fixie sustainable quinoa 8-bit american apparel
					<OverlayTrigger placement="top" overlay={<Tooltip id="overlay-example"> Another one </Tooltip>}>
						<Link to=""> have a </Link>
					</OverlayTrigger>
					terry richardson vinyl chambray. Beard stumptown, cardigans banh mi lomo thundercats. Tofu biodiesel williamsburg marfa, four loko
					mcsweeney&apos;s cleanse vegan chambray. A really ironic artisan
					<OverlayTrigger placement="top" overlay={<Tooltip id="overlay-example"> Another one here too </Tooltip>}>
						<Link to=""> whatever </Link>
					</OverlayTrigger>
					keytar, scenester farm-to-table banksy Austin
					<OverlayTrigger placement="top" overlay={<Tooltip id="overlay-example"> The last tip! </Tooltip>}>
						<Link to=""> twitter handle </Link>
					</OverlayTrigger>
					freegan cred raw denim single-origin coffee viral.
				</p>
			</CardBody>
		</Card>
	);
};

const Direction = () => {
	const directions: PopoverDirection[] = [{ placement: 'top' }, { placement: 'bottom' }, { placement: 'right' }, { placement: 'left' }];

	return (
		<Card>
			<CardBody>
				<h4 className="header-title">Four Directions</h4>
				<p className="text-muted font-14">Four options are available: top, right, bottom, and left aligned.</p>

				{directions.map((direction, index) => (
					<OverlayTrigger
						key={index.toString()}
						placement={direction.placement}
						overlay={
							<Tooltip id={`tooltip-${direction.placement}`}>
								Tooltip on <strong>{direction.placement}</strong>.
							</Tooltip>
						}
					>
						<Button variant="info" className="me-1">
							Tooltip on {direction.placement}
						</Button>
					</OverlayTrigger>
				))}
			</CardBody>
		</Card>
	);
};

const DisabledElements = () => {
	return (
		<Card>
			<CardBody>
				<h4 className="header-title">Disabled Elements</h4>
				<p className="text-muted font-14">
					Elements with the <code>disabled</code> attribute aren’t interactive, meaning users cannot hover or click them to trigger a popover (or
					tooltip). As a workaround, you’ll want to trigger the popover from a wrapper
					<code>&lt;div&gt;</code> or <code>&lt;span&gt;</code> and override the
					<code>pointer-events</code> on the disabled element.
				</p>
				<OverlayTrigger overlay={<Tooltip id="tooltip-disabled">Tooltip!</Tooltip>}>
					<span className="d-inline-block">
						<Button disabled style={{ pointerEvents: 'none' }}>
							Disabled button
						</Button>
					</span>
				</OverlayTrigger>
			</CardBody>
		</Card>
	);
};

const HtmlContent = () => {
	return (
		<Card>
			<CardBody>
				<h4 className="header-title">Html Tags</h4>
				<p className="text-muted font-14">And with custom HTML added:</p>

				<OverlayTrigger
					placement="top"
					overlay={
						<Tooltip>
							<em>Tooltip</em> <u>with</u> <b>HTML</b>
						</Tooltip>
					}
				>
					<Button variant="secondary">Tooltip with HTML</Button>
				</OverlayTrigger>
			</CardBody>
		</Card>
	);
};

const TooltipsUI = () => {
	return (
		<>
			<PageBreadcrumb title="Tooltips" subName="Base UI" />

			<Row>
				<Col xl={6}>
					<Basic />
					<DisabledElements />
				</Col>
				<Col xl={6}>
					<Direction />
					<HtmlContent />
				</Col>
			</Row>
		</>
	);
};

export default TooltipsUI;
