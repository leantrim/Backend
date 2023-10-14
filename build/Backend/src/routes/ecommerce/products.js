"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Products_1 = require("src/model/ecommerce/Products");
const auth_1 = __importDefault(require("src/middleware/auth"));
const router = express_1.default.Router();
router.post('/', auth_1.default, async (req, res) => {
    const { error } = (0, Products_1.validateProduct)(req.body);
    if (error)
        return res.status(400).send(error.message);
    const product = new Products_1.Product({ ...req.body, dateSubmitted: new Date() });
    try {
        await product.save();
        return res.send(product);
    }
    catch (err) {
        console.error('ERROR: Something went wrong with creating a product, please contact administrator and include this error:', err);
        return res.status(500).send(err);
    }
});
router.put('/:id', auth_1.default, async (req, res) => {
    const { error } = (0, Products_1.validateProduct)(req.body);
    if (error)
        return res.status(400).send(error.message);
    const product = await Products_1.Product.findById(req.params.id);
    if (!product)
        return res.status(404).send('The product with the given id was not found');
    try {
        const updatedProduct = await Products_1.Product.findByIdAndUpdate(req.params.id, req.body);
        return res.status(200).send(updatedProduct);
    }
    catch (error) {
        return res.status(500).send(error);
    }
});
// TODO: Add authentication (user, admin)
router.get('/', auth_1.default, async (req, res) => {
    const products = await Products_1.Product.find();
    if (!products)
        return res.status(404).send('No products have been created');
    return res.status(200).send(products);
});
router.get('/:id', auth_1.default, async (req, res) => {
    const product = await Products_1.Product.findById(req.params.id);
    if (!product)
        return res.status(404).send('The product with the given id was not found');
    return res.status(200).send(product);
});
exports.default = router;
