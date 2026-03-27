import { z } from "zod"

export const paginationQuerySchema = z.object({
  cursor: z.string().uuid().optional(),
  limit: z.coerce.number().int().min(1).max(8).default(8),
})

export type PaginationQuery = z.infer<typeof paginationQuerySchema>
