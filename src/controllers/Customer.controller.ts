import { Request, Response } from "express";
import { CustomerService } from "../services/Customer.service";

export class CustomerController {
  static async list(req: Request, res: Response) {
    const {
      search = "",
      page = 1,
      limit = 20,
    } = req.query as {
      search?: string;
      page?: string | number;
      limit?: string | number;
    };

    const data = await CustomerService.list({
      search,
      page: Number(page),
      limit: Number(limit),
    });
    res.json(data);
  }

  static async getById(req: Request, res: Response) {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ error: "ID inválido" });
    }

    const customer = await CustomerService.getById(id);
    if (!customer) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }
    return res.json(customer);
  }

  // Crear o actualizar según teléfono
  static async upsert(req: Request, res: Response) {
    const { fullName, phone, email } = req.body;

    if (!fullName || !phone) {
      return res
        .status(400)
        .json({ error: "fullName y phone son campos requeridos" });
    }

    try {
      const c = await CustomerService.upsert({ fullName, phone, email });
      return res.status(201).json(c);
    } catch (e: any) {
      // opcional: manejar errores Prisma (duplicados, etc.)
      if (e.code === "P2002") {
        return res
          .status(409)
          .json({ error: "Teléfono o correo ya existente" });
      }
      return res.status(400).json({ error: e.message });
    }
  }

  // Actualizar por ID
  static async update(req: Request, res: Response) {
    const id = Number(req.params.id);
    const { fullName, phone, email } = req.body;
    if (isNaN(id)) {
      return res.status(400).json({ error: "ID inválido" });
    }
    try {
      const c = await CustomerService.update(id, { fullName, phone, email });
      return res.json(c);
    } catch (e: any) {
      if (e.code === "P2002") {
        return res
          .status(409)
          .json({ error: "Teléfono o correo ya existente" });
      }
      if (e.code === "P2025") {
        return res.status(404).json({ error: "Cliente no encontrado" });
      }
      return res.status(400).json({ error: e.message });
    }
  }
}
