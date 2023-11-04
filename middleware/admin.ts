import { NextFunction, Request, Response } from 'express';

const admin = (req: Request, res: Response, next: NextFunction) => {
	if (!req.body.user?.isAdmin) return res.status(403).send('Only for admins');

	next();
};

export default admin;
