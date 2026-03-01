import { createOrder, getOrderById } from '../services/orderService.js';
import { validarPedido } from '../validators/orderValidator.js';

export async function createOrderController(req, res, next) {
  try {
    validarPedido(req.body);

    const orderId = await createOrder(req.body);

    return res.status(201).json({
      numeroPedido: orderId
    });

  } catch (error) {
    next(error);
  }
}

export async function getOrderByIdController(req, res, next) {
  try {
    const { id } = req.params;

    const order = await getOrderById(id);

    return res.json(order);

  } catch (error) {
    next(error);
  }
}
