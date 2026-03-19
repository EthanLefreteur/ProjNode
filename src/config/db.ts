import mysql from "mysql2/promise";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

dotenv.config();

export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// ✅ Vérifie si les tables existent
export async function schemaExist() {
  const connection = await pool.getConnection();

  const [tables]: any = await connection.query("SHOW TABLES");

  const usersTableExists = tables.some(
    (table: any) =>
      table["Tables_in_" + process.env.DB_NAME] === "users"
  );

  connection.release();
  return usersTableExists;
}

// ✅ Création des tables
export async function createSchema() {
  const connection = await pool.getConnection();

  console.log("Creating tables...");

  // USERS
  await connection.query(`
    CREATE TABLE users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255),
      passwordHash VARCHAR(255)
    )
  `);

  // RECIPES
  await connection.query(`
    CREATE TABLE recipes (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255),
      ingredients TEXT,
      servings INT,
      oven BOOLEAN,
      equipment BOOLEAN,
      exotic BOOLEAN,
      country VARCHAR(255),
      price INT,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      authorId INT,
      views INT DEFAULT 0,
      FOREIGN KEY (authorId) REFERENCES users(id)
    )
  `);

  // USER TEST
  const hash = await bcrypt.hash("ioupi", 10);

  await connection.query(
    "INSERT INTO users(name,passwordHash) VALUES (?, ?)",
    ["remy", hash]
  );

  connection.release();

  console.log("Database created!");
}

// ❌ Supprimer les tables (debug)
export async function deleteSchema() {
  const connection = await pool.getConnection();

  await connection.query("DROP TABLE IF EXISTS recipes");
  await connection.query("DROP TABLE IF EXISTS users");

  connection.release();

  console.log("Database deleted!");
}