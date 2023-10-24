import Joi from "joi";
import mongoose, { Model, Schema } from "mongoose";
import { StoreSubPage } from "@mediapartners/shared-types/types/ecommerce/StoreType";

const subPageSchema: Schema<StoreSubPage> = new mongoose.Schema({
  pageName: { type: String, required: true },
  absolutePath: { type: String, required: true },
  title: { type: String, required: true },
  bodyText: { type: String, required: true },
});

const SubPage: Model<StoreSubPage> = mongoose.model("SubPages", subPageSchema);

function validateSubPage(store: StoreSubPage) {
  const schema = Joi.object<StoreSubPage>({
    pageName: Joi.string().required(),
    title: Joi.string().required(),
    bodyText: Joi.string().required(),
    absolutePath: Joi.string()
      .pattern(/^[a-zA-Z0-9-_]+$/)
      .required(),
  });

  return schema.validate(store);
}

export { validateSubPage, SubPage };
