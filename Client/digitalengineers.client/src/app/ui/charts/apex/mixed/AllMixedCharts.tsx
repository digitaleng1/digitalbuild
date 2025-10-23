
import { Card, Col, Row } from 'react-bootstrap';
import ReactApexChart from 'react-apexcharts';
import { lineAreaChartOpts, lineColumnAreaChartOpts, lineColumnChartOpts, multipleYAxisChartOpts } from './data';
const AllMixedCharts = () => {
	return (
		<>
			<Row>
				<Col xl={6}>
					<Card>
						<Card.Body>
							<h4 className="header-title">Line &amp; Column Chart</h4>
							<div dir="ltr">
								<ReactApexChart className="apex-charts" options={lineColumnChartOpts} height={380} series={lineColumnChartOpts.series} type="line" />
							</div>
						</Card.Body>
					</Card>
				</Col>

				<Col xl={6}>
					<Card>
						<Card.Body>
							<h4 className="header-title">Multiple Y-Axis Chart</h4>
							<div dir="ltr">
								<ReactApexChart
									className="apex-charts"
									options={multipleYAxisChartOpts}
									height={380}
									series={multipleYAxisChartOpts.series}
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
							<h4 className="header-title">Line &amp; Area Chart</h4>
							<div dir="ltr">
								<ReactApexChart className="apex-charts" options={lineAreaChartOpts} height={380} series={lineAreaChartOpts.series} type="line" />
							</div>
						</Card.Body>
					</Card>
				</Col>

				<Col xl={6}>
					<Card>
						<Card.Body>
							<h4 className="header-title">Line, Column &amp; Area Chart</h4>
							<div dir="ltr">
								<ReactApexChart
									className="apex-charts"
									options={lineColumnAreaChartOpts}
									height={380}
									series={lineColumnAreaChartOpts.series}
									type="line"
								/>
							</div>
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</>
	);
};

export default AllMixedCharts;
