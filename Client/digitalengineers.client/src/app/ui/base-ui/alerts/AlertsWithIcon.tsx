
import { useState } from 'react';
import { Alert, Card } from 'react-bootstrap';

const AlertsWithIcon = () => {
	const [colors] = useState<string[]>(['success', 'danger', 'warning', 'info']);

	const icons: string[] = ['ri-check-line', 'ri-close-circle-line', 'ri-alert-line', 'ri-information-line'];

	return (
		<Card>
			<Card.Body>
				<h4 className="header-title">Icons with Alerts</h4>
				<p className="text-muted font-14">You can also include additional elements like icons, heading, etc along side the actual message.</p>

				{colors.map((color, index) => {
					return (
						<Alert variant={color} key={index.toString()}>
							<i className={`${icons[index]} me-1 align-middle font-16`}></i>
							This is a<strong>{color}</strong> alert - check it out!
						</Alert>
					);
				})}
			</Card.Body>
		</Card>
	);
};
export default AlertsWithIcon;
