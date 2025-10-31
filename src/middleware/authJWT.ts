import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { getEnv } from "../config/env";

export function authJWT(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "No autorizado" });
  }
  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "No autorizado" });
  }
  try {
    const decoded = jwt.verify(token, getEnv("JWT_SECRET"));
    (req as any).user = decoded;
    next();
    return;
  } catch (error) {
    return res.status(401).json({ error: "No autorizado" });
  }
}
