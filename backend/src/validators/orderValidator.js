import AppError from '../utils/appError.js';

const FORMAS_PAGAMENTO_VALIDAS = ['Pix', 'Cartão', 'Boleto'];

function emailValido(email) {
  return /\S+@\S+\.\S+/.test(email);
}

export function validarPedido(dados) {
  const { nome, email, endereco, formaPagamento, produtos } = dados;

  if (!nome || !email || !endereco || !formaPagamento || !produtos) {
    throw new AppError('Todos os campos são obrigatórios.', 400);
  }

  if (!emailValido(email)) {
    throw new AppError('O e-mail informado é inválido.', 400);
  }

  if (!FORMAS_PAGAMENTO_VALIDAS.includes(formaPagamento)) {
    throw new AppError('Forma de pagamento inválida.', 400);
  }

  if (!Array.isArray(produtos) || produtos.length === 0) {
    throw new AppError('A lista de produtos deve conter ao menos um item.', 400);
  }

  for (const produto of produtos) {
    if (!produto.id || !produto.quantidade) {
      throw new AppError('Cada produto deve possuir id e quantidade.', 400);
    }

    if (produto.quantidade <= 0) {
      throw new AppError('A quantidade do produto deve ser maior que zero.', 400);
    }
  }
}
