import express, { Request, Response } from 'express';
import { validateKlarnaV3 } from 'src/model/ecommerce/KlarnaV3';
import { Product } from 'src/model/ecommerce/Products';
import { Order } from 'src/model/ecommerce/Orders';
import { getKlarnaOrder, sendCreateNewOrderToKlarna } from 'src/lib/KlarnaHelper';
import auth from 'src/middleware/auth';

const router = express.Router();

router.get('/:id', auth, async (req: Request, res: Response) => {
  if (!req.params.id) return res.status(400).send('Order ID is missing.');

  try {
    const klarnaData = await getKlarnaOrder(req.params.id);
    const { merchant_urls, html_snippet, ...restBody } = klarnaData;
    const order = new Order(restBody);
    order.save();
    return res.status(200).send(klarnaData);
  } catch (error) {
    return res.status(400).send(error);
  }
});

// Create new order
router.post('/', auth, async (req: Request, res: Response) => {
  const { error } = validateKlarnaV3(req.body);
  const { cartItems, ...restOfBody } = req.body;
  if (error) return res.status(400).send(error);

  const product = await Product.findOne();
  if (!product) return res.status(500).send('Product not found.');

  try {
    const klarnaData = await sendCreateNewOrderToKlarna(cartItems, product);
    return res.status(200).json(klarnaData);
  } catch (error) {
    console.error('There was a problem with the Klarna order: ', error);
    if (error instanceof Error) {
      return res.status(500).send(error.message);
    } else {
      return res.status(500).send('An unknown error occurred.');
    }
  }
});

export default router;
