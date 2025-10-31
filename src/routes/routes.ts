import { Router } from "express";
import authRoutes from "./auth.routes";
import customersRoutes from "./customers.routes";
import vehiclesRoutes from "./vehicle.routes";
import servicesRoutes from "./service.routes";
import availabilityRoutes from "./availability.routes";
import appointmentsRoutes from "./appointments.routes";
import resourceRoutes from "./resource.routes";
const router: Router = Router();

router.use("/auth", authRoutes);
router.use("/customers", customersRoutes);
router.use("/vehicles", vehiclesRoutes);
router.use("/services", servicesRoutes);
router.use("/availability", availabilityRoutes);
router.use("/appointments", appointmentsRoutes);
router.use("/resources", resourceRoutes);
export default router;
