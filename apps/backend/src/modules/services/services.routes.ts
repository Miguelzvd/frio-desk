import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth";
import * as servicesController from "./services.controller";

const router = Router();

router.use(authMiddleware);

router.post("/", servicesController.createService);
router.get("/", servicesController.listServices);
router.get("/metrics", servicesController.getMetricsController);

router.get("/:id", servicesController.getService);
router.patch("/:id", servicesController.updateService);
router.delete("/:id", servicesController.deleteService);

export default router;
