import { ProductDimensions, ProductType, ProductVariantType } from '@mediapartners/shared-types/types/ecommerce';
import Joi from 'joi';
import mongoose, { Model, Schema } from 'mongoose';

const productSchema: Schema<ProductType> = new mongoose.Schema({
  sku: { type: String, required: true },
  articleNumber: { type: Number, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  discountPrice: { type: Number, required: true },
  manufacturer: { type: String, required: true },
  manufacturerPurchasePrice: { type: Number, required: true },
  mainImage: { type: String, required: true },
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
      variantType: { type: String, required: true },
      variantMainImage: { type: String, required: true },
      variantStock: { type: Number, required: true },
    },
  ],
});

const Product: Model<ProductType> = mongoose.model('Product', productSchema);

function validateProduct(product: ProductType) {
  const schema = Joi.object<ProductType>({
    sku: Joi.string().required(),
    articleNumber: Joi.number().required(),
    name: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required(),
    discountPrice: Joi.number().required(),
    manufacturer: Joi.string().required(),
    manufacturerPurchasePrice: Joi.number().required(),
    features: Joi.array().items(Joi.string()).required(),
    mainImage: Joi.string().uri().required(),
    images: Joi.array()
      .items(
        Joi.object({
          url: Joi.string().uri().required(),
          alt: Joi.string().required(),
        }),
      )
      .required(),
    dimensions: Joi.object<ProductDimensions>({
      length: Joi.string().required(),
      width: Joi.string().required(),
      weight: Joi.string().required(),
      height: Joi.string().required(),
      ropeLength: Joi.string().required(),
      maxDogWeight: Joi.string().required(),
    }).required(),
    variants: Joi.array()
      .items(
        Joi.object<ProductVariantType>({
          variantType: Joi.string().required(),
          variantMainImage: Joi.string().required(),
          variantStock: Joi.number().required(),
        }),
      )
      .required(),
  });

  return schema.validate(product);
}

export { validateProduct, Product };
