import express, { Request, Response } from "express";
import {
  getKlarnaOrder,
  sendCreateNewOrderToKlarna,
} from "../../lib/KlarnaHelper";
import auth from "../../middleware/auth";
import { validateKlarnaV3 } from "../../model/ecommerce/KlarnaV3";
import { Order } from "../../model/ecommerce/Orders";
import { Product } from "../../model/ecommerce/Products";

const router = express.Router();

router.get("/:id", auth, async (req: Request, res: Response) => {
  if (!req.params.id) return res.status(400).send("Order ID is missing.");
  console.log("Request came in..");

  try {
    const klarnaData = await getKlarnaOrder(req.params.id);
    return res.status(200).send(klarnaData);
  } catch (error) {
    return res.status(400).send(error);
  }
});

// Confirm order
router.post("/confirmation/push", auth, async (req: Request, res: Response) => {
  const { merchant_urls, html_snippet, ...restBody } = req.body;
  console.log(req.body, "req came in");
  const order = new Order(restBody);
  order.save();
  res.status(200);
});

// Create new order
router.post("/", auth, async (req: Request, res: Response) => {
  const { error } = validateKlarnaV3(req.body);
  const { cartItems, ...restOfBody } = req.body;
  if (error) return res.status(400).send(error);

  const product = await Product.findOne();
  if (!product) return res.status(500).send("Product not found.");

  try {
    const klarnaData = await sendCreateNewOrderToKlarna(cartItems, product);
    return res.status(200).json(klarnaData);
  } catch (error) {
    console.error("There was a problem with the Klarna order: ", error);
    if (error instanceof Error) {
      return res.status(500).send(error.message);
    } else {
      return res.status(500).send("An unknown error occurred.");
    }
  }
});

export default router;
