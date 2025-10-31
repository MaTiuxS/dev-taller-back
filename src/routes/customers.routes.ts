import { Router } from "express";
import { authJWT } from "../middleware/authJWT";
import { validateRequest } from "../middleware/validation";
import {
  upsertCustomerRules,
  listCustomersQuery,
  getByIdParam,
  updateCustomerRules,
} from "../validators/customer.validator";
import { CustomerController } from "../controllers/Customer.controller";

const router: Router = Router();

router.get(
  "/",
  authJWT,
  validateRequest(listCustomersQuery),
  CustomerController.list
);
router.get(
  "/:id",
  authJWT,
  validateRequest(getByIdParam),
  CustomerController.getById
);
router.post(
  "/",
  authJWT,
  validateRequest(upsertCustomerRules),
  CustomerController.upsert
);
router.patch(
  "/:id",
  authJWT,
  validateRequest(updateCustomerRules),
  CustomerController.update
);

export default router;
