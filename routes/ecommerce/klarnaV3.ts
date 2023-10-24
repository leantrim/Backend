import express, { Request, Response } from 'express';
import {
	getKlarnaOrder,
	sendCreateNewOrderToKlarna,
} from '../../lib/KlarnaHelper';
import auth from '../../middleware/auth';
import { validateKlarnaV3 } from '../../model/ecommerce/KlarnaV3';
import { Order } from '../../model/ecommerce/Orders';
import { Product } from '../../model/ecommerce/Products';
import axios from 'axios';
import { KlarnaOrderData } from './KlarnaType';

const router = express.Router();

router.get('/:id', auth, async (req: Request, res: Response) => {
	if (!req.params.id) return res.status(400).send('Order ID is missing.');

	try {
		const klarnaData = await getKlarnaOrder(req.params.id);
		console.log('Request came in..', klarnaData);
		return res.status(200).send(klarnaData);
	} catch (error) {
		return res.status(400).send(error);
	}
});

// Confirm order
router.post('/confirmation/push', auth, async (req: Request, res: Response) => {
	const { merchant_urls, html_snippet, ...restBody } = req.body;
	console.log(req.body, 'req came in');
	const order = new Order(restBody);
	order.save();
	res.status(200);
});

// Create new order
router.post('/', auth, async (req: Request, res: Response) => {
	const { error } = validateKlarnaV3(req.body);
	const { cartItems, ...restOfBody } = req.body;
	if (error) return res.status(400).send(error);

	const product = await Product.findOne();
	if (!product) return res.status(500).send('Product not found.');

	try {
		const klarnaData = await sendCreateNewOrderToKlarna(cartItems, product);
		return res.status(200).json(klarnaData);
	} catch (error) {
		console.error('There was a problem with the Klarna order: ', error);
		if (error instanceof Error) {
			return res.status(500).send(error.message);
		} else {
			return res.status(500).send('An unknown error occurred.');
		}
	}
});

const sendOrderConfirmationEmail = (klarnaData: KlarnaOrderData) => {
	const apiKey = process.env.SENDGRID_API_KEY;
	const sendGridUrl = 'https://api.sendgrid.com/v3/mail/send';

	const requestData = {
		from: {
			email: 'example@sendgrid.net',
		},
		personalizations: [
			{
				to: [
					{
						email: 'example@sendgrid.net',
					},
				],
				bcc: [
					{
						email: 'bcc@example.com',
					},
				],
				dynamic_template_data: {
					total: klarnaData.order_amount,
					items: klarnaData.order_lines.map((order) => {}),
					// items: [
					// 	{
					// 		text: 'New Line Sneakers',
					// 		image:
					// 			'https://marketing-image-production.s3.amazonaws.com/uploads/8dda1131320a6d978b515cc04ed479df259a458d5d45d58b6b381cae0bf9588113e80ef912f69e8c4cc1ef1a0297e8eefdb7b270064cc046b79a44e21b811802.png',
					// 		price: '$ 79.95',
					// 	},
					// 	{
					// 		text: 'Old Line Sneakers',
					// 		image:
					// 			'https://marketing-image-production.s3.amazonaws.com/uploads/3629f54390ead663d4eb7c53702e492de63299d7c5f7239efdc693b09b9b28c82c924225dcd8dcb65732d5ca7b7b753c5f17e056405bbd4596e4e63a96ae5018.png',
					// 		price: '$ 79.95',
					// 	},
					// 	{
					// 		text: 'Blue Line Sneakers',
					// 		image:
					// 			'https://marketing-image-production.s3.amazonaws.com/uploads/00731ed18eff0ad5da890d876c456c3124a4e44cb48196533e9b95fb2b959b7194c2dc7637b788341d1ff4f88d1dc88e23f7e3704726d313c57f350911dd2bd0.png',
					// 		price: '$ 79.95',
					// 	},
					// ],
					receipt: true,
					name: 'Sample Name',
					address01: '1234 Fake St.',
					address02: 'Apt. 123',
					city: 'Place',
					state: 'CO',
					zip: '80202',
				},
			},
		],
		template_id: '[template_id]',
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

export default router;
