
import { Card, Col, Row } from 'react-bootstrap';
import ReactApexChart from 'react-apexcharts';
import { SimplePieOpt, SimpleDonutOpt, MonochromePieOpt, GradientDonutOpt, PatternedDonutOpt, ImagefillOpt } from './data';
import DonutUpdateChart from './DonutUpdateChart';

const AllPieCharts = () => {
	return (
		<>
			<Row>
				<Col xl={6}>
					<Card>
						<Card.Body>
							<h4 className="header-title">Simple Pie Chart</h4>
							<div dir="ltr">
								<ReactApexChart className="apex-charts" options={SimplePieOpt} height={320} series={SimplePieOpt.series} type="pie" />
							</div>
						</Card.Body>
					</Card>
				</Col>

				<Col xl={6}>
					<Card>
						<Card.Body>
							<h4 className="header-title">Simple Donut Chart</h4>
							<div dir="ltr">
								<ReactApexChart className="apex-charts" options={SimpleDonutOpt} height={320} series={SimpleDonutOpt.series} type="donut" />
							</div>
						</Card.Body>
					</Card>
				</Col>
			</Row>

			<Row>
				<Col xl={6}>
					<Card>
						<Card.Body>
							<h4 className="header-title mb-4">Monochrome Pie Chart</h4>
							<div dir="ltr">
								<ReactApexChart className="apex-charts" options={MonochromePieOpt} height={320} series={MonochromePieOpt.series} type="pie" />
							</div>
						</Card.Body>
					</Card>
				</Col>

				<Col xl={6}>
					<Card>
						<Card.Body>
							<h4 className="header-title mb-4">Gradient Donut Chart</h4>
							<div dir="ltr">
								<ReactApexChart className="apex-charts" options={GradientDonutOpt} height={320} series={GradientDonutOpt.series} type="donut" />
							</div>
						</Card.Body>
					</Card>
				</Col>
			</Row>

			<Row>
				<Col xl={6}>
					<Card>
						<Card.Body>
							<h4 className="header-title mb-4">Patterned Donut Chart</h4>
							<div dir="ltr">
								<ReactApexChart className="apex-charts" options={PatternedDonutOpt} height={320} series={PatternedDonutOpt.series} type="donut" />
							</div>
						</Card.Body>
					</Card>
				</Col>

				<Col xl={6}>
					<Card>
						<Card.Body>
							<h4 className="header-title mb-4">Pie Chart with Image fill</h4>
							<div dir="ltr">
								<ReactApexChart className="apex-charts" options={ImagefillOpt} height={320} series={ImagefillOpt.series} type="pie" />
							</div>
						</Card.Body>
					</Card>
				</Col>
			</Row>

			<Row>
				<Col xl={6}>
					<Card>
						<Card.Body>
							<h4 className="header-title mb-4">Donut Update</h4>
							<DonutUpdateChart />
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</>
	);
};

export default AllPieCharts;
