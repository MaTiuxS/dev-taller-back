import { Prisma } from "@prisma/client";
import { prisma } from "../config/db";

type ListArgs = {
  plate?: string;
  customerId?: number;
  page?: number;
  limit?: number;
};
type Data = {
  plate: string;
  customerId: number;
  make?: string | null;
  model?: string | null;
  year?: number | null;
};

export class VehicleService {
  static async list({ plate, customerId, page = 1, limit = 10 }: ListArgs) {
    const where: Prisma.VehicleWhereInput = {};
    if (plate) {
      where.plate = {
        contains: plate.toUpperCase(),
        mode: Prisma.QueryMode.insensitive,
      };
    }
    if (customerId) {
      where.customerId = customerId;
    }

    const [items, total] = await Promise.all([
      prisma.vehicle.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: { customer: true },
      }),
      prisma.vehicle.count({ where }),
    ]);

    return { data: items, meta: { total, page, limit } };
  }

  static async getById(id: number) {
    return prisma.vehicle.findUnique({
      where: { id },
      include: { customer: true },
    });
  }

  static async create(data: Data) {
    const plate = data.plate.toUpperCase().trim();
    return prisma.vehicle.create({
      data: {
        plate,
        customerId: data.customerId,
        make: data.make ?? null,
        model: data.model ?? null,
        year: data.year ?? null,
      },
    });
  }

  static async update(id: number, data: Data) {
    const plate = data.plate.toUpperCase().trim();
    return prisma.vehicle.update({
      where: { id },
      data: {
        plate,
        customerId: data.customerId,
        make: data.make ?? null,
        model: data.model ?? null,
        year: data.year ?? null,
      },
    });
  }
}
