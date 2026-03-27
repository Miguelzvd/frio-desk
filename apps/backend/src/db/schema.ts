import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  pgEnum,
  uniqueIndex,
} from "drizzle-orm/pg-core"

export const userRoleEnum = pgEnum("user_role", ["admin", "technician"])
export const serviceTypeEnum = pgEnum("service_type", [
  "preventiva",
  "corretiva",
  "instalação",
  "inspeção",
])
export const serviceStatusEnum = pgEnum("service_status", ["open", "finished"])

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: userRoleEnum("role").notNull().default("technician"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

export const services = pgTable("services", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  type: serviceTypeEnum("type").notNull(),
  status: serviceStatusEnum("status").notNull().default("open"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  finishedAt: timestamp("finished_at"),
})

export const checklistItems = pgTable("checklist_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  serviceId: uuid("service_id")
    .notNull()
    .references(() => services.id, { onDelete: "cascade" }),
  label: text("label").notNull(),
  checked: boolean("checked").notNull().default(false),
})

export const photos = pgTable("photos", {
  id: uuid("id").primaryKey().defaultRandom(),
  serviceId: uuid("service_id")
    .notNull()
    .references(() => services.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  publicId: text("public_id").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

export const reports = pgTable(
  "reports",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    serviceId: uuid("service_id")
      .notNull()
      .references(() => services.id, { onDelete: "cascade" }),
    responsibleName: text("responsible_name").notNull(),
    notes: text("notes").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [uniqueIndex("reports_service_id_unique").on(table.serviceId)]
)

export type UserInsert = typeof users.$inferInsert
export type UserSelect = typeof users.$inferSelect
export type ServiceInsert = typeof services.$inferInsert
export type ServiceSelect = typeof services.$inferSelect
export type ChecklistItemInsert = typeof checklistItems.$inferInsert
export type ChecklistItemSelect = typeof checklistItems.$inferSelect
export type PhotoInsert = typeof photos.$inferInsert
export type PhotoSelect = typeof photos.$inferSelect
export type ReportInsert = typeof reports.$inferInsert
export type ReportSelect = typeof reports.$inferSelect
