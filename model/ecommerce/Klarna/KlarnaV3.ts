import {
	CartItemsType,
	CartType,
	ProductVariantType,
} from '@mediapartners/shared-types/types/ecommerce';
import Joi from 'joi';
import mongoose, { Model, Schema } from 'mongoose';

const klarnaV3Schema: Schema<CartItemsType> = new mongoose.Schema({
	totalPrice: { type: Number, required: true },
	cartItems: [
		{
			price: { type: Number, required: false },
			quantity: { type: Number, required: true },
			productName: { type: String, required: true },
			productId: { type: String, required: true },
			variant: {
				type: { type: String, required: true },
				image: { type: String, required: true },
				stock: { type: Number, required: true },
			},
		},
	],
});

const KlarnaV3: Model<CartItemsType> = mongoose.model(
	'KlarnaV3',
	klarnaV3Schema
);

function validateKlarnaV3(product: CartItemsType) {
	const schema = Joi.object<CartItemsType>({
		totalPrice: Joi.number().optional(),
		loading: Joi.boolean().optional(),
		cartItems: Joi.array<CartType>()
			.items(
				Joi.object<CartType>({
					variant: Joi.object<ProductVariantType>({
						type: Joi.string().required(),
						color: Joi.string().required(),
						image: Joi.object({
							url: Joi.string().required(),
							alt: Joi.string().required(),
						}),
						stock: Joi.number().required(),
						_id: Joi.string().optional(),
					}).required(),
					productName: Joi.string().optional(),
					productId: Joi.string().required(),
					quantity: Joi.number().required(),
					price: Joi.number().optional(),
				})
			)
			.required(),
	});

	return schema.validate(product);
}

export { validateKlarnaV3, KlarnaV3 };
