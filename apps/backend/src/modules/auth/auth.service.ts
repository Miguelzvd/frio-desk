import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { UserPublic, UserRole } from "@friodesk/shared"
import { JwtPayload } from "../../middlewares/auth"
import * as userRepository from "../users/users.repository"
import * as usersService from "../users/users.service"

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface AuthResult {
  user: UserPublic
  tokens: AuthTokens
}

function generateTokens(userId: string, role: UserRole): AuthTokens {
  const secret = process.env.JWT_SECRET
  const refreshSecret = process.env.JWT_REFRESH_SECRET

  if (!secret || !refreshSecret) {
    throw new Error("JWT secrets não configurados")
  }

  const payload: JwtPayload = { userId, role }

  const accessToken = jwt.sign(payload, secret, { expiresIn: "15m" })
  const refreshToken = jwt.sign(payload, refreshSecret, { expiresIn: "7d" })

  return { accessToken, refreshToken }
}

export async function register(
  name: string,
  email: string,
  password: string
): Promise<AuthResult> {
  const user = await usersService.createUser(name, email, password)
  const tokens = generateTokens(user.id, user.role)

  return { user, tokens }
}

export async function login(
  email: string,
  password: string
): Promise<AuthResult> {
  const found = await userRepository.findUserByEmail(email)

  if (!found) {
    throw Object.assign(new Error("Credenciais inválidas"), { statusCode: 401 })
  }

  const passwordMatch = await bcrypt.compare(password, found.passwordHash)
  if (!passwordMatch) {
    throw Object.assign(new Error("Credenciais inválidas"), { statusCode: 401 })
  }

  const tokens = generateTokens(found.id, found.role)

  const user: UserPublic = {
    id: found.id,
    name: found.name,
    email: found.email,
    role: found.role,
    createdAt: found.createdAt,
  }

  return { user, tokens }
}

export async function refresh(refreshToken: string): Promise<AuthTokens> {
  const refreshSecret = process.env.JWT_REFRESH_SECRET
  if (!refreshSecret) {
    throw new Error("JWT_REFRESH_SECRET não configurado")
  }

  let payload: JwtPayload
  try {
    payload = jwt.verify(refreshToken, refreshSecret) as JwtPayload
  } catch {
    throw Object.assign(new Error("Refresh token inválido ou expirado"), {
      statusCode: 401,
    })
  }

  return generateTokens(payload.userId, payload.role)
}
