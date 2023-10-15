import express from "express";
import Joi from "joi";
import bcrypt from "bcrypt";
import { User } from "../model/User";
import { UserType } from "@mediapartners/shared-types/types/panel";

const router = express.Router();

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.message);

  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid email or password");

  if (!(await bcrypt.compare(req.body.password, user.password))) {
    return res.status(400).send("Invalid email or password");
  }

  return res.send(user.generateAuthToken());
});

const validate = (user: UserType) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });

  return schema.validate(user);
};

export default router;
