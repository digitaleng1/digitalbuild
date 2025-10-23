
import { Card, Col, Row } from 'react-bootstrap';
import Chart, { type ChartItem } from 'chart.js/auto';
import { useEffect } from 'react';
import { interpolationConfig, lineConfig, multiAxesConfig, pointStylingConfig, lineSegmentConfig, steppedConfig } from './data';

const AllLineCharts = () => {
	useEffect(() => {
		const interpolationTag = document.getElementById('interpolation-example') as ChartItem;
		const interpolationChart = new Chart(interpolationTag, interpolationConfig);

		const lineTag = document.getElementById('line-example') as ChartItem;
		const lineChart = new Chart(lineTag, lineConfig);

		const multiAxesTag = document.getElementById('multi-axes-example') as ChartItem;
		const multiAxesChart = new Chart(multiAxesTag, multiAxesConfig);

		const pointStylingTag = document.getElementById('point-styling-example') as ChartItem;
		const pointStylingChart = new Chart(pointStylingTag, pointStylingConfig);

		const lineSegmentTag = document.getElementById('line-segment-example') as ChartItem;
		const lineSegmentChart = new Chart(lineSegmentTag, lineSegmentConfig);

		const steppedTag = document.getElementById('stepped-example') as ChartItem;
		const steppedChart = new Chart(steppedTag, steppedConfig);

		return () => {
			interpolationChart.destroy();
			lineChart.destroy();
			multiAxesChart.destroy();
			pointStylingChart.destroy();
			lineSegmentChart.destroy();
			steppedChart.destroy();
		};
	}, []);
	return (
		<>
			<Row>
				<Col xl={6}>
					<Card>
						<Card.Body>
							<h4 className="header-title mb-4">Interpolation</h4>
							<div dir="ltr">
								<div className="mt-3 chartjs-chart" style={{ height: 320 }}>
									<canvas id="interpolation-example" data-colors="#727cf5,#0acf97" />
								</div>
							</div>
						</Card.Body>
					</Card>
				</Col>
				<Col xl={6}>
					<Card>
						<Card.Body>
							<h4 className="header-title mb-4">Line</h4>
							<div dir="ltr">
								<div className="mt-3 chartjs-chart" style={{ height: 320 }}>
									<canvas id="line-example" data-colors="#727cf5,#0acf97" />
								</div>
							</div>
						</Card.Body>
					</Card>
				</Col>
			</Row>

			<Row>
				<Col xl={6}>
					<Card>
						<Card.Body>
							<h4 className="header-title mb-4">Multi-Axes</h4>
							<div dir="ltr">
								<div className="mt-3 chartjs-chart" style={{ height: 320 }}>
									<canvas id="multi-axes-example" data-colors="#727cf5,#0acf97" />
								</div>
							</div>
						</Card.Body>
					</Card>
				</Col>
				<Col xl={6}>
					<Card>
						<Card.Body>
							<h4 className="header-title mb-4">Point Styling</h4>
							<div dir="ltr">
								<div className="mt-3 chartjs-chart" style={{ height: 320 }}>
									<canvas id="point-styling-example" data-colors="#727cf5,#0acf97" />
								</div>
							</div>
						</Card.Body>
					</Card>
				</Col>
			</Row>

			<Row>
				<Col xl={6}>
					<Card>
						<Card.Body>
							<h4 className="header-title mb-4">Line Segment</h4>
							<div dir="ltr">
								<div className="mt-3 chartjs-chart" style={{ height: 320 }}>
									<canvas id="line-segment-example" data-colors="#727cf5,#0acf97" />
								</div>
							</div>
						</Card.Body>
					</Card>
				</Col>
				<Col xl={6}>
					<Card>
						<Card.Body>
							<h4 className="header-title mb-4">Stepped</h4>
							<div dir="ltr">
								<div className="mt-3 chartjs-chart" style={{ height: 320 }}>
									<canvas id="stepped-example" data-colors="#727cf5,#0acf97" />
								</div>
							</div>
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</>
	);
};

export default AllLineCharts;
