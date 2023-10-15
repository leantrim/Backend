import Joi from 'joi';
import mongoose, { Schema, Model } from 'mongoose';
import 'mongoose-type-email';
import { WebsiteModel, InfoType, Services } from "@mediapartners/shared-types/types/panel/cms";


const siteSchema: Schema<WebsiteModel> = new mongoose.Schema({
  metaTitle: { type: String, required: true },
  url: { type: String, required: true },
  title: { type: String, required: true },
  metaDescription: { type: String, required: true },
  primaryColor: { type: String, required: true },
  secondaryColor: { type: String, required: true },
  aboutUs: { type: String, required: true },
  imageUrl: { type: String, required: false },
  _id: { type: String, required: false },
  __v: { type: Number, required: false },
  bodyTexts: [
    new Schema(
      {
        title: { type: String, required: true },
        text: { type: String, required: true },
      },
      { _id: false },
    ), // Disable automatic creation of _id for subdocuments
  ],
  services: [
    new Schema(
      {
        title: { type: String, required: true },
        text: { type: String, required: true },
        metaTitle: { type: String, required: true },
        metaDescription: { type: String, required: true },
        imageUrl: { type: String, required: false },
      },
      { _id: false },
    ), // Disable automatic creation of _id for subdocuments
  ],
  contactInfo: {
    email: { type: String, required: true },
    address: { type: String, required: true },
    companyName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
  },
});

const Site: Model<WebsiteModel> = mongoose.model('Site', siteSchema);

function validateSite(site: WebsiteModel) {
  const schema = Joi.object<WebsiteModel>({
    metaTitle: Joi.string().required(),
    url: Joi.string().required(),
    title: Joi.string().required(),
    metaDescription: Joi.string().required(),
    primaryColor: Joi.string().required(),
    secondaryColor: Joi.string().required(),
    aboutUs: Joi.string().required(),
    imageUrl: Joi.string().allow(''),
    _id: Joi.string().allow(''),
    __v: Joi.number(),
    bodyTexts: Joi.array()
      .items(
        Joi.object<InfoType>({
          title: Joi.string().required(),
          text: Joi.string().required(),
        }),
      )
      .required(),
    services: Joi.array()
      .items(
        Joi.object<Services>({
          title: Joi.string().required(),
          text: Joi.string().required(),
          metaTitle: Joi.string().required(),
          metaDescription: Joi.string().required(),
          imageUrl: Joi.string().allow(''),
        }),
      )
      .required(),
    contactInfo: Joi.object({
      email: Joi.string().email().required(),
      address: Joi.string().required(),
      companyName: Joi.string().required(),
      phoneNumber: Joi.string().required(),
    }).required(),
  });

  return schema.validate(site);
}

export { validateSite, Site };
