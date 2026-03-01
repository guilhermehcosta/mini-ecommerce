export async function createOrderRepository(client, data) {
  const { nome, email, endereco, formaPagamento } = data;

  const result = await client.query(
    `
    INSERT INTO orders (customer_name, email, address, payment_method)
    VALUES ($1, $2, $3, $4)
    RETURNING id
    `,
    [nome, email, endereco, formaPagamento]
  );

  return result.rows[0].id;
}

export async function createOrderItemRepository(client, orderId, produto) {
  await client.query(
    `
    INSERT INTO order_items 
    (order_id, product_id, product_name, price, quantity)
    VALUES ($1, $2, $3, $4, $5)
    `,
    [
      orderId,
      produto.id,
      produto.nome,
      produto.preco,
      produto.quantidade
    ]
  );
}

export async function getOrderByIdRepository(client, id) {
  const result = await client.query(
    `
    SELECT o.id,
           o.customer_name,
           o.email,
           o.address,
           o.payment_method,
           json_agg(
             json_build_object(
               'product_id', oi.product_id,
               'quantity', oi.quantity
             )
           ) AS produtos
    FROM orders o
    JOIN order_items oi ON oi.order_id = o.id
    WHERE o.id = $1
    GROUP BY o.id
    `,
    [id]
  );

  return result.rows[0];
}
