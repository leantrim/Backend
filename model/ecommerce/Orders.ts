import Joi from 'joi';
import {
  OrderAddressType,
  OrderCustomerType,
  OrderLineType,
  OrderOptionsType,
  OrderType,
} from '@mediapartners/shared-types/types/ecommerce';
import mongoose, { Model, Schema } from 'mongoose';

const orderSchema: Schema<OrderType> = new mongoose.Schema({
  order_id: { type: String, required: false }, //
  status: { type: String, required: false }, //
  purchase_country: { type: String, required: false }, //
  purchase_currency: { type: String, required: false }, //
  locale: { type: String, required: false }, //
  billing_address: {
    given_name: { type: String, required: false },
    family_name: { type: String, required: false },
    email: { type: String, required: false },
    street_address: { type: String, required: false },
    postal_code: { type: String, required: false },
    city: { type: String, required: false },
    phone: { type: String, required: false },
    country: { type: String, required: false },
  },
  customer: {
    date_of_birth: { type: String, required: false },
    gender: { type: String, required: false },
  },
  shipping_address: {
    given_name: { type: String, required: false },
    family_name: { type: String, required: false },
    email: { type: String, required: false },
    street_address: { type: String, required: false },
    postal_code: { type: String, required: false },
    city: { type: String, required: false },
    phone: { type: String, required: false },
    country: { type: String, required: false },
  },
  order_amount: { type: Number, required: false },
  order_tax_amount: { type: Number, required: false },
  order_lines: [
    {
      type: { type: String, required: false },
      reference: { type: String, required: false },
      name: { type: String, required: false },
      quantity: { type: Number, required: false },
      quantity_unit: { type: String, required: false },
      unit_price: { type: Number, required: false },
      tax_rate: { type: Number, required: false },
      total_amount: { type: Number, required: false },
      total_discount_amount: { type: Number, required: false },
      total_tax_amount: { type: Number, required: false },
      image_url: { type: String, required: false },
    },
  ],
  options: {
    allow_separate_shipping_address: { type: Boolean, required: false },
    date_of_birth_mandatory: { type: Boolean, required: false },
    require_validate_callback_success: { type: Boolean, required: false },
  },
  started_at: { type: Date, required: false },
  completed_at: { type: Date, required: false },
  last_modified_at: { type: Date, required: true },
  external_payment_methods: { type: Array, required: false },
  external_checkouts: { type: Array, required: false },
  payment_type_allows_increase: { type: Boolean, required: false },
});

const Order: Model<OrderType> = mongoose.model('Order', orderSchema);

const addressSchema = Joi.object<OrderAddressType>({
  given_name: Joi.string().required(),
  family_name: Joi.string().required(),
  email: Joi.string().email().required(),
  street_address: Joi.string().required(),
  postal_code: Joi.string().required(),
  city: Joi.string().required(),
  phone: Joi.string().required(),
  country: Joi.string().required(),
});

const customerSchema = Joi.object<OrderCustomerType>({
  date_of_birth: Joi.string().required(),
  gender: Joi.string().valid('male', 'female').required(),
});

const orderLineSchema = Joi.object<OrderLineType>({
  type: Joi.string().optional(),
  reference: Joi.string().optional(),
  name: Joi.string().optional(),
  quantity: Joi.number().optional(),
  quantity_unit: Joi.string().optional(),
  unit_price: Joi.number().optional(),
  tax_rate: Joi.number().optional(),
  total_amount: Joi.number().optional(),
  total_discount_amount: Joi.number().optional(),
  total_tax_amount: Joi.number().optional(),
  image_url: Joi.string().uri().optional(),
});

const optionsSchema = Joi.object<OrderOptionsType>({
  allow_separate_shipping_address: Joi.boolean().optional(),
  date_of_birth_mandatory: Joi.boolean().optional(),
  require_validate_callback_success: Joi.boolean().optional(),
});

const schema = Joi.object<OrderType>({
  _id: Joi.string().optional(),
  order_id: Joi.string().optional(),
  status: Joi.string().optional(),
  purchase_country: Joi.string().optional(),
  purchase_currency: Joi.string().optional(),
  locale: Joi.string().optional(),
  billing_address: addressSchema.optional(),
  customer: customerSchema.optional(),
  shipping_address: addressSchema.optional(),
  order_amount: Joi.number().optional(),
  order_tax_amount: Joi.number().optional(),
  order_lines: Joi.array().items(orderLineSchema).optional(),
  options: optionsSchema.optional(),
  started_at: Joi.date().optional(),
  completed_at: Joi.date().optional(),
  last_modified_at: Joi.date().optional(),
  external_payment_methods: Joi.array().optional,
  external_checkouts: Joi.array().optional,
  payment_type_allows_increase: Joi.boolean().optional(),
});

function validateOrder(order: OrderType) {
  return schema.validate(order);
}

export { validateOrder, Order };
