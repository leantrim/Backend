"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const KlarnaV3_1 = require("src/model/ecommerce/KlarnaV3");
const Products_1 = require("src/model/ecommerce/Products");
const Orders_1 = require("src/model/ecommerce/Orders");
const KlarnaHelper_1 = require("src/lib/KlarnaHelper");
const auth_1 = __importDefault(require("src/middleware/auth"));
const router = express_1.default.Router();
router.get('/:id', auth_1.default, async (req, res) => {
    if (!req.params.id)
        return res.status(400).send('Order ID is missing.');
    try {
        const klarnaData = await (0, KlarnaHelper_1.getKlarnaOrder)(req.params.id);
        const { merchant_urls, html_snippet, ...restBody } = klarnaData;
        const order = new Orders_1.Order(restBody);
        order.save();
        return res.status(200).send(klarnaData);
    }
    catch (error) {
        return res.status(400).send(error);
    }
});
// Create new order
router.post('/', auth_1.default, async (req, res) => {
    const { error } = (0, KlarnaV3_1.validateKlarnaV3)(req.body);
    const { cartItems, ...restOfBody } = req.body;
    if (error)
        return res.status(400).send(error);
    const product = await Products_1.Product.findOne();
    if (!product)
        return res.status(500).send('Product not found.');
    try {
        const klarnaData = await (0, KlarnaHelper_1.sendCreateNewOrderToKlarna)(cartItems, product);
        return res.status(200).json(klarnaData);
    }
    catch (error) {
        console.error('There was a problem with the Klarna order: ', error);
        if (error instanceof Error) {
            return res.status(500).send(error.message);
        }
        else {
            return res.status(500).send('An unknown error occurred.');
        }
    }
});
exports.default = router;
