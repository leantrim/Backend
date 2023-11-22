import express, { Request, Response } from 'express';
import { ProductType } from '@mediapartners/shared-types/types/ecommerce';
import auth from '../../../middleware/auth';
import {
	Product,
	validateProduct,
	validateUpdateProduct,
} from '../../../model/ecommerce/stores/Products/Products';
import { Document } from 'mongoose';
import xss from 'xss';

const router = express.Router();

router.post('/', auth, async (req: Request, res: Response) => {
	const { error } = validateProduct(req.body);
	if (error) return res.status(400).send(xss(error.message));

	const product = new Product({ ...req.body, dateSubmitted: new Date() });

	try {
		await product.save();
		return res.send('Product succefully created');
	} catch (error) {
		console.error(error);
		return res.status(500).send('An error occurred. Please try again later.');
	}
});
router.post('/:id', auth, async (req: Request, res: Response) => {
	const product: Document | null = await Product.findById(req.params.id);

	if (!product)
		return res.status(404).send('The product with the given id was not found');

	// Convert the product to a plain JavaScript object
	const productObj = product.toObject();

	// Remove the _id field
	delete productObj._id;

	productObj.name = '[Copy] ' + productObj.name;

	// Create a new product with the same data
	const newProduct = new Product(productObj);

	try {
		await newProduct.save();
		return res.status(201).send(newProduct);
	} catch (error) {
		console.error(error);
		return res.status(500).send('An error occurred. Please try again later.');
	}
});

router.put('/:id', auth, async (req: Request, res: Response) => {
	const { user, ...restBody } = req.body;
	const { error } = validateProduct(restBody);
	if (error) return res.status(400).send(xss(error.message));
	const product: ProductType | null = await Product.findById(req.params.id);

	if (!product)
		return res.status(404).send('The product with the given id was not found');

	try {
		const updatedProduct = await Product.findByIdAndUpdate(
			req.params.id,
			restBody,
			{ new: true }
		);
		console.log(updatedProduct);
		if (!updatedProduct) {
			return res.status(404).send('No product found to update');
		}
		return res.status(200).send(updatedProduct);
	} catch (error) {
		console.error(error);
		return res.status(500).send('An error occurred. Please try again later.');
	}
});

router.patch('/:id', auth, async (req: Request, res: Response) => {
	const { user, ...restBody } = req.body;
	const { error } = validateUpdateProduct(restBody);
	if (error) return res.status(400).send(xss(error.message));
	const productId = req.params.id;

	let updatedField: string = '';
	type UpdateType = { [key: string]: string | { [key: string]: string } };

	let update: UpdateType = {};
	for (const key in restBody) {
		if (Array.isArray(restBody[key])) {
			// Handle arrays differently
			update[key] = restBody[key];
			updatedField = restBody[key];
		} else if (typeof restBody[key] === 'object') {
			for (const subKey in restBody[key]) {
				if (restBody[key].hasOwnProperty(subKey)) {
					update[`${key}.${subKey}`] = restBody[key][subKey];
					updatedField = restBody[key][subKey];
				}
			}
		} else {
			update[key] = restBody[key];
			updatedField = restBody[key];
		}
	}

	try {
		const product = await Product.findById(productId);

		if (!product)
			return res
				.status(404)
				.send('The product with the given id was not found');

		// Update the product fields
		Object.assign(product, update);

		// Save the product
		const updatedProduct = await product.save();

		return res.status(200).send(updatedProduct);
	} catch (error) {
		console.error(error);
		return res.status(500).send('An error occurred. Please try again later.');
	}

	// TODO: Add user log
});

router.get('/', async (req: Request, res: Response) => {
	try {
		const products = await Product.find().select('-__v');
		if (!products) return res.status(404).send('No products have been created');
		return res.status(200).send(products);
	} catch (error) {
		console.error(error);
		return res.status(500).send('An error occurred. Please try again later.');
	}
});

router.get('/:id', auth, async (req: Request, res: Response) => {
	const product: ProductType | null = await Product.findById(req.params.id);

	if (!product)
		return res
			.status(404)
			.send(xss('The product with the given id was not found'));

	return res.status(200).send(product);
});
router.delete('/:id', auth, async (req: Request, res: Response) => {
	const product: ProductType | null = await Product.findById(req.params.id);

	if (!product)
		return res
			.status(404)
			.send(xss('The product with the given id was not found'));

	try {
		await Product.deleteOne({
			_id: req.params.id,
		});
		return res.status(200).send('Product succefully deleted');
	} catch (error) {
		console.error(error);
		return res.status(500).send('An error occurred. Please try again later.');
	}
});

export default router;
