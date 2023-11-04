import express, { Request, Response } from 'express';
import { StoreSubPage } from '@mediapartners/shared-types/types/ecommerce/StoreType';
import auth from '../../../middleware/auth';
import {
	SubPage,
	validateSubPage,
} from '../../../model/ecommerce/stores/SubPages';
import xss from 'xss';

const router = express.Router();

router.post('/', auth, async (req: Request, res: Response) => {
	const { error } = validateSubPage(req.body);
	if (error) return res.status(400).send(xss(error.message));

	const subPage = new SubPage({ ...req.body, dateSubmitted: new Date() });

	try {
		await subPage.save();
		return res.send(subPage);
	} catch (error) {
		console.error(error);
		return res.status(500).send('An error occurred. Please try again later.');
	}
});

router.put('/:id', auth, async (req: Request, res: Response) => {
	const { error } = validateSubPage(req.body);
	if (error) return res.status(400).send(xss(error.message));
	const subPage: StoreSubPage | null = await SubPage.findById(req.params.id);

	if (!subPage)
		return res.status(404).send('The subPage with the given id was not found');

	try {
		const updatedSubPage = await SubPage.findByIdAndUpdate(
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
		const subPages = await SubPage.findOne();
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
	const subPage: StoreSubPage | null = await SubPage.findById(req.params.id);

	if (!subPage)
		return res
			.status(404)
			.send(xss('The subPage with the given id was not found'));

	return res.status(200).send(subPage);
});

export default router;
