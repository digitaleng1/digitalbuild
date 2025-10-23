
import useOrders from '../hooks/useOrders';

const StatusSelect = () => {
	const { changeOrderStatusGroup } = useOrders();

	return (
		<select className="form-select" id="status-select" onChange={(e) => changeOrderStatusGroup(e.target.value)}>
			<option value="All">All</option>
			<option value="Paid">Paid</option>
			<option value="Authorization">Awaiting Authorization</option>
			<option value="Failed">Payment failed</option>
			<option value="Unpaid">Unpaid</option>
		</select>
	);
};

export default StatusSelect;
