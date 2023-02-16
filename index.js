const express = require('express') // solicita o modulo "express" para o Node.js
const app = express() // instancia um objeto "app" com a função "express"

const conf = require('dotenv').config().parsed; //solicita o modulo "dotenv" para obter variáveis de ambiente e armazenar como objeto

// console.log(conf);

const port = conf.HTTPPORT; // obtém a variável de ambiente "HTTPPORT" e armazena o valor em uma variável "port"

// Objeto que será executado quando houver uma requisição.
const controller = {
 resJson: async (req, res) => {

    // Lista com alguns atributos úteis da requisição (req) HTTP.
    data = {
      "method": req.method,
      "url": req.url,
      "baseURL": req.baseURL,
      "query":res.query,
      "params": req.params,
      "body": req.body,
      "headers": req.headers
    }

    // Envia JSON com os dados acima para o cliente, como texto plano.
    // res.send(data);

    // Envia JSON com os dados acima para o cliente, como texto plano JSON.
    res.json(data);
    
  }
}

// Recebe os dados do body HTTP e valida em JSON.
const bodyParser = require('body-parser').json();


// Rota para GET → getAll() → Recebe, por exemplo, todos os registros.
app.get('/', controller.resJson);

// Rota para GET → get(id) → Recebe apenas o registro identificado.
app.get('/:id', controller.resJson);

// Rota para DELETE.
app.delete('/:id', controller.resJson);

// Rota para POST. => bodyPartser e usado para garantir a chegada de um JSON
app.post('/', bodyParser, controller.resJson);

// Rota para PUT.
app.put('/', controller.resJson);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
