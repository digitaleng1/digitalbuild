
import { ButtonGroup, Card, CardBody, DropdownButton, DropdownDivider, DropdownItem, SplitButton } from 'react-bootstrap';

const DropstartVariationDropdowns = () => {
	const variations = [
		{
			type: DropdownButton,
			name: 'Dropstart',
		},
		{
			type: SplitButton,
			name: 'Split dropstart',
		},
	];
	return (
		<Card>
			<CardBody>
				<h4 className="header-title">Dropup variation</h4>
				<p className="text-muted font-14 mb-3">
					Trigger dropdown menus left of their toggle elements, with the <code>drop</code>
					prop.
				</p>
				{variations.map((item, index) => (
					<item.type as={ButtonGroup} key={index.toString()} drop="start" title={item.name} variant="secondary" className="me-1">
						<DropdownItem eventKey="1">Action</DropdownItem>
						<DropdownItem eventKey="2">Another action</DropdownItem>
						<DropdownItem eventKey="3">Something else here</DropdownItem>
						<DropdownDivider />
						<DropdownItem eventKey="4">Separated link</DropdownItem>
					</item.type>
				))}
			</CardBody>
		</Card>
	);
};

export default DropstartVariationDropdowns;
