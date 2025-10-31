import { Request, Response } from "express";
import { AvailabilityService } from "../services/Availability.service";

export class AvailabilityController {
  static async getDaySlots(req: Request, res: Response) {
    const { serviceId, date, resourceId } = req.query as any;

    try {
      const data = await AvailabilityService.getDaySlots({
        serviceId: Number(serviceId),
        date,
        resourceId: resourceId ? Number(resourceId) : undefined,
      });
      return res.json(data);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
}
