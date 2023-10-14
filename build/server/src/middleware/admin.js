"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const admin = (req, res, next) => {
    if (!req.body.user.isAdmin)
        return res
            .status(403)
            .send("You are not authorized to make this request :(");
    next();
};
exports.default = admin;
