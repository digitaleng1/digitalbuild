import { useState } from 'react';
import { cartSummary } from '../checkout/data';
import type{ Cart } from '../checkout/types';

export default function useCheckout() {
	const [cart, setCart] = useState<Cart>(cartSummary);

	/**
	 * Update the shipping cost
	 */
	const updateShipping = (shippingCost: number) => {
		const localCart = { ...cart };
		localCart['shipping'] = shippingCost;
		localCart['total'] = localCart['sub_total'] + shippingCost;
		setCart(localCart);
	};

	return { cart, updateShipping };
}
