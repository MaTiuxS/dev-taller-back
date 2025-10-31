import { prisma } from "../config/db";
import { comparePassword, hashPassword } from "../utils/auth";
import { generateJWT } from "../utils/jwt";

export class AuthService {
  static async login(email: string, password: string) {
    // Lógica de inicio de sesión

    const user = await prisma.user.findUnique({
      where: { email },
      include: { roluser: true },
    });

    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    const validPassword = await comparePassword(password, user.password);
    // console.log(validPassword);
    if (!validPassword) {
      throw new Error("Usuario o contraseña incorrectos");
    }

    const token = generateJWT({
      id: user.id,
      name: user.name,
      email: user.email,
      rolId: user.rolId,
    });

    return token;
  }

  static async register(data: {
    name: string;
    email: string;
    password: string;
    rolId: number;
  }) {
    // Lógica de registro de usuario
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });
    if (existingUser) {
      throw new Error("El correo electrónico ya está en uso");
    }

    const hashedPassword = await hashPassword(data.password);

    const newUser = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        rolId: data.rolId,
      },
    });

    return newUser;
  }

  static async getProfile(userId: number) {
    return prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        rolId: true,
        roluser: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }
  static async getAllUsers() {
    return prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        rolId: true,
        roluser: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }
}
