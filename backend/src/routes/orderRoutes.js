import { Router } from 'express';
import {
  createOrderController,
  getOrderByIdController
} from '../controllers/orderController.js';

const router = Router();

router.post('/orders', createOrderController);
router.get('/orders/:id', getOrderByIdController);

export default router;
