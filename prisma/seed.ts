import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const ADMIN_NAME = (process.env.ADMIN_NAME || "Super Admin").trim();
  const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || "admin@taller.com")
    .toLowerCase()
    .trim();
  const ADMIN_PASSWORD = (process.env.ADMIN_PASSWORD || "admin123").trim();

  // Asegurar que el rol de administrador existe
  const superRole = await prisma.rolUser.upsert({
    where: { name: "SUPERADMIN" },
    update: {},
    create: { name: "SUPERADMIN" },
  });

  // Crear o actualiza el usuario administrador
  const hash = await bcrypt.hash(ADMIN_PASSWORD, 10);

  await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: {
      name: ADMIN_NAME,
      password: hash,
      rolId: superRole.id,
    },
    create: {
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: hash,
      rolId: superRole.id,
    },
  });
  console.log("Usuario administrador asegurado en la base de datos.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
