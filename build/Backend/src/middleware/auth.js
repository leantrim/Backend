"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const { timingSafeEqual } = require('node:crypto');
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 100, // limit each IP to 100 requests per windowMs
});
const auth = [
    limiter,
    (req, res, next) => {
        const bearerToken = req.header('authorization');
        if (bearerToken && process.env.BACKEND_API_KEY) {
            const token = Buffer.from(bearerToken);
            const api_key = Buffer.from(process.env.BACKEND_API_KEY);
            if (timingSafeEqual(token, api_key)) {
                return next();
            }
            else {
                return res.status(401).send('Key not provided.');
            }
        }
        if (!process.env.JWT_SECRET) {
            console.error('ERROR: JWT Secret not set (auth middleware)');
            process.exit(1);
        }
        const token = req.header('x-auth-token');
        if (!token) {
            return res.status(401).send('Access denied. You need to be logged in.');
        }
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            req.body.user = decoded;
            next();
        }
        catch (error) {
            return res.status(400).send('Invalid token.');
        }
    },
];
exports.default = auth;
