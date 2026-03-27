import { Router } from "express";
import { authMiddleware } from "../../middlewares/auth";
import { listTechniciansController } from "./users.controller";

const router = Router();

router.use(authMiddleware);
router.get("/technicians", listTechniciansController);

export default router;