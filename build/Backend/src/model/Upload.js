"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.File = exports.validateFile = void 0;
const joi_1 = __importDefault(require("joi"));
const mongoose_1 = __importDefault(require("mongoose"));
const fileSchema = new mongoose_1.default.Schema({
    file: { type: Buffer, required: true },
    fileType: { type: String, required: true },
});
const File = mongoose_1.default.model("File", fileSchema);
exports.File = File;
function validateFile(file) {
    const schema = joi_1.default.object({
        file: joi_1.default.binary().required(),
        fileType: joi_1.default.string().required(),
    });
    return schema.validate(file);
}
exports.validateFile = validateFile;
