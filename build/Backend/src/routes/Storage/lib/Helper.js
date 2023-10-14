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
exports.getObjectsInBucket = exports.minioClient = exports.upload = exports.storage = void 0;
const Minio = __importStar(require("minio"));
const multer_1 = __importDefault(require("multer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.storage = multer_1.default.memoryStorage();
exports.upload = (0, multer_1.default)({ storage: exports.storage });
if (!process.env.MINIO_PORT ||
    isNaN(Number(process.env.MINIO_PORT)) ||
    !process.env.MINIO_END_POINT ||
    !process.env.MINIO_ACCESS_KEY ||
    !process.env.MINIO_SECRET_KEY ||
    !process.env.MINIO_USE_SSL) {
    throw new Error("MiniO Config is not propperly set up, please check .env");
}
exports.minioClient = new Minio.Client({
    endPoint: process.env.MINIO_END_POINT,
    port: parseInt(process.env.MINIO_PORT),
    useSSL: JSON.parse(process.env.MINIO_USE_SSL || "false"),
    accessKey: process.env.MINIO_ACCESS_KEY,
    secretKey: process.env.MINIO_SECRET_KEY,
});
const getObjectsInBucket = (bucketName) => {
    const data = [];
    let stream = exports.minioClient.listObjects(bucketName, "", true);
    stream.on("data", function (obj) {
        data.push(obj);
    });
    stream.on("end", function (obj) {
        return data;
    });
    stream.on("error", function (err) {
        return err;
    });
    return data;
};
exports.getObjectsInBucket = getObjectsInBucket;
const objectsInBucket = (0, exports.getObjectsInBucket)("mediapartners");
console.log(objectsInBucket);
