"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = exports.validateProduct = void 0;
const joi_1 = __importDefault(require("joi"));
const mongoose_1 = __importDefault(require("mongoose"));
const productSchema = new mongoose_1.default.Schema({
    sku: { type: String, required: true },
    articleNumber: { type: Number, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    discountPrice: { type: Number, required: true },
    manufacturer: { type: String, required: true },
    manufacturerPurchasePrice: { type: Number, required: true },
    mainImage: { type: String, required: true },
    images: [
        {
            url: { type: String, required: true },
            alt: { type: String, required: true },
        },
    ],
    features: [{ type: String, required: true }],
    dimensions: {
        length: { type: String, required: true },
        width: { type: String, required: true },
        weight: { type: String, required: true },
        height: { type: String, required: true },
        ropeLength: { type: String, required: true },
        maxDogWeight: { type: String, required: true },
    },
    variants: [
        {
            variantType: { type: String, required: true },
            variantMainImage: { type: String, required: true },
            variantStock: { type: Number, required: true },
        },
    ],
});
const Product = mongoose_1.default.model('Product', productSchema);
exports.Product = Product;
function validateProduct(product) {
    const schema = joi_1.default.object({
        sku: joi_1.default.string().required(),
        articleNumber: joi_1.default.number().required(),
        name: joi_1.default.string().required(),
        description: joi_1.default.string().required(),
        price: joi_1.default.number().required(),
        discountPrice: joi_1.default.number().required(),
        manufacturer: joi_1.default.string().required(),
        manufacturerPurchasePrice: joi_1.default.number().required(),
        features: joi_1.default.array().items(joi_1.default.string()).required(),
        mainImage: joi_1.default.string().uri().required(),
        images: joi_1.default.array()
            .items(joi_1.default.object({
            url: joi_1.default.string().uri().required(),
            alt: joi_1.default.string().required(),
        }))
            .required(),
        dimensions: joi_1.default.object({
            length: joi_1.default.string().required(),
            width: joi_1.default.string().required(),
            weight: joi_1.default.string().required(),
            height: joi_1.default.string().required(),
            ropeLength: joi_1.default.string().required(),
            maxDogWeight: joi_1.default.string().required(),
        }).required(),
        variants: joi_1.default.array()
            .items(joi_1.default.object({
            variantType: joi_1.default.string().required(),
            variantMainImage: joi_1.default.string().required(),
            variantStock: joi_1.default.number().required(),
        }))
            .required(),
    });
    return schema.validate(product);
}
exports.validateProduct = validateProduct;
