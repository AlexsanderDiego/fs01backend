const express = require('express');
const cors = require('cors'); // Adicionando o módulo CORS

const server = express();

const usuarios = [
  {
    email: 'test@example.com',
    senha: '123'
  },
  {
    email: 'usuario@example.com',
    senha: '123'
  },
];

server.use(express.json());

// Middleware CORS
server.use(cors());

server.post('/login', (req, res) => {
  const usuarioEncontrado = usuarios.find((usuario) => usuario.email == req.body.email);

  if (usuarioEncontrado != null && req.body.senha == usuarioEncontrado.senha) {
    res.send('OK..Login Autorizado');
  } else {
    res.status(401).send('Não Autorizado');
  }
});

server.listen(8080, () => {
  console.log('Servidor está rodando na porta 8080');
});
