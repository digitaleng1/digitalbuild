
import { Col, Row, Table } from 'react-bootstrap';
import useCart from '../hooks/useCart';
import CartSummary from './CartSummary';
import {Link} from "react-router";

const CartDetail = () => {
	const { items, summary, onQtyChange, removeItem } = useCart();

	return (
		<Row>
			<Col lg={8}>
				<Table responsive borderless className="table-centered table-nowrap mb-0">
					<thead className="bg-light bg-opacity-50 thead-sm">
						<tr>
							<th>Product</th>
							<th>Price</th>
							<th>Quantity</th>
							<th>Total</th>
							<th style={{ width: '50px' }}></th>
						</tr>
					</thead>
					<tbody>
						{items.map((item, index) => {
							return (
								<tr key={index.toString()}>
									<td>
										<img src={item.image} alt={item.name} title="contact-img" className="rounded me-3" height="64" />

										<p className="m-0 d-inline-block align-middle font-16">
											<Link to="" className="text-body">
												{item.name}
											</Link>
											<br />
											<small className="me-2">
												<b>Size:</b> {item.size}
											</small>
											<small>
												<b>Color:</b> {item.color}
											</small>
										</p>
									</td>
									<td>${item.price.toFixed(2)}</td>
									<td>
										<input
											type="number"
											min="1"
											value={item.qty}
											className="form-control"
											placeholder="Qty"
											style={{ width: '90px' }}
											onChange={(e) => {
												onQtyChange(e, item);
											}}
										/>
									</td>
									<td>${item.total.toFixed(2)}</td>
									<td>
										<Link
											to=""
											className="action-icon"
											onClick={(e) => {
												removeItem(e, item);
											}}
										>
											<i className="mdi mdi-delete"></i>
										</Link>
									</td>
								</tr>
							);
						})}
					</tbody>
				</Table>

				<div className="mt-3">
					<label className="form-label" htmlFor="example-textarea">
						Add a Note:
					</label>
					<textarea className="form-control" id="example-textarea" rows={3} placeholder="Write some note.."></textarea>
				</div>

				<Row className="mt-4">
					<Col sm={6}>
						<Link to="/apps/ecommerce/products" className="btn text-muted d-none d-sm-inline-block btn-link fw-semibold">
							<i className="mdi mdi-arrow-left"></i> Continue Shopping
						</Link>
					</Col>
					<Col sm={6}>
						<div className="text-sm-end">
							<Link to="/apps/ecommerce/checkout" className="btn btn-danger">
								<i className="mdi mdi-cart-plus me-1"></i>
								Checkout
							</Link>
						</div>
					</Col>
				</Row>
			</Col>

			<Col lg={4}>
				<CartSummary summary={summary} />
			</Col>
		</Row>
	);
};

export default CartDetail;
