import express, { Request, Response } from "express";
import { Order } from "src/model/ecommerce/Orders";
import auth from "src/middleware/auth";
import { OrderType } from "@mediapartners/shared-types/types/ecommerce";

const router = express.Router();

// TODO: Add authentication (user, admin)
router.get("/", auth, async (req: Request, res: Response) => {
  const orders = await Order.find();
  if (!orders) return res.status(404).send("No orders have been created");
  return res.status(200).send(orders);
});

router.get("/:id", async (req, res) => {
  const order: OrderType | null = await Order.findById(req.params.id);

  if (!order)
    return res.status(404).send("The order with the given id was not found");

  return res.status(200).send(order);
});

export default router;
