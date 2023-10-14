"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Site = exports.validateSite = void 0;
const joi_1 = __importDefault(require("joi"));
const mongoose_1 = __importDefault(require("mongoose"));
require("mongoose-type-email");
const siteSchema = new mongoose_1.default.Schema({
    metaTitle: { type: String, required: true },
    url: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    primaryColor: { type: String, required: true },
    secondaryColor: { type: String, required: true },
    aboutUs: { type: String, required: true },
    bodyTexts: [
        {
            title: { type: String, required: true },
            text: { type: String, required: true },
        },
    ],
    services: [
        {
            title: { type: String, required: true },
            text: { type: String, required: true },
            metaTitle: { type: String, required: true },
            metaDescription: { type: String, required: true },
            imageUrl: { type: String, required: false },
        },
    ],
    contactInfo: {
        email: { type: String, required: true },
        address: { type: String, required: true },
        companyName: { type: String, required: true },
        phoneNumber: { type: String, required: true },
    },
});
const Site = mongoose_1.default.model("Site", siteSchema);
exports.Site = Site;
function validateSite(site) {
    const schema = joi_1.default.object({
        metaTitle: joi_1.default.string().required(),
        url: joi_1.default.string().required(),
        title: joi_1.default.string().required(),
        description: joi_1.default.string().required(),
        primaryColor: joi_1.default.string().required(),
        secondaryColor: joi_1.default.string().required(),
        aboutUs: joi_1.default.string().required(),
        bodyTexts: joi_1.default.array()
            .items(joi_1.default.object({
            title: joi_1.default.string().required(),
            text: joi_1.default.string().required(),
        }))
            .required(),
        services: joi_1.default.array()
            .items(joi_1.default.object({
            title: joi_1.default.string().required(),
            text: joi_1.default.string().required(),
            metaTitle: joi_1.default.string().required(),
            metaDescription: joi_1.default.string().required(),
            imageUrl: joi_1.default.string(),
        }))
            .required(),
        contactInfo: joi_1.default.object({
            email: joi_1.default.string().email().required(),
            address: joi_1.default.string().required(),
            companyName: joi_1.default.string().required(),
            phoneNumber: joi_1.default.string().required(),
        }).required(),
    });
    return schema.validate(site);
}
exports.validateSite = validateSite;
