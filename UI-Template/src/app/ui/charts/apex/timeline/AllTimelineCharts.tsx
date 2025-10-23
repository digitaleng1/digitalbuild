
import { Card, Col, Row } from 'react-bootstrap';
import ReactApexChart from 'react-apexcharts';
import { BasicTimelineOps, DistributedTimelineOps, MultiSeriesTimelineOpt, AdvancedTimelineOpt, GroupRowsTimelineOpt } from './data';
const AllTimelineCharts = () => {
	return (
		<>
			<Row>
				<Col xl={6}>
					<Card>
						<Card.Body>
							<h4 className="header-title mb-3">Basic Timeline</h4>
							<div dir="ltr">
								<ReactApexChart className="apex-charts" options={BasicTimelineOps} height={350} series={BasicTimelineOps.series} type="rangeBar" />
							</div>
						</Card.Body>
					</Card>
				</Col>

				<Col xl={6}>
					<Card>
						<Card.Body>
							<h4 className="header-title mb-3">Distributed Timeline </h4>
							<div dir="ltr">
								<ReactApexChart
									className="apex-charts"
									options={DistributedTimelineOps}
									height={350}
									series={DistributedTimelineOps.series}
									type="rangeBar"
								/>
							</div>
						</Card.Body>
					</Card>
				</Col>
			</Row>

			<Row>
				<Col xl={6}>
					<Card>
						<Card.Body>
							<h4 className="header-title mb-3">Multi Series Timeline</h4>
							<div dir="ltr">
								<ReactApexChart
									className="apex-charts"
									options={MultiSeriesTimelineOpt}
									height={350}
									series={MultiSeriesTimelineOpt.series}
									type="rangeBar"
								/>
							</div>
						</Card.Body>
					</Card>
				</Col>

				<Col xl={6}>
					<Card>
						<Card.Body>
							<h4 className="header-title mb-3">Advanced Timeline</h4>
							<div dir="ltr">
								<ReactApexChart
									className="apex-charts"
									options={AdvancedTimelineOpt}
									height={350}
									series={AdvancedTimelineOpt.series}
									type="rangeBar"
								/>
							</div>
						</Card.Body>
					</Card>
				</Col>
			</Row>

			<Row>
				<Col xl={6}>
					<Card>
						<Card.Body>
							<h4 className="header-title mb-3">Multiple Series - Group Rows</h4>
							<div dir="ltr">
								<ReactApexChart
									className="apex-charts"
									options={GroupRowsTimelineOpt}
									height={350}
									series={GroupRowsTimelineOpt.series}
									type="rangeBar"
								/>
							</div>
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</>
	);
};

export default AllTimelineCharts;
