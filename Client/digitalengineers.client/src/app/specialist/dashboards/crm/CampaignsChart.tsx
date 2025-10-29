
import CardTitle from '@/components/CardTitle';
import type { ApexOptions } from 'apexcharts';
import Chart from 'react-apexcharts';
import { Card, Row, Col } from 'react-bootstrap';

const CampaignsChart = () => {
	const apexBarChartOpts: ApexOptions = {
		grid: {
			padding: {
				left: 0,
				right: 0,
			},
		},
		chart: {
			height: 320,
			type: 'radialBar',
		},
		colors: ['#ffbc00', '#727cf5', '#0acf97'],
		labels: ['Total Sent', 'Reached', 'Opened'],
		plotOptions: {
			radialBar: {
				track: {
					margin: 8,
				},
			},
		},
	};

	const apexBarChartData: number[] = [86, 36, 50];

	return (
		<Card>
				<CardTitle
					containerClass="card-header d-flex justify-content-between align-items-center"
					title="Campaigns"
					menuItems={[{ label: 'Today' }, { label: 'Yesterday' }, { label: 'Last Week' }, { label: 'Last Month' }]}
				/>
			<Card.Body className='pt-0'>

				<Chart options={apexBarChartOpts} series={apexBarChartData} type="radialBar" className="apex-charts" height={315} />

				<Row className="text-center mt-3">
					<Col sm={4}>
						<i className="mdi mdi-send widget-icon rounded-circle bg-warning-lighten text-warning"></i>
						<h3 className="fw-normal mt-3">
							<span>6,510</span>
						</h3>
						<p className="text-muted mb-0 mb-2">
							<i className="mdi mdi-checkbox-blank-circle text-warning"></i> Total Sent
						</p>
					</Col>
					<Col sm={4}>
						<i className="mdi mdi-flag-variant widget-icon rounded-circle bg-primary-lighten text-primary"></i>
						<h3 className="fw-normal mt-3">
							<span>3,487</span>
						</h3>
						<p className="text-muted mb-0 mb-2">
							<i className="mdi mdi-checkbox-blank-circle text-primary"></i> Reached
						</p>
					</Col>
					<Col sm={4}>
						<i className="mdi mdi-email-open widget-icon rounded-circle bg-success-lighten text-success"></i>
						<h3 className="fw-normal mt-3">
							<span>1,568</span>
						</h3>
						<p className="text-muted mb-0 mb-2">
							<i className="mdi mdi-checkbox-blank-circle text-success"></i> Opened
						</p>
					</Col>
				</Row>
			</Card.Body>
		</Card>
	);
};

export default CampaignsChart;
