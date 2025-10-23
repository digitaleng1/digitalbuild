import {Link} from "react-router";
import {
	ButtonGroup,
	Card,
	CardBody,
	Col,
	Dropdown,
	DropdownButton,
	DropdownDivider,
	DropdownHeader,
	DropdownItem,
	DropdownMenu,
	DropdownToggle,
	Row,
} from 'react-bootstrap';

import { toSentenceCase } from '@/common';
import { colorVariants } from '@/common/color-variants';
import PageBreadcrumb from '@/components/PageBreadcrumb';

import ButtonDropdownSizes from './ButtonDropdownSizes';
import DropendVariationDropdowns from './DropendVariationDropdowns';
import DropstartVariationDropdowns from './DropstartVariationDropdowns';
import DropupVariationDropdowns from './DropupVariationDropdowns';
import SplitColorVariantButtonDropdown from './SplitColorVariantButtonDropdown';



const SingleButtonDropdown = () => {
	return (
		<Card>
			<CardBody>
				<h4 className="header-title">Single button dropdowns</h4>
				<p className="text-muted font-14">
					You can use <code>DropdownButton</code> to create a simple dropdown. Also, you can use prop <code>as</code> to create custom element typeof
					dropdown.
				</p>

				<Row>
					<Col className="col-auto">
						<DropdownButton variant="light" title="Dropdown button">
							<DropdownItem href="">Action</DropdownItem>
							<DropdownItem href="">Another action</DropdownItem>
							<DropdownItem href="">Something else here</DropdownItem>
						</DropdownButton>
					</Col>
					<Col className="col-auto">
						<Dropdown>
							<DropdownToggle as={Link} to="" className="btn btn-secondary" id="dropdown-basic">
								Dropdown link
							</DropdownToggle>

							<DropdownMenu>
								<DropdownItem href="">Action</DropdownItem>
								<DropdownItem href="">Another action</DropdownItem>
								<DropdownItem href="">Something else here</DropdownItem>
							</DropdownMenu>
						</Dropdown>
					</Col>
				</Row>
			</CardBody>
		</Card>
	);
};

const DropdownMenuAlignment = () => {
	return (
		<Card>
			<CardBody>
				<h4 className="header-title">Menu alignment</h4>
				<p className="text-muted font-14">
					Passing <code>right</code> to the <code>menuAlign</code> prop on the
					<code> DropdownButton</code> to right align the dropdown menu.
				</p>

				<DropdownButton variant="light" align="end" title="Right-aligned menu">
					<DropdownItem href="">Action</DropdownItem>
					<DropdownItem href="">Another action</DropdownItem>
					<DropdownItem href="">Something else here</DropdownItem>
				</DropdownButton>
			</CardBody>
		</Card>
	);
};

const ColorVariantButtonDropdown = () => {
	return (
		<Card>
			<CardBody>
				<h4 className="header-title">Variant</h4>
				<p className="text-muted font-14 mb-3">The best part is you can do this with any button variant, too:</p>

				{colorVariants.map((color, index) => {
					return (
						<Dropdown key={index.toString()} as={ButtonGroup} className="me-1">
							<DropdownToggle variant={color}>{toSentenceCase(color)}</DropdownToggle>
							<DropdownMenu>
								<DropdownItem href="">Action</DropdownItem>
								<DropdownItem href="">Another action</DropdownItem>
								<DropdownItem href="">Something else here</DropdownItem>
								<DropdownDivider />
								<DropdownItem href="">Separated link</DropdownItem>
							</DropdownMenu>
						</Dropdown>
					);
				})}
			</CardBody>
		</Card>
	);
};

const AnimatedButtonDropdown = () => {
	return (
		<Card>
			<CardBody>
				<h4 className="header-title">Animated Dropdown</h4>
				<p className="text-muted font-14">
					Add <code>.dropdown-menu-animated</code> to a <code>Dropdown.Menu</code> to have animated dropdown menu.
				</p>
				<Dropdown>
					<DropdownToggle variant="light">Animated Dropdown</DropdownToggle>
					<DropdownMenu className="dropdown-menu-animated">
						<DropdownItem href="">Action</DropdownItem>
						<DropdownItem href="">Another action</DropdownItem>
						<DropdownItem href="">Something else here</DropdownItem>
						<DropdownDivider />
						<DropdownItem href="">Separated link</DropdownItem>
					</DropdownMenu>
				</Dropdown>
			</CardBody>
		</Card>
	);
};

