import { eq, count } from "drizzle-orm";
import { db } from "../../db";
import { users, services } from "../../db/schema";

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
    .groupBy(users.id);

  return result.map((tech) => ({
    id: tech.id,
    name: tech.name,
    email: tech.email,
    role: tech.role,
    createdAt: tech.createdAt,
    _count: {
      services: tech.servicesCount,
    },
  }));
}
