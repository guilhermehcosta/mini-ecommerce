import pool from '../config/database.js';
import AppError from '../utils/appError.js';
import {
  createOrderRepository,
  createOrderItemRepository,
  getOrderByIdRepository
} from '../repositories/orderRepository.js';

export async function createOrder(data) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    for (const produto of data.produtos) {

      
      const produtoResult = await client.query(
    `SELECT name, price, stock 
     FROM products 
     WHERE id = $1 
     FOR UPDATE`,
    [produto.id]
  );

  if (produtoResult.rows.length === 0) {
    throw new AppError('Produto não encontrado.', 404);
  }

  const { name, price, stock } = produtoResult.rows[0];

  if (stock < produto.quantidade) {
    throw new AppError(
      `Estoque insuficiente para o produto ${produto.id}`,
      400
    );
  }

  await client.query(
    `UPDATE products
     SET stock = stock - $1
     WHERE id = $2`,
    [produto.quantidade, produto.id]
  );

  produto.nome = name;
  produto.preco = price;
    }

    const orderId = await createOrderRepository(client, data);

    for (const produto of data.produtos) {
      await createOrderItemRepository(client, orderId, produto);
    }

    await client.query('COMMIT');

    return orderId;

  } catch (error) {
    await client.query('ROLLBACK');

    if (error.code === '23505') {
      throw new AppError(
        'Já existe um pedido com este e-mail.',
        400
      );
    }

    throw error;

  } finally {
    client.release();
  }
}
export async function getOrderById(id) {
  const client = await pool.connect();

  try {
    return await getOrderByIdRepository(client, id);
  } finally {
    client.release();
  }
}
