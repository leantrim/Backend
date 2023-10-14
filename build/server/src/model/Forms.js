"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Form = exports.validateForm = void 0;
const joi_1 = __importDefault(require("joi"));
const mongoose_1 = __importDefault(require("mongoose"));
const formSchema = new mongoose_1.default.Schema({
    site: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    zipCode: { type: String, required: true },
    livingArea: { type: String, required: false },
    serviceType: { type: String, required: false },
    dateSubmitted: { type: Date, required: false },
});
const Form = mongoose_1.default.model("Form", formSchema);
exports.Form = Form;
function validateForm(form) {
    const schema = joi_1.default.object({
        site: joi_1.default.string().required(),
        email: joi_1.default.string().email().required(),
        phoneNumber: joi_1.default.string().required(),
        zipCode: joi_1.default.string().required(),
        livingArea: joi_1.default.string().optional(),
        serviceType: joi_1.default.string().optional(),
        dateSubmitted: joi_1.default.date().optional(),
    });
    return schema.validate(form);
}
exports.validateForm = validateForm;
