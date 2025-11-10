import { Row, Col, Card, CardBody } from 'react-bootstrap';
import CardTitle from '@/components/CardTitle';
import type { SpecialistStats } from '@/types/specialist';

interface StatsCardProps {
	stats?: SpecialistStats;
}

const StatsCard = ({ stats }: StatsCardProps) => {
	if (!stats) return null;

	return (
		<>
			<Row>
				<Col sm={6} lg={6}>
					<Card className="widget-flat">
						<CardBody>
							<div className="float-end">
								<i className="mdi mdi-briefcase-check widget-icon bg-success-lighten text-success"></i>
							</div>
							<h5 className="text-muted fw-normal mt-0" title="Completed Projects">
								Completed Projects
							</h5>
							<h3 className="mt-3 mb-0">{stats.completedProjects}</h3>
						</CardBody>
					</Card>
				</Col>

				<Col sm={6} lg={6}>
					<Card className="widget-flat">
						<CardBody>
							<div className="float-end">
								<i className="mdi mdi-star widget-icon bg-warning-lighten text-warning"></i>
							</div>
							<h5 className="text-muted fw-normal mt-0" title="Average Rating">
								Average Rating
							</h5>
							<h3 className="mt-3 mb-0">
								{stats.averageRating.toFixed(1)}
								<small className="text-muted"> ({stats.totalReviews} reviews)</small>
							</h3>
						</CardBody>
					</Card>
				</Col>
			</Row>

			<Row>
				<Col sm={6} lg={6}>
					<Card className="widget-flat">
						<CardBody>
							<div className="float-end">
								<i className="mdi mdi-certificate widget-icon bg-info-lighten text-info"></i>
							</div>
							<h5 className="text-muted fw-normal mt-0" title="Experience">
								Years of Experience
							</h5>
							<h3 className="mt-3 mb-0">{stats.yearsOfExperience}</h3>
						</CardBody>
					</Card>
				</Col>

				<Col sm={6} lg={6}>
					<Card className="widget-flat">
						<CardBody>
							<div className="float-end">
								<i className="mdi mdi-currency-usd widget-icon bg-primary-lighten text-primary"></i>
							</div>
							<h5 className="text-muted fw-normal mt-0" title="Hourly Rate">
								Hourly Rate
							</h5>
							<h3 className="mt-3 mb-0">
								{stats.hourlyRate ? `$${stats.hourlyRate}/hr` : 'Not set'}
							</h3>
						</CardBody>
					</Card>
				</Col>
			</Row>
		</>
	);
};

export default StatsCard;
