
import React, { useContext } from 'react';
import {
	Row,
	Col,
	Card,
	Accordion,
	Button,
	Collapse,
	AccordionItem,
	useAccordionButton,
	AccordionContext,
	CardBody,
	AccordionHeader, AccordionBody
} from 'react-bootstrap';
import classNames from 'classnames';
import { useToggle } from '@/hooks';
import {Link} from "react-router";

type AccordionItem = {
	id: number;
	title: string;
	text: string;
};

type CustomAccordion1Props = {
	item: string;
	index: number;
};

type CustomAccordion2Props = {
	item: AccordionItem;
	index: number;
};

type CustomToggleProps = {
	children: React.ReactNode;
	eventKey: string;
	containerClass: string;
	linkClass: string;
	callback?: (eventKey: string) => void;
};

const CustomToggle = ({ children, eventKey, containerClass, linkClass, callback }: CustomToggleProps) => {
	const { activeEventKey } = useContext(AccordionContext);

	const decoratedOnClick = useAccordionButton(eventKey, () => callback && callback(eventKey));

	const isCurrentEventKey = activeEventKey === eventKey;

	return (
		<h5 className={containerClass}>
			<a
				role="button"
				className={classNames(linkClass, {
					collapsed: !isCurrentEventKey,
				})}
				onClick={decoratedOnClick}
			>
				{children}
			</a>
		</h5>
	);
};

const CustomAccordion1 = ({ item, index }: CustomAccordion1Props) => {
	return (
		<Card className="mb-0">
			<Card.Header>
				<CustomToggle eventKey={String(index)} containerClass="m-0" linkClass="custom-accordion-title d-block">
					Collapsible Group Item #{item}
				</CustomToggle>
			</Card.Header>
			<Accordion.Collapse eventKey={String(index)}>
				<div>
					<Card.Body>
						Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat
						skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid
						single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente
						ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you
						probably haven&apos;t heard of them accusamus labore sustainable VHS.
					</Card.Body>
				</div>
			</Accordion.Collapse>
		</Card>
	);
};

const CustomAccordion2 = ({ item, index }: CustomAccordion2Props) => {
	return (
		<Card className="mb-0">
			<Card.Header>
				<CustomToggle eventKey={String(index)} containerClass="m-0" linkClass="custom-accordion-title d-block">
					Q. {item.title}
					<i className="mdi mdi-chevron-down accordion-arrow"></i>
				</CustomToggle>
			</Card.Header>
			<Accordion.Collapse eventKey={String(index)}>
				<div>
					<Card.Body>{item.text}</Card.Body>
				</div>
			</Accordion.Collapse>
		</Card>
	);
};

