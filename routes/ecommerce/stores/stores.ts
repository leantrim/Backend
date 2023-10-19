import express, { Request, Response } from "express";
import { StoreType } from "@mediapartners/shared-types/types/ecommerce/StoreType";
import auth from "../../../middleware/auth";
import { Store, validateStore } from "../../../model/ecommerce/stores/Stores";

const router = express.Router();

router.post("/", auth, async (req: Request, res: Response) => {
  const { error } = validateStore(req.body);
  if (error) return res.status(400).send(error.message);

  const store = new Store({ ...req.body, dateSubmitted: new Date() });

  try {
    await store.save();
    return res.send(store);
  } catch (err) {
    console.error(
      "ERROR: Something went wrong with creating a store, please contact administrator and include this error:",
      err
    );
    return res.status(500).send(err);
  }
});

router.put("/:id", auth, async (req: Request, res: Response) => {
  const { error } = validateStore(req.body);
  if (error) return res.status(400).send(error.message);
  const store: StoreType | null = await Store.findById(req.params.id);

  if (!store)
    return res.status(404).send("The store with the given id was not found");

  try {
    const updatedStore = await Store.findByIdAndUpdate(req.params.id, req.body);
    return res.status(200).send(updatedStore);
  } catch (error) {
    return res.status(500).send(error);
  }
});

// TODO: Add authentication (user, admin)
router.get("/", async (req: Request, res: Response) => {
  try {
    const stores = await Store.findOne();
    if (!stores) {
      return res
        .status(404)
        .send("There are no stores created in the database.");
    }
    return res.status(200).send(stores);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .send(`An error occurred while retrieving stores ${err}`);
  }
});

router.get("/:id", auth, async (req: Request, res: Response) => {
  const store: StoreType | null = await Store.findById(req.params.id);

  if (!store)
    return res.status(404).send("The store with the given id was not found");

  return res.status(200).send(store);
});

export default router;
