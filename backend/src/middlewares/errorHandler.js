export function manipuladorGlobalDeErros(err, req, res, next) {
  const status = err.statusCode || 500;

  return res.status(status).json({
    erro: err.message || 'Erro interno do servidor.'
  });
}
