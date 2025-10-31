import { query } from "express-validator";

export const daySlotsRules = [
  query("serviceId")
    .isInt({ gt: 0 })
    .withMessage("Service id requerido")
    .toInt(),
  query("date").isISO8601().withMessage("La fecha debe ser YYYY-MM-DD"),
  query("resourceId")
    .optional()
    .isInt({ gt: 0 })
    .withMessage("Resource id debe ser un entero positivo")
    .toInt(),
];
