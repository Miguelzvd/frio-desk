import { eq, and, count, lt, desc, gte, sql, SQL } from "drizzle-orm";
import { db } from "../../db";
import {
  services,
  checklistItems,
  photos,
  ServiceInsert,
  ServiceSelect,
  ChecklistItemInsert,
  ChecklistItemSelect,
  PhotoSelect,
  users,
} from "../../db/schema";
import type { PaginatedResponse } from "@friodesk/shared";

export interface ServiceWithUser extends ServiceSelect {
  user: { id: string; name: string; email: string };
}

export async function findServicesByUserId(
  userId: string,
): Promise<ServiceSelect[]> {
  return db.select().from(services).where(eq(services.userId, userId));
}

export async function findServiceById(
  id: string,
): Promise<ServiceSelect | undefined> {
  const result = await db
    .select()
    .from(services)
    .where(eq(services.id, id))
    .limit(1);
  return result[0];
}

export async function findServiceByIdAndUserId(
  id: string,
  userId: string,
): Promise<ServiceSelect | undefined> {
  const result = await db
    .select()
    .from(services)
    .where(and(eq(services.id, id), eq(services.userId, userId)))
    .limit(1);
  return result[0];
}

export async function createService(
  data: ServiceInsert,
): Promise<ServiceSelect> {
  const result = await db.insert(services).values(data).returning();
  return result[0];
}

export async function updateService(
  id: string,
  data: Partial<ServiceInsert>,
): Promise<ServiceSelect> {
  const result = await db
    .update(services)
    .set(data)
    .where(eq(services.id, id))
    .returning();
  return result[0];
}

export async function deleteService(id: string): Promise<void> {
  await db.delete(services).where(eq(services.id, id));
}

export async function createChecklistItems(
  items: ChecklistItemInsert[],
): Promise<ChecklistItemSelect[]> {
  return db.insert(checklistItems).values(items).returning();
}

export async function findChecklistByServiceId(
  serviceId: string,
): Promise<ChecklistItemSelect[]> {
  return db
    .select()
    .from(checklistItems)
    .where(eq(checklistItems.serviceId, serviceId));
}

export async function findPhotosByServiceId(
  serviceId: string,
): Promise<PhotoSelect[]> {
  return db.select().from(photos).where(eq(photos.serviceId, serviceId));
}

export async function findAllServicesWithUser(): Promise<ServiceWithUser[]> {
  const result = await db
    .select({
      id: services.id,
      userId: services.userId,
      type: services.type,
      status: services.status,
      notes: services.notes,
      createdAt: services.createdAt,
      finishedAt: services.finishedAt,
      user: {
        id: users.id,
        name: users.name,
        email: users.email,
      },
    })
    .from(services)
    .innerJoin(users, eq(services.userId, users.id))
    .orderBy(services.createdAt);
  return result;
}

export async function findServiceByIdForAdmin(
  id: string,
): Promise<ServiceSelect | undefined> {
  const result = await db
    .select()
    .from(services)
    .where(eq(services.id, id))
    .limit(1);
  return result[0];
}

export async function findServicesByUserIdPaginated(
  userId: string,
  cursor: string | undefined,
  limit: number,
  typeFilter?: string,
  statusFilter?: string,
): Promise<PaginatedResponse<ServiceSelect>> {
  const filters: (SQL<unknown> | undefined)[] = [eq(services.userId, userId)];

  if (typeFilter && typeFilter !== "all") {
    filters.push(eq(services.type, typeFilter as any));
  }
  if (statusFilter && statusFilter !== "all") {
    filters.push(eq(services.status, statusFilter as any));
  }

  const totalWhere = and(...filters);
  const [totalRes] = await db
    .select({ value: count() })
    .from(services)
    .where(totalWhere);
  const total = totalRes?.value ?? 0;

  let cursorCreatedAt: Date | undefined;
  if (cursor) {
    const [cursorItem] = await db
      .select({ createdAt: services.createdAt })
      .from(services)
      .where(eq(services.id, cursor))
      .limit(1);
    cursorCreatedAt = cursorItem?.createdAt;
  }

  const queryFilters = [...filters];
  if (cursorCreatedAt) {
    queryFilters.push(lt(services.createdAt, cursorCreatedAt));
  }

  const rows = await db
    .select()
    .from(services)
    .where(and(...queryFilters))
    .orderBy(desc(services.createdAt))
    .limit(limit + 1);

  const hasNext = rows.length > limit;
  const data = hasNext ? rows.slice(0, limit) : rows;
  const nextCursor = hasNext ? data[data.length - 1].id : null;

  return { data, nextCursor, total };
}

