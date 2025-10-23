import { Card, CardBody, Table } from 'react-bootstrap';
import type{ TopPerformer } from './types';
import CardTitle from '@/components/CardTitle';
import {Link} from "react-router";

type PerformersProps = {
	topPerformanceData: TopPerformer[];
};

const Performers = ({ topPerformanceData }: PerformersProps) => {
	return (
		<Card>
				<CardTitle
					containerClass="card-header d-flex justify-content-between align-items-center"
					title="Top Performing"
					menuItems={[{ label: 'Settings' }, { label: 'Action' }]}
				/>

			<CardBody className='pt-0'>
				<Table hover responsive striped size="sm" className="table-centered mb-0 table-nowrap">
					<thead>
						<tr>
							<th>User</th>
							<th>Leads</th>
							<th>Deals</th>
							<th>Tasks</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						{(topPerformanceData || []).map((item, index) => {
							return (
								<tr key={index.toString()}>
									<td>
										<h5 className="font-15 mb-1 fw-normal">{item.name}</h5>
										<span className="text-muted font-13">{item.position}</span>
									</td>
									<td>{item.leads}</td>
									<td>{item.deals}</td>
									<td>{item.tasks}</td>
									<td className="table-action">
										<Link to="" className="action-icon">
											<i className="mdi mdi-eye"></i>
										</Link>
									</td>
								</tr>
							);
						})}
					</tbody>
				</Table>
			</CardBody>
		</Card>
	);
};

export default Performers;
