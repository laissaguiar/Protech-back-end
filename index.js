const express = require("express");
var mysql = require('mysql');
const router = express.Router();
var cors = require('cors');

const app = express();

app.use(express.json());

app.use(cors());

var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "Alto_falante"
});

connection.connect(function (err) {
  if (err) {
    console.error('Error connecting: ' + err.stack);
    return;
  }
  console.log('Connected as id ' + connection.threadId);
});

app.post("/cadastro", function (req, res) {
  connection.query(`INSERT INTO Usuario (nome, senha, usuario) VALUES ('${req.body.nome}', '${req.body.senha}', '${req.body.usuario}');`, function (err, result, fields) {
    console.log(err);
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        res.status(200).send('Usuário já existe.');
      }
    } else {
      res.set('Access-Control-Allow-Origin', '*');
      res.status(200).send("Sucesso");
    }
  });
});

app.post("/login", function (req, res) {
  connection.query(`SELECT * FROM Usuario WHERE usuario='${req.body.usuario}' AND senha='${req.body.senha}';`, function (err, result, fields) {
    if (err) {
      res.status(400).send(err);
    }
    console.log(typeof result);
    res.set('Access-Control-Allow-Origin', '*');

    if (Object.keys(result).length === 0) {
      res.status(200).send("Incorreto!");
    } else {
      res.status(200).send("Login efetuado com sucesso!");
    }
  });
});

app.get("/altofalantes", function (req, res) {
  connection.query("SELECT * FROM Alto_falante", function (err, result, fields) {
    if (err) {
      res.status(400).send('Erro ao consultar altofalantes.');
    };
    res.set('Access-Control-Allow-Origin', '*');
    res.status(200).send(result);
  });
});

app.get("/altofalantes/find-it", function (req, res) {
  connection.query(`SELECT nome FROM Alto_falante WHERE 
    tamanho='${req.query.tamanho}' AND 
    prioridade='${req.query.prioridade}' AND 
    alcance='${req.query.alcance}' AND 
    impiedancia_ohms='${req.query.impiedancia}'`, function (err, result, fields) {
    console.log(typeof result);
    // if (Object.keys(result).length === 0) {
    //   res.status(400).send('Erro ao consultar altofalantes.');
    // }
    res.set('Access-Control-Allow-Origin', '*');
    res.status(200).send(result);
  });
});

app.listen(3333);