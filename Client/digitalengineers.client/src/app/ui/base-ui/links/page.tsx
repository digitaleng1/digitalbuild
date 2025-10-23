import { toSentenceCase } from '@/common';
import { extendedColorVariants } from '@/common/color-variants';
import PageBreadcrumb from '@/components/PageBreadcrumb';

import {Link} from "react-router";
import { Card, CardBody, Col, Row } from 'react-bootstrap';



const LinksUI = () => {
	const opacityVariants = [10, 25, 50, 75, 100];

	return (
		<>
			<PageBreadcrumb title="Links" subName="Base UI" />

			<Row>
				<Col xl={6}>
					<Card>
						<CardBody>
							<h4 className="header-title">Colored links</h4>
							<p className="text-muted font-14">
								You can use the <code>.link-*</code> classes to colorize links. Unlike the
								<Link to="/ui/base-ui/utilities">
									<code>.text-*</code> classes
								</Link>
								, these classes have a <code>:hover</code> and <code>:focus</code>
								state. Some of the link styles use a relatively light foreground color, and should only be used on a dark background in order to have
								sufficient contrast.
							</p>
							<div className="tab-content">
								<div className="tab-pane show active" id="colored-links-preview">
									{extendedColorVariants.map((color, index) => {
										return (
											<p key={index}>
												<Link to="" className={`link-${color}`}>
													{toSentenceCase(color)} link
												</Link>
											</p>
										);
									})}
									<p className="mb-0">
										<a href="" className="link-body-emphasis">
											Emphasis link
										</a>
									</p>
								</div>
							</div>
						</CardBody>
					</Card>
				</Col>
				<Col xl={6}>
					<Card>
						<CardBody>
							<h4 className="header-title">Link utilities</h4>
							<p className="text-muted font-14">
								<a href="ui-utilities.html">Colored link helpers</a> have been updated to pair with our link utilities. Use the new utilities to
								modify the link opacity, underline opacity, and underline offset.
							</p>
							<div className="tab-content">
								<div className="tab-pane show active" id="links-utilities-preview">
									{extendedColorVariants.map((color, index) => (
										<p key={index}>
											<Link
												to=""
												className={`link-${color} text-decoration-underline link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover`}
											>
												{toSentenceCase(color)} link
											</Link>
										</p>
									))}
									<p>
										<a
											href=""
											className="link-body-emphasis text-decoration-underline link-offset-2 link-underline-opacity-25 link-underline-opacity-75-hover"
										>
											Emphasis link
										</a>
									</p>
								</div>
							</div>
						</CardBody>
					</Card>
				</Col>
			</Row>
			{/*end row*/}
			<Row>
				<Col xl={6}>
					<Card>
						<CardBody>
							<h4 className="header-title">Link opacity</h4>
							<p className="text-muted font-14">
								Change the alpha opacity of the link <code>rgba()</code> color value with utilities. Please be aware that changes to a color’s opacity
								can lead to links with <em>insufficient</em> contrast.
							</p>
							<div className="tab-content">
								<div className="tab-pane show active" id="link-opacity-preview">
									{opacityVariants.map((opacity, index) => (
										<p key={index}>
											<a className={`link-opacity-${opacity}`} href="">
												Link opacity {opacity}
											</a>
										</p>
									))}
								</div>
							</div>
						</CardBody>
					</Card>
				</Col>
				<Col xl={6}>
					<Card>
						<CardBody>
							<h4 className="header-title">Link hover opacity</h4>
							<p className="text-muted font-14">You can even change the opacity level on hover.</p>
							<div className="tab-content">
								<div className="tab-pane show active" id="link-hover-opacity-preview">
									{opacityVariants.map((opacity, index) => (
										<p key={index}>
											<a className={`link-opacity-${opacity}-hover`} href="">
												Link hover opacity {opacity}
											</a>
										</p>
									))}
								</div>
							</div>
						</CardBody>
					</Card>
				</Col>
			</Row>
			{/*end row*/}
			<Row>
				<Col xl={6}>
					<Card>
						<CardBody>
							<h4 className="header-title">Underline color</h4>
							<p className="text-muted font-14">Change the underline’s color independent of the link text color.</p>
							<div className="tab-content">
								<div className="tab-pane show active" id="link-underline-color-preview">
									{extendedColorVariants.map((color, index) => (
										<p key={index}>
											<Link to="" className={`text-decoration-underline link-underline-${color}`}>
												{toSentenceCase(color)} underline
											</Link>
										</p>
									))}
								</div>
							</div>
						</CardBody>
					</Card>
				</Col>
				<Col xl={6}>
					<Card>
						<CardBody>
							<h4 className="header-title">Underline opacity</h4>
							<p className="text-muted font-14">
								Change the underline’s opacity. Requires adding
								<code>.link-underline</code> to first set an <code>rgba()</code>
								color we use to then modify the alpha opacity.
							</p>
							<div className="tab-content">
								<div className="tab-pane show active" id="link-underline-opacity-preview">
									<p>
										<a className="text-decoration-underline link-offset-2 link-underline link-underline-opacity-0" href="">
											Underline opacity 0
										</a>
									</p>

									{opacityVariants.map((opacity, index) => (
										<p key={index}>
											<Link to="" className={`text-decoration-underline link-offset-2 link-underline link-underline-opacity-${opacity}`}>
												Underline opacity {opacity}
											</Link>
										</p>
									))}
								</div>
							</div>
						</CardBody>
					</Card>
				</Col>
			</Row>
			{/*end row*/}
			<Row>
				<Col xl={6}>
					<Card>
						<CardBody>
							<h4 className="header-title">Underline offset</h4>
							<p className="text-muted font-14">
								Change the underline’s opacity. Requires adding
								<code>.link-underline</code> to first set an <code>rgba()</code>
								color we use to then modify the alpha opacity.
							</p>
							<div className="tab-content">
								<div className="tab-pane show active" id="link-underline-offset-preview">
									<p>
										<Link to="">Default link</Link>
									</p>
									{[1, 2, 3].map((offset, index) => (
										<p key={index}>
											<Link to="" className={`text-decoration-underline link-offset-${offset}`}>
												Offset {offset} link
											</Link>
										</p>
									))}
								</div>
							</div>
						</CardBody>
					</Card>
				</Col>
				<Col xl={6}>
					<Card>
						<CardBody>
							<h4 className="header-title">Hover variants</h4>
							<p className="text-muted font-14">
								Just like the <code>.link-opacity-*-hover</code> utilities,
								<code>.link-offset</code> and <code>.link-underline-opacity</code>
								utilities include <code>:hover</code> variants by default. Mix and match to create unique link styles.
							</p>
							<div className="tab-content">
								<div className="tab-pane show active" id="link-hover-variants-preview">
									<a
										className="link-offset-2 link-offset-3-hover text-decoration-underline link-underline link-underline-opacity-0 link-underline-opacity-75-hover"
										href=""
									>
										Underline opacity 0
									</a>
								</div>
							</div>
						</CardBody>
					</Card>
				</Col>
			</Row>
		</>
	);
};

export default LinksUI;
