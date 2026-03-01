import pool from './config/database.js'
import cors from 'cors'

import dotenv from 'dotenv'
dotenv.config()

import productRoutes from './routes/productRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import { manipuladorGlobalDeErros } from './middlewares/errorHandler.js';

import express from 'express'

import { syncProducts } from './services/productService.js';


const app = express();

app.use(cors());
app.use(express.json());

pool.connect()
  .then(() => console.log('Conectado ao PostgreSQL ✅'))
  .catch(err => console.error('Erro ao conectar no banco:', err));

app.use('/', productRoutes)
app.use('/', orderRoutes);

app.use(manipuladorGlobalDeErros);

app.listen(process.env.PORT, () => {
  console.log(`Servidor rodando na porta ${process.env.PORT}`);
});

app.get('/sync-products', async (req, res) => {
  try {
    await syncProducts();
    res.json({ message: 'Produtos sincronizados' });
  } catch (error) {
  console.error("ERRO REAL:", error);
  res.status(500).json({ error: error.message });
}
});