const ActiveItemDropdown = () => {
	return (
		<Card>
			<CardBody>
				<h4 className="header-title">Active Item</h4>

				<p className="text-muted font-14">
					Add <code>active</code> prop to item in the dropdown to
					<strong>style them as active</strong>.
				</p>

				<Dropdown>
					<DropdownToggle variant="secondary">Active Item</DropdownToggle>
					<DropdownMenu>
						<DropdownItem>Regular link</DropdownItem>
						<DropdownItem active>Active link</DropdownItem>
						<DropdownItem>Another link</DropdownItem>
					</DropdownMenu>
				</Dropdown>
			</CardBody>
		</Card>
	);
};

const DisabledItemDropdown = () => {
	return (
		<Card>
			<CardBody>
				<h4 className="header-title">Disabled Item</h4>

				<p className="text-muted font-14">
					Add <code>disabled</code> prop to item in the dropdown to
					<strong>style them as disabled</strong>.
				</p>

				<Dropdown>
					<DropdownToggle>Active Item</DropdownToggle>
					<DropdownMenu>
						<DropdownItem>Regular link</DropdownItem>
						<DropdownItem disabled>Disabled link</DropdownItem>
						<DropdownItem>Another link</DropdownItem>
					</DropdownMenu>
				</Dropdown>
			</CardBody>
		</Card>
	);
};

const DropdownWithHeader = () => {
	return (
		<Card>
			<CardBody>
				<h4 className="header-title">Headers</h4>

				<p className="text-muted font-14">Add a header to label sections of actions.</p>

				<Dropdown>
					<DropdownToggle variant="secondary">Header</DropdownToggle>
					<DropdownMenu>
						<DropdownHeader>Dropdown header</DropdownHeader>
						<DropdownItem>Action</DropdownItem>
						<DropdownItem>Another action</DropdownItem>
					</DropdownMenu>
				</Dropdown>
			</CardBody>
		</Card>
	);
};

const DropdownWithText = () => {
	return (
		<Card>
			<CardBody>
				<h4 className="header-title">Text</h4>

				<p className="text-muted font-14">
					Place any freeform text within a dropdown menu with text and use spacing utilities. Note that you’ll likely need additional sizing styles to
					constrain the menu width.
				</p>

				<Dropdown>
					<DropdownToggle>Text Dropdown</DropdownToggle>
					<DropdownMenu className="p-3 text-muted" style={{ maxWidth: '200px' }}>
						<p>Some example text that&apos;s free-flowing within the dropdown menu.</p>
						<p className="mb-0">And this is more example text.</p>
					</DropdownMenu>
				</Dropdown>
			</CardBody>
		</Card>
	);
};

const CustomDropdown = () => {
	return (
		<Card>
			<CardBody>
				<h4 className="header-title">Forms</h4>

				<p className="text-muted font-14">
					Put a form within a dropdown menu, or make it into a dropdown menu, and use margin or padding utilities to give it the negative space you
					require.
				</p>

				<Dropdown>
					<DropdownToggle variant="secondary">Form</DropdownToggle>
					<DropdownMenu>
						<form className="px-4 py-3">
							<div className="mb-3">
								<label htmlFor="exampleDropdownFormEmail1" className="form-label">
									Email address
								</label>
								<input type="email" className="form-control" id="exampleDropdownFormEmail1" placeholder="email@example.com" />
							</div>
							<div className="mb-3">
								<label htmlFor="exampleDropdownFormPassword1" className="form-label">
									Password
								</label>
								<input type="password" className="form-control" id="exampleDropdownFormPassword1" placeholder="Password" />
							</div>
							<div className="mb-2">
								<div className="form-check">
									<input type="checkbox" className="form-check-input" id="dropdownCheck" />
									<label className="form-check-label" htmlFor="dropdownCheck">
										Remember me
									</label>
								</div>
							</div>
							<button type="submit" className="btn btn-primary">
								Sign in
							</button>
						</form>
						<DropdownDivider />
						<DropdownItem eventKey="4">New around here? Sign up</DropdownItem>
						<DropdownItem eventKey="4">Forgot password?</DropdownItem>
					</DropdownMenu>
				</Dropdown>
			</CardBody>
		</Card>
	);
};

const DropdownsUI = () => {
	return (
		<>
			<PageBreadcrumb title="Dropdowns" subName="Base UI" />

			<Row>
				<Col lg={6}>
					<SingleButtonDropdown />
					<ColorVariantButtonDropdown />
					<AnimatedButtonDropdown />
					<DropupVariationDropdowns />
					<DropendVariationDropdowns />
					<DisabledItemDropdown />
					<DropdownWithText />
				</Col>

				<Col lg={6}>
					<DropdownMenuAlignment />
					<SplitColorVariantButtonDropdown />
					<ButtonDropdownSizes />
					<DropstartVariationDropdowns />
					<ActiveItemDropdown />
					<DropdownWithHeader />
					<CustomDropdown />
				</Col>
			</Row>
		</>
	);
};

export default DropdownsUI;
