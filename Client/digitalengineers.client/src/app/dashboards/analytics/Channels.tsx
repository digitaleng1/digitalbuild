import {Link} from "react-router";
import { Card, CardBody, CardHeader, ProgressBar } from 'react-bootstrap';

const Channels = () => {
	return (
		<Card>
			<CardHeader className="d-flex justify-content-between align-items-center">
				<h4 className="header-title">Channels</h4>
				<Link to="" className="btn btn-sm btn-light">
					Export <i className="mdi mdi-download ms-1"></i>
				</Link>
			</CardHeader>
			<CardBody className="pt-0">
				<table className="table table-sm table-responsive table-centered mb-0 font-14">
					<thead className="bg-light bg-opacity-50">
						<tr>
							<th>Channel</th>
							<th>Visits</th>
							<th style={{ width: '40%' }}>&nbsp;</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>Direct</td>
							<td>2,050</td>
							<td>
								<ProgressBar now={65} style={{ height: '3px' }} />
							</td>
						</tr>
						<tr>
							<td>Organic Search</td>
							<td>1,405</td>
							<td>
								<ProgressBar now={45} style={{ height: '3px' }} variant="info" />
							</td>
						</tr>
						<tr>
							<td>Refferal</td>
							<td>750</td>
							<td>
								<ProgressBar now={30} style={{ height: '3px' }} variant="warning" />
							</td>
						</tr>
						<tr>
							<td>Social</td>
							<td>540</td>
							<td>
								<ProgressBar now={25} style={{ height: '3px' }} variant="danger" />
							</td>
						</tr>
					</tbody>
				</table>
			</CardBody>
		</Card>
	);
};

export default Channels;
