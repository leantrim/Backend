import express, { Request, Response } from "express";
import { ProductType } from "@mediapartners/shared-types/types/ecommerce";
import auth from "../../middleware/auth";
import { Product, validateProduct } from "../../model/ecommerce/Products";

const router = express.Router();

router.post("/", auth, async (req: Request, res: Response) => {
  const { error } = validateProduct(req.body);
  if (error) return res.status(400).send(error.message);

  const product = new Product({ ...req.body, dateSubmitted: new Date() });

  try {
    await product.save();
    return res.send(product);
  } catch (err) {
    console.error(
      "ERROR: Something went wrong with creating a product, please contact administrator and include this error:",
      err
    );
    return res.status(500).send(err);
  }
});

router.put("/:id", auth, async (req: Request, res: Response) => {
  const { error } = validateProduct(req.body);
  if (error) return res.status(400).send(error.message);
  const product: ProductType | null = await Product.findById(req.params.id);

  if (!product)
    return res.status(404).send("The product with the given id was not found");

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body
    );
    return res.status(200).send(updatedProduct);
  } catch (error) {
    return res.status(500).send(error);
  }
});

// TODO: Add authentication (user, admin)
router.get("/", async (req: Request, res: Response) => {
  try {
    const products = await Product.find();
    if (!products) return res.status(404).send("No products have been created");
    return res.status(200).send(products);
  } catch (err) {
    console.error(err);
    return res
      .status(200)
      .send(`An error occurred while retrieving products ${err}`);
  }
});

router.get("/:id", auth, async (req: Request, res: Response) => {
  const product: ProductType | null = await Product.findById(req.params.id);

  if (!product)
    return res.status(404).send("The product with the given id was not found");

  return res.status(200).send(product);
});

export default router;
