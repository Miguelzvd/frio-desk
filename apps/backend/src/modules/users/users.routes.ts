import { Router } from "express"
import { authMiddleware } from "../../middlewares/auth"
import { requireRole } from "../../middlewares/require-role"
import * as usersController from "./users.controller"

const router = Router()

router.use(authMiddleware)

// Rota legada — mantida para compatibilidade (sem verificação de role)
router.get("/technicians", usersController.listUsersController)

// Rotas admin
router.get("/", requireRole("admin"), usersController.listUsersController)
router.get("/:id/services", requireRole("admin"), usersController.getUserServicesController)
router.get("/:id", requireRole("admin"), usersController.getUserController)
router.patch("/:id", requireRole("admin"), usersController.updateUserController)
router.delete("/:id", requireRole("admin"), usersController.deleteUserController)

export default router
