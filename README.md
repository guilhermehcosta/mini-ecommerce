Projeto desenvolvido como desafio técnico.
A aplicação simula um mini e-commerce com listagem de produtos, carrinho e finalização de pedido com controle de estoque.

Os produtos são obtidos da Fake Store API, sincronizados e armazenados no banco de dados.

Tecnologias utilizadas:

Backend
- Node.js
- Express
- PostgreSQL
- pg
- Axios

Frontend
- React
- Javascript
- Vite

Funcionalidades:
- Listagem de produtos
- Carrinho de compras
- Checkout
- Controle de estoque
- Persistência de pedidos no banco
- Sincronização de produtos via API externa

Decisões técnicas:

Para evitar inconsistência no estoque, implementei controle transacional utilizando:

- BEGIN
- COMMIT
- ROLLBACK
- SELECT FOR UPDATE

Dessa forma, caso algum item do pedido não tenha estoque suficiente, toda a operação é cancelada.

Os produtos são sincronizados utilizando INSERT ... ON CONFLICT, garantindo que produtos novos sejam inseridos e produtos existentes sejam atualizados

Como executar o projeto:

- Clonar o repositório:
git clone https://github.com/guilhermehcosta/mini-ecommerce.git

Backend:

- Entrar na pasta:
cd backend
npm install

- Criar o arquivo .env preenchendo as variáveis:

DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=123456
DB_NAME=ecommerce
DB_PORT=5432
PORT=3000

- Crie o banco de dados no PostgreSQL com o nome que você definiu no .env (execute este comando separadamente no psql ou pgAdmin)
- CREATE DATABASE seu_banco

- Execute o script para criar as tabelas:
  psql -U seu_usuario -d seu_banco -f database.sql


- Rodar o servidor:
npm run dev

- Sincronizar produtos:
Acessar o endpoint no navegador:
[GET /sync](http://localhost:3000/sync) (ou a porta que você usa)

Isso irá buscar os produtos da API externa e salvar no banco.

Frontend:

- Entrar na pasta:
cd frontend
npm install
npm run dev

A aplicação ficará disponível em:
http://localhost:5173


- Melhorias futuras
Se tivesse mais tempo, eu implementaria:

- Testes automatizados
- Autenticação de usuário
- Paginação de produtos
- Docker para facilitar execução
- Deploy em ambiente cloud
