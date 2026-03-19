import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../config/db";

export const register = async (req: Request, res: Response) => {
  console.log(req);
  const { name, password } = req.body;

  const hash = await bcrypt.hash(password, 10);

  await pool.query(
    "INSERT INTO users (name, passwordHash) VALUES (?, ?)",
    [name, hash]
  );

  res.json({ message: "User created" });
};


export const login = async (req: Request, res: Response) => {
  const { name, password } = req.body;

  const connection = await pool.getConnection();
  const [dbUsers]: any = await connection.query(
    "SELECT * FROM users WHERE name = ?",
    [name]
  );
  connection.release();

  if (dbUsers.length === 0) {
    return res.sendStatus(401);
  }

  const dbUser = dbUsers[0];
  const valid = await bcrypt.compare(password, dbUser.passwordHash);

  if (!valid) {
    return res.sendStatus(401);
  }

  // Create JWT
  const token = jwt.sign(
    { id: dbUser.id, name: dbUser.name },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  // Send JWT as HTTP-only cookie
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // only use HTTPS in production
    sameSite: "strict",
    maxAge: 60 * 60 * 1000, // 1 hour
  });

  res.json({ message: "Login OK", user: dbUser.name });
};