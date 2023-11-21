import express, { Request, Response } from 'express';
import { getKlarnaOrder, sendCreateNewOrderToKlarna } from './lib/KlarnaHelper';
import auth from '../../../middleware/auth';
import { validateKlarnaV3 } from '../../../model/ecommerce/Klarna/KlarnaV3';
import { Order } from '../../../model/ecommerce/Orders';
import { Product } from '../../../model/ecommerce/stores/Products/Products';
import axios from 'axios';
import { KlarnaOrderData } from './lib/KlarnaType';
import xss from 'xss';

const router = express.Router();

router.get('/:id', async (req: Request, res: Response) => {
	if (!req.params.id) return res.status(400).send(xss('Order ID is missing.'));

	try {
		const klarnaData = await getKlarnaOrder(req.params.id);
		return res.status(200).send(klarnaData);
	} catch (error) {
		console.error(error);
		return res.status(400).send(`An unkown error has occured`);
	}
});

// Create new order
router.post('/', async (req: Request, res: Response) => {
	const { error } = validateKlarnaV3(req.body);
	const { cartItems, ...restOfBody } = req.body;
	console.log(error?.message);
	if (error) return res.status(400).send(error.message);

	const product = await Product.findOne();
	if (!product) return res.status(500).send(xss('Product not found.'));

	try {
		const klarnaData = await sendCreateNewOrderToKlarna(cartItems, product);
		return res.status(201).json(klarnaData);
	} catch (error) {
		console.error('There was a problem with the Klarna order: ', error);
		if (error instanceof Error) {
			console.error(error.message);
			return res.status(500).send('An unknown error occurred.');
		} else {
			console.log(error);
			return res.status(500).send('An unknown error occurred.');
		}
	}
});

// Confirm order
router.post('/confirmation/push', async (req: Request, res: Response) => {
	const orderId = req.query.order_id;
	try {
		console.log(orderId);
		const klarnaData = await getKlarnaOrder(orderId as string);
		const { options, html_snipet, ...restBody } = klarnaData;
		sendOrderConfirmationEmail(restBody);
		const order = new Order(klarnaData);
		await order.save(); // Ensure the order is saved before sending the response
	} catch (error) {
		console.error(error);
	}
	return res.sendStatus(200); // Send a HTTP 200 status code back to Klarna
});

const sendOrderConfirmationEmail = (klarnaData: KlarnaOrderData) => {
	const apiKey = process.env.SENDGRID_API_KEY;
	const sendGridUrl = 'https://api.sendgrid.com/v3/mail/send';

	const requestData = {
		from: {
			email: 'order@hundkopplet.se',
			name: 'Order Bekräftelse Hundkopplet.se',
		},
		replyTo: {
			email: 'kundstjanst@hundkopplet.se',
			name: 'Kundtjänst',
		},
		personalizations: [
			{
				to: [
					{
						email: klarnaData.shipping_address.email,
						name:
							klarnaData.shipping_address.given_name +
							' ' +
							klarnaData.shipping_address.family_name,
					},
				],
				bcc: [
					{
						email: 'services@mediapartners.se',
					},
				],
				dynamic_template_data: {
					Order_Number: klarnaData.order_id.split('-')[0],
					receipt: true,
					order: {
						items: klarnaData.order_lines.map((order) => ({
							product_name: order.name,
							image: order.image_url,
							quantity: order.quantity,
							price: formatAmount(order.unit_price),
							total: formatAmount(order.total_amount),
						})),
					},
					first_name: klarnaData.shipping_address.given_name,
					last_name: klarnaData.shipping_address.family_name,
					address01: klarnaData.shipping_address.street_address,
					city: klarnaData.shipping_address.city,
					zip: klarnaData.shipping_address.postal_code,
					phone_number: klarnaData.shipping_address.phone,
					total_vat: formatAmount(klarnaData.order_tax_amount),
					sub_total: formatAmount(
						klarnaData.order_amount - klarnaData.order_tax_amount
					),
					total_amount: formatAmount(klarnaData.order_amount),
					shipping_fee: 0,
					subject: `[Orderbekräftelse #${klarnaData.order_id}] Hundkopplet.se`,
				},
			},
		],
		template_id: 'd-6e064f2f65d44bcab9d0cc508839a0fe',
	};

	const headers = {
		Authorization: `Bearer ${apiKey}`,
		'Content-Type': 'application/json',
	};

	axios
		.post(sendGridUrl, requestData, { headers })
		.then((response) => {
			console.log('Email sent successfully');
		})
		.catch((error) => {
			console.error('Error sending email:', error);
		});
};

function formatAmount(amount: number): string {
	return (amount / 100).toFixed(2);
}

export default router;
