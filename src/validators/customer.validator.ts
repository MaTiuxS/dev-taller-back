import { body, param, query } from "express-validator";

export const upsertCustomerRules = [
  body("fullName")
    .notEmpty()
    .withMessage("El nombre completo es obligatorio")
    .isString()
    .withMessage("El nombre completo debe ser una cadena de texto")
    .isLength({ min: 10, max: 30 })
    .withMessage("El nombre completo debe tener entre 10 y 30 caracteres"),

  body("phone")
    .notEmpty()
    .withMessage("El número de teléfono es obligatorio")
    .isString()
    .withMessage("El número de teléfono debe ser una cadena de texto")
    .customSanitizer((v) => String(v).replace(/\s|-/g, ""))
    .isLength({ min: 8, max: 8 })
    .withMessage("El número de teléfono debe tener entre 8 y 8 caracteres"),

  body("email")
    .optional({ nullable: true })
    .isEmail()
    .withMessage("Correo inválido")
    .normalizeEmail(),
];

export const listCustomersQuery = [
  query("search").optional().isString().trim(),
  query("page").optional().isInt({ min: 1 }).toInt(),
  query("limit").optional().isInt({ min: 1, max: 100 }).toInt(),
];

export const getByIdParam = [
  param("id").isInt({ gt: 0 }).withMessage("Id inválido").toInt(),
];

export const updateCustomerRules = [
  param("id").isInt({ gt: 0 }).toInt(),
  ...upsertCustomerRules,
];
