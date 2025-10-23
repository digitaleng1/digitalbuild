import {Link} from "react-router";
import { Card, CardBody } from 'react-bootstrap';

const Events = () => {
	return (
		<Card>
			<CardBody className="p-2">
				<div className="list-group list-group-flush my-2">
					<Link to="" className="list-group-item list-group-item-action border-0">
						<i className="uil uil-calendar-alt me-1"></i> 3 events this week
					</Link>
					<Link to="" className="list-group-item list-group-item-action border-0">
						<i className="uil uil-calender me-1"></i> Eva&apos;s birthday today
					</Link>
					<Link to="" className="list-group-item list-group-item-action border-0">
						<i className="uil uil-bookmark me-1"></i> Jenny&apos;s wedding tomorrow
					</Link>
				</div>
			</CardBody>
		</Card>
	);
};

export default Events;
