import { z } from "zod";

const VALID_EXTENSIONS = [".jpg", ".jpeg", ".png"];
const VALID_MIMETYPES = ["image/jpeg", "image/png"] as const;

export const uploadPhotoSchema = z.object({
  originalname: z
    .string()
    .refine(
      (name) =>
        VALID_EXTENSIONS.some((ext) => name.toLowerCase().endsWith(ext)),
      { message: "Formato de arquivo inválido" },
    ),
  mimetype: z.enum(VALID_MIMETYPES, {
    message: "Tipo de arquivo inválido",
  }),
});
