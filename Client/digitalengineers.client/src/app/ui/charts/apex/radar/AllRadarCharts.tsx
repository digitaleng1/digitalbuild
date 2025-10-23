
import ReactApexChart from 'react-apexcharts';
import { Card, Col, Row } from 'react-bootstrap';
import { BasicRadarOpt, PolygonFillOpt } from './data';

import RadarMultiSeries from './RadarMultiSeries';
const AllRadarCharts = () => {
	return (
		<>
			<Row>
				<Col xl={6}>
					<Card>
						<Card.Body>
							<h4 className="header-title mb-3">Basic Radar Chart</h4>
							<div dir="ltr">
								<ReactApexChart className="apex-charts" options={BasicRadarOpt} height={350} series={BasicRadarOpt.series} type="radar" />
							</div>
						</Card.Body>
					</Card>
				</Col>

				<Col xl={6}>
					<Card>
						<Card.Body>
							<h4 className="header-title mb-3">Radar with Polygon-fill</h4>
							<div dir="ltr">
								<ReactApexChart className="apex-charts" options={PolygonFillOpt} height={350} series={PolygonFillOpt.series} type="radar" />
							</div>
						</Card.Body>
					</Card>
				</Col>
			</Row>

			<Row>
				<Col xl={6}>
					<Card>
						<Card.Body>
							<h4 className="header-title mb-3">Radar – Multiple Series</h4>
							<RadarMultiSeries />
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</>
	);
};

export default AllRadarCharts;
