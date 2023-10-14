"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.validateUser = void 0;
const joi_1 = __importDefault(require("joi"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongoose_1 = __importDefault(require("mongoose"));
require("mongoose-type-email");
const userSchema = new mongoose_1.default.Schema({
    name: { type: String, minlength: 2, required: true },
    email: { type: String, required: true },
    password: { type: String, minlength: 6, required: true },
    isAdmin: { type: Boolean, required: true },
});
userSchema.methods.generateAuthToken = function () {
    return jsonwebtoken_1.default.sign({
        _id: this._id,
        name: this.name,
        email: this.email,
        isAdmin: this.isAdmin,
    }, process.env.JWT_SECRET, { expiresIn: "7d" });
};
const User = mongoose_1.default.model("User", userSchema);
exports.User = User;
function validateUser(user) {
    const schema = joi_1.default.object({
        name: joi_1.default.string().min(2).required(),
        email: joi_1.default.string().email().required(),
        password: joi_1.default.string().min(9).required(),
        isAdmin: joi_1.default.boolean().required(),
    });
    return schema.validate(user);
}
exports.validateUser = validateUser;
