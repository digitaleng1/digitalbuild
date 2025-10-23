
import ReactApexChart from 'react-apexcharts';
import { Card, CardBody, Col, Row } from 'react-bootstrap';

// data
import { AreaApexOpt, AreaNullValueOps, IrregularTimeSeriesOps, NavigateAreaApexOpt, SpilineAreaApexOpt, StackedAreaOpt } from './data';

const AllAreaCharts = () => {
	return (
		<>
			<Row>
				<Col xl={6}>
					<Card>
						<CardBody>
							<h4 className="header-title mb-4">Basic Area Chart</h4>
							<div dir="ltr">
								<ReactApexChart className="apex-charts" options={AreaApexOpt} height={380} series={AreaApexOpt.series} type="area" />
							</div>
						</CardBody>
					</Card>
				</Col>
				<Col xl={6}>
					<Card>
						<CardBody>
							<h4 className="header-title mb-4">Spline Area</h4>
							<div dir="ltr">
								<ReactApexChart className="apex-charts" options={SpilineAreaApexOpt} height={380} series={SpilineAreaApexOpt.series} type="area" />
							</div>
						</CardBody>
					</Card>
				</Col>
			</Row>

			<Row>
				<Col xl={6}>
					<Card>
						<CardBody>
							<h4 className="header-title mb-4">Area with Negative Values</h4>
							<div dir="ltr">
								<ReactApexChart className="apex-charts" options={NavigateAreaApexOpt} height={350} series={NavigateAreaApexOpt.series} type="area" />
							</div>
						</CardBody>
					</Card>
				</Col>
				<Col xl={6}>
					<Card>
						<CardBody>
							<h4 className="header-title mb-4">Stacked Area</h4>
							<div dir="ltr">
								<ReactApexChart
									id="stacked-area"
									className="apex-charts"
									options={StackedAreaOpt}
									height={380}
									series={StackedAreaOpt.series}
									type="area"
								/>
							</div>
						</CardBody>
					</Card>
				</Col>
			</Row>

			<Row>
				<Col xl={6}>
					<Card>
						<CardBody>
							<h4 className="header-title mb-4">Irregular TimeSeries</h4>
							<div dir="ltr">
								<ReactApexChart
									id="area-timeSeries"
									className="apex-charts"
									options={IrregularTimeSeriesOps}
									height={380}
									series={IrregularTimeSeriesOps.series}
									type="area"
								/>
							</div>
						</CardBody>
					</Card>
				</Col>
				<Col xl={6}>
					<Card>
						<CardBody>
							<h4 className="header-title mb-4">Area Chart with Null values</h4>
							<div dir="ltr">
								<ReactApexChart
									id="area-chart-nullvalues"
									className="apex-charts"
									options={AreaNullValueOps}
									height={380}
									series={AreaNullValueOps.series}
									type="area"
								/>
							</div>
						</CardBody>
					</Card>
				</Col>
			</Row>
		</>
	);
};

export default AllAreaCharts;
