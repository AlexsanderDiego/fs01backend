import { Router } from "express";
import bcrypt from "bcrypt"; // Adicionando o encript de senha
import sql, { prisma } from "../config/db.js";

const usuarioRoutes = Router();

const selectFields = {
  id: true,
  email: true,
  usuario: true,
  nome: true,
};

//Retornando todos os usuários
usuarioRoutes.get("/usuarios", async (req, res) => {
  // const usuarios =
  //   await sql`SELECT id, nome, email, senha, usuario FROM usuarios`;
  const usuarios = await prisma.usuarios.findMany({
    select: selectFields,
  });

  res.send(usuarios);
});

//Retornando um único usuário pelo ID
usuarioRoutes.get("/usuarios/:id", async (req, res) => {
  const id = Number(req.params.id);

  //   const usuario =
  // await sql`SELECT id, nome, email, usuario FROM usuarios where id = ${id}`;
  const usuario = await prisma.usuarios.findUnique({
    where: {
      id: id,
    },
    select: selectFields,
  });

  res.send(usuario);
});

//Retornando um único usuário pelo usuario
usuarioRoutes.get("/usuarios/usuario/:usuario", async (req, res) => {
  const usuario = req.params.usuario;
  const usuarios = await prisma.usuarios.findUnique({
    where: {
      usuario: usuario,
    },
    select: selectFields,
  });

  res.send(usuarios);
});

//Adicionando Usuario
usuarioRoutes.post("/cadastrarusuarios", async (req, res) => {
  try {
    const user = req.body;

    // const senhaEncriptada = await bcrypt.hash(user.senha, 10);
    const senhaEncriptada = await bcrypt.hash(user.senha, 10);
    const usuario =
      //   await sql`INSERT INTO usuarios (nome, email, usuario, senha) VALUES (${user.nome}, ${user.email}, ${user.usuario}, ${senhaEncriptada})`;
      await prisma.usuarios.create({
        data: user,
      });

    res.status(201).send("User created successfully");
  } catch (error) {
    res.status(400).send({ error: error.sqlMessage });
  }
});

// Delete por ID
usuarioRoutes.delete("/apagarusuarios/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    // const usuarios = await sql`DELETE FROM usuarios where id = ${id}`;
    await prisma.usuarios.delete({
      where: {
        id: id,
      },
    });
    res.status(201).send("Usuario Deletado!");
  } catch (error) {
    res.status(400).send({ error: error.sqlMessage });
  }
});

// Atualizando o nome de usuário de um usuário por ID
usuarioRoutes.put("/usuarios/:id", async (req, res) => {
  // try {
  //   const id = req.params.id;
  //   const values = req.body;

  //   // await sql`UPDATE usuarios SET usuario = ${values} where id = ${id}`;
  //   await prisma.usuarios.update({
  //       data: {
  //           nome: values.nome,
  //           usuario: values.usuario,
  //           email: values.email
  //       }
  //   })
  
  //   const usuario =
  //     //   await sql`SELECT id, nome, email, usuario FROM usuarios where id = ${id}`;
  //     await prisma.usuarios.findUnique({
  //       where: {
  //         id: id,
  //       },
  //     });
  //   res.status(201).send(usuario);
  // } catch (error) {
  //   res.status(400).send({ error: error.message });
  // }
    try {
      const id = Number(req.params.id);
      const values = req.body;
  
      // Verifica se o usuário existe antes de tentar atualizar
      const usuarioExistente = await prisma.usuarios.findUnique({
        where: {
          id: id,
        },
      });
  
      if (!usuarioExistente) {
        return res.status(404).send({ error: 'Usuário não encontrado' });
      }
  
      // Atualiza os dados do usuário
      const usuarioAtualizado = await prisma.usuarios.update({
        where: {
          id: id,
        },
        data: {
          nome: values.nome,
          usuario: values.usuario,
          email: values.email,
        },
      });

      const usuario = await prisma.usuarios.findUnique({
        where: {
          id: id,
        },
        select: selectFields,
      });
  
      res.status(200).send(usuario);
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      res.status(400).send({ error: error.message || 'Erro desconhecido ao atualizar usuário' });
    }

  
});

// Atualizando a senha de um usuário por ID
usuarioRoutes.put("/usuarios/senha/:id", async (req, res) => {
  try {
    const loginUsuario = req.body;
    const id = req.params.id;
    const senhaAtual = loginUsuario.senhaAtual;
    const senhaEncriptada = await bcrypt.hash(loginUsuario.senhaNova, 10);
    const values = `${senhaEncriptada}`;

    const resposta = await sql`SELECT * FROM usuarios  where id = ${id}`;
    console.log(resposta);

    if (await bcrypt.compare(senhaAtual, resposta[0].senha)) {
      await sql`UPDATE usuarios SET senha = ${values} where id = ${id}`;

      const usuarios =
        await sql`SELECT id, nome, email, usuario FROM usuarios where id = ${id}`;
      res.status(201).send(usuarios);
    } else {
      res.status(501).send("senha errada");
    }
  } catch (error) {
    res.status(400).send({ error: error.sqlMessage });
  }
});

export { usuarioRoutes };
