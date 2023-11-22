import express, { Request, Response } from 'express';
import axios from 'axios';
import crypto from 'crypto';
import { validateFacebook } from '../../../model/ecommerce/Facebook/FbEvents';
import { Facebook_Events, sendEventToCAPI } from './helpers';

function hashWithSHA256(data: any) {
	return crypto.createHash('sha256').update(data).digest('hex');
}

const router = express.Router();

router.post(`/${Facebook_Events.Purchase}`, (req, res) => {
	const fbc = req.cookies._fbc;
	const fbp = req.cookies._fbp;
	const eventData = {
		event_name: Facebook_Events.Purchase,
		event_time: Math.floor(Date.now() / 1000),
		event_source_url: 'https://hundkopplet.se/orderconfirmation',
		action_source: 'website',
		user_data: {
			client_user_agent: req.headers['user-agent'], // Client user agent without hashing
			client_ip_address: req.ip,
			ct: hashWithSHA256('Malmö'), // City
			zp: hashWithSHA256('21370'), // Zip
			country: hashWithSHA256('SV'), // country
			fn: hashWithSHA256('anders'), // firstname
			ln: hashWithSHA256('svensson'), // lastname
			db: hashWithSHA256('1991-01-29'), // Date of birth
			ge: hashWithSHA256('male'), // Gender
			ph: hashWithSHA256('0769384132'), // Phone
			fbc,
			fbp,
		},
		custom_data: {
			content_ids: ['PRODUCT_ID_123'],
			content_type: 'product',
			currency: 'SEK',
			value: 499.99,
			num_items: 1,
			custom_parameters: {
				variantType: 'Röd',
			},
		},
	};

	// Send the event to Facebook CAPI
	sendEventToCAPI(eventData);

	// Handle your request logic
	return res.status(200).send('Purchase Conversion Sent');
});
router.post(`/${Facebook_Events.InitiateCheckout}`, (req, res) => {
	// Define the event data for AddToCart
	const fbc = req.cookies._fbc;
	const fbp = req.cookies._fbp;
	const eventData = {
		event_name: Facebook_Events.InitiateCheckout,
		event_time: Math.floor(Date.now() / 1000), // Event time in Unix timestamp format
		event_source_url: 'https://example.com/product-page', // Source URL of the event
		action_source: 'website', // Action source
		user_data: {
			client_user_agent: req.headers['user-agent'], // Client user agent without hashing
			client_ip_address: req.ip,
			fbc,
			fbp,
		},
		custom_data: {
			content_ids: ['PRODUCT_ID_123'],
			content_type: 'product',
			currency: 'SEK',
			value: 19.99,
			num_items: 1,
			custom_parameters: {
				variantType: ['rod', 'mintgroen'],
			},
		},
	};

	// Send the event to Facebook CAPI
	sendEventToCAPI(eventData);

	// Handle your request logic
	return res.status(200).send('Added to Cart');
});

router.post(`/${Facebook_Events.AddToCart}`, (req, res) => {
	// Define the event data for AddToCart
	const fbc = req.cookies._fbc;
	const fbp = req.cookies._fbp;
	console.log(req.headers.referer, req.headers.origin);
	const eventData = {
		event_name: Facebook_Events.AddToCart,
		event_time: Math.floor(Date.now() / 1000), // Event time in Unix timestamp format
		event_source_url: 'https://example.com/product-page', // Source URL of the event
		action_source: 'website', // Action source
		user_data: {
			client_user_agent: req.headers['user-agent'], // Client user agent without hashing
			client_ip_address: req.ip,
			fbc,
			fbp,
		},
		custom_data: req.body,
	};

	// Send the event to Facebook CAPI
	sendEventToCAPI(eventData);

	// Handle your request logic
	return res.status(200).send('Added to Cart');
});

// Client side
router.post('/', (req, res) => {
	console.log('CAME IN!');
	const { error } = validateFacebook(req.body);
	if (error) {
		// console.log(error);
	}

	const eventData = {
		event_name: Facebook_Events.AddToCart,
		event_time: Math.floor(Date.now() / 1000), // Event time in Unix timestamp format
		event_source_url: 'https://example.com/product-page', // Source URL of the event
		action_source: 'website', // Action source
		...req.body,
		user_data: {
			...req.body.user_data,
			client_user_agent: req.headers['user-agent'], // Client user agent without hashing
			client_ip_address: req.ip,
		},
	};
	console.log(eventData);
	// Send the event to Facebook CAPI
	sendEventToCAPI(eventData);

	// Handle your request logic
	return res.status(200).send('Added to Cart');
});

export default router;
