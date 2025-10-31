import { prisma } from "../config/db";
import { randomBytes } from "crypto";

export class AppointmentsService {
  static async list({ from, to, status, page = 1, limit = 10 }: any) {
    const where: any = {};
    if (from || to)
      where.startAt = {
        gte: from ? new Date(from) : undefined,
        lte: to ? new Date(to) : undefined,
      };
    if (status) where.status = { in: String(status).split(",") };

    const [items, total] = await Promise.all([
      prisma.appointment.findMany({
        where,
        include: {
          customer: true,
          vehicle: true,
          service: true,
          resource: true,
        },
        orderBy: { startAt: "asc" },
        skip: (page - 1) * limit,
        take: 5,
      }),
      prisma.appointment.count({ where }),
    ]);

    return { data: items, meta: { page, limit, total } };
  }

  static async getById(id: number) {
    return prisma.appointment.findUnique({
      where: { id },
      include: {
        customer: true,
        vehicle: true,
        service: true,
        resource: true,
        workOrder: true,
        feedback: true,
      },
    });
  }

  static async create(data: any) {
    const srv = await prisma.service.findUnique({
      where: { id: data.serviceId },
    });
    if (!srv) throw new Error("Servicio no encontrado");

    const startAt = new Date(data.startAt);
    const endAt = new Date(startAt.getTime() + srv.durationMinutes * 60000);

    if (data.resourceId) {
      const overlap = await prisma.appointment.findFirst({
        where: {
          resourceId: data.resourceId,
          startAt: { lt: endAt },
          endAt: { gt: startAt },
          status: { in: ["PENDIENTE", "CONFIRMADA", "EN_PROCESO"] as any },
        },
      });
      if (overlap)
        throw new Error("Horario no disponible para el recurso seleccionado");
    }

    return prisma.appointment.create({
      data: {
        customerId: data.customerId,
        vehicleId: data.vehicleId,
        serviceId: data.serviceId,
        resourceId: data.resourceId ?? null,
        channel: data.channel ?? "WHATSAPP",
        status: "PENDIENTE",
        startAt,
        endAt,
        notes: data.notes ?? null,
        confirmationCode: randomBytes(4).toString("hex").toUpperCase(),
      },
    });
  }

  static async update(id: number, data: any) {
    const current = await prisma.appointment.findUnique({
      where: { id },
    });
    if (!current) {
      const err: any = new Error("Cita no encontrada");
      err.code = "P2025";
      throw err;
    }

    // recalcular endAt si cambia startAt o serviceId
    let startAt = data.startAt ? new Date(data.startAt) : current.startAt;
    let endAt = current.endAt;
    let serviceId = data.serviceId ?? current.serviceId;

    if (data.startAt || data.serviceId) {
      const srv = await prisma.service.findUnique({ where: { id: serviceId } });
      if (!srv) throw new Error("Servicio no encontrado");
      endAt = new Date(startAt.getTime() + srv.durationMinutes * 60000);
    }

    const resourceId = data.resourceId ?? current.resourceId;
    if (resourceId) {
      const overlap = await prisma.appointment.findFirst({
        where: {
          id: { not: id },
          resourceId,
          startAt: { lt: endAt },
          endAt: { gt: startAt },
          status: { in: ["PENDIENTE", "CONFIRMADA", "EN_PROCESO"] as any },
        },
      });
      if (overlap) throw new Error("Horario no disponible para el recurso");
    }

    return prisma.appointment.update({
      where: { id },
      data: { ...data, startAt, endAt, resourceId, serviceId },
    });
  }

  static async cancel(id: number) {
    const current = await prisma.appointment.findUnique({
      where: { id },
    });

    if (!current) {
      throw new Error("Cita no encontrada");
    }
    return prisma.appointment.update({
      where: { id },
      data: { status: "CANCELADA" },
    });
  }
}
