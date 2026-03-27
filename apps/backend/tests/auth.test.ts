import { describe, it, expect, beforeAll, beforeEach, jest } from "@jest/globals"
import * as authService from "../src/modules/auth/auth.service"
import * as authRepository from "../src/modules/auth/auth.repository"
import bcrypt from "bcrypt"

jest.mock("../src/modules/auth/auth.repository")
jest.mock("../src/db", () => ({ db: {} }))

const mockRepo = authRepository as jest.Mocked<typeof authRepository>

const fakeUser = {
  id: "user-uuid-1",
  name: "João Silva",
  email: "joao@example.com",
  passwordHash: "",
  role: "technician" as const,
  createdAt: new Date(),
}

beforeAll(async () => {
  fakeUser.passwordHash = await bcrypt.hash("senha123", 10)
})

beforeEach(() => {
  jest.clearAllMocks()
})

describe("Auth Service", () => {
  describe("register", () => {
    it("deve registrar um novo usuário com sucesso", async () => {
      mockRepo.findUserByEmail.mockResolvedValue(undefined)
      mockRepo.createUser.mockResolvedValue(fakeUser)

      const result = await authService.register("João Silva", "joao@example.com", "senha123")

      expect(result.user.email).toBe("joao@example.com")
      expect(result.user.name).toBe("João Silva")
      expect(result.tokens.accessToken).toBeDefined()
      expect(result.tokens.refreshToken).toBeDefined()
      expect(mockRepo.createUser).toHaveBeenCalledTimes(1)
    })

    it("deve falhar ao registrar email duplicado", async () => {
      mockRepo.findUserByEmail.mockResolvedValue(fakeUser)

      await expect(
        authService.register("Outro Nome", "joao@example.com", "senha123")
      ).rejects.toMatchObject({ message: "Email já cadastrado", statusCode: 409 })

      expect(mockRepo.createUser).not.toHaveBeenCalled()
    })
  })

  describe("login", () => {
    it("deve fazer login com credenciais válidas", async () => {
      mockRepo.findUserByEmail.mockResolvedValue(fakeUser)

      const result = await authService.login("joao@example.com", "senha123")

      expect(result.user.email).toBe("joao@example.com")
      expect(result.tokens.accessToken).toBeDefined()
      expect(result.tokens.refreshToken).toBeDefined()
    })

    it("deve rejeitar login com senha errada", async () => {
      mockRepo.findUserByEmail.mockResolvedValue(fakeUser)

      await expect(
        authService.login("joao@example.com", "senhaerrada")
      ).rejects.toMatchObject({ message: "Credenciais inválidas", statusCode: 401 })
    })

    it("deve rejeitar login com email inexistente", async () => {
      mockRepo.findUserByEmail.mockResolvedValue(undefined)

      await expect(
        authService.login("naoexiste@example.com", "senha123")
      ).rejects.toMatchObject({ message: "Credenciais inválidas", statusCode: 401 })
    })
  })
})
