import { NextFunction, Request, Response } from "express";

const admin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.user?.isAdmin)
    return res
      .status(403)
      .send("You are not authorized to make this request :(");

  next();
};

export default admin;
