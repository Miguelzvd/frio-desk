import { z } from "zod"

export const updateUserSchema = z
  .object({
    name: z.string().min(1, "Nome não pode ser vazio").optional(),
    email: z.string().email("Email inválido").optional(),
  })
  .refine((data) => data.name !== undefined || data.email !== undefined, {
    message: "Informe ao menos um campo para atualizar (nome ou email)",
  })
