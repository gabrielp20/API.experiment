const express = require('express') // solicita o modulo "express" para o Node.js
const app = express() // instancia um objeto "app" com a função "express"
const conf = require('dotenv').config().parsed; //solicita o modulo "dotenv" para obter variáveis de ambiente e armazenar como objeto

// console.log(conf);

// Importa a biblioteca "MySQL".
const mysql = require('mysql2');

// Faz a conexão com o servidor.
const conn = mysql.createPool({
  host: conf.HOSTNAME,
  user: conf.USERNAME,
  database: conf.DATABASE,
  password: conf.PASSWORD,
  port: conf.HOSTPORT
}).promise();

const port = conf.HTTPPORT; // obtém a variável de ambiente "HTTPPORT" e armazena o valor em uma variável "port"

// Objeto que será executado quando houver uma requisição.
const thing = {
  getAll: async (req, res) => {

    try {
      // Query que obtém os dados do banco de dados.
      const sql = "SELECT *, DATE_FORMAT(tdate, '%d/%m/%Y às %H:%i') AS tdatebr FROM things WHERE tstatus = 'on' ORDER BY tdate DESC";

      const [rows] = await conn.query(sql);

      // Views dos dados
      res.json({ data: rows });
    }

    catch (error) {

      // Exibe mensagem de erro.
      res.json({ status: "error", message: error });

    }
  },

  getOne: async (req, res) => {

    try {

      // Id da requisição
      const id = req.params.id;

      const sql = "SELECT *, DATE_FORMAT(tdate, '%d/%m/%Y às %H:%i') AS tdatebr FROM things WHERE tid = ? tstatus = 'on' ORDER BY tdate DESC";
      const [rows] = await conn.query(sql, [id]);

      // Views dos dados
      res.json({ coisa: rows });

    } catch (error) {

      // Exibe mensagem de erro.
      res.json({ status: "error", message: error });

    }
  },

  post: async (req, res) => {

    try {

      // Extrai os campos do req.body.
      const { user, name, photo, description, location, options } = req.body;

      // Query
      const sql = "INSERT INTO things (tuser, tname, tphoto , tdescription, tlocation, toptions) VALUES (?, ?, ?, ?, ?, ?)";
      const [rows] = await conn.query(sql, [user, name, photo, description, location, options]);

       // View → feedback.
       res.json({ id: rows.insertId, status: "success" });

    } catch {

      // Exibe mensagem de erro.
      res.json({ status: "error", message: error });

    }
  },

  put: async (req, res) => {

    try {

      // Id da requisição
      const id = req.params.id;

      // Extrai os campos do req.body.
      const { user, name, photo, description, location, options } = req.body;

      // Query
      const sql = "UPDATE things SET tuser = ?, tname = ?, tphoto = ?, tdescription = ?, tlocation = ?, toptions = ? WHERE tid = ?";
      const [rows] = await conn.query(sql, [user, name, photo, description, location, options, id]);

      // View → feedback.
      res.json({ status: "success" });

    } catch {

      // Exibe mensagem de erro.
      res.json({ status: "error", message: error });

    }
  },


  delete: async (req, res) => {
    try {

      // Id da requisição
      const id = req.params.id;

      // Query
      const sql = "UPDATE things SET tstatus = 'off' WHERE tid = ?";
      const [rows] = await conn.query(sql, [id]);

      // View 
      res.json({ status: "success" });

    } catch {

      // Exibe mensagem de erro.
      res.json({ status: "error", message: error });
  }
}}

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
