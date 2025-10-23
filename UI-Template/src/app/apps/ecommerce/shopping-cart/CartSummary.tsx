import { Alert, Table } from 'react-bootstrap';
import type { CartSummaryItem } from '../types';

const CartSummary = ({ summary }: { summary: CartSummaryItem }) => {
	return (
		<>
			<div className="border p-3 mt-4 mt-lg-0 rounded">
				<h4 className="header-title mb-3">Order Summary</h4>

				<Table responsive className="mb-0">
					<tbody>
						<tr>
							<td>Grand Total :</td>
							<td>${summary.gross_total.toFixed(2)}</td>
						</tr>
						<tr>
							<td>Discount : </td>
							<td>-${summary.discount.toFixed(2)}</td>
						</tr>
						<tr>
							<td>Shipping Charge :</td>
							<td>${summary.shipping_charge.toFixed(2)}</td>
						</tr>
						<tr>
							<td>Estimated Tax : </td>
							<td>${summary.tax.toFixed(2)}</td>
						</tr>
						<tr>
							<th>Total :</th>
							<th>${summary.net_total.toFixed(2)}</th>
						</tr>
					</tbody>
				</Table>
			</div>

			<Alert variant="warning" className="mt-3">
				Use coupon code <strong>HYPBM</strong> and get 10% discount !
			</Alert>

			<div className="input-group mt-3">
				<input type="text" className="form-control form-control-light" placeholder="Coupon code" aria-label="Recipient's username" />
				<div className="input-group-append">
					<button className="btn btn-light" type="button">
						Apply
					</button>
				</div>
			</div>
		</>
	);
};

export default CartSummary;
