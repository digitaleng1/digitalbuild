
import { colorVariants, toSentenceCase } from '@/common';
import { Card, CardBody, DropdownDivider, DropdownItem, SplitButton } from 'react-bootstrap';

const SplitColorVariantButtonDropdown = () => {
	return (
		<Card>
			<CardBody>
				<h4 className="header-title">Split button dropdowns</h4>
				<p className="text-muted font-14 mb-3">
					You can split button dropdowns by adding <code>SplitButton</code>.
				</p>

				{colorVariants.map((color, index) => {
					return (
						<SplitButton key={index.toString()} variant={color} title={toSentenceCase(color)} className="me-1 mb-1">
							<DropdownItem eventKey="1">Action</DropdownItem>
							<DropdownItem eventKey="2">Another action</DropdownItem>
							<DropdownItem eventKey="3">Something else here</DropdownItem>
							<DropdownDivider />
							<DropdownItem eventKey="4">Separated link</DropdownItem>
						</SplitButton>
					);
				})}
			</CardBody>
		</Card>
	);
};

export default SplitColorVariantButtonDropdown;
