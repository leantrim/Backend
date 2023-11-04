import {
	ProductDimensions,
	ProductType,
	ProductVariantType,
} from '@mediapartners/shared-types/types/ecommerce';
import {
	BlockType,
	ImageProp,
	SECTION_TYPES,
} from '@mediapartners/shared-types/types/ecommerce/ProductType';
import Joi from 'joi';
import mongoose, { Model, Schema } from 'mongoose';

const productSchema: Schema<ProductType> = new mongoose.Schema({
	articleNumber: { type: Number, required: true },
	name: { type: String, required: true },
	description: { type: String, required: true },
	price: { type: Number, required: true },
	discountPrice: { type: Number, required: true },
	manufacturer: { type: String, required: true },
	manufacturerPurchasePrice: { type: Number, required: true },
	mainImage: {
		url: { type: String, required: true },
		alt: { type: String, required: true },
	},
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
			type: { type: String, required: true },
			color: { type: String, required: true },
			image: {
				url: { type: String, required: true },
				alt: { type: String, required: true },
			},
			stock: { type: Number, required: true },
		},
	],
	blocks: [
		{
			type: {
				type: String,
				enum: Object.values(SECTION_TYPES),
				required: true,
			},
			images: [
				{
					url: { type: String },
					alt: { type: String },
				},
			],
			title: { type: String },
			text: { type: String },
			buyNowButton: { type: Boolean },
			customCss: { type: String },
			backgroundColor: { type: String },
			order: { type: String },
			isVisible: { type: Boolean },
		},
	],
});

const Product: Model<ProductType> = mongoose.model('Product', productSchema);

function validateProduct(product: ProductType) {
	const schema = Joi.object<ProductType>({
		articleNumber: Joi.number().required(),
		name: Joi.string().required(),
		description: Joi.string().required(),
		price: Joi.number().required(),
		discountPrice: Joi.number().required(),
		manufacturer: Joi.string().required(),
		manufacturerPurchasePrice: Joi.number().required(),
		features: Joi.array().items(Joi.string()).required(),
		mainImage: imageSchema.required(),
		images: Joi.array().items(imageSchema).required(),
		dimensions: dimensionsSchema.required(),
		variants: Joi.array().items(variantsSchema).required(),
		blocks: blocksSchema,
	});

	return schema.validate(product);
}

function validateUpdateProduct(product: ProductType) {
	const schema = Joi.object({
		articleNumber: Joi.number(),
		name: Joi.string(),
		description: Joi.string(),
		price: Joi.number(),
		discountPrice: Joi.number(),
		manufacturer: Joi.string(),
		manufacturerPurchasePrice: Joi.number(),
		features: Joi.array().items(Joi.string()),
		mainImage: imageSchema,
		images: Joi.array().items(imageSchema),
		dimensions: dimensionsSchema,
		variants: variantsSchema,
		blocks: blocksSchema,
	});

	return schema.validate(product);
}

const variantsSchema = Joi.array().items(
	Joi.object<ProductVariantType>({
		type: Joi.string().required(),
		color: Joi.string().required(),
		image: Joi.object({
			url: Joi.string().uri().required(),
			alt: Joi.string().required(),
		}),
		stock: Joi.number().required(),
		_id: Joi.string(),
	})
);

const blocksSchema = Joi.array().items(
	Joi.object<BlockType>({
		type: Joi.string()
			.valid(...Object.values(SECTION_TYPES))
			.required(),
		images: Joi.array().items(
			Joi.object().keys({
				url: Joi.string().uri().required(),
				alt: Joi.string().required(),
			})
		),
		title: Joi.string(),
		text: Joi.string(),
		buyNowButton: Joi.boolean(),
		customCss: Joi.string(),
		backgroundColor: Joi.string(),
		order: Joi.number(),
		isVisible: Joi.boolean(),
		_id: Joi.string(),
	})
);

const dimensionsSchema = Joi.object<ProductDimensions>({
	length: Joi.string().required(),
	width: Joi.string().required(),
	weight: Joi.string().required(),
	height: Joi.string().required(),
	ropeLength: Joi.string().required(),
	maxDogWeight: Joi.string().required(),
});

const imageSchema = Joi.object<ImageProp>({
	url: Joi.string().uri(),
	alt: Joi.string(),
	_id: Joi.string(),
});

export { validateProduct, Product, validateUpdateProduct };
