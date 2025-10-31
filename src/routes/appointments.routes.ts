import { Router } from "express";
import { authJWT } from "../middleware/authJWT";
import { validateRequest } from "../middleware/validation";
import {
  createAppointmentRules,
  idParam,
  listAppointmentsQuery,
  updateAppointmentRules,
} from "../validators/appointments.validator";
import { AppointmentsController } from "../controllers/Appointments.controller";
const router: Router = Router();

router.get(
  "/",
  authJWT,
  validateRequest(listAppointmentsQuery),
  AppointmentsController.list
);
router.get(
  "/:id",
  authJWT,
  validateRequest(idParam),
  AppointmentsController.getById
);
router.post(
  "/",
  authJWT,
  validateRequest(createAppointmentRules),
  AppointmentsController.create
);
router.patch(
  "/:id",
  authJWT,
  validateRequest(updateAppointmentRules),
  AppointmentsController.update
);
router.delete(
  "/:id",
  authJWT,
  validateRequest(idParam),
  AppointmentsController.cancel
);

export default router;
