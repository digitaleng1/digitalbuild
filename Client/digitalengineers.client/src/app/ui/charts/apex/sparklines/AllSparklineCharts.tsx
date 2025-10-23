
import { Card, Col, Row } from 'react-bootstrap';
import ReactApexChart from 'react-apexcharts';

import { spark1Opt, Spark2Opt, Spark3Opt, Chart1Opt, Chart2Opt, Chart3Opt, Chart4Opt, Chart5Opt, Chart6Opt, Chart7Opt, Chart8Opt } from './data';

const AllSparklineCharts = () => {
	return (
		<>
			<Row>
				<Col>
					<Card>
						<Card.Body>
							<Row dir="ltr">
								<Col md={4}>
									<ReactApexChart className="apex-charts" options={spark1Opt} height={160} series={spark1Opt.series} type="area" />
								</Col>
								<Col md={4}>
									<ReactApexChart className="apex-charts" options={Spark2Opt} height={160} series={Spark2Opt.series} type="area" />
								</Col>
								<Col md={4}>
									<ReactApexChart className="apex-charts" options={Spark3Opt} height={160} series={Spark3Opt.series} type="area" />
								</Col>
							</Row>

							<Row className="mt-3">
								<Col>
									<div className="table-responsive">
										<table className="table table-centered mb-0">
											<thead className="table-light">
												<tr>
													<th>Total Value</th>
													<th>Percentage of Portfolio</th>
													<th>Last 10 days</th>
													<th>Volume</th>
												</tr>
											</thead>
											<tbody>
												<tr>
													<td>$32,554</td>
													<td>15%</td>
													<td>
														<ReactApexChart options={Chart1Opt} series={Chart1Opt.series} type="line" width={140} height={60} />
													</td>
													<td>
														<ReactApexChart options={Chart5Opt} series={Chart5Opt.series} type="bar" width={100} height={60} />
													</td>
												</tr>
												<tr>
													<td>$23,533</td>
													<td>7%</td>
													<td>
														<ReactApexChart options={Chart2Opt} series={Chart2Opt.series} type="line" width={140} height={60} />
													</td>
													<td>
														<ReactApexChart options={Chart6Opt} series={Chart6Opt.series} type="bar" width={100} height={60} />
													</td>
												</tr>
												<tr>
													<td>$54,276</td>
													<td>9%</td>
													<td>
														<ReactApexChart options={Chart3Opt} series={Chart3Opt.series} type="line" width={140} height={60} />
													</td>
													<td>
														<ReactApexChart options={Chart7Opt} series={Chart7Opt.series} type="bar" width={100} height={60} />
													</td>
												</tr>
												<tr>
													<td>$11,533</td>
													<td>2%</td>
													<td>
														<ReactApexChart options={Chart4Opt} series={Chart4Opt.series} type="line" width={140} height={60} />
													</td>
													<td>
														<ReactApexChart options={Chart8Opt} series={Chart8Opt.series} type="bar" width={100} height={60} />
													</td>
												</tr>
											</tbody>
										</table>
									</div>
								</Col>
							</Row>
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</>
	);
};

export default AllSparklineCharts;
