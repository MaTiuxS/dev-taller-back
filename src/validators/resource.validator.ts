import { body, param, query } from "express-validator";

export const createResourceRules = [
  body("name")
    .isString()
    .trim()
    .isLength({ min: 3 })
    .withMessage("El nombre es obligatorio"),
  body("type")
    .isIn(["TECHNICIAN", "BAY"])
    .withMessage("El tipo debe ser TECHNICIAN o BAY"),
];

export const updateResourceRules = [
  param("id").isInt({ gt: 0 }).toInt(),
  body("name").optional().isString().trim(),
  body("type").optional().isIn(["TECHNICIAN", "BAY"]),
  body("isActive").optional().isBoolean(),
];

export const idParam = [param("id").isInt({ gt: 0 }).toInt()];

export const listResourceQuery = [
  query("search").optional().isString(),
  query("page").optional().isInt({ gt: 0 }).toInt(),
  query("limit").optional().isInt({ gt: 0, lt: 200 }).toInt(),
];
