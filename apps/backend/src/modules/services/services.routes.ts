import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth";
import * as servicesController from "./services.controller";

const router = Router();

router.use(authMiddleware);

router.post("/", servicesController.registerService);
router.get("/", servicesController.getAllServices);
router.get("/metrics/periods", servicesController.getAvailablePeriodsServices);
router.get("/metrics", servicesController.getMetricsController);

router.patch("/:serviceId/checklist/:itemId", servicesController.toggleChecklistItemController);
router.get("/:id", servicesController.getServiceById);
router.patch("/:id", servicesController.updateService);
router.delete("/:id", servicesController.deleteService);

export default router;