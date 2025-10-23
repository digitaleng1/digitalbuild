import type { ShippingAddress } from '../types';

const ShippingInfo = ({ details }: { details: ShippingAddress }) => {
	return (
		<>
			<h5>{details.provider}</h5>

			<address className="mb-0 font-14 address-lg">
				{details.address_1}
				<br />
				{details.address_2}
				<br />
				<abbr title="Phone">P:</abbr> {details.phone} <br />
				<abbr title="Mobile">M:</abbr> {details.mobile}
			</address>
		</>
	);
};

export default ShippingInfo;
