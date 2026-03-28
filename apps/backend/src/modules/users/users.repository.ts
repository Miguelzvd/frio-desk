import { eq, count, lt, desc, and } from "drizzle-orm"
import { db } from "../../db"
import { users, services, UserSelect, ServiceSelect, UserInsert } from "../../db/schema"
import type { PaginatedResponse } from "@friodesk/shared"

export async function createUser(data: UserInsert): Promise<UserSelect> {
  const result = await db.insert(users).values(data).returning()
  return result[0]
}

export async function findUsers(): Promise<UserSelect[]> {
  const result = await db
    .select()
    .from(users)
  return result
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

export async function findUserByEmail(
  email: string
): Promise<UserSelect | undefined> {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1)

  return result[0]
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

export interface AdminTechnicianRow {
  id: string
  name: string
  email: string
  role: "admin" | "technician"
  createdAt: Date
  _count: { services: number }
}

export async function findAdminTechniciansPaginated(
  cursor: string | undefined,
  limit: number,
): Promise<PaginatedResponse<AdminTechnicianRow>> {
  const [totalRes] = await db
    .select({ value: count() })
    .from(users)
    .where(eq(users.role, "technician"))
  const total = totalRes?.value ?? 0

  let cursorCreatedAt: Date | undefined
  if (cursor) {
    const [cursorItem] = await db
      .select({ createdAt: users.createdAt })
      .from(users)
      .where(eq(users.id, cursor))
      .limit(1)
    cursorCreatedAt = cursorItem?.createdAt
  }

  const rows = await db
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
    .where(
      cursorCreatedAt
        ? and(eq(users.role, "technician"), lt(users.createdAt, cursorCreatedAt))
        : eq(users.role, "technician"),
    )
    .groupBy(users.id)
    .orderBy(desc(users.createdAt))
    .limit(limit + 1)

  const hasNext = rows.length > limit
  const sliced = hasNext ? rows.slice(0, limit) : rows
  const nextCursor = hasNext ? sliced[sliced.length - 1].id : null
  const data = sliced.map((tech) => ({
    id: tech.id,
    name: tech.name,
    email: tech.email,
    role: tech.role,
    createdAt: tech.createdAt,
    _count: { services: tech.servicesCount },
  }))

  return { data, nextCursor, total }
}

