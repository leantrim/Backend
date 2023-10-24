import express, { Request, Response } from 'express';
import { StoreType } from '@mediapartners/shared-types/types/ecommerce/StoreType';
import auth from '../../../middleware/auth';
import {
	Store,
	validateNewStore,
	validateUpdateStore,
} from '../../../model/ecommerce/stores/Stores';

const router = express.Router();

router.post('/', auth, async (req: Request, res: Response) => {
	const { error } = validateNewStore(req.body);
	if (error) return res.status(400).send(error.message);

	const store = new Store({ ...req.body, dateSubmitted: new Date() });

	try {
		await store.save();
		return res.send(store);
	} catch (err) {
		console.error(
			'ERROR: Something went wrong with creating a store, please contact administrator and include this error:',
			err
		);
		return res.status(500).send(err);
	}
});

router.put('/:id', auth, async (req: Request, res: Response) => {
	const { user, ...restBody } = req.body;
	const { error } = validateUpdateStore(restBody);
	if (error) return res.status(400).send(error.message);
	console.log(restBody);
	const storeId = req.params.id;
	console.log(storeId);

	type UpdateType = { [key: string]: string | { [key: string]: string } };

	let update: UpdateType = {};
	for (const key in restBody) {
		if (Array.isArray(restBody[key])) {
			// Handle arrays differently
			update[key] = restBody[key];
		} else if (typeof restBody[key] === 'object') {
			// Handle nested objects
			for (const subKey in restBody[key]) {
				if (restBody[key].hasOwnProperty(subKey)) {
					update[`${key}.${subKey}`] = restBody[key][subKey];
				}
			}
		} else {
			// Handle other types
			update[key] = restBody[key];
		}
	}

	try {
		const store = await Store.findByIdAndUpdate(storeId, update, {
			new: true,
		});

		if (!store)
			return res.status(404).send('The store with the given id was not found');
		return res.status(200).send(update);
	} catch (error) {
		console.log(error);
		return res.status(500).send(error);
	}

	// TODO: Add user log
});

// TODO: Add authentication (user, admin)
router.get('/', async (req: Request, res: Response) => {
	try {
		const stores = await Store.find();
		if (!stores) {
			return res
				.status(404)
				.send('There are no stores created in the database.');
		}
		return res.status(200).send(stores);
	} catch (err) {
		console.error(err);
		return res
			.status(500)
			.send(`An error occurred while retrieving stores ${err}`);
	}
});

router.get('/:id', auth, async (req: Request, res: Response) => {
	const store: StoreType | null = await Store.findById(req.params.id);

	if (!store)
		return res.status(404).send('The store with the given id was not found');
	console.log(store);
	return res.status(200).send(store);
});

export default router;
