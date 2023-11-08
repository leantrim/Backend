import { ImageProp } from '@mediapartners/shared-types/types/ecommerce/ProductType';
import { SeoMetadata } from '@mediapartners/shared-types/types/ecommerce/StoreType';
import Joi from 'joi';

export const seoMetadataSchema = Joi.object<SeoMetadata>({
	description: Joi.string().required(),
	keywords: Joi.array().items(Joi.string()).required(),
	title: Joi.string().required(),
});

export const imageSchema = Joi.object<ImageProp>({
	url: Joi.string().uri(),
	alt: Joi.string(),
	_id: Joi.string(),
});
