import { Request, Response } from "express";
import { ResourceService } from "../services/Resource.service";

export class ResourceController {
  static async list(req: Request, res: Response) {
    const data = await ResourceService.list(req.query);
    return res.json(data);
  }

  static async getById(req: Request, res: Response) {
    const id = Number(req.params.id);
    const resource = await ResourceService.getById(id);
    if (!resource)
      return res.status(404).json({ error: "Recurso no encontrado" });
    return res.json(resource);
  }

  static async create(req: Request, res: Response) {
    try {
      const r = await ResourceService.create(req.body);
      return res.status(201).json(r);
    } catch (e: any) {
      if (e.code === "P2002")
        return res
          .status(409)
          .json({ error: "Ya existe un recurso con ese nombre y tipo" });
      return res.status(400).json({ error: e.message });
    }
  }

  static async update(req: Request, res: Response) {
    const id = Number(req.params.id);
    try {
      const r = await ResourceService.update(id, req.body);
      return res.json(r);
    } catch (e: any) {
      if (e.code === "P2025")
        return res.status(404).json({ error: "Recurso no encontrado" });
      if (e.code === "P2002")
        return res
          .status(409)
          .json({ error: "Ya existe un recurso con ese nombre y tipo" });
      return res.status(400).json({ error: e.message });
    }
  }

  static async remove(req: Request, res: Response) {
    const id = Number(req.params.id);
    try {
      const r = await ResourceService.remove(id);
      return res.json(r);
    } catch (e: any) {
      return res.status(400).json({ error: e.message });
    }
  }
}
