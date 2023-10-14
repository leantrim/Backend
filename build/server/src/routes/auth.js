"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const joi_1 = __importDefault(require("joi"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const User_1 = require("../model/User");
const router = express_1.default.Router();
router.post("/", async (req, res) => {
    const { error } = validate(req.body);
    if (error)
        return res.status(400).send(error.message);
    const user = await User_1.User.findOne({ email: req.body.email });
    if (!user)
        return res.status(400).send("Invalid email or password");
    if (!(await bcrypt_1.default.compare(req.body.password, user.password))) {
        return res.status(400).send("Invalid email or password");
    }
    return res.send(user.generateAuthToken());
});
const validate = (user) => {
    const schema = joi_1.default.object({
        email: joi_1.default.string().email().required(),
        password: joi_1.default.string().min(6).required(),
    });
    return schema.validate(user);
};
exports.default = router;
