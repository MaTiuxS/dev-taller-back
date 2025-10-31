import type { Request, Response } from "express";

import { AuthService } from "../services/Auth.service";

export class AuthController {
  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const data = await AuthService.login(email, password);
      return res.status(200).json(data);
    } catch (error) {
      return res.status(401).json({ error: (error as Error).message });
    }
  }

  static async register(req: Request, res: Response) {
    try {
      const { name, email, password, rolId } = req.body; // saneado por validate()
      // console.log(name, email, password, rolId);
      const result = await AuthService.register({
        name,
        email,
        password,
        rolId,
      });
      return res.status(201).json(result);
    } catch (error: any) {
      return res.status(400).json(error.message);
    }
  }

  static async getRoles(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      const profile = await AuthService.getProfile(userId);
      if (!profile)
        return res.status(404).json({ error: "Usuario no encontrado" });
      return res.status(200).json(profile);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
  static async getAllUsers(req: Request, res: Response) {
    try {
      req;
      const users = await AuthService.getAllUsers();
      return res.status(200).json(users);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}
