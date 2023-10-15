import { CartType, ProductType } from "@mediapartners/shared-types/types/ecommerce";

export const getKlarnaOrder = async (order_id: string) => {
  const auth = getKlarnaAuth();
  try {
    const response = await fetch(`https://api.playground.klarna.com/checkout/v3/orders/${order_id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: auth,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.error_messages}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('There was a problem with the fetch operation: ', error);
    return error;
  }
};

export const sendCreateNewOrderToKlarna = async (cartItems: CartType[], product: ProductType) => {
  const payLoad = buildKlarnaRequest(cartItems, product);
  const auth = getKlarnaAuth();
  try {
    const response = await fetch('https://api.playground.klarna.com/checkout/v3/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: auth,
      },
      body: JSON.stringify(payLoad),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.error_messages}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('There was a problem with the fetch operation: ', error);
    return error;
  }
};

export const buildKlarnaRequest = (cart: CartType[], product: ProductType) => {
  const orderInfo = cart.map((item) => {
    const totalLineOrderAmount = item.quantity * product.price * 100; // Convert to öre
    const totalTaxAmount = Math.floor(totalLineOrderAmount * (2500 / (10000 + 2500)));
    return {
      reference: `${item.variant.variantType} - ${item.productName}`,
      name: `${item.productName} - ${item.variant.variantType}`,
      quantity: item.quantity,
      unit_price: product.price * 100,
      quantity_unit: 'pcs',
      tax_rate: 2500,
      total_amount: totalLineOrderAmount,
      total_discount_amount: 0,
      total_tax_amount: totalTaxAmount,
      image_url: item.variant.variantMainImage,
    };
  });

  const order_amount = cart.reduce(
    (total, item) => total + item.quantity * product.price * 100, // Convert to öre
    0,
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
      terms: 'https://www.example.com/terms.html',
      checkout: 'https://www.example.com/checkout.html?order_id={checkout.order.id}',
      confirmation: 'https://localhost:3000/orderconfirmation?order_id={checkout.order.id}',
      push: 'https://www.example.com/api/push?order_id={checkout.order.id}',
    },
  };
  return payLoad;
};

export function getKlarnaAuth() {
  const client = 'PK85748_e3ebe8568456';
  const secret = 'g7lRUO2IyPJbLiDr';
  const auth = 'Basic ' + Buffer.from(client + ':' + secret).toString('base64');
  return auth;
}
