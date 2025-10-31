// src/validators/appointment.validator.ts
import { body, query, param } from "express-validator";

export const createAppointmentRules = [
  body("customerId").isInt({ gt: 0 }).toInt(),
  body("vehicleId").isInt({ gt: 0 }).toInt(),
  body("serviceId").isInt({ gt: 0 }).toInt(),
  body("startAt").isISO8601().withMessage("La fecha debe ser YYYY-MM-DD"),
  body("resourceId").optional().isInt({ gt: 0 }).toInt(),
  body("channel")
    .optional()
    .isIn(["WHATSAPP", "WEB", "PERSONAL"])
    .default("WHATSAPP"),
  body("notes").optional().isString().isLength({ max: 2000 }).trim(),
];

export const updateAppointmentRules = [
  param("id").isInt({ gt: 0 }).toInt(),
  body("startAt").optional().isISO8601(),
  body("endAt").optional().isISO8601(),
  body("status")
    .optional()
    .isIn(["PENDIENTE", "CONFIRMADA", "EN_PROCESO", "COMPLETADA", "CANCELADA"]),
  body("resourceId").optional().isInt({ gt: 0 }).toInt(),
  body("notes").optional().isString().isLength({ max: 2000 }).trim(),
];

export const listAppointmentsQuery = [
  query("from").optional().isISO8601(),
  query("to").optional().isISO8601(),
  query("status").optional().isString(),
  query("page").optional().isInt({ min: 1 }).toInt(),
  query("limit").optional().isInt({ min: 1, max: 100 }).toInt(),
];

export const idParam = [param("id").isInt({ gt: 0 }).toInt()];
