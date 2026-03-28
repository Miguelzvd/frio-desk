import { UserPublic } from "@friodesk/shared"
import { UserSelect, ServiceSelect } from "../../db/schema"
import * as usersRepository from "./users.repository"
import bcrypt from "bcrypt"

const SALT_ROUNDS = 10

export async function createUser(
  name: string,
  email: string,
  password: string
): Promise<UserPublic> {
  const existing = await usersRepository.findUserByEmail(email)

  if (existing) {
    throw Object.assign(new Error("Email já cadastrado"), { statusCode: 409 })
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS)
  const created = await usersRepository.createUser({ name, email, passwordHash })


  const user: UserPublic = {
    id: created.id,
    name: created.name,
    email: created.email,
    role: created.role,
    createdAt: created.createdAt,
  }

  return user
}


export async function getUserById(id: string): Promise<UserSelect> {
  const user = await usersRepository.findUserById(id)
  if (!user) {
    throw Object.assign(new Error("Usuário não encontrado"), { statusCode: 404 })
  }
  return user
}

export async function getUsers(): Promise<UserSelect[]> {
  const users = await usersRepository.findUsers()
  return users
}

export async function getUserServices(userId: string): Promise<ServiceSelect[]> {
  await getUserById(userId)
  return usersRepository.findUserServices(userId)
}

export async function updateUser(
  id: string,
  data: { name?: string; email?: string },
): Promise<UserSelect> {
  await getUserById(id)
  return usersRepository.updateUser(id, data)
}

export async function deleteUser(id: string): Promise<void> {
  await getUserById(id)
  await usersRepository.deleteUser(id)
}
