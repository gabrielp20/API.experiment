const express = require('express') // solicita o modulo "express" para o Node.js
const app = express() // instancia um objeto "app" com a função "express"

const conf = require('dotenv').config().parsed; //solicita o modulo "dotenv" para obter variáveis de ambiente e armazenar como objeto

// console.log(conf);

const port = conf.HTTPPORT; // obtém a variável de ambiente "HTTPPORT" e armazena o valor em uma variável "port"

// Objeto que será executado quando houver uma requisição.
const thing = {
  getAll: async (req, res) => {
    res.json({ "req": req.method, "status": "ok" });
  },
  getOne: async (req, res) => {
    res.json({ "req": req.method, "id": res.param.id , "status": "ok" });
  },
  post: async (req, res) => {
    res.json({ "req": req.method, "status": "ok" });
   },
  put: async (req, res) => { 
    res.json({ "req": req.method, "status": "ok" });
  },
  delete: async (req, res) => {
    res.json({ "req": req.method, "status": "ok" });
   }
}

// Objeto que trata requisições para o 'user'.
const user = {
  getOne: async (req, res) => { },
  post: async (req, res) => { },
  put: async (req, res) => { },
  delete: async (req, res) => { }
}

// Recebe os dados do body HTTP e valida em JSON.
const bodyParser = require('body-parser').json();

// Rota para GET → getAll() → Recebe, por exemplo, todos os registros.
app.get('/', thing.getAll);

// Rota para GET → get(id) → Recebe apenas o registro identificado.
app.get('/:id', thing.getOne);

// Rota para DELETE.
app.delete('/:id', thing.delete);

// Rota para POST. => bodyPartser e usado para garantir a chegada de um JSON
app.post('/', bodyParser, thing.post);

// Rota para PUT.
app.put('/:id', bodyParser, thing.put);

// Rotas para o usuário
app.get('/user/:id', user.getOne);
app.put('/user/:id', user.put);
app.delete('/user/:id', user.delete);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
