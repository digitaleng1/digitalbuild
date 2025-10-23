import {Link} from "react-router";
import { Card, CardBody, CardHeader, ProgressBar } from 'react-bootstrap';

const Social = () => {
	return (
		<Card>
			<CardHeader className="d-flex justify-content-between align-items-center">
				<h4 className="header-title">Social Media Traffic</h4>
				<Link to="" className="btn btn-sm btn-light">
					Export <i className="mdi mdi-download ms-1"></i>
				</Link>
			</CardHeader>

			<CardBody className="pt-0">
				<table className="table table-sm table-responsive table-centered mb-0 font-14">
					<thead className="bg-light bg-opacity-50">
						<tr>
							<th>Network</th>
							<th>Visits</th>
							<th style={{ width: '40%' }}>&nbsp;</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>Facebook</td>
							<td>2,250</td>
							<td>
								<ProgressBar now={65} style={{ height: '3px' }} />
							</td>
						</tr>
						<tr>
							<td>Instagram</td>
							<td>1,501</td>
							<td>
								<ProgressBar now={45} style={{ height: '3px' }} />
							</td>
						</tr>
						<tr>
							<td>Twitter</td>
							<td>750</td>
							<td>
								<ProgressBar now={30} style={{ height: '3px' }} />
							</td>
						</tr>
						<tr>
							<td>LinkedIn</td>
							<td>540</td>
							<td>
								<ProgressBar now={25} style={{ height: '3px' }} />
							</td>
						</tr>
					</tbody>
				</table>
			</CardBody>
		</Card>
	);
};

export default Social;
