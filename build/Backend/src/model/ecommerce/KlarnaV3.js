"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KlarnaV3 = exports.validateKlarnaV3 = void 0;
const joi_1 = __importDefault(require("joi"));
const mongoose_1 = __importDefault(require("mongoose"));
const klarnaV3Schema = new mongoose_1.default.Schema({
    totalPrice: { type: Number, required: true },
    cartItems: [
        {
            price: { type: Number, required: false },
            quantity: { type: Number, required: true },
            productName: { type: String, required: true },
            productId: { type: String, required: true },
            variant: {
                variantType: { type: String, required: true },
                variantMainImage: { type: String, required: true },
                variantStock: { type: Number, required: true },
            },
        },
    ],
});
const KlarnaV3 = mongoose_1.default.model('KlarnaV3', klarnaV3Schema);
exports.KlarnaV3 = KlarnaV3;
function validateKlarnaV3(product) {
    const schema = joi_1.default.object({
        totalPrice: joi_1.default.number().optional(),
        loading: joi_1.default.boolean().optional(),
        cartItems: joi_1.default.array()
            .items(joi_1.default.object({
            variant: joi_1.default.object({
                variantType: joi_1.default.string().required(),
                variantMainImage: joi_1.default.string().required(),
                variantStock: joi_1.default.number().required(),
                _id: joi_1.default.string().optional(),
            }).required(),
            productName: joi_1.default.string().optional(),
            productId: joi_1.default.string().required(),
            quantity: joi_1.default.number().required(),
            price: joi_1.default.number().optional(),
        }))
            .required(),
    });
    return schema.validate(product);
}
exports.validateKlarnaV3 = validateKlarnaV3;
