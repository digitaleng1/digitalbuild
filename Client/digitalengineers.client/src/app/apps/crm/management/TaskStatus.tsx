import { Card, CardBody, ProgressBar } from 'react-bootstrap';
import classNames from 'classnames';
import type { Task } from './types';
import CardTitle from '@/components/CardTitle';

type TaskStatusProps = {
	tasks: Array<Task>;
};

const TaskStatus = ({ tasks }: TaskStatusProps) => {
	return (
		<Card>
			<CardBody>
				<CardTitle
					containerClass="d-flex align-items-center justify-content-between mb-3"
					title="Task Status"
					menuItems={[{ label: 'Today' }, { label: 'Yesterday' }, { label: 'Last Week' }, { label: 'Last Month' }]}
				/>
				{(tasks || []).map((task, index) => {
					return (
						<div className={classNames({ 'mb-4': index < tasks.length - 1 })} key={index.toString()}>
							<div className="d-flex align-items-center mb-2">
								<div className="flex-shrink-0">
									<i className={classNames(task.icon, 'widget-icon', 'bg-' + task.variant + '-lighten', 'text-' + task.variant)} />
								</div>
								<div className="flex-grow-1 ms-2">
									<h5 className="my-0 fw-semibold">{task.title}</h5>
								</div>
								{task.completedTask ? (
									<h5 className="my-0">
										{task.completedTask}/{task.totalTask}
									</h5>
								) : (
									<h5 className="my-0">{task.progressValue}%</h5>
								)}
							</div>
							<ProgressBar variant={task.variant} now={task.progressValue} style={{ height: 6 }} />
						</div>
					);
				})}
			</CardBody>
		</Card>
	);
};

export default TaskStatus;
