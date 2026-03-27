import { eq, count } from "drizzle-orm"
import { db } from "../../db"
import { users, services, UserSelect, ServiceSelect } from "../../db/schema"

export async function getAdminTechnicians() {
  const result = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      createdAt: users.createdAt,
      servicesCount: count(services.id),
    })
    .from(users)
    .leftJoin(services, eq(users.id, services.userId))
    .where(eq(users.role, "technician"))
    .groupBy(users.id)

  return result.map((tech) => ({
    id: tech.id,
    name: tech.name,
    email: tech.email,
    role: tech.role,
    createdAt: tech.createdAt,
    _count: {
      services: tech.servicesCount,
    },
  }))
}

export async function findUserById(id: string): Promise<UserSelect | undefined> {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.id, id))
    .limit(1)
  return result[0]
}

export async function findUserServices(userId: string): Promise<ServiceSelect[]> {
  return db.select().from(services).where(eq(services.userId, userId))
}

export async function updateUser(
  id: string,
  data: { name?: string; email?: string },
): Promise<UserSelect> {
  const result = await db
    .update(users)
    .set(data)
    .where(eq(users.id, id))
    .returning()
  return result[0]
}

export async function deleteUser(id: string): Promise<void> {
  await db.delete(users).where(eq(users.id, id))
}
