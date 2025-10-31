import { body, param, query } from "express-validator";

export const listServicesQuery = [
  query("active").optional().isBoolean().toBoolean(),
];

export const createServiceRules = [
  body("name")
    .isString()
    .isLength({ min: 3 })
    .withMessage("El nombre del servicio debe tener al menos 3 caracteres"),
  body("durationMinutes")
    .isInt({ gt: 0 })
    .withMessage("La duración debe ser un número entero positivo")
    .toInt(),
  body("basePrice")
    .optional()
    .isFloat({ gt: 0 })
    .withMessage("El precio debe ser un número decimal positivo")
    .toFloat(),
  body("isActive").optional().isBoolean().toBoolean(),
];

export const updateServiceRules = [
  param("id").isInt().toInt(),
  ...createServiceRules,
];

export const idParam = [param("id").isInt({ gt: 0 }).toInt()];
