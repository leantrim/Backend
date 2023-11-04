import express, { Request, Response } from 'express';
import { ReviewType } from '@mediapartners/shared-types/types/ecommerce/StoreType';
import auth from '../../../middleware/auth';
import {
	Review,
	validateReview,
} from '../../../model/ecommerce/stores/Reviews';
import xss from 'xss';

const router = express.Router();

router.post('/', auth, async (req: Request, res: Response) => {
	const { error } = validateReview(req.body);
	if (error) return res.status(400).send(xss(error.message));

	const review = new Review({ ...req.body, dateSubmitted: new Date() });

	try {
		await review.save();
		return res.send(review);
	} catch (error) {
		console.error(error);
		return res.status(500).send('An error occurred. Please try again later.');
	}
});

router.put('/:id', auth, async (req: Request, res: Response) => {
	const { error } = validateReview(req.body);
	if (error) return res.status(400).send(xss(error.message));
	const review: ReviewType | null = await Review.findById(req.params.id);

	if (!review)
		return res.status(404).send('The review with the given id was not found');

	try {
		const updatedSubPage = await Review.findByIdAndUpdate(
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
		const subPages = await Review.find();
		if (!subPages) {
			return res
				.status(404)
				.send('There are no subPages created in the database.');
		}
		return res.status(200).send(subPages);
	} catch (error) {
		console.error(error);
		return res.status(500).send('An error occurred. Please try again later.');
	}
});

router.get('/:id', auth, async (req: Request, res: Response) => {
	const review: ReviewType | null = await Review.findById(req.params.id);

	if (!review)
		return res
			.status(404)
			.send(xss('The review with the given id was not found'));

	return res.status(200).send(review);
});

export default router;
