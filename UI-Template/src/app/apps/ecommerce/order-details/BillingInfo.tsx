import type { Billing } from '../types';

const BillingInfo = ({ details }: { details: Billing }) => {
	return (
		<ul className="list-unstyled mb-0">
			<li>
				<p className="mb-2">
					<span className="fw-bold me-2">Payment Type:</span> {details.type}
				</p>
				<p className="mb-2">
					<span className="fw-bold me-2">Provider:</span> {details.provider}
				</p>
				<p className="mb-2">
					<span className="fw-bold me-2">Valid Date:</span> {details.valid}
				</p>
				<p className="mb-0">
					<span className="fw-bold me-2">CVV:</span> xxx
				</p>
			</li>
		</ul>
	);
};

export default BillingInfo;
