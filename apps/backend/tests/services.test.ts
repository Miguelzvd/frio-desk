import * as servicesService from "../src/modules/services/services.service"
import * as servicesRepository from "../src/modules/services/services.repository"
import { describe, it, expect, beforeEach, jest } from '@jest/globals'
import { UserRole } from "@friodesk/shared"

jest.mock("../src/modules/services/services.repository")
jest.mock("../src/db", () => ({ db: {} }))

const mockRepo = servicesRepository as jest.Mocked<typeof servicesRepository>

const userId = "user-uuid-1"
const serviceId = "service-uuid-1"

const fakeService = {
  id: serviceId,
  userId,
  type: "preventiva" as const,
  status: "open" as const,
  createdAt: new Date(),
  notes: "test",
  finishedAt: null,
}

const fakeChecklist = [
  { id: "cl-1", serviceId, label: "Limpeza de filtros", checked: false },
  { id: "cl-2", serviceId, label: "Verificação de gás", checked: false },
  { id: "cl-3", serviceId, label: "Teste de temperatura", checked: false },
  { id: "cl-4", serviceId, label: "Inspeção elétrica", checked: false },
]

beforeEach(() => {
  jest.clearAllMocks()
})

describe("Services Service", () => {
  describe("createService", () => {
    it("deve criar um serviço e gerar checklist automaticamente", async () => {
      mockRepo.createService.mockResolvedValue(fakeService)
      mockRepo.createChecklistItems.mockResolvedValue(fakeChecklist)

      const result = await servicesService.createService(userId, "preventiva")

      expect(result.id).toBe(serviceId)
      expect(result.type).toBe("preventiva")
      expect(result.checklist).toHaveLength(4)
      expect(result.checklist.map((i) => i.label)).toContain("Limpeza de filtros")
      expect(mockRepo.createChecklistItems).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ label: "Limpeza de filtros" }),
        ])
      )
    })

    it("deve gerar checklist correto para serviço corretivo", async () => {
      const fakeCorretiva = { ...fakeService, type: "corretiva" as const }
      const fakeChecklistCorretiva = [
        { id: "cl-1", serviceId, label: "Diagnóstico do problema", checked: false },
        { id: "cl-2", serviceId, label: "Substituição de peça", checked: false },
        { id: "cl-3", serviceId, label: "Teste pós-reparo", checked: false },
      ]

      mockRepo.createService.mockResolvedValue(fakeCorretiva)
      mockRepo.createChecklistItems.mockResolvedValue(fakeChecklistCorretiva)

      const result = await servicesService.createService(userId, "corretiva")

      expect(result.checklist).toHaveLength(3)
      expect(result.checklist[0].label).toBe("Diagnóstico do problema")
    })
  })

  describe("listServices", () => {
    it("deve listar apenas serviços do usuário autenticado paginados", async () => {
      // O mock agora precisa retornar o formato de PaginatedResponse
      const paginatedResult = {
        data: [fakeService],
        nextCursor: null,
        total: 1
      }

      mockRepo.findServicesByUserIdPaginated.mockResolvedValue(paginatedResult)

      const result = await servicesService.listServices(userId, "technician" as UserRole, {})

      expect(result.data).toHaveLength(1)
      expect(result.data[0].userId).toBe(userId)
      expect(mockRepo.findServicesByUserIdPaginated).toHaveBeenCalledWith(userId, undefined, 8)
    })
  })

  describe("getServiceDetail", () => {
    it("deve retornar 404 ao buscar serviço inexistente", async () => {
      mockRepo.findServiceByIdAndUserId.mockResolvedValue(undefined)

      await expect(
        servicesService.getServiceDetail("id-inexistente", userId, "technician" as UserRole)
      ).rejects.toMatchObject({ message: "Serviço não encontrado", statusCode: 404 })
    })

    it("deve retornar detalhe completo de um serviço existente", async () => {
      mockRepo.findServiceByIdAndUserId.mockResolvedValue(fakeService)
      mockRepo.findChecklistByServiceId.mockResolvedValue(fakeChecklist)
      mockRepo.findPhotosByServiceId.mockResolvedValue([])

      // Adicionando o parâmetro de role
      const result = await servicesService.getServiceDetail(serviceId, userId, "technician" as UserRole)

      expect(result.id).toBe(serviceId)
      expect(result.checklist).toHaveLength(4)
      expect(result.photos).toHaveLength(0)
    })
  })
})