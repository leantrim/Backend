import { NextFunction, Request, Response } from 'express';
import { Logging } from 'model/main/Logging';

const loggingMiddleware = (req: Request, res: Response, next: NextFunction) => {
	// const logEntry = new Logging({
	//   ipAddress: req.ip,
	//   path: req.path,
	//   method: req.method,
	//   timestamp: new Date()
	// });
	// logEntry.save()
	//   .then(() => next())
	//   .catch((error) => {
	//     console.error('Failed to save log entry:', error);
	//     next(error);
	//   });
	console.log('REQUEST', req.body);
	// console.log('RES', res);
	next();
};

export default loggingMiddleware;
