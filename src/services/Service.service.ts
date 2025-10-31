import { prisma } from "../config/db";

export class ServiceService {
  static async list({ active }: { active?: boolean }) {
    return prisma.service.findMany({
      where: active === undefined ? {} : { isActive: !!active },
      orderBy: { name: "asc" },
    });
  }

  static async getById(id: number) {
    return prisma.service.findUnique({ where: { id } });
  }

  static async create(data: any) {
    return prisma.service.create({
      data: {
        name: data.name.trim(),
        durationMinutes: Number(data.durationMinutes),
        basePrice: data.basePrice ?? null,
        isActive: data.isActive ?? true,
      },
    });
  }

  static async update(id: number, data: any) {
    const existServiceName = await prisma.service.findFirst({
      where: {
        name: data.name?.trim(),
      },
    });

    if (existServiceName?.name !== data.name) {
      return prisma.service.update({
        where: { id },
        data: {
          name: data.name?.trim(),
          durationMinutes: data.durationMinutes
            ? Number(data.durationMinutes)
            : undefined,
          basePrice: data.basePrice ?? undefined,
          isActive: data.isActive ?? undefined,
        },
      });
    }

    return prisma.service.update({
      where: { id },
      data: {
        durationMinutes: data.durationMinutes
          ? Number(data.durationMinutes)
          : undefined,
        basePrice: data.basePrice ?? undefined,
        isActive: data.isActive ?? undefined,
      },
    });
  }

  // soft-delete
  static async remove(id: number) {
    const isActiveService = await prisma.service.findUnique({
      where: { id },
      select: { isActive: true },
    });
    if (!isActiveService) {
      throw new Error("Servicio no encontrado");
    }

    return prisma.service.update({
      where: { id },
      data: { isActive: !isActiveService.isActive },
    });
  }
}
