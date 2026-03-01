const BASE_URL = 'http://localhost:3000';

export async function getProducts() {
  const response = await fetch(`${BASE_URL}/products`);

  if (!response.ok) {
    throw new Error('Erro ao buscar produtos');
  }

  return response.json();
}

export async function createOrder(data) {
  const response = await fetch(`${BASE_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.erro || 'Erro ao criar pedido');
  }

  return result;
}
