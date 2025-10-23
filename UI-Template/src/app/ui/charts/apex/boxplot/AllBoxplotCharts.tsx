
import { Card, CardBody, Col, Row } from 'react-bootstrap';
import ReactApexChart from 'react-apexcharts';
import { BasicBoxplotOps, ScatterBoxplotOps, HorizontalBoxPlotOps } from './data';

const AllBoxPlotCharts = () => {
	return (
		<>
			<Row>
				<Col xl={6}>
					<Card>
						<CardBody>
							<h4 className="header-title mb-4">Basic Boxplot</h4>
							<div dir="ltr">
								<ReactApexChart className="apex-charts" options={BasicBoxplotOps} height={350} series={BasicBoxplotOps.series} type="boxPlot" />
							</div>
						</CardBody>
					</Card>
				</Col>

				<Col xl={6}>
					<Card>
						<CardBody>
							<h4 className="header-title mb-4">Scatter Boxplot </h4>
							<div dir="ltr">
								<ReactApexChart className="apex-charts" options={ScatterBoxplotOps} height={350} series={ScatterBoxplotOps.series} type="boxPlot" />
							</div>
						</CardBody>
					</Card>
				</Col>
			</Row>

			<Row>
				<Col xl={6}>
					<Card>
						<CardBody>
							<h4 className="header-title mb-4">Horizontal BoxPlot</h4>
							<div dir="ltr">
								<ReactApexChart
									className="apex-charts"
									options={HorizontalBoxPlotOps}
									height={350}
									series={HorizontalBoxPlotOps.series}
									type="boxPlot"
								/>
							</div>
						</CardBody>
					</Card>
				</Col>
			</Row>
		</>
	);
};

export default AllBoxPlotCharts;
