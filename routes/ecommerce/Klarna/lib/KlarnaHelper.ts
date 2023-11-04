import { API_ROUTES } from '@mediapartners/shared-types/types/Routes';
import {
	CartType,
	ProductType,
} from '@mediapartners/shared-types/types/ecommerce';

const FRONTEND_URL = process.env.KLARNA_FRONTEND_URL;
const BACKEND_URL = process.env.KLARNA_BACKEND_URL || 'https://localhost:8000';
const KLARNA_URL = process.env.KLARNA_URL;

export const getKlarnaOrder = async (order_id: string) => {
	const auth = getKlarnaAuth();
	try {
		const response = await fetch(
			`${KLARNA_URL}/checkout/v3/orders/${order_id}`,
			{
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: auth,
				},
			}
		);

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(
				`HTTP error! status: ${response.status}, message: ${errorData.error_messages}`
			);
		}

		const data = await response.json();
		return data;
	} catch (error) {
		console.error('There was a problem with the fetch operation: ', error);
		return error;
	}
};

export const sendCreateNewOrderToKlarna = async (
	cartItems: CartType[],
	product: ProductType
) => {
	console.log('Came in?');
	const payLoad = buildKlarnaRequest(cartItems, product);
	const auth = getKlarnaAuth();
	try {
		const response = await fetch(`${KLARNA_URL}/checkout/v3/orders`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: auth,
			},
			body: JSON.stringify(payLoad),
		});

		if (!response.ok) {
			const errorData = await response.json();
			console.log(errorData);
			console.log(errorData);
			throw new Error(
				`HTTP error! status: ${response.status}, message: ${errorData.error_messages}`
			);
		}
		const data = await response.json();
		console.log(data);
		return data;
	} catch (error) {
		console.log(error);
		console.error('There was a problem with the fetch operation: ', error);
		return error;
	}
};

export const buildKlarnaRequest = (cart: CartType[], product: ProductType) => {
	const orderInfo = cart.map((item) => {
		const totalLineOrderAmount = item.quantity * product.price * 100; // Convert to öre
		const totalTaxAmount = Math.floor(
			totalLineOrderAmount * (2500 / (10000 + 2500))
		);
		return {
			reference: `${item.variant.type} - ${item.productName}`,
			name: `${item.productName} - ${item.variant.type}`,
			quantity: item.quantity,
			unit_price: product.price * 100,
			quantity_unit: 'pcs',
			tax_rate: 2500,
			total_amount: totalLineOrderAmount,
			total_discount_amount: 0,
			total_tax_amount: totalTaxAmount,
			image_url: item.variant.image.url,
		};
	});

	const order_amount = cart.reduce(
		(total, item) => total + item.quantity * product.price * 100, // Convert to öre
		0
	);

	const totalTaxAmount = Math.floor(order_amount * (2500 / (10000 + 2500)));

	const payLoad = {
		purchase_country: 'SE',
		purchase_currency: 'SEK',
		locale: 'se-SV',
		order_amount: order_amount,
		order_tax_amount: totalTaxAmount,
		order_lines: [...orderInfo],
		merchant_urls: {
			terms: `${FRONTEND_URL}/terms.html`,
			checkout: `${FRONTEND_URL}/checkout.html?order_id={checkout.order.id}`,
			confirmation: `${FRONTEND_URL}/orderconfirmation?order_id={checkout.order.id}`,
			push: `${BACKEND_URL}/${API_ROUTES.KLARNA}/confirmation/push?order_id={checkout.order.id}`,
		},
	};
	return payLoad;
};

export function getKlarnaAuth() {
	const client = process.env.KLARNA_CLIENT_KEY;
	const secret = process.env.KLARNA_SECRET_KEY;
	const auth = 'Basic ' + Buffer.from(client + ':' + secret).toString('base64');
	return auth;
}
