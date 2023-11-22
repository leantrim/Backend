import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import crypto from 'crypto';

const { timingSafeEqual } = require('node:crypto');

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 1000, // limit each IP to 100 requests per windowMs
});

const auth = [
	limiter,
	(req: Request, res: Response, next: NextFunction) => {
		const bearerToken = req.header('authorization');
		if (bearerToken && process.env.BACKEND_API_KEY) {
			console.log(bearerToken);
			let tokenWithoutBearer = bearerToken;
			let apiKey = process.env.BACKEND_API_KEY;

			if (!tokenWithoutBearer || !apiKey) {
				return res.status(400).send('Bearer token or API key is missing');
			}

			// Ensure tokenWithoutBearer and apiKey are the same length
			const maxLength = Math.max(tokenWithoutBearer.length, apiKey.length);
			tokenWithoutBearer = tokenWithoutBearer.padEnd(maxLength, '0');
			apiKey = apiKey.padEnd(maxLength, '0');

			const hash1 = crypto.createHash('sha256');
			const token = hash1.update(tokenWithoutBearer).digest();

			const hash2 = crypto.createHash('sha256');
			const api_key = hash2.update(apiKey).digest();

			if (timingSafeEqual(token, api_key)) {
				return next();
			} else {
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
			const decoded = jwt.verify(token, process.env.JWT_SECRET);
			req.body.user = decoded;

			next();
		} catch (error) {
			return res.status(400).send('Invalid token.');
		}
	},
];

export default auth;
