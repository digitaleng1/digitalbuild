import type { OrderDetailsItem } from '../types';

const OrderSummary = ({ summary }: { summary: OrderDetailsItem }) => {
	return (
		<div className="table-responsive">
			<table className="table mb-0">
				<thead className="bg-light bg-opacity-50 thead-sm">
					<tr>
						<th>Description</th>
						<th>Price</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>Grand Total :</td>
						<td>{summary.gross_total}</td>
					</tr>
					<tr>
						<td>Shipping Charge :</td>
						<td>{summary.shipping_charge}</td>
					</tr>
					<tr>
						<td>Estimated Tax : </td>
						<td>{summary.tax}</td>
					</tr>
					<tr>
						<th>Total :</th>
						<td>{summary.net_total}</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
};

export default OrderSummary;
