
import { Card, Col, Row } from 'react-bootstrap';
import ReactApexChart from 'react-apexcharts';
import { BasicHeatmapOps, MultipleHeatmapOps, ColorRangeHeatmapOps, RangewithoutShadeOps } from './data';
const AllHeatmapCharts = () => {
	return (
		<>
			<Row>
				<Col xl={6}>
					<Card>
						<Card.Body>
							<h4 className="header-title">Basic Heatmap - Single Series</h4>
							<div dir="ltr">
								<ReactApexChart className="apex-charts" options={BasicHeatmapOps} height={380} series={BasicHeatmapOps.series} type="heatmap" />
							</div>
						</Card.Body>
					</Card>
				</Col>

				<Col xl={6}>
					<Card>
						<Card.Body>
							<h4 className="header-title">Heatmap - Multiple Series</h4>
							<div dir="ltr">
								<ReactApexChart className="apex-charts" options={MultipleHeatmapOps} height={380} series={MultipleHeatmapOps.series} type="heatmap" />
							</div>
						</Card.Body>
					</Card>
				</Col>
			</Row>

			<Row>
				<Col xl={6}>
					<Card>
						<Card.Body>
							<h4 className="header-title mb-3">Heatmap - Color Range</h4>
							<div dir="ltr">
								<ReactApexChart
									className="apex-charts"
									options={ColorRangeHeatmapOps}
									height={380}
									series={ColorRangeHeatmapOps.series}
									type="heatmap"
								/>
							</div>
						</Card.Body>
					</Card>
				</Col>

				<Col xl={6}>
					<Card>
						<Card.Body>
							<h4 className="header-title mb-3">Heatmap - Range without Shades</h4>
							<div dir="ltr">
								<ReactApexChart
									className="apex-charts"
									options={RangewithoutShadeOps}
									height={380}
									series={RangewithoutShadeOps.series}
									type="heatmap"
								/>
							</div>
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</>
	);
};

export default AllHeatmapCharts;
