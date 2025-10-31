import { prisma } from "../config/db";
import { Prisma } from "@prisma/client";

export class ResourceService {
  static async list({ search = "", page = 1, limit = 20 }: any) {
    const where: Prisma.ResourceWhereInput = search
      ? {
          name: { contains: search, mode: Prisma.QueryMode.insensitive },
        }
      : {};

    const [items, total] = await Promise.all([
      prisma.resource.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.resource.count({ where }),
    ]);

    return { data: items, meta: { total, page, limit } };
  }

  static async getById(id: number) {
    return prisma.resource.findUnique({
      where: { id },
      include: { appointments: true },
    });
  }

  static async create(data: { name: string; type: string }) {
    return prisma.resource.create({
      data: {
        name: data.name.trim(),
        type: data.type as any, // 'TECHNICIAN' o 'BAY'
      },
    });
  }

  static async update(
    id: number,
    data: { name?: string; type?: string; isActive?: boolean }
  ) {
    return prisma.resource.update({
      where: { id },
      data: {
        name: data.name?.trim(),
        type: data.type ? (data.type as any) : undefined,
        isActive: data.isActive ?? undefined,
      },
    });
  }

  static async remove(id: number) {
    return prisma.resource.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
