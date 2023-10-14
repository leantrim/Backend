import { UserType } from "@mediapartners/shared-types/types/panel";
import Joi from "joi";
import jwt from "jsonwebtoken";
import mongoose, { Schema, Model } from "mongoose";
import "mongoose-type-email";

const userSchema: Schema<UserType> = new mongoose.Schema({
  name: { type: String, minlength: 2, required: true },
  email: { type: String, required: true },
  password: { type: String, minlength: 6, required: true },
  isAdmin: { type: Boolean, required: true },
});

userSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      name: this.name,
      email: this.email,
      isAdmin: this.isAdmin,
    },
    process.env.JWT_SECRET!!,
    { expiresIn: "7d" }
  );
};

const User: Model<UserType> = mongoose.model("User", userSchema);

function validateUser(user: UserType) {
  const schema = Joi.object<UserType>({
    name: Joi.string().min(2).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(9).required(),
    isAdmin: Joi.boolean().required(),
  });

  return schema.validate(user);
}

export { validateUser, User };
