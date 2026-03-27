import { UserRole } from "@friodesk/shared"
import { Request, Response, NextFunction } from "express"

export function requireRole(role: UserRole) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: "Não autenticado", statusCode: 401 })
      return
    }
    if (req.user.role !== role) {
      res.status(403).json({ error: "Acesso não autorizado", statusCode: 403 })
      return
    }
    next()
  }
}
