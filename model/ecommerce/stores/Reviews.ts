import Joi from "joi";
import mongoose, { Model, Schema } from "mongoose";
import { ReviewType } from "@mediapartners/shared-types/types/ecommerce/StoreType";

const ratingSchema: Schema<ReviewType> = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  rating: { type: Number, required: true },
  title: { type: String, required: true },
  reviewText: { type: String, required: true },
  images: [{ type: String, required: false }],
});

const Review: Model<ReviewType> = mongoose.model("Store", ratingSchema);

function validateReview(store: ReviewType) {
  const schema = Joi.object<ReviewType>({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    rating: Joi.number().min(1).max(5).required(),
    title: Joi.string().required(),
    reviewText: Joi.string().required(),
    images: Joi.array().items(Joi.string()),
  });

  return schema.validate(store);
}

export { validateReview, Review };
