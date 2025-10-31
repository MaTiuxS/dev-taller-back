import jwt, { SignOptions } from "jsonwebtoken";
import { getEnv } from "../config/env";

export const generateJWT = (payload: object) => {
  const secret = getEnv("JWT_SECRET") as string;
  const options: SignOptions = { expiresIn: "1d" };
  const token = jwt.sign(payload, secret, options);
  return token;
};
