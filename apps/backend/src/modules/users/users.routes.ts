import { Router } from "express"
import { authMiddleware } from "../../middlewares/auth"
import { requireRole } from "../../middlewares/require-role"
import * as usersController from "./users.controller"

const router = Router()

router.use(authMiddleware)

// Rota legada — mantida para compatibilidade (sem verificação de role)
router.get("/technicians", usersController.listUsers)

// Rotas admin
router.post("/", requireRole("admin"), usersController.createUser)
router.get("/", requireRole("admin"), usersController.listUsers)
router.get("/:id/services", requireRole("admin"), usersController.getUserServices)
router.get("/:id", requireRole("admin"), usersController.getUserById)
router.patch("/:id", requireRole("admin"), usersController.updateUser)
router.delete("/:id", requireRole("admin"), usersController.deleteUser)

export default router
