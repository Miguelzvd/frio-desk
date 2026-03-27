import { describe, it, expect } from "@jest/globals"
import { registerSchema, loginSchema } from "../src/modules/auth/auth.schema"
import { createServiceSchema } from "../src/modules/services/services.schema"
import { uploadPhotoSchema } from "../src/modules/photos/photos.schema"

describe("Validation Schemas", () => {
  describe("registerSchema", () => {
    it("deve passar com dados válidos", () => {
      const resultado = registerSchema.safeParse({
        name: "João Silva",
        email: "joao@example.com",
        password: "senha123",
      })

      expect(resultado.success).toBe(true)
    })

    it("deve falhar com email inválido", () => {
      const resultado = registerSchema.safeParse({
        name: "João Silva",
        email: "nao-e-um-email",
        password: "senha123",
      })

      expect(resultado.success).toBe(false)
      expect(resultado.error?.issues[0].message).toBe("Email inválido")
    })

    it("deve falhar com nome vazio", () => {
      const resultado = registerSchema.safeParse({
        name: "",
        email: "joao@example.com",
        password: "senha123",
      })

      expect(resultado.success).toBe(false)
      expect(resultado.error?.issues[0].path).toContain("name")
    })

    it("deve falhar com senha menor que 6 caracteres", () => {
      const resultado = registerSchema.safeParse({
        name: "João Silva",
        email: "joao@example.com",
        password: "123",
      })

      expect(resultado.success).toBe(false)
      expect(resultado.error?.issues[0].message).toBe("Senha deve ter pelo menos 6 caracteres")
    })

    it("deve falhar quando campos obrigatórios estiverem ausentes", () => {
      const resultado = registerSchema.safeParse({})

      expect(resultado.success).toBe(false)
      expect(resultado.error?.issues.length).toBeGreaterThanOrEqual(3)
    })
  })

  describe("loginSchema", () => {
    it("deve passar com email e senha válidos", () => {
      const resultado = loginSchema.safeParse({
        email: "joao@example.com",
        password: "senha123",
      })

      expect(resultado.success).toBe(true)
    })

    it("deve falhar com email inválido", () => {
      const resultado = loginSchema.safeParse({
        email: "nao-e-um-email",
        password: "senha123",
      })

      expect(resultado.success).toBe(false)
      expect(resultado.error?.issues[0].message).toBe("Email inválido")
    })

    it("deve falhar com senha vazia", () => {
      const resultado = loginSchema.safeParse({
        email: "joao@example.com",
        password: "",
      })

      expect(resultado.success).toBe(false)
      expect(resultado.error?.issues[0].path).toContain("password")
    })
  })

  describe("createServiceSchema", () => {
    it("deve passar com type válido: preventiva", () => {
      const resultado = createServiceSchema.safeParse({ type: "preventiva" })
      expect(resultado.success).toBe(true)
    })

    it("deve passar com type válido: corretiva", () => {
      const resultado = createServiceSchema.safeParse({ type: "corretiva" })
      expect(resultado.success).toBe(true)
    })

    it("deve passar com type válido: instalação", () => {
      const resultado = createServiceSchema.safeParse({ type: "instalação" })
      expect(resultado.success).toBe(true)
    })

    it("deve passar com type válido: inspeção", () => {
      const resultado = createServiceSchema.safeParse({ type: "inspeção" })
      expect(resultado.success).toBe(true)
    })

    it("deve falhar com type inválido (lavagem)", () => {
      const resultado = createServiceSchema.safeParse({ type: "lavagem" })
      expect(resultado.success).toBe(false)
    })

    it("deve falhar com type inválido (outro)", () => {
      const resultado = createServiceSchema.safeParse({ type: "outro" })
      expect(resultado.success).toBe(false)
    })

    it("deve falhar quando type estiver ausente", () => {
      const resultado = createServiceSchema.safeParse({})
      expect(resultado.success).toBe(false)
    })
  })

  describe("uploadPhotoSchema", () => {
    it("deve passar com extensão .jpg e mimetype válido", () => {
      const resultado = uploadPhotoSchema.safeParse({
        originalname: "foto.jpg",
        mimetype: "image/jpeg",
      })

      expect(resultado.success).toBe(true)
    })

    it("deve passar com extensão .jpeg e mimetype válido", () => {
      const resultado = uploadPhotoSchema.safeParse({
        originalname: "foto.jpeg",
        mimetype: "image/jpeg",
      })

      expect(resultado.success).toBe(true)
    })

    it("deve passar com extensão .png e mimetype válido", () => {
      const resultado = uploadPhotoSchema.safeParse({
        originalname: "foto.png",
        mimetype: "image/png",
      })

      expect(resultado.success).toBe(true)
    })

    it("deve falhar com extensão inválida (.pdf)", () => {
      const resultado = uploadPhotoSchema.safeParse({
        originalname: "documento.pdf",
        mimetype: "image/jpeg",
      })

      expect(resultado.success).toBe(false)
      expect(resultado.error?.issues[0].message).toBe("Formato de arquivo inválido")
    })

    it("deve falhar com extensão inválida (.exe)", () => {
      const resultado = uploadPhotoSchema.safeParse({
        originalname: "virus.exe",
        mimetype: "image/jpeg",
      })

      expect(resultado.success).toBe(false)
      expect(resultado.error?.issues[0].message).toBe("Formato de arquivo inválido")
    })

    it("deve falhar com extensão inválida (.gif)", () => {
      const resultado = uploadPhotoSchema.safeParse({
        originalname: "animacao.gif",
        mimetype: "image/jpeg",
      })

      expect(resultado.success).toBe(false)
      expect(resultado.error?.issues[0].message).toBe("Formato de arquivo inválido")
    })

    it("deve falhar quando mimetype não for image/jpeg ou image/png", () => {
      const resultado = uploadPhotoSchema.safeParse({
        originalname: "foto.jpg",
        mimetype: "image/gif",
      })

      expect(resultado.success).toBe(false)
      expect(resultado.error?.issues[0].message).toBe("Tipo de arquivo inválido")
    })
  })
})
