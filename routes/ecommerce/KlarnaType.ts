interface BillingAddress {
	given_name: string;
	family_name: string;
	email: string;
	street_address: string;
	postal_code: string;
	city: string;
	phone: string;
	country: string;
}

interface Customer {
	date_of_birth: string;
	gender: string;
}

interface OrderLine {
	type: string;
	reference: string;
	name: string;
	quantity: number;
	quantity_unit: string;
	unit_price: number;
	tax_rate: number;
	total_amount: number;
	total_discount_amount: number;
	total_tax_amount: number;
	image_url: string;
}

interface MerchantUrls {
	terms: string;
	checkout: string;
	confirmation: string;
	push: string;
}

interface Options {
	allow_separate_shipping_address: boolean;
	date_of_birth_mandatory: boolean;
	require_validate_callback_success: boolean;
}

interface ExternalPaymentMethod {
	// Define the structure for external payment methods here
}

interface ExternalCheckout {
	// Define the structure for external checkouts here
}

export interface KlarnaOrderData {
	order_id: string;
	status: string;
	purchase_country: string;
	purchase_currency: string;
	locale: string;
	billing_address: BillingAddress;
	customer: Customer;
	shipping_address: BillingAddress; // Assuming it has the same structure as billing_address
	order_amount: number;
	order_tax_amount: number;
	order_lines: OrderLine[];
	merchant_urls: MerchantUrls;
	started_at: string;
	completed_at: string;
	last_modified_at: string;
	options: Options;
	external_payment_methods: ExternalPaymentMethod[];
	external_checkouts: ExternalCheckout[];
	payment_type_allows_increase: boolean;
}
