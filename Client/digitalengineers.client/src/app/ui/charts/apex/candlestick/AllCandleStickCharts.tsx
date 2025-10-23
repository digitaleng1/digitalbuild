
import ReactApexChart from 'react-apexcharts';
import { Card, Col, Row } from 'react-bootstrap';
import { CandlestickwithLineOps, CategoryXAxisOps, SimpleCandlestickOps } from './data';

const AllCandleStickCharts = () => {
	return (
		<>
			<Row>
				<Col xl={6}>
					<Card>
						<Card.Body>
							<h4 className="header-title">Simple Candlestick Chart</h4>
							<div dir="ltr">
								<ReactApexChart
									className="apex-charts"
									options={SimpleCandlestickOps}
									height={400}
									series={SimpleCandlestickOps.series}
									type="candlestick"
								/>
							</div>
						</Card.Body>
					</Card>
				</Col>
				<Col xl={6}>
					<Card>
						<Card.Body>
							<h4 className="header-title mb-3">Category X-Axis</h4>
							<div dir="ltr">
								<ReactApexChart className="apex-charts" options={CategoryXAxisOps} height={380} series={CategoryXAxisOps.series} type="candlestick" />
							</div>
						</Card.Body>
					</Card>
				</Col>
			</Row>

			<Row>
				<Col xl={6}>
					<Card>
						<Card.Body>
							<h4 className="header-title mb-3">Candlestick with Line</h4>
							<div dir="ltr">
								<ReactApexChart
									className="apex-charts"
									options={CandlestickwithLineOps}
									height={380}
									series={CandlestickwithLineOps.series}
									type="candlestick"
								/>
							</div>
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</>
	);
};

export default AllCandleStickCharts;
