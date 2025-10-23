
import { Card, Col, Row } from 'react-bootstrap';
import ReactApexChart from 'react-apexcharts';
import { BasicTreemapOpt, MultipleSeriesTreemapOpt, DistributedTreemapOpt, ColorRangeTreemapOpt } from './data';

const AllTreemapCharts = () => {
	return (
		<>
			<Row>
				<Col xl={6}>
					<Card>
						<Card.Body>
							<h4 className="header-title">Basic Treemap</h4>
							<div dir="ltr">
								<ReactApexChart className="apex-charts" options={BasicTreemapOpt} height={350} series={BasicTreemapOpt.series} type="treemap" />
							</div>
						</Card.Body>
					</Card>
				</Col>

				<Col xl={6}>
					<Card>
						<Card.Body>
							<h4 className="header-title">Treemap Multiple Series</h4>
							<div dir="ltr">
								<ReactApexChart
									className="apex-charts"
									options={MultipleSeriesTreemapOpt}
									height={350}
									series={MultipleSeriesTreemapOpt.series}
									type="treemap"
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
							<h4 className="header-title">Distributed Treemap</h4>
							<div dir="ltr">
								<ReactApexChart
									className="apex-charts"
									options={DistributedTreemapOpt}
									height={350}
									series={DistributedTreemapOpt.series}
									type="treemap"
								/>
							</div>
						</Card.Body>
					</Card>
				</Col>

				<Col xl={6}>
					<Card>
						<Card.Body>
							<h4 className="header-title">Color Range Treemap</h4>
							<div dir="ltr">
								<ReactApexChart
									className="apex-charts"
									options={ColorRangeTreemapOpt}
									height={350}
									series={ColorRangeTreemapOpt.series}
									type="treemap"
								/>
							</div>
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</>
	);
};

export default AllTreemapCharts;
