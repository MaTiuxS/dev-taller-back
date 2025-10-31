import { Router } from "express";
import { ResourceController } from "../controllers/Resource.controller";

import {
  createResourceRules,
  updateResourceRules,
  idParam,
  listResourceQuery,
} from "../validators/resource.validator";
import { validateRequest } from "../middleware/validation";

const router: Router = Router();

router.get("/", validateRequest(listResourceQuery), ResourceController.list);
router.get("/:id", validateRequest(idParam), ResourceController.getById);
router.post(
  "/",
  validateRequest(createResourceRules),
  ResourceController.create
);
router.put(
  "/:id",
  validateRequest(updateResourceRules),
  ResourceController.update
);
router.delete("/:id", validateRequest(idParam), ResourceController.remove);

export default router;
