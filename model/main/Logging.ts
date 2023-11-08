import { LoggingType } from '@mediapartners/shared-types/types/panel';
import { METHOD_TYPE } from '@mediapartners/shared-types/types/panel/LoggingType';
import Joi from 'joi';
import mongoose, { Schema, Model } from 'mongoose';

const loggingSchema: Schema<LoggingType> = new mongoose.Schema({
	webUrl: { type: String, minlength: 2 },
	userId: { type: mongoose.Schema.Types.ObjectId, required: true },
	data: { type: String, minlength: 6, required: true },
	date: { type: Date, required: true },
	method: {
		type: Number,
		required: true,
		enum: Object.values(METHOD_TYPE), // assuming StoreType is an enum
	},
	statusCode: { type: Number, required: true },
	userAgent: { type: String },
	ipAddress: { type: String },
	responseTime: { type: Number },
	errorMessage: { type: String },
});

const Logging: Model<LoggingType> = mongoose.model('Logging', loggingSchema);

function validateLog(log: LoggingType) {
	const schema = Joi.object<LoggingType>({
		webUrl: Joi.string().uri(),
		userId: Joi.string().length(24).required(),
		data: Joi.string().required(),
		date: Joi.date().required(),
		method: Joi.number().valid(...Object.values(METHOD_TYPE)).required,
		statusCode: Joi.number(),
		userAgent: Joi.string(),
		ipAddress: Joi.string(),
		responseTime: Joi.number(),
		errorMessage: Joi.string(),
		_id: Joi.string(),
	});

	return schema.validate(log);
}

export { validateLog, Logging };
