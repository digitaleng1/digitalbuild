import { Fragment } from 'react';

import {Link} from "react-router";

import { Card, CardBody, Col, Row } from 'react-bootstrap';
import { extendedColorVariants } from '@/common/color-variants';
import { toSentenceCase } from '@/common';
import PageBreadcrumb from '@/components/PageBreadcrumb';

// images
import avatar2 from '@/assets/images/users/avatar-2.jpg';
import avatar4 from '@/assets/images/users/avatar-4.jpg';
import small1 from '@/assets/images/small/small-1.jpg';
import small2 from '@/assets/images/small/small-2.jpg';



const UtilitiesUI = () => {
	return (
		<>
			<PageBreadcrumb title="Utilities" subName="Base UI" />

			<Row>
				<Col xl={6}>
					<Card>
						<CardBody>
							<h4 className="header-title">Background Color</h4>
							<p className="text-muted font-14">
								Similar to the contextual text color classes, set the background of an element to any contextual class. Background utilities
								<strong>
									do not set <code>color</code>
								</strong>
								, so in some cases you’ll want to use <code>.text-*</code>
								color utilities.
							</p>
							<div className="tab-content">
								<div className="tab-pane show active" id="bg-utilities-preview">
									{extendedColorVariants.map((color, index) => (
										<div key={index} className={`bg-${color} text-white p-2 mb-2`}>
											.bg-{toSentenceCase(color)}
										</div>
									))}
									<div className="bg-body text-dark p-2 mb-2">.bg-body</div>
									<div className="bg-body-secondary text-dark p-2 mb-2">.bg-body-secondary</div>
									<div className="bg-body-tertiary text-dark p-2 mb-2">.bg-body-tertiary</div>
									<div className="bg-white p-2 mb-2">.bg-white</div>
									<div className="bg-black text-white p-2 mb-2">.bg-black</div>
									<div className="bg-transparent text-dark p-2">.bg-transparent</div>
								</div>
							</div>
						</CardBody>
					</Card>
				</Col>
				<Col xl={6}>
					<Card>
						<CardBody>
							<h4 className="header-title">Background Gradient Color</h4>
							<p className="text-muted font-14">
								By adding a <code>.bg-gradient</code> class, a linear gradient is added as background image to the backgrounds. This gradient starts
								with a semi-transparent white which fades out to the bottom.
							</p>
							<div className="tab-content">
								<div className="tab-pane show active" id="bg-gradient-utilities-preview">
									{extendedColorVariants.map((color, index) => (
										<div key={index} className={`p-2 mb-2 bg-${color} bg-gradient text-white`}>
											.bg-gradient.bg-{color}
										</div>
									))}
									<div className="p-2 mb-2 bg-black bg-gradient text-white">.bg-black.bg-gradient</div>
								</div>
							</div>
						</CardBody>
					</Card>
				</Col>
			</Row>

			<Row>
				<Col xl={12}>
					<Card>
						<CardBody>
							<h4 className="header-title">Soft background</h4>
							<p className="text-muted font-14">
								Similar to the contextual text color classes, set the background of an element to any contextual class. Background utilities do not
								set
								<code>color</code>, so in some cases you’ll want to use
								<code>.text-*</code>
								<a href="https://getbootstrap.com/docs/5.3/utilities/colors/">color utilities</a>.
							</p>
							<div className="tab-content">
								<div className="tab-pane show active" id="bg-color-utilities-preview">
									<Row>
										<Col lg={6}>
											<div className="d-flex flex-column gap-2">
												{extendedColorVariants.map((color, index) => (
													<div key={index} className={`bg-${color}-subtle p-2`}>
														<code className={`text-${color}-emphasis`}>.bg-{color}-subtle</code>
													</div>
												))}
											</div>
										</Col>
										<Col lg={6}>
											<div className="d-flex flex-column gap-2">
												{extendedColorVariants.map((color, index) => (
													<div key={index} className={`bg-${color}-lighten p-2`}>
														<code className={`text-${color}-emphasis`}>.bg-{color}-lighten</code>
													</div>
												))}
											</div>
										</Col>
									</Row>
								</div>
							</div>
						</CardBody>
					</Card>
				</Col>
			</Row>

			<Row>
				<Col xl={6}>
					<Card>
						<CardBody>
							<h4 className="header-title">Color &amp; background</h4>
							<p className="text-muted font-14">
								Color and background helpers combine the power of our
								<code>.text-*</code> utilities and <code>.bg-*</code> utilities in one class. Using our Sass <code>color-contrast()</code> function,
								we automatically determine a contrasting <code>color</code> for a particular <code>background-color</code>.
							</p>
							<div className="tab-content">
								<div className="tab-pane show active" id="bg-color-utilities-preview">
									<div className="d-flex flex-column gap-2">
										{extendedColorVariants.map((color, index) => (
											<div key={index} className={`text-bg-${color} p-2`}>
												{color} with contrasting color (.text-bg-{color})
											</div>
										))}
									</div>
								</div>
							</div>
						</CardBody>
					</Card>
				</Col>
				<Col xl={6}>
					<Card>
						<CardBody>
							<h4 className="header-title">Colored links</h4>
							<p className="text-muted font-14">
								You can use the <code>.link-*</code> classes to colorize links. Unlike the <code>.text-*</code> classes, these classes have a
								<code>:hover</code> and <code>:focus</code> state.
							</p>
							<div className="tab-content">
								<div className="tab-pane show active" id="link-color-utilities-preview">
									<div className="d-flex flex-column gap-2">
										{extendedColorVariants.map((color, index) => (
											<Link to="" key={index} className={`link-${color}`}>
												{color} link
											</Link>
										))}
									</div>
								</div>
							</div>
						</CardBody>
					</Card>
				</Col>
			</Row>

			<Row>
				<Col xl={12}>
					<Card>
						<CardBody>
							<h4 className="header-title">Background Opacity</h4>
							<p className="text-muted font-14">
								<code>background-color</code> utilities are generated with Sass using CSS variables. This allows for real-time color changes without
								compilation and dynamic alpha transparency changes.
							</p>
							<div className="tab-content">
								<div className="tab-pane show active" id="bg-opacity-utilities-preview">
									<div className="bg-primary p-2 text-white">This is default primary background</div>
									<div className="bg-primary p-2 text-white bg-opacity-75">This is 75% opacity primary background</div>
									<div className="bg-primary p-2 text-dark bg-opacity-50">This is 50% opacity primary background</div>
									<div className="bg-primary p-2 text-dark bg-opacity-25">This is 25% opacity primary background</div>
									<div className="bg-primary p-2 text-dark bg-opacity-10">This is 10% opacity success background</div>
								</div>
							</div>
						</CardBody>
					</Card>
				</Col>
			</Row>

			<Row>
				<Col xl={12}>
					<Card>
						<CardBody>
							<h4 className="header-title">Text Color</h4>
							<p className="text-muted font-14">
								Colorize text with color utilities. If you want to colorize links, you can use the <code>.link-*</code> helper classes which have
								<code>:hover</code>
								and <code>:focus</code> states.
							</p>
							<div className="tab-content">
								<div className="tab-pane show active" id="textcolor-utilities-preview">
									<Row>
										<Col md={6}>
											{extendedColorVariants.map((color, index) => (
												<Fragment key={index}>
													<p className={`text-${color}`}>.text-{color}</p>
													<p className={`text-${color}-emphasis`}>.text-{color}-emphasis</p>
												</Fragment>
											))}

											<Col md={6}>
												<p className="text-muted">.text-muted</p>
												<p className="text-body">.text-body</p>
												<p className="text-body-emphasis">.text-body-emphasis</p>
												<p className="text-body-secondary">.text-body-secondary</p>
												<p className="text-body-tertiary">.text-body-tertiary</p>
												<p className="text-black">.text-black</p>
												<p className="text-white bg-dark">.text-white</p>
												<p className="text-black-50">.text-black-50</p>
												<p className="text-white-50 bg-dark">.text-white-50</p>
											</Col>
										</Col>
									</Row>
								</div>
							</div>
						</CardBody>
					</Card>
				</Col>
			</Row>
			<Row>
				<Col xl={6}>
					<Card>
						<CardBody>
							<h4 className="header-title">Text Opacity Color</h4>
							<p className="text-muted font-14">
								text color utilities are generated with Sass using CSS variables. This allows for real-time color changes without compilation and
								dynamic alpha transparency changes.
							</p>
							<div className="tab-content">
								<div className="tab-pane show active" id="textopacity-utilities-preview">
									<div className="text-primary">This is default primary text</div>
									<div className="text-primary text-opacity-75">This is 75% opacity primary text</div>
									<div className="text-primary text-opacity-50">This is 50% opacity primary text</div>
									<div className="text-primary text-opacity-25">This is 25% opacity primary text</div>
								</div>
							</div>
						</CardBody>
					</Card>
				</Col>
				<Col xl={6}>
					<Card>
						<CardBody>
							<h4 className="header-title">Opacity</h4>
							<p className="text-muted font-14">
								The <code>opacity</code> property sets the opacity level for an element. The opacity level describes the transparency level, where
								<code>1</code> is not transparent at all, <code>.5</code> is 50% visible, and <code>0</code> is completely transparent. Set the
								<code>opacity</code> of an element using
								<code>
									.opacity-{'{'}value{'}'}
								</code>
								utilities.
							</p>
							<div className="tab-content">
								<div className="tab-pane show active" id="opacity-utilities-preview">
									<div className="d-flex flex-wrap gap-2">
										<div className="opacity-100 p-2 bg-primary text-light fw-bold rounded">100%</div>
										<div className="opacity-75 p-2 bg-primary text-light fw-bold rounded">75%</div>
										<div className="opacity-50 p-2 bg-primary text-light fw-bold rounded">50%</div>
										<div className="opacity-25 p-2 bg-primary text-light fw-bold rounded">25%</div>
									</div>
								</div>
							</div>
						</CardBody>
					</Card>
				</Col>

				<Row>
					<Col xl={6}>
						<Card>
							<CardBody>
								<h4 className="header-title">Additive(Add) Border</h4>
								<p className="text-muted font-14">
									Use border utilities to <b>add</b> an element’s borders. Choose from all borders or one at a time.
								</p>
								<div className="tab-content">
									<div className="tab-pane show active" id="border-utilities-preview">
										<div className="d-flex align-items-start flex-wrap gap-4">
											<div className="text-center">
												<div className="border avatar-md bg-light bg-opacity-50" />
											</div>
											<div className="text-center">
												<div className="border-top avatar-md bg-light bg-opacity-50" />
											</div>
											<div className="text-center">
												<div className="border-end avatar-md bg-light bg-opacity-50" />
											</div>
											<div className="text-center">
												<div className="border-bottom avatar-md bg-light bg-opacity-50" />
											</div>
											<div className="text-center">
												<div className="border-start avatar-md bg-light bg-opacity-50" />
											</div>
										</div>
									</div>
								</div>
							</CardBody>
						</Card>
					</Col>
					<Col xl={6}>
						<Card>
							<CardBody>
								<h4 className="header-title">Subtractive(Remove) Border</h4>
								<p className="text-muted font-14">
									Use border utilities to <b>remove</b> an element’s borders. Choose from all borders or one at a time.
								</p>
								<div className="tab-content">
									<div className="tab-pane show active" id="bordersubtractive-utilities-preview">
										<div className="d-flex align-items-start flex-wrap gap-4">
											<div className="text-center">
												<div className="border border-0 avatar-md bg-light bg-opacity-50" />
											</div>
											<div className="text-center">
												<div className="border border-top-0 avatar-md bg-light bg-opacity-50" />
											</div>
											<div className="text-center">
												<div className="border border-end-0 avatar-md bg-light bg-opacity-50" />
											</div>
											<div className="text-center">
												<div className="border border-bottom-0 avatar-md bg-light bg-opacity-50" />
											</div>
											<div className="text-center">
												<div className="border border-start-0 avatar-md bg-light bg-opacity-50" />
											</div>
										</div>
									</div>
								</div>
							</CardBody>
						</Card>
					</Col>
				</Row>

				<Row>
					<Col xl={6}>
						<Card>
							<CardBody>
								<h4 className="header-title">Border Color</h4>
								<p className="text-muted font-14">Change the border color using utilities built on our theme colors.</p>
								<div className="tab-content">
									<div className="tab-pane show active" id="bordercolor-utilities-preview">
										<div className="d-flex align-items-start flex-wrap gap-2">
											{extendedColorVariants.map((color, index) => (
												<div key={index} className="text-center">
													<div className={`border border-${color} avatar-md bg-light bg-opacity-50"`} />
												</div>
											))}
										</div>
									</div>
								</div>
							</CardBody>
						</Card>
						<Card>
							<CardBody>
								<h4 className="header-title">Border Width Size</h4>
								<div className="tab-content">
									<div className="tab-pane show active" id="borderwidth-utilities-preview">
										<div className="d-flex align-items-start flex-wrap gap-2">
											<div className="text-center">
												<div className="border border-1 avatar-md bg-light bg-opacity-50" />
											</div>
											<div className="text-center">
												<div className="border border-2 avatar-md bg-light bg-opacity-50" />
											</div>
											<div className="text-center">
												<div className="border border-3 avatar-md bg-light bg-opacity-50" />
											</div>
											<div className="text-center">
												<div className="border border-4 avatar-md bg-light bg-opacity-50" />
											</div>
											<div className="text-center">
												<div className="border border-5 avatar-md bg-light bg-opacity-50" />
											</div>
										</div>
									</div>
								</div>
							</CardBody>
						</Card>
					</Col>
					<Col xl={6}>
						<Card>
							<CardBody>
								<h4 className="header-title">Border Opacity</h4>
								<p className="text-muted font-14">
									choose from any of the <code>.border-opacity</code> utilities:
								</p>
								<div className="tab-content">
									<div className="tab-pane show active" id="borderopacity-utilities-preview">
										<div className="border border-success p-2 mb-2">This is default success border</div>
										<div className="border border-success p-2 mb-2 border-opacity-75">This is 75% opacity success border</div>
										<div className="border border-success p-2 mb-2 border-opacity-50">This is 50% opacity success border</div>
										<div className="border border-success p-2 mb-2 border-opacity-25">This is 25% opacity success border</div>
										<div className="border border-success p-2 border-opacity-10">This is 10% opacity success border</div>
									</div>
								</div>
							</CardBody>
						</Card>
					</Col>
				</Row>

				<Row>
					<Col xl={12}>
						<Card>
							<CardBody>
								<h4 className="header-title">Border subtle Color</h4>
								<p className="text-muted font-14">Change the border color using utilities built on our theme colors.</p>
								<div className="tab-content">
									<div className="tab-pane show active" id="bordercolor-utilities-subtle-preview">
										<div className="d-flex align-items-start flex-wrap gap-2">
											<div className="text-center">
												<div className="border border-primary-subtle avatar-md bg-light bg-opacity-50" />
											</div>
											<div className="text-center">
												<div className="border border-secondary-subtle avatar-md bg-light bg-opacity-50" />
											</div>
											<div className="text-center">
												<div className="border border-success-subtle avatar-md bg-light bg-opacity-50" />
											</div>
											<div className="text-center">
												<div className="border border-danger-subtle avatar-md bg-light bg-opacity-50" />
											</div>
											<div className="text-center">
												<div className="border border-warning-subtle avatar-md bg-light bg-opacity-50" />
											</div>
											<div className="text-center">
												<div className="border border-info-subtle avatar-md bg-light bg-opacity-50" />
											</div>
											<div className="text-center">
												<div className="border border-light-subtle avatar-md" />
											</div>
											<div className="text-center">
												<div className="border border-dark-subtle avatar-md bg-light bg-opacity-50" />
											</div>
										</div>
									</div>
								</div>
							</CardBody>
						</Card>
					</Col>
				</Row>
				<Row>
					<Col xl={6}>
						<Card>
							<CardBody>
								<h4 className="header-title">Border Radius</h4>
								<p className="text-muted font-14">Add classes to an element to easily round its corners.</p>
								<div className="tab-content">
									<div className="tab-pane show active" id="border-radius-utilities-preview">
										<div className="d-flex align-items-start flex-wrap gap-2">
											<img src={avatar2} className="avatar-lg rounded" alt="rounded" />
											<img src={avatar2} className="avatar-lg rounded-top" alt="rounded-top" />
											<img src={avatar2} className="avatar-lg rounded-end" alt="rounded-end" />
											<img src={avatar2} className="avatar-lg rounded-bottom" alt="rounded-bottom" />
											<img src={avatar2} className="avatar-lg rounded-start" alt="rounded-start" />
											<img src={avatar2} className="avatar-lg rounded-circle" alt="rounded-circle" />
											<img src={small2} className="avatar-lg w-auto rounded-pill" alt="rounded-pill" />
										</div>
									</div>
								</div>
							</CardBody>
						</Card>
					</Col>
					<Col xl={6}>
						<Card>
							<CardBody>
								<h4 className="header-title">Border Radius Size</h4>
								<p className="text-muted font-14">
									Use the scaling classes for larger or smaller rounded corners. Sizes range from <code>0</code> to <code>5</code>.
								</p>
								<div className="tab-content">
									<div className="tab-pane show active" id="border-radius-size-utilities-preview">
										<div className="d-flex align-items-start flex-wrap gap-2">
											<img src={avatar4} className="avatar-lg rounded-0" alt="rounded-0" />
											<img src={avatar4} className="avatar-lg rounded-1" alt="rounded-1" />
											<img src={avatar4} className="avatar-lg rounded-2" alt="rounded-2" />
											<img src={avatar4} className="avatar-lg rounded-3" alt="rounded-3" />
											<img src={avatar4} className="avatar-lg rounded-4" alt="rounded-4" />
											<img src={avatar4} className="avatar-lg rounded-5" alt="rounded-5" />
										</div>
									</div>
								</div>
							</CardBody>
						</Card>
					</Col>
				</Row>

				<Row>
					<Col xl={6}>
						<Card>
							<CardBody>
								<h4 className="header-title">Text Selection</h4>
								<p className="text-muted font-14">
									Use <code>user-select-all</code>, <code>user-select-auto</code>, or
									<code>user-select-none</code> class to the content which is selected when the user interacts with it.
								</p>
								<div className="tab-content">
									<div className="tab-pane show active" id="text-interactions-utilities-preview">
										<p className="user-select-all">This paragraph will be entirely selected when clicked by the user.</p>
										<p className="user-select-auto">This paragraph has default select behavior.</p>
										<p className="user-select-none mb-0">This paragraph will not be selectable when clicked by the user.</p>
									</div>
								</div>
							</CardBody>
						</Card>
					</Col>
					<Col xl={6}>
						<Card>
							<CardBody>
								<h4 className="header-title">Pointer Events</h4>
								<p className="text-muted font-14">
									Bootstrap provides <code>.pe-none</code> and
									<code>.pe-auto</code> classes to prevent or add element interactions.
								</p>
								<div className="tab-content">
									<div className="tab-pane show active" id="pointer-event-utilities-preview">
										<p>
											<a href="" className="pe-none" tabIndex={-1} aria-disabled="true">
												This link
											</a>
											can not be clicked.
										</p>
										<p>
											<a href="" className="pe-auto">
												This link
											</a>
											can be clicked (this is default behavior).
										</p>
										<p className="pe-none">
											<a href="" tabIndex={-1} aria-disabled="true">
												This link
											</a>
											can not be clicked because the
											<code>pointer-events</code> property is inherited from its parent. However,
											<a href="" className="pe-auto">
												this link
											</a>
											has a <code>pe-auto</code> class and can be clicked.
										</p>
									</div>
								</div>
							</CardBody>
						</Card>
					</Col>
				</Row>

				<Row>
					<Col xl={12}>
						<Card>
							<CardBody>
								<h4 className="header-title">Overflow</h4>
								<p className="text-muted font-14">
									Adjust the <code>overflow</code> property on the fly with four default values and classes. These classes are not responsive by
									default.
								</p>
								<div className="tab-content">
									<div className="tab-pane show active" id="overflow-utilities-preview">
										<div className="d-flex flex-wrap gap-4">
											<div className="overflow-auto p-3 bg-light" style={{ maxWidth: 260, maxHeight: 100 }}>
												This is an example of using
												<code>.overflow-auto</code> on an element with set width and height dimensions. By design, this content will vertically
												scroll.
											</div>
											<div className="overflow-hidden p-3 bg-light" style={{ maxWidth: 260, maxHeight: 100 }}>
												This is an example of using
												<code>.overflow-hidden</code> on an element with set width and height dimensions.
											</div>
											<div className="overflow-visible p-3 bg-light" style={{ maxWidth: 260, maxHeight: 100 }}>
												This is an example of using
												<code>.overflow-visible</code> on an element with set width and height dimensions.
											</div>
											<div className="overflow-scroll p-3 bg-light" style={{ maxWidth: 260, maxHeight: 100 }}>
												This is an example of using
												<code>.overflow-scroll</code> on an element with set width and height dimensions.
											</div>
										</div>
									</div>
								</div>
							</CardBody>
						</Card>
					</Col>
				</Row>

				<Row>
					<Col xl={6}>
						<Card>
							<CardBody>
								<h4 className="header-title">Position in Arrange</h4>
								<p className="text-muted font-14">
									Arrange elements easily with the edge positioning utilities. The format is
									<code>
										{'{'}property{'}'}-{'{'}position{'}'}
									</code>
									.
								</p>
								<div className="tab-content">
									<div className="tab-pane show active" id="position-utilities-preview">
										<div className="position-relative p-5 bg-light bg-opacity-50 m-3 border rounded" style={{ height: 180 }}>
											<div className="position-absolute top-0 start-0 avatar-xs bg-dark rounded" />
											<div className="position-absolute top-0 end-0 avatar-xs bg-dark rounded" />
											<div className="position-absolute top-50 start-50 avatar-xs bg-dark rounded" />
											<div className="position-absolute bottom-50 end-50 avatar-xs bg-dark rounded" />
											<div className="position-absolute bottom-0 start-0 avatar-xs bg-dark rounded" />
											<div className="position-absolute bottom-0 end-0 avatar-xs bg-dark rounded" />
										</div>
									</div>
								</div>
							</CardBody>
						</Card>
					</Col>
					<Col xl={6}>
						<Card>
							<CardBody>
								<h4 className="header-title">Position in Center</h4>
								<p className="text-muted font-14">
									In addition, you can also center the elements with the transform utility class <code>.translate-middle</code>.
								</p>
								<div className="tab-content">
									<div className="tab-pane show active" id="position-center-utilities-preview">
										<div className="position-relative m-3 bg-light bg-opacity-50 border rounded" style={{ height: 180 }}>
											<div className="position-absolute top-0 start-0 translate-middle avatar-xs bg-dark rounded" />
											<div className="position-absolute top-0 start-50 translate-middle avatar-xs bg-dark rounded" />
											<div className="position-absolute top-0 start-100 translate-middle avatar-xs bg-dark rounded" />
											<div className="position-absolute top-50 start-0 translate-middle avatar-xs bg-dark rounded" />
											<div className="position-absolute top-50 start-50 translate-middle avatar-xs bg-dark rounded" />
											<div className="position-absolute top-50 start-100 translate-middle avatar-xs bg-dark rounded" />
											<div className="position-absolute top-100 start-0 translate-middle avatar-xs bg-dark rounded" />
											<div className="position-absolute top-100 start-50 translate-middle avatar-xs bg-dark rounded" />
											<div className="position-absolute top-100 start-100 translate-middle avatar-xs bg-dark rounded" />
										</div>
									</div>
								</div>
							</CardBody>
						</Card>
					</Col>
				</Row>

				<Row>
					<Col xl={6}>
						<Card>
							<CardBody>
								<h4 className="header-title">Position in Axis</h4>
								<p className="text-muted font-14">
									By adding <code>.translate-middle-x</code> or
									<code>.translate-middle-y</code> classes, elements can be positioned only in horizontal or vertical direction.
								</p>
								<div className="tab-content">
									<div className="tab-pane show active" id="position-axis-utilities-preview">
										<div className="position-relative m-3 bg-light border rounded" style={{ height: 180 }}>
											<div className="position-absolute top-0 start-0 avatar-xs bg-dark rounded " />
											<div className="position-absolute top-0 start-50 translate-middle-x avatar-xs bg-dark rounded" />
											<div className="position-absolute top-0 end-0 avatar-xs bg-dark rounded" />
											<div className="position-absolute top-50 start-0 translate-middle-y avatar-xs bg-dark rounded" />
											<div className="position-absolute top-50 start-50 translate-middle avatar-xs bg-dark rounded" />
											<div className="position-absolute top-50 end-0 translate-middle-y avatar-xs bg-dark rounded" />
											<div className="position-absolute bottom-0 start-0 avatar-xs bg-dark rounded" />
											<div className="position-absolute bottom-0 start-50 translate-middle-x avatar-xs bg-dark rounded" />
											<div className="position-absolute bottom-0 end-0 avatar-xs bg-dark rounded" />
										</div>
									</div>
								</div>
							</CardBody>
						</Card>
					</Col>
					<Col xl={6}>
						<Card>
							<CardBody>
								<h4 className="header-title">Shadows</h4>
								<p className="text-muted font-14">
									While shadows on components are disabled by default in Bootstrap and can be enabled via
									<code>$enable-shadows</code>, you can also quickly add or remove a shadow with our <code>box-shadow</code> utility classes. Includes
									support for <code>.shadow-none</code> and three default sizes (which have associated variables to match).
								</p>
								<div className="tab-content">
									<div className="tab-pane show active" id="shadow-utilities-preview">
										<div className="shadow-none p-2 mb-2 bg-light rounded">No shadow</div>
										<div className="shadow-sm p-2 mb-2 rounded">Small shadow</div>
										<div className="shadow p-2 mb-2 rounded">Regular shadow</div>
										<div className="shadow-lg p-2 mb-2 rounded">Larger shadow</div>
									</div>
								</div>
							</CardBody>
						</Card>
					</Col>
				</Row>

				<Row>
					<Col xl={6}>
						<Card>
							<CardBody>
								<h4 className="header-title">Width</h4>
								<p className="text-muted font-14">
									Width utilities are generated from the utility API in
									<code>_utilities.scss</code>. Includes support for
									<code>25%</code>, <code>50%</code>, <code>75%</code>,<code>100%</code>, and <code>auto</code> by default. Modify those values as you
									need to generate different utilities here.
								</p>
								<div className="tab-content">
									<div className="tab-pane show active" id="width-utilities-preview">
										<div className="w-25 p-2 bg-light">Width 25%</div>
										<div className="w-50 p-2 bg-light">Width 50%</div>
										<div className="w-75 p-2 bg-light">Width 75%</div>
										<div className="w-100 p-2 bg-light">Width 100%</div>
										<div className="w-auto p-2 bg-light">Width auto</div>
									</div>
								</div>
							</CardBody>
						</Card>
					</Col>
					<Col xl={6}>
						<Card>
							<CardBody>
								<h4 className="header-title">Height</h4>
								<p className="text-muted font-14">
									Height utilities are generated from the utility API in
									<code>_utilities.scss</code>. Includes support for
									<code>25%</code>, <code>50%</code>, <code>75%</code>,<code>100%</code>, and <code>auto</code> by default. Modify those values as you
									need to generate different utilities here.
								</p>
								<div className="tab-content">
									<div className="tab-pane show active" id="height-utilities-preview">
										<div className="d-flex flex-wrap gap-3 align-items-start" style={{ height: 255 }}>
											<div className="h-25 p-2 bg-light">Height25%</div>
											<div className="h-50 p-2 bg-light">Height50%</div>
											<div className="h-75 p-2 bg-light">Height75%</div>
											<div className="h-100 p-2 bg-light">Height100%</div>
											<div className="h-auto p-2 bg-light">Height auto</div>
										</div>
									</div>
								</div>
							</CardBody>
						</Card>
					</Col>
				</Row>

				<Row>
					<Col xl={12}>
						<Card>
							<CardBody>
								<h4 className="header-title">Object fit</h4>
								<p className="text-muted font-14">
									Change the value of the
									<a href="https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit">
										<code>object-fit</code> property
									</a>
									with our responsive <code>object-fit</code> utility classes. This property tells the content to fill the parent container in a
									variety of ways, such as preserving the aspect ratio or stretching to take up as much space as possible.
								</p>
								<div className="tab-content">
									<div className="tab-pane show active" id="object-fit-utilities-preview">
										<div className="d-flex align-items-start flex-wrap gap-3 text-center">
											<div>
												<img src={small1} className="object-fit-contain border rounded avatar-xl" alt="..." />
												<p className="mt-1 mb-0">
													<code className="user-select-all">.object-fit-contain</code>
												</p>
											</div>
											<div>
												<img src={small1} className="object-fit-cover border rounded avatar-xl" alt="..." />
												<p className="mt-1 mb-0">
													<code className="user-select-all">.object-fit-cover</code>
												</p>
											</div>
											<div>
												<img src={small1} className="object-fit-fill border rounded avatar-xl" alt="..." />
												<p className="mt-1 mb-0">
													<code className="user-select-all">.object-fit-fill</code>
												</p>
											</div>
											<div>
												<img src={small1} className="object-fit-scale border rounded avatar-xl" alt="..." />
												<p className="mt-1 mb-0">
													<code className="user-select-all">.object-fit-scale</code>
												</p>
											</div>
											<div>
												<img src={small1} className="object-fit-none border rounded avatar-xl" alt="..." />
												<p className="mt-1 mb-0">
													<code className="user-select-all">.object-fit-none</code>
												</p>
											</div>
										</div>
									</div>
								</div>
							</CardBody>
						</Card>
					</Col>
				</Row>
				<Row>
					<Col xl={12}>
						<Card>
							<CardBody>
								<h4 className="header-title">Z-index</h4>
								<p className="text-muted font-14">
									Use <code>z-index</code> utilities to stack elements on top of one another. Requires a <code>position</code> value other than
									<code>static</code>, which can be set with custom styles or using our
									<a href="/docs/5.3/utilities/position/">position utilities</a>.
								</p>
								<div className="tab-content">
									<div className="tab-pane show active" id="z-index-preview">
										<div className="position-relative" style={{ height: 220, zIndex: 1 }}>
											<div className="z-3 position-absolute p-5 rounded-3 bg-primary-subtle" />
											<div className="z-2 position-absolute p-5 m-2 rounded-3 bg-success-subtle" />
											<div className="z-1 position-absolute p-5 m-3 rounded-3 bg-secondary-subtle" />
											<div className="z-0 position-absolute p-5 m-4 rounded-3 bg-danger-subtle" />
											<div className="z-n1 position-absolute p-5 m-5 rounded-3 bg-info-subtle" />
										</div>
									</div>
								</div>
							</CardBody>
						</Card>
					</Col>
				</Row>
			</Row>
		</>
	);
};

export default UtilitiesUI;
