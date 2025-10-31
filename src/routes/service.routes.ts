import { Router } from "express";
import { authJWT } from "../middleware/authJWT";
import { validateRequest } from "../middleware/validation";
import { ServiceController } from "../controllers/Service.controller";
import {
  createServiceRules,
  listServicesQuery,
  updateServiceRules,
} from "../validators/service.validator";
import { idParam } from "../validators/vehicle.validator";

const router: Router = Router();

router.get(
  "/",
  authJWT,
  validateRequest(listServicesQuery),
  ServiceController.list
);
router.get(
  "/:id",
  authJWT,
  validateRequest(idParam),
  ServiceController.getById
);
router.post(
  "/",
  authJWT,
  validateRequest(createServiceRules),
  ServiceController.create
);
router.patch(
  "/:id",
  authJWT,
  validateRequest(updateServiceRules),
  ServiceController.update
);
router.delete(
  "/:id",
  authJWT,
  validateRequest(idParam),
  ServiceController.remove
);

export default router;
