import { Request, Response, NextFunction } from "express";

export function requireRole(...ids: number[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!user) return res.status(401).json({ message: "No autenticado" });

    if (!Number.isInteger(user.rolId) || !ids.includes(user.rolId)) {
      return res.status(403).json({ message: "Acceso denegado" });
    }
    next();
    return;
  };
}
