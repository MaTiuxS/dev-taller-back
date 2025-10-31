import { Router } from "express";
import { authJWT } from "../middleware/authJWT";
import { validateRequest } from "../middleware/validation";
import { AvailabilityController } from "../controllers/Availability.controller";
import { daySlotsRules } from "../validators/availability.validator";

const router: Router = Router();

router.get(
  "/",
  authJWT,
  validateRequest(daySlotsRules),
  AvailabilityController.getDaySlots
);

export default router;