const AllAccordionAndCollapse = () => {
	const accordianContent: AccordionItem[] = [
		{
			id: 1,
			title: 'Can I use this template for my client?',
			text: ' Yup, the marketplace license allows you to use this theme in any end products. For more information on licenses, please refere',
		},
		{
			id: 2,
			title: 'Can this theme work with Wordpress?',
			text: "No. This is a HTML template. It won't directly with wordpress, though you can convert this into wordpress compatible theme",
		},
		{
			id: 3,
			title: 'How do I get help with the theme?',
			text: '   Use our dedicated support email (support@digital-engineers.com) to send your issues or feedback. We are here to help anytime',
		},
		{
			id: 4,
			title: 'Will you regularly give updates of UBold ?',
			text: 'Yes, We will update the UBold regularly. All the future updates would be available without any cost',
		},
	];
	const [isOpen, toggle] = useToggle(true);
	const [isOpenFirst, toggleFirst] = useToggle(true);
	const [isOpenSecond, toggleSecond] = useToggle(true);
	const [isOpenHorizontal, toggleHorizontal] = useToggle(true);

	const toggleBoth = () => {
		toggleFirst();
		toggleSecond();
	};
	const accordionData = ['first', 'second', 'third']
	return (
		<>
			<Row>
				<Col xl={6}>
					<Card>
						<CardBody>
							<h4 className="header-title">Default Accordions</h4>
							<p className="text-muted font-14 mb-3">Click the accordions below to expand/collapse the
								accordion content.</p>

							<Accordion defaultActiveKey={'0'} id="accordionExample">
								{accordionData.map((item, idx) => (
									<AccordionItem eventKey={`${idx}`} key={idx}>
										<AccordionHeader id="headingOne">
											<div className="fw-medium">Accordion Item #{idx + 1}</div>
										</AccordionHeader>
										<AccordionBody>
											<strong>This is the {item}&nbsp; item&apos;s accordion body.</strong>
											It is shown by default, until the collapse plugin adds the appropriate
											classes that we use to style each element. These classes control
											the overall appearance, as well as the showing and hiding via CSS
											transitions. You can modify any of this with custom CSS or overriding
											our default variables. It&apos;s also worth noting that just about any HTML
											can go within the
											<code>.accordion-body</code>, though the transition does limit overflow.
										</AccordionBody>
									</AccordionItem>
								))}
							</Accordion>
						</CardBody>
					</Card>
				</Col>
				<Col xl={6}>
					<Card>
						<CardBody>
							<h4 className="header-title">Flush Accordions</h4>
							<p className="text-muted font-14 mb-3">Add <code>.accordion-flush</code> to remove the
								default <code>background-color</code>, some borders, and some rounded corners to render
								accordions edge-to-edge with their parent container.</p>

							<Accordion flush id="accordionExample">
								{accordionData.map((item, idx) => (
									<AccordionItem eventKey={`${idx}`} key={idx}>
										<AccordionHeader id="headingOne">
											<div className="fw-medium">Accordion Item #{idx + 1}</div>
										</AccordionHeader>
										<AccordionBody>
											Placeholder content for this accordion, which is intended to demonstrate the
											<code>.accordion-flush</code>&nbsp; class. This is the {item}&nbsp; item&apos;s accordion body.
										</AccordionBody>
									</AccordionItem>
								))}
							</Accordion>
						</CardBody>
					</Card>
				</Col>

			</Row>
			<Row>
				<Col xl={6}>
					<Card>
						<CardBody>
							<h4 className="header-title">Simple Card Accordions</h4>
							<p className="text-muted font-14 mb-3">
								Use <code>Collapse</code> component to create accordions.
							</p>

							<Accordion defaultActiveKey="0" id="accordion" className="mb-3">
								{['1', '2', '3'].map((item, index) => {
									return <CustomAccordion1 key={index.toString()} item={item} index={index} />;
								})}
							</Accordion>
						</CardBody>
					</Card>
				</Col>
				<Col xl={6}>
					<Card>
						<CardBody>
							<h4 className="header-title">Always Open Accordions</h4>
							<p className="text-muted font-14 mb-3">Omit the <code>data-bs-parent</code> attribute on
								each <code>.accordion-collapse</code> to make accordion items stay open when another
								item is opened.</p>

							<Accordion defaultActiveKey={'0'} alwaysOpen id="accordionExample">
								{accordionData.map((item, idx) => (
									<AccordionItem eventKey={`${idx}`} key={idx}>
										<AccordionHeader id="headingOne">
											<div className="fw-medium">Accordion Item #{idx + 1}</div>
										</AccordionHeader>
										<AccordionBody>
											<strong>This is the {item}&nbsp; item&apos;s accordion body.</strong>
											It is shown by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control
											the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding
											our default variables. It&apos;s also worth noting that just about any HTML can go within the
											<code>.accordion-body</code>, though the transition does limit overflow.
										</AccordionBody>
									</AccordionItem>
								))}
							</Accordion>
						</CardBody>
					</Card>
				</Col>
			</Row>

			<Row>
				<Col xl={6}>
					<Card>
						<Card.Body>
							<h4 className="header-title">Custom Accordions</h4>
							<p className="text-muted font-14 mb-3">
								You can have custom look and feel for accorion as well. Just use class <code>.custom-accordion</code> along with
								<code>.accordion</code> as a wrapper.
							</p>

							<Accordion defaultActiveKey="0" id="accordion" className="custom-accordion">
								{(accordianContent || []).map((item, index) => {
									return <CustomAccordion2 key={index.toString()} item={item} index={index} />;
								})}
							</Accordion>
						</Card.Body>
					</Card>
				</Col>
				<Col xl={6}>
					<Card>
						<Card.Body>
							<h4 className="header-title">Collapse</h4>
							<p className="text-muted font-14 mb-3">Collapse provides the way to toggle the visibility of any content or element.</p>
							<p>
								<Link to="" className="btn btn-primary" onClick={toggle}>
									Link with href
								</Link>

								<Button color="primary" className="ms-1" type="button" onClick={toggle}>
									Button with data-target
								</Button>
							</p>
							<Collapse in={isOpen}>
								<div>
									<div className="card card-body mb-0">
										Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. Nihil anim keffiyeh helvetica,
										craft beer labore wes anderson cred nesciunt sapiente ea proident.
									</div>
								</div>
							</Collapse>
						</Card.Body>
					</Card>
				</Col>

			</Row>
			<Row>
				<Col xl={6}>
					<Card>
						<Card.Body>
							<h4 className="header-title">COLLAPSE HORIZONTAL</h4>
							<p className="text-muted font-14 mb-3">
								Add a collapse toggle animation to an element or component to transition the width instead of height.
							</p>
							<Button color="primary" className="ms-1" type="button" onClick={toggleHorizontal}>
								Toggle Width Collapse
							</Button>

							<div style={{ minHeight: '120px' }}>
								<Collapse in={isOpenHorizontal} dimension="width">
									<div id="example-collapse-text">
										<Card body style={{ width: '300px' }}>
											This is some placeholder content for a horizontal collapse. It&apos;s hidden by default and shown when triggered.
										</Card>
									</div>
								</Collapse>
							</div>
						</Card.Body>
					</Card>
				</Col>
				<Col xl={6}>
					<Card>
						<Card.Body>
							<h4 className="header-title">Multiple Targets</h4>
							<p className="text-muted font-14 mb-3">
								Multiple <code>Button</code> or <code>Link</code> can show and hide an element.
							</p>
							<p>
								<Link to="" className="btn btn-primary" onClick={toggleFirst}>
									Toggle first element
								</Link>

								<Button variant="primary" className="ms-1" type="button" onClick={toggleSecond}>
									Toggle second element
								</Button>

								<Button variant="primary" className="ms-1" type="button" onClick={toggleBoth}>
									Toggle both elements
								</Button>
							</p>
							<Row>
								<Col>
									<Collapse in={isOpenFirst}>
										<div>
											<div className="card card-body mb-0">
												Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. Nihil anim keffiyeh helvetica,
												craft beer labore wes anderson cred nesciunt sapiente ea proident.
											</div>
										</div>
									</Collapse>
								</Col>
								<Col>
									<Collapse in={isOpenSecond}>
										<div>
											<div className="card card-body mb-0">
												Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. Nihil anim keffiyeh helvetica,
												craft beer labore wes anderson cred nesciunt sapiente ea proident.
											</div>
										</div>
									</Collapse>
								</Col>
							</Row>
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</>
	);
};

export default AllAccordionAndCollapse;
