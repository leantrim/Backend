import express, { Request, Response } from "express";
import { ReviewType } from "@mediapartners/shared-types/types/ecommerce/StoreType";
import auth from "../../../middleware/auth";
import {
  Categories,
  validateCategory,
} from "../../../model/ecommerce/stores/Categories";

const router = express.Router();

router.post("/", auth, async (req: Request, res: Response) => {
  const { error } = validateCategory(req.body);
  if (error) return res.status(400).send(error.message);

  const category = new Categories({ ...req.body, dateSubmitted: new Date() });

  try {
    await category.save();
    return res.send(category);
  } catch (err) {
    console.error(
      "ERROR: Something went wrong with creating a category, please contact administrator and include this error:",
      err
    );
    return res.status(500).send(err);
  }
});

router.put("/:id", auth, async (req: Request, res: Response) => {
  const { error } = validateCategory(req.body);
  if (error) return res.status(400).send(error.message);
  const category: ReviewType | null = await Categories.findById(req.params.id);

  if (!category)
    return res.status(404).send("The category with the given id was not found");

  try {
    const updatedSubPage = await Categories.findByIdAndUpdate(
      req.params.id,
      req.body
    );
    return res.status(200).send(updatedSubPage);
  } catch (error) {
    return res.status(500).send(error);
  }
});

// TODO: Add authentication (user, admin)
router.get("/", async (req: Request, res: Response) => {
  try {
    const subPages = await Categories.find();
    if (!subPages) {
      return res
        .status(404)
        .send("There are no subPages created in the database.");
    }
    return res.status(200).send(subPages);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .send(`An error occurred while retrieving subPages ${err}`);
  }
});

router.get("/:id", auth, async (req: Request, res: Response) => {
  const category: ReviewType | null = await Categories.findById(req.params.id);

  if (!category)
    return res.status(404).send("The category with the given id was not found");

  return res.status(200).send(category);
});

export default router;
