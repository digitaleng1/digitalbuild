
import { Card, Col, Row } from 'react-bootstrap';
import { SimpleBubbleChartOps, SecondBubbleChartOps } from './data';
import ReactApexChart from 'react-apexcharts';

const AllBubbleCharts = () => {
	return (
		<Row>
			<Col xl={6}>
				<Card>
					<Card.Body>
						<h4 className="header-title">Simple Bubble Chart</h4>
						<div dir="ltr">
							<ReactApexChart
								className="apex-charts"
								options={SimpleBubbleChartOps}
								height={380}
								series={SimpleBubbleChartOps.series}
								type="bubble"
							/>
						</div>
					</Card.Body>
				</Card>
			</Col>

			<Col xl={6}>
				<Card>
					<Card.Body>
						<h4 className="header-title">3D Bubble Chart</h4>
						<div dir="ltr">
							<ReactApexChart
								className="apex-charts"
								options={SecondBubbleChartOps}
								height={380}
								series={SecondBubbleChartOps.series}
								type="bubble"
							/>
						</div>
					</Card.Body>
				</Card>
			</Col>
		</Row>
	);
};

export default AllBubbleCharts;
