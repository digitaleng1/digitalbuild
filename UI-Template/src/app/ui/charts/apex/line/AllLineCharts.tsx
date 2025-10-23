
import { Card, Col, Row } from 'react-bootstrap';
import {
	BrushChartOps,
	BrushChartOps2,
	DashedLineChartOps,
	GradientLineChartOps,
	lineChartOpts,
	LineChartwithAnnotationOps,
	LineWithDataLabelOps,
	MissingChartOps,
	SteplineChartOps,
	SyncingChartOps,
	SyncingChartOps2,
	ZoomableTimeseriesOps,
} from './data';

import ReactApexChart from 'react-apexcharts';

const AllLineCharts = () => {
	return (
		<>
			<Row>
				<Col xl={6}>
					<Card>
						<Card.Body>
							<h4 className="header-title mb-4">Simple line chart</h4>
							<div dir="ltr">
								<ReactApexChart className="apex-charts" options={lineChartOpts} height={380} series={lineChartOpts.series} type="line" />
							</div>
						</Card.Body>
					</Card>
				</Col>

				<Col xl={6}>
					<Card>
						<Card.Body>
							<h4 className="header-title mb-4">Line with Data Labels</h4>
							<div dir="ltr">
								<ReactApexChart
									className="apex-charts"
									options={LineWithDataLabelOps}
									height={380}
									series={LineWithDataLabelOps.series}
									type="line"
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
							<h4 className="header-title mb-4">Zoomable Timeseries</h4>
							<div dir="ltr">
								<ReactApexChart
									className="apex-charts"
									options={ZoomableTimeseriesOps}
									height={380}
									series={ZoomableTimeseriesOps.series}
									type="line"
								/>
							</div>
						</Card.Body>
					</Card>
				</Col>

				<Col xl={6}>
					<Card>
						<Card.Body>
							<h4 className="header-title mb-4">Line Chart with Annotations</h4>
							<div dir="ltr">
								<ReactApexChart
									className="apex-charts"
									options={LineChartwithAnnotationOps}
									height={380}
									series={LineChartwithAnnotationOps.series}
									type="line"
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
							<h4 className="header-title mb-4">Syncing charts</h4>
							<ReactApexChart className="apex-charts" options={SyncingChartOps} height={200} series={SyncingChartOps.series} type="line" />
							<div dir="ltr">
								<ReactApexChart className="apex-charts" options={SyncingChartOps2} height={200} series={SyncingChartOps2.series} type="line" />
							</div>
						</Card.Body>
					</Card>
				</Col>

				<Col xl={6}>
					<Card>
						<Card.Body>
							<h4 className="header-title mb-4">Gradient Line Chart</h4>
							<div dir="ltr">
								<ReactApexChart
									className="apex-charts"
									options={GradientLineChartOps}
									height={374}
									series={GradientLineChartOps.series}
									type="line"
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
							<h4 className="header-title mb-4">Missing / Null values</h4>
							<div dir="ltr">
								<ReactApexChart className="apex-charts" options={MissingChartOps} height={380} series={MissingChartOps.series} type="line" />
							</div>
						</Card.Body>
					</Card>
				</Col>

				<Col xl={6}>
					<Card>
						<Card.Body>
							<h4 className="header-title mb-4">Dashed Line Chart</h4>
							<div dir="ltr">
								<ReactApexChart className="apex-charts" options={DashedLineChartOps} height={380} series={DashedLineChartOps.series} type="line" />
							</div>
						</Card.Body>
					</Card>
				</Col>
			</Row>

			<Row>
				<Col xl={6}>
					<Card>
						<Card.Body>
							<h4 className="header-title mb-3">Stepline Chart</h4>
							<div dir="ltr">
								<ReactApexChart className="apex-charts" options={SteplineChartOps} height={344} series={SteplineChartOps.series} type="line" />
							</div>
						</Card.Body>
					</Card>
				</Col>

				<Col xl={6}>
					<Card>
						<Card.Body>
							<h4 className="header-title">Brush Chart</h4>
							<div dir="ltr">
								<ReactApexChart className="apex-charts" options={BrushChartOps} height={230} series={BrushChartOps.series} type="line" />
								<ReactApexChart className="apex-charts" options={BrushChartOps2} height={130} series={BrushChartOps2.series} type="line" />
							</div>
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</>
	);
};

export default AllLineCharts;
