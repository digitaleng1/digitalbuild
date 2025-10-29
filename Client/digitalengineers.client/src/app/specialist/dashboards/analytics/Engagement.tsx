import {Link} from "react-router";
import { Card, CardBody, CardHeader } from 'react-bootstrap';

const Engagement = () => {
	return (
		<Card>
			<CardHeader className="d-flex justify-content-between align-items-center">
				<h4 className="header-title">Engagement Overview</h4>
				<Link to="" className="btn btn-sm btn-light">
					Export <i className="mdi mdi-download ms-1"></i>
				</Link>
			</CardHeader>
			<CardBody className="pt-0">
				<table className="table table-sm table-responsive table-centered mb-0 font-14">
					<thead className="bg-light bg-opacity-50">
						<tr>
							<th>Duration (Secs)</th>
							<th style={{ width: '30%' }}>Sessions</th>
							<th style={{ width: '3    0%' }}>Views</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>0-30</td>
							<td>2,250</td>
							<td>4,250</td>
						</tr>
						<tr>
							<td>31-60</td>
							<td>1,501</td>
							<td>2,050</td>
						</tr>
						<tr>
							<td>61-120</td>
							<td>750</td>
							<td>1,600</td>
						</tr>
						<tr>
							<td>121-240</td>
							<td>540</td>
							<td>1,040</td>
						</tr>
					</tbody>
				</table>
			</CardBody>
		</Card>
	);
};

export default Engagement;
