import { prisma } from "../config/db";

type Args = { serviceId: number; date: string; resourceId?: number };

export class AvailabilityService {
  static businessHours = {
    startHour: 8,
    endHour: 18,
  };
  static stepMinutes = 30;

  static async getDaySlots({ serviceId, date, resourceId }: Args) {
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
    });
    if (!service) {
      throw new Error("Servicio no encontrado");
    }

    const durationMs = service.durationMinutes * 60000;
    const dayStart = new Date(`${date}T00:00:00.000Z`);
    const dayEnd = new Date(`${date}T23:59:59.999Z`);

    const appts = await prisma.appointment.findMany({
      where: {
        startAt: { gte: dayStart, lte: dayEnd },
        status: { in: ["PENDIENTE", "CONFIRMADA", "EN_PROCESO"] as any },
        ...(resourceId ? { resourceId } : {}),
      },
      select: { startAt: true, endAt: true, resourceId: true },
    });

    let resources = await prisma.resource.findMany({
      where: { isActive: true },
    });

    if (resourceId) resources = resources.filter((r) => r.id === resourceId);

    if (resources.length === 0) resources.push({ id: 0 } as any);

    const slots: Array<{ startAt: string; endAt: string; resourceId: number }> =
      [];

    for (
      let h = this.businessHours.startHour;
      h <= this.businessHours.endHour;
      h++
    ) {
      for (let m = 0; m < 60; m += this.stepMinutes) {
        const startAt = new Date(
          `${date}T${String(h).padStart(2, "0")}:${String(m).padStart(
            2,
            "0"
          )}:00.000Z`
        );
        const endAt = new Date(startAt.getTime() + durationMs);

        // fuera de horario
        if (
          endAt.getUTCHours() > this.businessHours.endHour ||
          (h === this.businessHours.endHour && m > 0)
        )
          continue;

        // busca un recurso libre
        let freeResId: number | null = null;
        for (const r of resources) {
          const overlaps = appts.some(
            (a) =>
              a.resourceId === (r as any).id &&
              a.startAt < endAt &&
              a.endAt > startAt
          );
          if (!overlaps) {
            freeResId = (r as any).id;
            break;
          }
        }
        if (freeResId !== null) {
          slots.push({
            startAt: startAt.toISOString(),
            endAt: endAt.toISOString(),
            resourceId: freeResId,
          });
        }
      }
    }

    return slots;
  }
}
