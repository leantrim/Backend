import axios from 'axios';
import crypto from 'crypto';

const API_VERSION = '18.0';
const DATASET_ID = '325016873451312';

// Define the CAPI endpoint
const apiUrl = `https://graph.facebook.com/v${API_VERSION}/${DATASET_ID}/events?access_token=${process.env.FB_ACCESS_TOKEN}`;

export function hashWithSHA256(data: any) {
	return crypto.createHash('sha256').update(data).digest('hex');
}

export enum Facebook_Events {
	AddToCart = 'AddToCart',
	Purchase = 'Purchase',
	ViewContent = 'ViewContent',
	InitiateCheckout = 'InitiateCheckout',
}

export type FbDataType = {
	event_id?: string;
	event_source_url: string;
	user_data: {
		client_user_agent?: string;
		client_ip_address?: string;
		ct: string; // City
		zp: string; // Zip
		country: string; // country
		fn: string; // firstname
		ln: string; // lastname
		db: string; // Date of birth
		ge: string; // Gender
		ph: string; // Phone
		fbc?: string;
		fbp?: string;
	};
	custom_data: {
		content_ids: string;
		content_type: string;
		currency: string;
		value: number;
		num_items: number;
		custom_parameters: {
			[key: string]: string | string[];
		};
	};
};

export const sendEventToCAPI = async (eventData: FbDataType | any) => {
	try {
		const response = await axios.post(apiUrl, {
			data: [eventData],
			test_event_code: 'TEST96786',
		});

		console.log('Event sent to Facebook CAPI:', response.data);
	} catch (error: any) {
		console.error('Error sending event to Facebook CAPI:', error.response.data);
	}
};

export function generatePurchaseData(fbData: FbDataType) {
	const eventData = {
		event_name: Facebook_Events.Purchase,
		event_time: Math.floor(Date.now() / 1000),
		action_source: 'website',
		...fbData,
	};
	return eventData;
}

export function sendPurchaseEventToFacebook(fbData: FbDataType) {
	const eventData = generatePurchaseData(fbData);
	sendEventToCAPI(eventData);
}
