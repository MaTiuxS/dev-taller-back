import { VehicleController } from "../controllers/Vehicle.controller";
import { authJWT } from "../middleware/authJWT";
import { validateRequest } from "../middleware/validation";
import { Router } from "express";
import {
  idParam,
  listVehiclesQuery,
  updateVehicleRules,
  createVehicleRules,
} from "../validators/vehicle.validator";

const router: Router = Router();

router.get(
  "/",
  authJWT,
  validateRequest(listVehiclesQuery),
  VehicleController.list
);
router.get(
  "/:id",
  authJWT,
  validateRequest(idParam),
  VehicleController.getById
);
router.post(
  "/",
  authJWT,
  validateRequest(createVehicleRules),
  VehicleController.create
);
router.patch(
  "/:id",
  authJWT,
  validateRequest(updateVehicleRules),
  VehicleController.update
);

export default router;
