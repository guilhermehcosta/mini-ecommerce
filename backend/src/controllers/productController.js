import getProducts from '../services/productService.js'
import { getProductsFromDatabase } from '../services/productService.js';

async function listProducts(req, res) {
  try {
    const products = await getProductsFromDatabase();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar produtos' });
  }
}

export default listProducts