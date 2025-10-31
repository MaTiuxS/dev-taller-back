import { body } from "express-validator";

export const loginRules = [
  body("email")
    .isEmail()
    .withMessage("Correo electrónico inválido")
    .normalizeEmail()
    .trim(),
  body("password")
    .notEmpty()
    .withMessage("La contraseña no puede estar vacía")
    .trim(),
];

export const registerRules = [
  body("name")
    .isString()
    .withMessage("El nombre debe ser un texto")
    .isLength({ min: 5, max: 30 })
    .withMessage("El nombre debe tener entre 5 y 30 caracteres")
    .trim(),
  body("email")
    .isEmail()
    .withMessage("Correo electrónico inválido")
    .normalizeEmail()
    .trim(),
  body("password")
    .isLength({ min: 8 })
    .withMessage("La contraseña debe tener al menos 8 caracteres")
    .matches(/[A-Z]/)
    .withMessage("La contraseña debe contener al menos una letra mayúscula")
    .matches(/[a-z]/)
    .withMessage("La contraseña debe contener al menos una letra minúscula")
    .matches(/[0-9]/)
    .withMessage("La contraseña debe contener al menos un número")
    .matches(/[\W_]/)
    .withMessage("La contraseña debe contener al menos un carácter especial"),
];
