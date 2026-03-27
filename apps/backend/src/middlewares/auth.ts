import { UserRole } from "@friodesk/shared"
import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

export interface JwtPayload {
  userId: string
  role: UserRole
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload
    }
  }
}

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Token não fornecido", statusCode: 401 })
    return
  }

  const token = authHeader.split(" ")[1]

  try {
    const secret = process.env.JWT_SECRET
    if (!secret) throw new Error("JWT_SECRET não configurado")

    const decoded = jwt.verify(token, secret) as JwtPayload
    req.user = decoded
    next()
  } catch {
    res.status(401).json({ error: "Token inválido ou expirado", statusCode: 401 })
  }
}
