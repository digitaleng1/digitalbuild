import { ProgressBar } from 'react-bootstrap';

const Stocks = () => {
	return (
		<div className="table-responsive mt-4">
			<table className="table table-bordered table-centered mb-0">
				<thead className="bg-light bg-opacity-50 thead-sm">
					<tr>
						<th>Outlets</th>
						<th>Price</th>
						<th>Stock</th>
						<th>Revenue</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>ASOS Ridley Outlet - NYC</td>
						<td>$139.58</td>
						<td>
							<div className="progress-w-percent mb-0">
								<span className="progress-value">478 </span>
								<ProgressBar now={56} className="progress-sm" variant="success" />
							</div>
						</td>
						<td>$1,89,547</td>
					</tr>
					<tr>
						<td>Marco Outlet - SRT</td>
						<td>$149.99</td>
						<td>
							<div className="progress-w-percent mb-0">
								<span className="progress-value">73 </span>
								<ProgressBar now={16} className="progress-sm" variant="danger" />
							</div>
						</td>
						<td>$87,245</td>
					</tr>
					<tr>
						<td>Chairtest Outlet - HY</td>
						<td>$135.87</td>
						<td>
							<div className="progress-w-percent mb-0">
								<span className="progress-value">781 </span>
								<ProgressBar now={72} className="progress-sm" variant="success" />
							</div>
						</td>
						<td>$5,87,478</td>
					</tr>
					<tr>
						<td>Nworld Group - India</td>
						<td>$159.89</td>
						<td>
							<div className="progress-w-percent mb-0">
								<span className="progress-value">815 </span>
								<ProgressBar now={89} className="progress-sm" variant="success" />
							</div>
						</td>
						<td>$55,781</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
};

export default Stocks;
