import type { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

export function validateRequest(rules: any[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(rules.map((rule) => rule.run(req)));

    const result = validationResult(req);
    if (!result.isEmpty()) {
      const errors = result.array().map((e) => ({
        path: e.type === "field" ? e.path : e.type,
        message: e.msg,
      }));
      res.status(400).json({ errors });
      return;
    }

    next();
  };
}
