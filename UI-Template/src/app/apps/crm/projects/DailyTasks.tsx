import { Card, CardBody } from 'react-bootstrap';
import type { DailyTask } from './types';
import SimplebarReactClient from '@/components/wrappers/SimplebarReactClient';
import {Link} from "react-router";

type DailyTaskProps = {
	taskData: Array<DailyTask>;
};

const DailyTasks = ({ taskData }: DailyTaskProps) => {
	return (
		<Card>
			<CardBody className="pb-0">
				<div className="d-flex justify-content-between align-items-center mb-3">
					<h4 className="header-title mb-0">Daily Task</h4>
					<select name="select" className="form-select form-select-sm w-50" key="select">
						<option>Today</option>
						<option>Yesterday</option>
						<option>Tomorrow</option>
					</select>
				</div>
			</CardBody>
			<SimplebarReactClient className="card-body py-0" style={{ maxHeight: '319px' }}>
				{(taskData || []).map((task, index) => {
					return (
						<div className="border rounded p-2 mb-2" key={index.toString()}>
							<ul className="list-inline mb-2">
								<li className="list-inline-item font-16 fw-semibold">
									<Link to="" className="text-secondary">
										{task.title}
									</Link>
								</li>
								<li className="list-inline-item text-muted">
									<i className="mdi mdi-circle-small"></i>
								</li>
								<li className="list-inline-item font-13 fw-semibold text-muted">{task.time}</li>
							</ul>
							<p className="text-muted mb-0">{task.shortDesc}</p>
							<p className="text-muted mb-0">
								<i className="mdi mdi-account-group me-1"></i>
								<b>{task.teamSize}</b> People
							</p>
						</div>
					);
				})}
				<div className="text-center">
					<i className="mdi mdi-dots-circle mdi-spin font-20 text-muted"></i>
				</div>
			</SimplebarReactClient>
		</Card>
	);
};

export default DailyTasks;
