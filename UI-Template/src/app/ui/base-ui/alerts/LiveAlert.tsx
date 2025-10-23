
import { useState } from 'react';
import { Alert, Button, Card, CardBody } from 'react-bootstrap';

const LiveAlert = () => {
	const [list, setList] = useState<number[]>([]);

	/*
	 * handle close
	 */
	const handleClose = (index: number) => {
		const updatedList = [...list];
		updatedList.splice(index, 1);
		setList(updatedList);
	};

	return (
		<Card>
			<CardBody>
				<h4 className="header-title">Alert Live example</h4>
				<p className="sub-header">
					Click the button below to show an alert (hidden with inline styles to start), then dismiss (and destroy) it with the built-in close button.
				</p>

				{(list || []).map((_color, idx) => {
					return (
						<Alert key={idx.toString()} variant="success" onClose={() => handleClose(idx)} dismissible>
							Nice, you triggered this alert message!
						</Alert>
					);
				})}
				<Button onClick={() => setList((prev) => [...prev, prev.length])}>Show live alert</Button>
			</CardBody>
		</Card>
	);
};
export default LiveAlert;
