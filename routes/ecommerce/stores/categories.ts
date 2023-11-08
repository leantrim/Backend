import express, { Request, Response } from 'express';
import { ReviewType } from '@mediapartners/shared-types/types/ecommerce/StoreType';
import auth from '../../../middleware/auth';
import {
	Categories,
	validateCategory,
} from '../../../model/ecommerce/stores/Categories';
import xss from 'xss';

const router = express.Router();

router.post('/', auth, async (req: Request, res: Response) => {
	const { error } = validateCategory(req.body);
	if (error) return res.status(400).send(xss(error.message));

	const category = new Categories({ ...req.body, dateSubmitted: new Date() });

	try {
		await category.save();
		return res.status(201).send(category);
	} catch (error) {
		console.error(error);
		return res.status(500).send('An error occurred. Please try again later.');
	}
});

router.put('/:id', auth, async (req: Request, res: Response) => {
	const { error } = validateCategory(req.body);
	if (error) return res.status(400).send(xss(error.message));
	const category: ReviewType | null = await Categories.findById(req.params.id);

	if (!category)
		return res.status(404).send('The category with the given id was not found');

	try {
		const updatedSubPage = await Categories.findByIdAndUpdate(
			req.params.id,
			req.body
		);
		return res.status(200).send(updatedSubPage);
	} catch (error) {
		console.error(error);
		return res.status(500).send('An error occurred. Please try again later.');
	}
});

// TODO: Add authentication (user, admin)
router.get('/', async (req: Request, res: Response) => {
	try {
		const subPages = await Categories.find();
		if (!subPages) {
			return res
				.status(404)
				.send(xss('There are no subPages created in the database.'));
		}
		return res.status(200).send(subPages);
	} catch (error) {
		console.error(error);
		return res.status(500).send('An error occurred. Please try again later.');
	}
});

router.get('/:id', auth, async (req: Request, res: Response) => {
	const category: ReviewType | null = await Categories.findById(req.params.id);

	if (!category)
		return res
			.status(404)
			.send(xss('The category with the given id was not found'));

	return res.status(200).send(category);
});

export default router;
