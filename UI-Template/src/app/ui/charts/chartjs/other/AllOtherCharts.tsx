
import { Card, Col, Row } from 'react-bootstrap';
import Chart, { type ChartItem } from 'chart.js/auto';
import { useEffect } from 'react';
import { bubbleConfig, donutConfig, pieConfig, polarAreaConfig, radarConfig, scatterConfig, barLineConfig } from './data';

const AllOtherCharts = () => {
	useEffect(() => {
		const bubbleTag = document.getElementById('bubble-example') as ChartItem;
		const bubbleChart = new Chart(bubbleTag, bubbleConfig);

		const donutTag = document.getElementById('donut-example') as ChartItem;
		const donutChart = new Chart(donutTag, donutConfig);

		const pieTag = document.getElementById('pie-example') as ChartItem;
		const pieChart = new Chart(pieTag, pieConfig);

		const polarAreaTag = document.getElementById('polar-area-example') as ChartItem;
		const polarAreaChart = new Chart(polarAreaTag, polarAreaConfig);

		const radarTag = document.getElementById('radar-example') as ChartItem;
		const radarChart = new Chart(radarTag, radarConfig);

		const scatterTag = document.getElementById('scatter-example') as ChartItem;
		const scatterChart = new Chart(scatterTag, scatterConfig);

		const barLineTag = document.getElementById('bar-line-example') as ChartItem;
		const barLine = new Chart(barLineTag, barLineConfig);

		return () => {
			bubbleChart.destroy();
			donutChart.destroy();
			pieChart.destroy();
			polarAreaChart.destroy();
			radarChart.destroy();
			scatterChart.destroy();
			barLine.destroy();
		};
	}, []);
	return (
		<>
			<Row>
				<Col xl={6}>
					<Card>
						<Card.Body>
							<h4 className="header-title mb-4">Bubble</h4>
							<div dir="ltr">
								<div className="mt-3 chartjs-chart" style={{ height: 320 }}>
									<canvas id="bubble-example" data-colors="#727cf5,#0acf97" />
								</div>
							</div>
						</Card.Body>
					</Card>
				</Col>
				<Col xl={6}>
					<Card>
						<Card.Body>
							<h4 className="header-title mb-4">DONUT</h4>
							<div dir="ltr">
								<div className="mt-3 chartjs-chart" style={{ height: 320 }}>
									<canvas id="donut-example" data-colors="#727cf5,#fa5c7c,#0acf97,#ebeff2" />
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
							<h4 className="header-title mb-4">Pie</h4>
							<div dir="ltr">
								<div className="mt-3 chartjs-chart" style={{ height: 320 }}>
									<canvas id="pie-example" data-colors="#727cf5,#fa5c7c,#0acf97,#ebeff2, #f56f36" />
								</div>
							</div>
						</Card.Body>
					</Card>
				</Col>
				<Col xl={6}>
					<Card>
						<Card.Body>
							<h4 className="header-title mb-4">Polar Area</h4>
							<div dir="ltr">
								<div className="mt-3 chartjs-chart" style={{ height: 320 }}>
									<canvas id="polar-area-example" data-colors="#727cf5,#fa5c7c,#0acf97,#ebeff2, #f56f36" />
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
							<h4 className="header-title mb-4">Radar</h4>
							<div dir="ltr">
								<div className="mt-3 chartjs-chart" style={{ height: 320 }}>
									<canvas id="radar-example" data-colors="#727cf5,#0acf97" />
								</div>
							</div>
						</Card.Body>
					</Card>
				</Col>
				<Col xl={6}>
					<Card>
						<Card.Body>
							<h4 className="header-title mb-4">Scatter</h4>
							<div dir="ltr">
								<div className="mt-3 chartjs-chart" style={{ height: 320 }}>
									<canvas id="scatter-example" data-colors="#727cf5,#0acf97" />
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
							<h4 className="header-title mb-4">Stacked Bar/Line</h4>
							<div dir="ltr">
								<div className="mt-3 chartjs-chart" style={{ height: 320 }}>
									<canvas id="bar-line-example" data-colors="#727cf5,#0acf97" />
								</div>
							</div>
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</>
	);
};

export default AllOtherCharts;
