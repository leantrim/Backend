"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = exports.validateOrder = void 0;
const joi_1 = __importDefault(require("joi"));
const mongoose_1 = __importDefault(require("mongoose"));
const orderSchema = new mongoose_1.default.Schema({
    order_id: { type: String, required: false },
    status: { type: String, required: false },
    purchase_country: { type: String, required: false },
    purchase_currency: { type: String, required: false },
    locale: { type: String, required: false },
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
const Order = mongoose_1.default.model('Order', orderSchema);
exports.Order = Order;
const addressSchema = joi_1.default.object({
    given_name: joi_1.default.string().required(),
    family_name: joi_1.default.string().required(),
    email: joi_1.default.string().email().required(),
    street_address: joi_1.default.string().required(),
    postal_code: joi_1.default.string().required(),
    city: joi_1.default.string().required(),
    phone: joi_1.default.string().required(),
    country: joi_1.default.string().required(),
});
const customerSchema = joi_1.default.object({
    date_of_birth: joi_1.default.string().required(),
    gender: joi_1.default.string().valid('male', 'female').required(),
});
const orderLineSchema = joi_1.default.object({
    type: joi_1.default.string().optional(),
    reference: joi_1.default.string().optional(),
    name: joi_1.default.string().optional(),
    quantity: joi_1.default.number().optional(),
    quantity_unit: joi_1.default.string().optional(),
    unit_price: joi_1.default.number().optional(),
    tax_rate: joi_1.default.number().optional(),
    total_amount: joi_1.default.number().optional(),
    total_discount_amount: joi_1.default.number().optional(),
    total_tax_amount: joi_1.default.number().optional(),
    image_url: joi_1.default.string().uri().optional(),
});
const optionsSchema = joi_1.default.object({
    allow_separate_shipping_address: joi_1.default.boolean().optional(),
    date_of_birth_mandatory: joi_1.default.boolean().optional(),
    require_validate_callback_success: joi_1.default.boolean().optional(),
});
const schema = joi_1.default.object({
    _id: joi_1.default.string().optional(),
    order_id: joi_1.default.string().optional(),
    status: joi_1.default.string().optional(),
    purchase_country: joi_1.default.string().optional(),
    purchase_currency: joi_1.default.string().optional(),
    locale: joi_1.default.string().optional(),
    billing_address: addressSchema.optional(),
    customer: customerSchema.optional(),
    shipping_address: addressSchema.optional(),
    order_amount: joi_1.default.number().optional(),
    order_tax_amount: joi_1.default.number().optional(),
    order_lines: joi_1.default.array().items(orderLineSchema).optional(),
    options: optionsSchema.optional(),
    started_at: joi_1.default.date().optional(),
    completed_at: joi_1.default.date().optional(),
    last_modified_at: joi_1.default.date().optional(),
    external_payment_methods: joi_1.default.array().optional,
    external_checkouts: joi_1.default.array().optional,
    payment_type_allows_increase: joi_1.default.boolean().optional(),
});
function validateOrder(order) {
    return schema.validate(order);
}
exports.validateOrder = validateOrder;