export async function findAllServicesWithUserPaginated(
  cursor: string | undefined,
  limit: number,
  typeFilter?: string,
  statusFilter?: string,
): Promise<PaginatedResponse<ServiceWithUser>> {
  const filters: (SQL<unknown> | undefined)[] = [];

  if (typeFilter && typeFilter !== "all") {
    filters.push(eq(services.type, typeFilter as any));
  }
  if (statusFilter && statusFilter !== "all") {
    filters.push(eq(services.status, statusFilter as any));
  }

  const totalWhere = filters.length > 0 ? and(...filters) : undefined;
  const [totalRes] = await db
    .select({ value: count() })
    .from(services)
    .where(totalWhere);
  const total = totalRes?.value ?? 0;

  let cursorCreatedAt: Date | undefined;
  if (cursor) {
    const [cursorItem] = await db
      .select({ createdAt: services.createdAt })
      .from(services)
      .where(eq(services.id, cursor))
      .limit(1);
    cursorCreatedAt = cursorItem?.createdAt;
  }

  const queryFilters = [...filters];
  if (cursorCreatedAt) {
    queryFilters.push(lt(services.createdAt, cursorCreatedAt));
  }

  const queryWhere = queryFilters.length > 0 ? and(...queryFilters) : undefined;

  const rows = await db
    .select({
      id: services.id,
      userId: services.userId,
      type: services.type,
      status: services.status,
      notes: services.notes,
      createdAt: services.createdAt,
      finishedAt: services.finishedAt,
      user: {
        id: users.id,
        name: users.name,
        email: users.email,
      },
    })
    .from(services)
    .innerJoin(users, eq(services.userId, users.id))
    .where(queryWhere)
    .orderBy(desc(services.createdAt))
    .limit(limit + 1);

  const hasNext = rows.length > limit;
  const data = hasNext ? rows.slice(0, limit) : rows;
  const nextCursor = hasNext ? data[data.length - 1].id : null;

  return { data, nextCursor, total };
}

export async function findAllServicesWithUserForReport(
  typeFilter?: string,
  statusFilter?: string,
): Promise<ServiceWithUser[]> {
  const filters: (SQL<unknown> | undefined)[] = [];

  if (typeFilter && typeFilter !== "all") {
    filters.push(eq(services.type, typeFilter as any));
  }
  if (statusFilter && statusFilter !== "all") {
    filters.push(eq(services.status, statusFilter as any));
  }

  const queryWhere = filters.length > 0 ? and(...filters) : undefined;

  return db
    .select({
      id: services.id,
      userId: services.userId,
      type: services.type,
      status: services.status,
      notes: services.notes,
      createdAt: services.createdAt,
      finishedAt: services.finishedAt,
      user: {
        id: users.id,
        name: users.name,
        email: users.email,
      },
    })
    .from(services)
    .innerJoin(users, eq(services.userId, users.id))
    .where(queryWhere)
    .orderBy(desc(services.createdAt));
}

export async function updateChecklistItem(
  id: string,
  checked: boolean,
): Promise<ChecklistItemSelect> {
  const result = await db
    .update(checklistItems)
    .set({ checked })
    .where(eq(checklistItems.id, id))
    .returning();
  return result[0];
}

export async function getAvailablePeriods(): Promise<
  { year: number; month: number }[]
> {
  const rows = await db
    .selectDistinct({
      year: sql<number>`EXTRACT(YEAR FROM ${services.createdAt})::int`,
      month: sql<number>`EXTRACT(MONTH FROM ${services.createdAt})::int`,
    })
    .from(services)
    .orderBy(
      desc(sql`EXTRACT(YEAR FROM ${services.createdAt})`),
      desc(sql`EXTRACT(MONTH FROM ${services.createdAt})`),
    );
  return rows;
}

export async function getAdminMetrics(year?: number, month?: number) {
  const periodFilters: SQL<unknown>[] = [];

  if (year !== undefined && month !== undefined) {
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 1);
    periodFilters.push(gte(services.createdAt, start));
    periodFilters.push(lt(services.createdAt, end));
  } else if (year !== undefined) {
    const start = new Date(year, 0, 1);
    const end = new Date(year + 1, 0, 1);
    periodFilters.push(gte(services.createdAt, start));
    periodFilters.push(lt(services.createdAt, end));
  }

  const where = periodFilters.length > 0 ? and(...periodFilters) : undefined;

  const totalRes = await db
    .select({ value: count() })
    .from(services)
    .where(where);
  const totalServices = totalRes[0]?.value || 0;

  const statusRes = await db
    .select({ status: services.status, value: count() })
    .from(services)
    .where(where)
    .groupBy(services.status);

  const openServices = statusRes.find((s) => s.status === "open")?.value || 0;
  const finishedServices =
    statusRes.find((s) => s.status === "finished")?.value || 0;

  const typeRes = await db
    .select({ type: services.type, value: count() })
    .from(services)
    .where(where)
    .groupBy(services.type);

  const byType = typeRes.reduce(
    (acc, curr) => {
      acc[curr.type] = curr.value;
      return acc;
    },
    {} as Record<string, number>,
  );

  const techRes = await db
    .select({ value: count() })
    .from(users)
    .where(eq(users.role, "technician"));

  const totalTechnicians = techRes[0]?.value || 0;

  return {
    totalServices,
    openServices,
    finishedServices,
    totalTechnicians,
    byType,
  };
}
