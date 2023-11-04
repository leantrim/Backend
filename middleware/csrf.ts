import express from 'express';
import csrf from 'csurf';
import { NextFunction, Request, Response } from 'express';

const app = express();

class CustomError extends Error {
	code?: string;

	constructor(message?: string, code?: string) {
		super(message);
		this.code = code;
	}
}

// Enable CSRF protection
const csrfProtection = csrf({ cookie: true });
app.use(csrfProtection);

// Your CSRF error handling middleware
const handleCSRFError = (
	err: CustomError,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (err.code !== 'EBADCSRFTOKEN') return next(err);

	// Handle CSRF token errors here
	res.status(403);
	res.send('Form tampered with');
};

app.use(handleCSRFError);

// Your routes go here

export default app;
