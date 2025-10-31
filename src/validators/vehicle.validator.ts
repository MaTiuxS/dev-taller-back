import { body, param, query } from "express-validator";

export const listVehiclesQuery = [
  query("plate").optional().isString().trim(),
  query("customerId").optional().isInt({ gt: 0 }).toInt(),
  query("page").optional().isInt({ min: 1 }).toInt(),
  query("limit").optional().isInt({ min: 1, max: 100 }).toInt(),
];

export const createVehicleRules = [
  body("plate")
    .notEmpty()
    .withMessage("La placa es obligatoria")
    .customSanitizer((v) => String(v).toUpperCase().trim())
    .matches(/^[A-Z0-9-]{5,10}$/)
    .withMessage("Placa inválida (5-10, letras/números/guión)"),
  body("customerId")
    .isInt({ gt: 0 })
    .withMessage("Id cliente inválido")
    .toInt(),
  body("make").optional().isString().trim(),
  body("model").optional().isString().trim(),
  body("year").optional().isInt({ min: 1920, max: 2030 }).toInt(),
];

export const updateVehicleRules = [
  param("id").isInt({ gt: 0 }).toInt(),
  ...createVehicleRules,
];

export const idParam = [param("id").isInt({ gt: 0 }).toInt()];
