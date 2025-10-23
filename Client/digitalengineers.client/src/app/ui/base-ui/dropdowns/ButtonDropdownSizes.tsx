
import { ButtonGroup, Card, CardBody, DropdownButton, DropdownDivider, DropdownItem, SplitButton } from 'react-bootstrap';

const ButtonDropdownSizes = () => {
	return (
		<Card>
			<CardBody>
				<h4 className="header-title">Sizing</h4>
				<p className="text-muted font-14">Button dropdowns work with buttons of all sizes, including default and split dropdown buttons.</p>

				{[DropdownButton, SplitButton].map((DropdownType, index) => (
					<DropdownType as={ButtonGroup} className="me-1" key={index.toString()} size="lg" title="Large button" variant="light">
						<DropdownItem eventKey="1">Action</DropdownItem>
						<DropdownItem eventKey="2">Another action</DropdownItem>
						<DropdownItem eventKey="3">Something else here</DropdownItem>
						<DropdownDivider />
						<DropdownItem eventKey="4">Separated link</DropdownItem>
					</DropdownType>
				))}
				{[DropdownButton, SplitButton].map((DropdownType, index) => (
					<DropdownType as={ButtonGroup} className="me-1" key={index.toString()} size="sm" title="Small button" variant="light">
						<DropdownItem eventKey="1">Action</DropdownItem>
						<DropdownItem eventKey="2">Another action</DropdownItem>
						<DropdownItem eventKey="3">Something else here</DropdownItem>
						<DropdownDivider />
						<DropdownItem eventKey="4">Separated link</DropdownItem>
					</DropdownType>
				))}
			</CardBody>
		</Card>
	);
};
export default ButtonDropdownSizes;
