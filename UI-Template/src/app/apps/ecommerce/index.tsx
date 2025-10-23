import { lazy } from 'react';
import { Outlet, Route, Routes } from 'react-router';

const Products = lazy(() => import('./products/page'));
const ProductDetails = lazy(() => import('./product-details/page'));
const Orders = lazy(() => import('./orders/page'));
const OrderDetails = lazy(() => import('./order-details/page'));
const Customers = lazy(() => import('./customers/page'));
const ShoppingCart = lazy(() => import('./shopping-cart/page'));
const Checkout = lazy(() => import('./checkout/page'));
const Sellers = lazy(() => import('./sellers/page'));

export default function Dashboard() {
    return (
        <Routes>
            <Route path="/*" element={<Outlet />}>
                <Route path="products" element={<Products />} />
                <Route path="product-details" element={<ProductDetails />} />
                <Route path="orders" element={<Orders />} />
                <Route path="order-details" element={<OrderDetails />} />
                <Route path="customers" element={<Customers />} />
                <Route path="shopping-cart" element={<ShoppingCart />} />
                <Route path="checkout" element={<Checkout />} />
                <Route path="sellers" element={<Sellers />} />
            </Route>
        </Routes>
    );
}
