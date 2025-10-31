import { Request, Response } from "express";
import { VehicleService } from "../services/Vehicle.service";

type ListQuery = {
  plate?: string;
  customerId?: string | number;
  page?: string | number;
  limit?: string | number;
};
type Body = {
  plate: string;
  customerId: number;
  make?: string;
  model?: string;
  year?: number;
};
type IdParams = { id: string };

export class VehicleController {
  static async list(req: Request<{}, any, any, ListQuery>, res: Response) {
    const { plate, customerId, page, limit } = req.query;
    const data = await VehicleService.list({
      plate,
      customerId: customerId ? Number(customerId) : undefined,
      page: Number(page),
      limit: Number(limit),
    });
    return res.json(data);
  }

  static async getById(req: Request<IdParams>, res: Response) {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Id inválido" });
    }

    const v = await VehicleService.getById(id);
    if (!v) {
      return res.status(404).json({ error: "Vehículo no encontrado" });
    }

    return res.json(v);
  }

  static async create(req: Request<{}, any, Body>, res: Response) {
    const { plate, customerId, make, model, year } = req.body;
    try {
      const v = await VehicleService.create({
        plate,
        customerId,
        make,
        model,
        year,
      });
      return res.status(201).json(v);
    } catch (e: any) {
      if (e.code === "P2002")
        return res.status(409).json({ error: "La placa ya existe" });
      if (e.code === "P2003")
        return res.status(400).json({ error: "El cliente no existe" });
      return res.status(400).json({ error: e.message });
    }
  }

  static async update(req: Request<IdParams, any, Body>, res: Response) {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "ID inválido" });

    const { plate, customerId, make, model, year } = req.body;
    try {
      const v = await VehicleService.update(id, {
        plate,
        customerId,
        make,
        model,
        year,
      });
      return res.json(v);
    } catch (e: any) {
      if (e.code === "P2025")
        return res.status(404).json({ error: "Vehículo no encontrado" });
      if (e.code === "P2002")
        return res.status(409).json({ error: "La placa ya existe" });
      if (e.code === "P2003")
        return res.status(400).json({ error: "El cliente no existe" });
      return res.status(400).json({ error: e.message });
    }
  }
}
