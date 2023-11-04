import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';

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
			const token = Buffer.from(bearerToken);
			const api_key = Buffer.from(process.env.BACKEND_API_KEY);
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
