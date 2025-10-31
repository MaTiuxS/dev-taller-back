import { Request, Response } from "express";
import { ServiceService } from "../services/Service.service";
import { prisma } from "../config/db";

export class ServiceController {
  static async list(req: Request, res: Response) {
    const { active } = req.query as { active?: string | boolean };

    const data = await ServiceService.list({
      active:
        active === undefined ? undefined : active === "true" || active === true,
    });
    return res.json(data);
  }

  static async getById(req: Request, res: Response) {
    const id = Number(req.params.id);
    const s = await ServiceService.getById(id);
    if (!s) {
      return res.status(404).json({ message: "Servicio no encontrado" });
    }
    return res.json(s);
  }

  static async create(req: Request, res: Response) {
    const existService = await prisma.service.findFirst({
      where: { name: req.body.name.trim() },
    });
    if (existService) {
      return res
        .status(400)
        .json({ message: "Ya existe un servicio con ese nombre" });
    }
    const s = await ServiceService.create(req.body);
    return res.status(201).json(s);
  }
  static async update(req: Request, res: Response) {
    const id = Number(req.params.id);
    const s = await ServiceService.update(id, req.body);
    return res.json(s);
  }

  static async remove(req: Request, res: Response) {
    const id = Number(req.params.id);
    const s = await ServiceService.remove(id);
    return res.json(s);
  }
}
