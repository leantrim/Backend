import { FormTypes } from '@mediapartners/shared-types/types/panel';
import Joi from 'joi';
import mongoose, { Schema, Model } from 'mongoose';

const formSchema: Schema<FormTypes> = new mongoose.Schema({
  site: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  zipCode: { type: String, required: true },
  livingArea: { type: String, required: false },
  serviceType: { type: String, required: false },
  dateSubmitted: { type: Date, required: false },
});

const Form: Model<FormTypes> = mongoose.model('Form', formSchema);

function validateForm(form: FormTypes) {
  const schema = Joi.object<FormTypes>({
    site: Joi.string().required(),
    email: Joi.string().email().required(),
    phoneNumber: Joi.string().required(),
    zipCode: Joi.string().required(),
    livingArea: Joi.string().optional(),
    serviceType: Joi.string().optional(),
    dateSubmitted: Joi.date().optional(),
  });

  return schema.validate(form);
}

export { validateForm, Form };
