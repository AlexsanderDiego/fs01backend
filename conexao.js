const mariadb = require("mariadb");

const pool = mariadb.createPool({
  host: "localhost",
  user: "root",
  password: "12345",
  database: "cadastros",
  connectionLimit: 5,
});

async function conexao1() {
  let conexao = await pool.getConnection();
  const email = "carlos@email.com";

  const usuarios = await conexao.query(
    `SELECT * FROM usuarios where email = '${email}'`
  );

  console.log(usuarios);
  console.log('deu certo')
  // return conexao
}

conexao1()
// if (conexao1) {
// console.log('conectou');
// }

export default conexao1