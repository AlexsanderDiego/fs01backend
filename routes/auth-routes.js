import { Router } from "express";
import bcrypt from "bcrypt"; // Adicionando o encript de senha
import sql, { prisma } from "../config/db.js";

const authRoutes = Router();

//Login
authRoutes.post("/auth/login", async (req, res) => {
    const loginUsuario = req.body;
  
    // const resposta =
    //   await sql`SELECT * FROM usuarios  where email = ${loginUsuario.email}`;
      const resposta =  await prisma.usuarios.findMany({
        where: {
          email: loginUsuario.email,
        },
      });
      console.log(resposta);
      console.log(resposta.length);
  
    if (
      resposta.length &&
      (await bcrypt.compare(loginUsuario.senha, resposta[0].senha))
    ) {
      const usuario = resposta[0];
  
      delete usuario.senha;
      console.log("authenticated login");
      res.send(usuario);
    } else {
      res.status(401).send("Não autorizado");
      console.log("unauthenticated login");
    }
  });

  export { authRoutes }