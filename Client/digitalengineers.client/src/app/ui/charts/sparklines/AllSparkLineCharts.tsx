
import { Card, Col, Row } from 'react-bootstrap';
import { Sparklines, SparklinesBars, SparklinesLine } from 'react-sparklines';

const AllSparkLineCharts = () => {
	return (
		<Row>
			<Col md={6} xxl={4}>
				<Card>
					<Card.Body>
						<h4 className="header-title">Line Charts</h4>
						<div className="mt-4" dir="ltr">
							<Sparklines data={[25, 23, 26, 24, 25, 32, 30, 24, 19]} height={50} width={160} limit={7} margin={5}>
								<SparklinesLine color="#727cf5" />
							</Sparklines>
						</div>
					</Card.Body>
				</Card>
			</Col>
			<Col md={6} xxl={4}>
				<Card>
					<Card.Body>
						<h4 className="header-title">Bar Chart</h4>
						<div className="mt-4" dir="ltr">
							<Sparklines data={[3, 6, 7, 8, 6, 4, 7, 10, 12, 7, 4, 9, 12, 13, 11, 12]} height={50} width={160}>
								<SparklinesBars style={{ fill: '#727cf5' }} barWidth={3} />
							</Sparklines>
							<div id="sparkline2" className="text-center" data-colors="#39afd1" />
						</div>
					</Card.Body>
				</Card>
			</Col>
			<Col md={6} xxl={4}>
				<Card>
					<Card.Body>
						<h4 className="header-title">Custom Line Chart</h4>
						<div className="mt-4" dir="ltr">
							<Sparklines data={[0, 23, 43, 35, 44, 45, 56, 37, 4]} height={50} width={160}>
								<SparklinesLine color="#0acf97" />
							</Sparklines>
							<div id="sparkline4" className="text-center" data-colors="#ffbc00,#4eb7eb" />
						</div>
					</Card.Body>
				</Card>
			</Col>
			<Col md={6} xxl={4}>
				<Card>
					<Card.Body>
						<h4 className="header-title">Composite bar Chart</h4>
						<div className="text-center mt-4" dir="ltr">
							<Sparklines data={[3, 6, 7, 8, 6, 4, 7, 10, 12, 7, 4, 9, 12, 13, 11, 12]} height={50} width={160}>
								<SparklinesLine color="#e3eaef" />
								<SparklinesBars style={{ fill: '#6c757d' }} barWidth={3} />
							</Sparklines>
							<div id="sparkline6" className="text-center" />
						</div>
					</Card.Body>
				</Card>
			</Col>
		</Row>
	);
};

export default AllSparkLineCharts;
