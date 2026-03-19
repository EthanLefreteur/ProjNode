import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: { id: number; name: string };
    }
  }
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies?.token;
  console.log(req.cookies);

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: missing token" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number; name: string };
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized: invalid token" });
  }
};