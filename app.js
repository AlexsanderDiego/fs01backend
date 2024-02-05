const express = require("express");
const cors = require("cors"); // Adicionando o módulo CORS
const mariadb = require("mariadb"); // Adicionando o banco de dados Mariadb
const bcrypt = require("bcrypt"); // Adicionando o encript de senha

const server = express();

const pool = mariadb.createPool({
  host: "localhost",
  user: "root",
  password: "12345",
  database: "cadastros",
  connectionLimit: 5,
});

server.use(express.json());

// Middleware CORS
server.use(cors());

server.post("/auth/login", async (req, res) => {
  let conexao = await pool.getConnection();

  const loginUsuario = req.body;

  //Autorização de Login
  const resposta = await conexao.query(
    `SELECT * FROM usuarios  where email = '${loginUsuario.email}'`
  );

  if (
    resposta.length &&
    (await bcrypt.compare(loginUsuario.senha, resposta[0].senha))
  ) {
    const usuario = resposta[0];

    delete usuario.senha;

    res.send(usuario);
  } else {
    res.status(401).send("Não autorizado");
  }
});

//Retornando todos os usuários
server.get("/usuarios", async (req, res) => {
  let conexao = await pool.getConnection();

  const usuarios = await conexao.query(
    `SELECT id, nome, email, usuario FROM usuarios`
  );
  res.send(usuarios);
});

//Retornando um único usuário pelo ID
server.get("/usuarios/:id", async (req, res) => {
  let conexao = await pool.getConnection();

  const id = req.params.id;

  const usuarios = await conexao.query(
    `SELECT id, nome, email, usuario FROM usuarios where id = '${id}'`
  );
  res.send(usuarios);
});

//Adicionando Usuario
server.post("/usuarios", async (req, res) => {
  let conexao = await pool.getConnection();

  try {
    const user = req.body;

    const senhaEncriptada = await bcrypt.hash(user.senha, 10);
    const values = `'${user.nome}', '${user.email}', '${user.usuario}', '${senhaEncriptada}'`;
    await conexao.query(
      `INSERT INTO usuarios (nome, email, usuario, senha) values (${values})`
    );
    res.sendStatus(201);
  } catch (error) {
    res.status(400).send({ error: error.sqlMessage });
  }
});

// Delete por ID
server.delete("/usuarios/:id", async (req, res) => {
  let conexao = await pool.getConnection();

  try {
    const id = req.params.id;

    const usuarios = await conexao.query(
      `DELETE FROM usuarios where id = '${id}'`
    );
    res.status(201).send("Usuario Deletado!");
  } catch (error) {
    res.status(400).send({ error: error.sqlMessage });
  }
});

// Atualizando o nome de usuário de um usuário por ID
server.put("/usuarios/:id", async (req, res) => {
  let conexao = await pool.getConnection();

  try {
    const id = req.params.id;
    const values = `'${req.body.usuario}'`;

    await conexao.query(
      `UPDATE usuarios SET usuario = ${values} where id = ${id}`
    );

    const usuarios = await conexao.query(
      `SELECT id, nome, email, usuario FROM usuarios where id = '${id}'`
    );
    res.status(201).send(usuarios);
  } catch (error) {
    res.status(400).send({ error: error.sqlMessage });
  }
});

// Atualizando a senha de um usuário por ID
server.put("/usuarios/senha/:id", async (req, res) => {
  let conexao = await pool.getConnection();

  try {
    const loginUsuario = req.body
    const id = req.params.id;
    const senhaAtual = loginUsuario.senhaAtual;
    const senhaEncriptada = await bcrypt.hash(loginUsuario.senhaNova, 10);
    const values = `'${senhaEncriptada}'`;

    const resposta = await conexao.query(
      `SELECT * FROM usuarios  where id = '${id}'`
    );

    if (await bcrypt.compare(senhaAtual, resposta[0].senha)) {
      await conexao.query(
        `UPDATE usuarios SET senha = ${values} where id = ${id}`
      );

      const usuarios = await conexao.query(
        `SELECT id, nome, email, usuario FROM usuarios where id = '${id}'`
      );
      res.status(201).send(usuarios);
    } else {
      res.status(501).send("senha errada");
    }
  } catch (error) {
    res.status(400).send({ error: error.sqlMessage });
  }
});

server.listen(8080, () => {
  console.log("Servidor está rodando na porta 8080");
});
