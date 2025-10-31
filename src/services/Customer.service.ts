import { Prisma } from "@prisma/client";
import { prisma } from "../config/db";

type ListArgs = {
  search?: string;
  page?: number;
  limit?: number;
};

export class CustomerService {
  static async list({ search = "", page = 1, limit = 20 }: ListArgs) {
    const ors: Prisma.CustomerWhereInput[] = [];

    if (search) {
      // Campos de texto: usar modo insensitive
      ors.push({
        fullName: { contains: search, mode: Prisma.QueryMode.insensitive },
      });
      ors.push({
        email: { contains: search, mode: Prisma.QueryMode.insensitive },
      });

      // Teléfono: no tiene 'mode', solo contains
      ors.push({ phone: { contains: search } });
    }
    const where: Prisma.CustomerWhereInput | undefined = ors.length
      ? { OR: ors }
      : undefined;

    const [items, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.customer.count({ where }),
    ]);
    return { data: items, meta: { page, limit, total } };
  }

  static async getById(id: number) {
    return prisma.customer.findUnique({
      where: { id },
      include: {
        vehicles: true,
        appointments: {
          orderBy: { startAt: "desc" },
          take: 5,
          include: { vehicle: true, resource: true, service: true },
        },
      },
    });
  }

  static async upsert(data: {
    fullName: string;
    phone: string;
    email?: string;
  }) {
    return prisma.customer.upsert({
      where: { phone: data.phone },
      update: { fullName: data.fullName, email: data.email ?? null },
      create: {
        fullName: data.fullName,
        phone: data.phone,
        email: data.email ?? null,
      },
    });
  }

  static async update(id: number, data: any) {
    return prisma.customer.update({
      where: { id },
      data: {
        fullName: data.fullName,
        phone: data.phone,
        email: data.email ?? null,
      },
    });
  }
}
