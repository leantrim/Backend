"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Orders_1 = require("src/model/ecommerce/Orders");
const auth_1 = __importDefault(require("src/middleware/auth"));
const router = express_1.default.Router();
// TODO: Add authentication (user, admin)
router.get("/", auth_1.default, async (req, res) => {
    const orders = await Orders_1.Order.find();
    if (!orders)
        return res.status(404).send("No orders have been created");
    return res.status(200).send(orders);
});
router.get("/:id", async (req, res) => {
    const order = await Orders_1.Order.findById(req.params.id);
    if (!order)
        return res.status(404).send("The order with the given id was not found");
    return res.status(200).send(order);
});
exports.default = router;
