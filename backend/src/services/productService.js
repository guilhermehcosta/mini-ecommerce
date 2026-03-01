import axios from 'axios';
import pool from '../config/database.js'; 

export async function getProductsFromDatabase() {
  const result = await pool.query('SELECT * FROM products');

  return result.rows.map(product => ({
    id: product.id,
    nome: product.name,
    descricao: product.description,
    preco: product.price,
    estoque: product.stock,
    imagem: product.image
  }));
}


export async function upsertProduct(product) {
  const query = `
  INSERT INTO products (id, name, price, description, image, stock)
  VALUES ($1, $2, $3, $4, $5, $6)
  ON CONFLICT (id)
  DO UPDATE SET
    name = EXCLUDED.name,
    price = EXCLUDED.price,
    description = EXCLUDED.description,
    image = EXCLUDED.image,
    stock = EXCLUDED.stock
`;


  const values = [
  product.id,
  product.title,
  product.price,
  product.description,
  product.image,
  Math.floor(Math.random() * 20) + 1
];


  await pool.query(query, values);
}

export async function syncProducts() {
  const response = await axios.get('https://fakestoreapi.com/products');
  const products = response.data;

  for (const product of products) {
    await upsertProduct(product);
  }

  console.log('Produtos sincronizados com sucesso');
}

async function getProducts() {
  const response = await axios.get('https://fakestoreapi.com/products');

  return response.data.map(product => ({
    id: product.id,
    nome: product.title,
    descricao: product.description,
    preco: (product.price * 5).toFixed(2),
    estoque: Math.floor(Math.random() * 20) + 1,
    imagem: product.image
  }));
}

export default getProducts