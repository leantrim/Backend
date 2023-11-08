import {
	CustomData,
	CustomParameters,
	FacebookDataType,
} from '@mediapartners/shared-types/types/ecommerce';
import Joi from 'joi';

function validateFacebook(fbRequest: FacebookDataType) {
	const schema = Joi.object<FacebookDataType>({
		fbc: Joi.string(),
		fbp: Joi.string(),
		custom_data: Joi.object<CustomData>({
			value: Joi.number().required(),
			currency: Joi.string().required(),
			num_items: Joi.number().required(),
			content_type: Joi.string().required(),
			custom_parameters: Joi.object<CustomParameters>({
				variantType: Joi.string().required(),
			}).required(),
			test_event_code: Joi.string(),
		}),
	});
	return schema.validate(fbRequest);
}

export { validateFacebook };
