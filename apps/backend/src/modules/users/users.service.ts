import { UserSelect, ServiceSelect } from "../../db/schema"
import * as usersRepository from "./users.repository"

export async function getUserById(id: string): Promise<UserSelect> {
  const user = await usersRepository.findUserById(id)
  if (!user) {
    throw Object.assign(new Error("Usuário não encontrado"), { statusCode: 404 })
  }
  return user
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
