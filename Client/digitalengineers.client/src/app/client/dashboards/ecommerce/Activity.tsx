import { Card, CardBody } from 'react-bootstrap';
import {Link} from "react-router";

import CardTitle from '@/components/CardTitle';
import Timeline from '@/components/Timeline';
import TimelineItem from '@/components/TimelineItem';
import SimplebarReactClient from '@/components/wrappers/SimplebarReactClient';

const Activity = () => {
	return (
		<Card>
				<CardTitle
					containerClass="d-flex card-header justify-content-between align-items-center"
					title="Recent Activity"
					menuItems={[{ label: 'Sales Report' }, { label: 'Export Report' }, { label: 'Profit' }, { label: 'Action' }]}
				/>
			<SimplebarReactClient style={{ maxHeight: '432px', width: '100%' }}>
				<CardBody className="py-0">
					<Timeline>
						<TimelineItem>
							<i className="mdi mdi-upload bg-info-lighten text-info timeline-icon"></i>
							<div className="timeline-item-info">
								<Link to="" className="text-info fw-bold mb-1 d-block">
									You sold an item
								</Link>
								<small>Paul Burgess just purchased “Hyper - Admin Dashboard”!</small>
								<p className="mb-0 pb-2">
									<small className="text-muted">5 minutes ago</small>
								</p>
							</div>
						</TimelineItem>

						<TimelineItem>
							<i className="mdi mdi-airplane bg-primary-lighten text-primary timeline-icon"></i>
							<div className="timeline-item-info">
								<Link to="" className="text-primary fw-bold mb-1 d-block">
									Product on the Bootstrap Market
								</Link>
								<small>
									Dave Gamache added
									<span className="fw-bold">Admin Dashboard</span>
								</small>
								<p className="mb-0 pb-2">
									<small className="text-muted">30 minutes ago</small>
								</p>
							</div>
						</TimelineItem>

						<TimelineItem>
							<i className="mdi mdi-microphone bg-info-lighten text-info timeline-icon"></i>
							<div className="timeline-item-info">
								<Link to="" className="text-info fw-bold mb-1 d-block">
									Robert Delaney
								</Link>
								<small>
									Send you message
									<span className="fw-bold">&quot;Are you there?&quot;</span>
								</small>
								<p className="mb-0 pb-2">
									<small className="text-muted">2 hours ago</small>
								</p>
							</div>
						</TimelineItem>

						<TimelineItem>
							<i className="mdi mdi-upload bg-primary-lighten text-primary timeline-icon"></i>
							<div className="timeline-item-info">
								<Link to="" className="text-primary fw-bold mb-1 d-block">
									Audrey Tobey
								</Link>
								<small>
									Uploaded a photo <span className="fw-bold">&quot;Error.jpg&quot;</span>
								</small>
								<p className="mb-0 pb-2">
									<small className="text-muted">14 hours ago</small>
								</p>
							</div>
						</TimelineItem>
						<TimelineItem>
							<i className="mdi mdi-airplane bg-primary-lighten text-primary timeline-icon"></i>
							<div className="timeline-item-info">
								<Link to="" className="text-primary fw-bold mb-1 d-block">
									Product on the Bootstrap Market
								</Link>
								<small>
									Dave Gamache added
									<span className="fw-bold">Admin Dashboard</span>
								</small>
								<p className="mb-0 pb-2">
									<small className="text-muted">30 minutes ago</small>
								</p>
							</div>
						</TimelineItem>

						<TimelineItem>
							<i className="mdi mdi-microphone bg-info-lighten text-info timeline-icon"></i>
							<div className="timeline-item-info">
								<Link to="" className="text-info fw-bold mb-1 d-block">
									Robert Delaney
								</Link>
								<small>
									Send you message
									<span className="fw-bold">&quot;Are you there?&quot;</span>
								</small>
								<p className="mb-0 pb-2">
									<small className="text-muted">2 hours ago</small>
								</p>
							</div>
						</TimelineItem>

						<TimelineItem>
							<i className="mdi mdi-upload bg-primary-lighten text-primary timeline-icon"></i>
							<div className="timeline-item-info">
								<Link to="" className="text-primary fw-bold mb-1 d-block">
									Audrey Tobey
								</Link>
								<small>
									Uploaded a photo <span className="fw-bold">&quot;Error.jpg&quot;</span>
								</small>
								<p className="mb-0 pb-2">
									<small className="text-muted">14 hours ago</small>
								</p>
							</div>
						</TimelineItem>
					</Timeline>
				</CardBody>
			</SimplebarReactClient>
		</Card>
	);
};

export default Activity;
