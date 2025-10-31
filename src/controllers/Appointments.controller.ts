import { Request, Response } from "express";
import { AppointmentsService } from "../services/Appointments.service";

export class AppointmentsController {
  static async list(req: Request, res: Response) {
    const data = await AppointmentsService.list(req.query as any);
    return res.json(data);
  }

  static async getById(req: Request, res: Response) {
    const id = Number(req.params.id);
    const a = await AppointmentsService.getById(id);
    if (!a) return res.status(404).json({ error: "Cita no encontrada" });
    return res.json(a);
  }

  static async create(req: Request, res: Response) {
    try {
      const a = await AppointmentsService.create(req.body);
      return res.status(201).json(a);
    } catch (e: any) {
      return res.status(400).json({ error: e.message });
    }
  }

  static async update(req: Request, res: Response) {
    const id = Number(req.params.id);
    try {
      const a = await AppointmentsService.update(id, req.body);
      return res.json(a);
    } catch (e: any) {
      if (e.code === "P2025")
        return res.status(404).json({ error: "Cita no encontrada" });
      return res.status(400).json({ error: e.message });
    }
  }

  static async cancel(req: Request, res: Response) {
    const id = Number(req.params.id);
    try {
      const a = await AppointmentsService.cancel(id);
      return res.json(a);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}
