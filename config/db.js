import postgres from "postgres";
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

const sql = postgres({
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: process.env.DB_SSL,
});

export default sql;