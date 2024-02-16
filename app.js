import cors from "cors"; // Adicionando o módulo CORS
import 'dotenv/config';
import express from "express";
import { authRoutes } from "./routes/auth-routes.js";
import { usuarioRoutes } from "./routes/usuario-routes.js";


const server = express();

server.use(express.json());

// Middleware CORS
server.use(cors());

//Rota Login
server.use(authRoutes)

//Rota Usuarios 
server.use(usuarioRoutes)

server.listen(8080, () => {
  console.log("Servidor está rodando na porta 8080");
});
