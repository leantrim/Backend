"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Site = exports.validateSite = void 0;
const joi_1 = __importDefault(require("joi"));
const mongoose_1 = __importStar(require("mongoose"));
require("mongoose-type-email");
const siteSchema = new mongoose_1.default.Schema({
    metaTitle: { type: String, required: true },
    url: { type: String, required: true },
    title: { type: String, required: true },
    metaDescription: { type: String, required: true },
    primaryColor: { type: String, required: true },
    secondaryColor: { type: String, required: true },
    aboutUs: { type: String, required: true },
    imageUrl: { type: String, required: false },
    _id: { type: String, required: false },
    __v: { type: Number, required: false },
    bodyTexts: [
        new mongoose_1.Schema({
            title: { type: String, required: true },
            text: { type: String, required: true },
        }, { _id: false }), // Disable automatic creation of _id for subdocuments
    ],
    services: [
        new mongoose_1.Schema({
            title: { type: String, required: true },
            text: { type: String, required: true },
            metaTitle: { type: String, required: true },
            metaDescription: { type: String, required: true },
            imageUrl: { type: String, required: false },
        }, { _id: false }), // Disable automatic creation of _id for subdocuments
    ],
    contactInfo: {
        email: { type: String, required: true },
        address: { type: String, required: true },
        companyName: { type: String, required: true },
        phoneNumber: { type: String, required: true },
    },
});
const Site = mongoose_1.default.model('Site', siteSchema);
exports.Site = Site;
function validateSite(site) {
    const schema = joi_1.default.object({
        metaTitle: joi_1.default.string().required(),
        url: joi_1.default.string().required(),
        title: joi_1.default.string().required(),
        metaDescription: joi_1.default.string().required(),
        primaryColor: joi_1.default.string().required(),
        secondaryColor: joi_1.default.string().required(),
        aboutUs: joi_1.default.string().required(),
        imageUrl: joi_1.default.string().allow(''),
        _id: joi_1.default.string().allow(''),
        __v: joi_1.default.number(),
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
            imageUrl: joi_1.default.string().allow(''),
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
