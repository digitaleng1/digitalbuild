
import { extendedColorVariants, toSentenceCase } from '@/common';
import classNames from 'classnames';
import { useState } from 'react';
import { Alert, Card } from 'react-bootstrap';

const DismissibleAlerts = () => {
	const [colors, setColors] = useState<string[]>(extendedColorVariants);

	/*
	 * handle close
	 */
	const handleClose = (index: number) => {
		const list = [...colors];
		list.splice(index, 1);
		setColors(list);
	};

	return (
		<Card>
			<Card.Body>
				<h4 className="header-title">Dismissing Alerts</h4>
				<p className="text-muted font-14 mb-3">
					Add a dismiss button and the <code>.alert-dismissible</code> class, which adds extra padding to the right of the alert and positions the
					<code>.btn-close</code> button.
				</p>

				{colors.map((color, index) => {
					return (
						<Alert
							variant=""
							className={classNames('bg-' + color, color === 'light' ? 'text-dark' : 'text-white', {
								'text-light': ['dark', 'secondary'].includes(color),
							})}
							key={index.toString()}
							onClose={() => handleClose(index)}
							dismissible
						>
							<strong>{toSentenceCase(color)} - </strong> A simple {color} alert—check it out!
						</Alert>
					);
				})}
			</Card.Body>
		</Card>
	);
};

export default DismissibleAlerts;
