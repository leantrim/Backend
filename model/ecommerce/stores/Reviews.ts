import Joi from 'joi';
import mongoose, { Model, Schema } from 'mongoose';
import { ReviewType } from '@mediapartners/shared-types/types/ecommerce/StoreType';

const ratingSchema: Schema<ReviewType> = new mongoose.Schema({
	name: { type: String, required: true },
	email: { type: String, required: true },
	rating: { type: Number, required: true },
	title: { type: String, required: false },
	reviewText: { type: String, required: false },
	images: [{ type: String, required: false }],
	product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
	approved: { type: Boolean, required: false },
	dateSubmitted: { type: Date, required: false },
});

const Review: Model<ReviewType> = mongoose.model('Reviews', ratingSchema);

function validateReview(review: ReviewType) {
	const schema = Joi.object<ReviewType>({
		name: Joi.string().required(),
		email: Joi.string().email().required(),
		rating: Joi.number().min(1).max(5).required(),
		title: Joi.string(),
		reviewText: Joi.string(),
		images: Joi.array().items(Joi.string()),
		product: Joi.array().items(Joi.string().length(24)),
		approved: Joi.boolean(),
	});

	return schema.validate(review);
}

export { validateReview, Review };
