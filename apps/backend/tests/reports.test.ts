import { describe, it, expect, beforeEach, jest } from "@jest/globals"
import * as reportsService from "../src/modules/reports/reports.service"
import * as reportsRepository from "../src/modules/reports/reports.repository"
import * as servicesRepository from "../src/modules/services/services.repository"

jest.mock("../src/modules/reports/reports.repository")
jest.mock("../src/modules/services/services.repository")
jest.mock("../src/db", () => ({ db: {} }))

const mockReportsRepo = reportsRepository as jest.Mocked<typeof reportsRepository>
const mockServicesRepo = servicesRepository as jest.Mocked<typeof servicesRepository>

const userId = "user-uuid-1"
const serviceId = "service-uuid-1"

const fakeService = {
  id: serviceId,
  userId,
  type: "preventiva" as const,
  status: "open" as const,
  createdAt: new Date(),
  finishedAt: null,
}

const fakeReport = {
  id: "report-uuid-1",
  serviceId,
  responsibleName: "João Silva",
  notes: "Manutenção realizada com sucesso.",
  createdAt: new Date(),
}

const fakeChecklist = [
  { id: "cl-1", serviceId, label: "Limpeza de filtros", checked: false },
  { id: "cl-2", serviceId, label: "Verificação de gás", checked: false },
]

const fakePhotos = [
  {
    id: "photo-uuid-1",
    serviceId,
    url: "http://localhost/storage/foto.jpg",
    publicId: "field-report/service-uuid-1/foto.jpg",
    createdAt: new Date(),
  },
]

beforeEach(() => {
  jest.clearAllMocks()
})

describe("Reports Service", () => {
  describe("createReport", () => {
    it("deve criar relatório com sucesso e retornar os dados do relatório", async () => {
      mockServicesRepo.findServiceByIdAndUserId.mockResolvedValue(fakeService)
      mockReportsRepo.findReportByServiceId.mockResolvedValue(undefined)
      mockReportsRepo.createReport.mockResolvedValue(fakeReport)

      const result = await reportsService.createReport(
        serviceId,
        userId,
        "João Silva",
        "Manutenção realizada com sucesso."
      )

      expect(result.id).toBe(fakeReport.id)
      expect(result.serviceId).toBe(serviceId)
      expect(result.responsibleName).toBe("João Silva")
      expect(result.notes).toBe("Manutenção realizada com sucesso.")
      expect(mockReportsRepo.createReport).toHaveBeenCalledWith({
        serviceId,
        responsibleName: "João Silva",
        notes: "Manutenção realizada com sucesso.",
      })
    })

    it("deve retornar 409 quando já existir relatório para o mesmo serviceId", async () => {
      mockServicesRepo.findServiceByIdAndUserId.mockResolvedValue(fakeService)
      mockReportsRepo.findReportByServiceId.mockResolvedValue(fakeReport)

      await expect(
        reportsService.createReport(serviceId, userId, "João Silva", "Novas notas")
      ).rejects.toMatchObject({ message: "Relatório já existe para este serviço", statusCode: 409 })

      expect(mockReportsRepo.createReport).not.toHaveBeenCalled()
    })

    it("deve retornar 404 quando serviceId não existir", async () => {
      mockServicesRepo.findServiceByIdAndUserId.mockResolvedValue(undefined)

      await expect(
        reportsService.createReport("id-inexistente", userId, "João Silva", "Notas")
      ).rejects.toMatchObject({ message: "Serviço não encontrado", statusCode: 404 })

      expect(mockReportsRepo.createReport).not.toHaveBeenCalled()
    })
  })

  describe("getReport", () => {
    it("deve retornar relatório completo com serviço, checklist, fotos e responsável", async () => {
      mockServicesRepo.findServiceByIdAndUserId.mockResolvedValue(fakeService)
      mockReportsRepo.findReportByServiceId.mockResolvedValue(fakeReport)
      mockServicesRepo.findChecklistByServiceId.mockResolvedValue(fakeChecklist)
      mockServicesRepo.findPhotosByServiceId.mockResolvedValue(fakePhotos)

      const result = await reportsService.getFullReport(serviceId, userId)

      expect(result.report.id).toBe(fakeReport.id)
      expect(result.report.responsibleName).toBe("João Silva")
      expect(result.service.id).toBe(serviceId)
      expect(result.checklist).toHaveLength(2)
      expect(result.photos).toHaveLength(1)
    })

    it("deve retornar 404 quando não existir relatório para o serviço", async () => {
      mockServicesRepo.findServiceByIdAndUserId.mockResolvedValue(fakeService)
      mockReportsRepo.findReportByServiceId.mockResolvedValue(undefined)

      await expect(
        reportsService.getFullReport(serviceId, userId)
      ).rejects.toMatchObject({ message: "Relatório não encontrado", statusCode: 404 })
    })
  })
})
