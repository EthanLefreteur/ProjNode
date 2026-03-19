import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../config/db";

export const register = async (req: Request, res: Response) => {
  const { name, password } = req.body;

  const hash = await bcrypt.hash(password, 10);

  await pool.query(
    "INSERT INTO users (name, passwordHash) VALUES (?, ?)",
    [name, hash]
  );

  res.json({ message: "User created" });
};


export const login = async (req: any, res: any) => {
  const { name, password } = req.body;

  const connection = await pool.getConnection();

  const [dbUsers]: any = await connection.query(
    "SELECT * FROM users WHERE name = ?",
    [name]
  );

  connection.release();

  if (dbUsers.length === 0) {
    res.sendStatus(401);
    return;
  }

  const dbUser = dbUsers[0];

  const valid = await bcrypt.compare(password, dbUser.passwordHash);

  if (!valid) {
    res.sendStatus(401);
    return;
  }

  res.json({ message: "Login OK", user: dbUser.name });
};