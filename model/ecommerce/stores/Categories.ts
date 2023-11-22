import Joi from 'joi';
import mongoose, { Model, Schema } from 'mongoose';
import { CategoriesType } from '@mediapartners/shared-types/types/ecommerce/StoreType';
import { seoMetadataSchema } from '../../common/JoiRules';

const categorySchema: Schema<CategoriesType> = new mongoose.Schema({
	name: { type: String, required: true },
	absolutePath: { type: String, required: true },
	seoMetadata: { type: Object, required: true },
	parentCategory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Categories' }],
	products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
});

const Categories: Model<CategoriesType> = mongoose.model(
	'Categories',
	categorySchema
);

function validateCategory(category: CategoriesType) {
	const schema = Joi.object<CategoriesType>({
		name: Joi.string().required(),
		absolutePath: Joi.string().required(),
		seoMetadata: seoMetadataSchema.required(),
		parentCategory: Joi.array().items(Joi.string().length(24)),
		products: Joi.array().items(Joi.string().length(24)),
	});

	return schema.validate(category);
}

export { validateCategory, Categories };
