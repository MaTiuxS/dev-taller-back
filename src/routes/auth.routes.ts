import { Router } from "express";
import { AuthController } from "../controllers/Auth.controller";
import { authJWT } from "../middleware/authJWT";
import { requireRole } from "../middleware/requireRole";

import { validateRequest } from "../middleware/validation";
import { loginRules, registerRules } from "../validators/auth.validator";

const router: Router = Router();

router.post("/login", validateRequest(loginRules), AuthController.login);
router.get("/rol", authJWT, AuthController.getRoles);
router.get("/users", authJWT, AuthController.getAllUsers);

// Solo el SUPERADMIN puede registrar nuevos usuarios
router.post(
  "/register",
  authJWT,
  requireRole(1),
  validateRequest(registerRules),
  AuthController.register
);

export default router;
