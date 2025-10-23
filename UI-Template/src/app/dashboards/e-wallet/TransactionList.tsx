import { Badge, Card, CardBody, OverlayTrigger, Table, Tooltip } from 'react-bootstrap';
import classNames from 'classnames';
import type { Transaction } from './types';

import {Link} from "react-router";

type TransactionListProps = {
	transactionList: Transaction[];
};

const TransactionList = ({ transactionList }: TransactionListProps) => {
	return (
		<Card>
				<div className="card-header d-flex justify-content-between align-items-center">
					<h4 className="header-title mb-0">Transaction List</h4>
					<select name="select" className="form-select form-select-sm w-25">
						<option>Today</option>
						<option>Yesterday</option>
						<option>Tomorrow</option>
					</select>
				</div>
			<CardBody className="pt-0">
				<Table responsive className="table-centered mb-0">
					<thead>
						<tr>
							<th scope="col">Name</th>
							<th scope="col">Date</th>
							<th scope="col">Status</th>
							<th scope="col">Amount</th>
							<th scope="col" className="text-end">
								Action
							</th>
						</tr>
					</thead>
					<tbody>
						{(transactionList || []).map((transaction, index) => {
							return (
								<tr key={index.toString()}>
									<td>
										<div className="d-flex align-items-center">
											<div className="flex-shrink-0">
												<img src={transaction.avatar} alt="" className="rounded-circle" width="33" />
											</div>
											<div className="flex-grow-1 ms-2">{transaction.name}</div>
										</div>
									</td>
									<td>
										<i className="uil uil-calender me-1"></i>
										{transaction.date}
									</td>
									<td>
										<Badge
											className={classNames({
												'bg-success-lighten text-success': transaction.status === 'Incoming',
												'bg-danger-lighten text-danger': transaction.status === 'Outgoing',
												'bg-warning-lighten text-warning': transaction.status === 'In Progress',
											})}
										>
											{transaction.status}
										</Badge>
									</td>
									<td>
										<span
											className={classNames(
												{
													'text-success': transaction.status === 'Incoming',
													'text-danger': transaction.status === 'Outgoing',
													'text-warning': transaction.status === 'In Progress',
												},
												'fw-semibold'
											)}
										>
											{transaction.amount}
										</span>
									</td>
									<td>
										<OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}>
											<Link to="" className="font-18 text-info me-2">
												<i className="uil uil-pen"></i>
											</Link>
										</OverlayTrigger>
										<OverlayTrigger placement="top" overlay={<Tooltip>Delete</Tooltip>}>
											<Link to="" className="font-18 text-danger">
												<i className="uil uil-trash"></i>
											</Link>
										</OverlayTrigger>
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

export default TransactionList;
