import Joi from "joi";
import mongoose, { Model, Schema } from "mongoose";
import {
  ContactInfo,
  SeoMetadata,
  SocialLinks,
  StoreType,
  TypeofStore,
} from "@mediapartners/shared-types/types/ecommerce/StoreType";
import { seoMetadataSchema } from "model/common/JoiRules";

const storeSchema: Schema<StoreType> = new mongoose.Schema({
  name: { type: String, required: true },
  url: { type: String, required: true },
  logo: { type: String, required: true },
  description: { type: String, required: true },
  contactInfo: { type: Object, required: true },
  socialLinks: { type: Object, required: true },
  type: {
    type: String,
    required: true,
    enum: Object.values(TypeofStore), // assuming StoreType is an enum
  },
  seoMetadata: { type: Object, required: true },
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Rating" }],
  categories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Categories" }],
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Products" }],
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Orders" }],
  subPages: [{ type: mongoose.Schema.Types.ObjectId, ref: "SubPages" }],
});

const Store: Model<StoreType> = mongoose.model("StoreType", storeSchema);

function validateStore(store: StoreType) {
  const schema = Joi.object<StoreType>({
    name: Joi.string().required(),
    url: Joi.string().uri().required(),
    logo: Joi.string().uri().required(),
    description: Joi.string().required(),
    contactInfo: Joi.object<ContactInfo>({
      email: Joi.string().email().required(),
      phone: Joi.string().pattern(new RegExp("^[0-9]+$")).required(),
    }).required(),
    socialLinks: Joi.object<SocialLinks>({
      facebook: Joi.string().uri().required(),
      instagram: Joi.string().uri().required(),
    }).required(),
    type: Joi.string()
      .valid(...Object.values(TypeofStore))
      .required(),
    seoMetadata: seoMetadataSchema.required(),
    reviews: Joi.array().items(Joi.string().length(24)),
    categories: Joi.array().items(Joi.string().length(24)),
    products: Joi.array().items(Joi.string().length(24)),
    orders: Joi.array().items(Joi.string().length(24)),
    subPages: Joi.array().items(Joi.string().length(24)),
  });

  return schema.validate(store);
}

export { validateStore, Store };
