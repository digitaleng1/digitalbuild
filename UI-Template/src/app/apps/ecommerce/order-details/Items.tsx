import type { OrderItem } from '../types';

const Items = ({ items }: { items: OrderItem[] }) => {
	return (
		<div className="table-responsive">
			<table className="table mb-0">
				<thead className="bg-light bg-opacity-50 thead-sm">
					<tr>
						<th>Item</th>
						<th>Quantity</th>
						<th>Price</th>
						<th>Total</th>
					</tr>
				</thead>
				<tbody>
					{(items || []).map((item, index) => {
						return (
							<tr key={index.toString()}>
								<td>{item.name}</td>
								<td>{item.quantity}</td>
								<td>{item.price}</td>
								<td>{item.total}</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
};

export default Items;
