import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "../config/db";

export const register = async (req: Request, res: Response) => {
  const { name, password } = req.body;

  const hash = await bcrypt.hash(password, 10);

  await db.query(
    "INSERT INTO users (name, passwordHash) VALUES (?, ?)",
    [name, hash]
  );

  res.json({ message: "User created" });
};

export const login = async (req: Request, res: Response) => {
  const { name, password } = req.body;

  const [rows]: any = await db.query(
    "SELECT * FROM users WHERE name = ?",
    [name]
  );

  const user = rows[0];

  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign({ id: user.id }, "SECRET");

  res.json({ token });
};