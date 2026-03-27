import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import * as photosService from "../src/modules/photos/photos.service";
import * as photosRepository from "../src/modules/photos/photos.repository";
import * as servicesRepository from "../src/modules/services/services.repository";
import type {
  StorageProvider,
  UploadResult,
} from "../src/storage/storage.interface";

jest.mock("../src/modules/photos/photos.repository");
jest.mock("../src/modules/services/services.repository");
jest.mock("../src/db", () => ({ db: {} }));
jest.mock("../src/storage/storage.factory");

import { getStorage } from "../src/storage/storage.factory";

const mockPhotosRepo = photosRepository as jest.Mocked<typeof photosRepository>;
const mockServicesRepo = servicesRepository as jest.Mocked<
  typeof servicesRepository
>;
const mockGetStorage = getStorage as jest.MockedFunction<typeof getStorage>;

const userId = "user-uuid-1";
const otherUserId = "other-user-uuid";
const serviceId = "service-uuid-1";

const fakeService = {
  id: serviceId,
  userId,
  type: "preventiva" as const,
  status: "open" as const,
  createdAt: new Date(),
  notes: "test",
  finishedAt: null,
};

const fakePhoto = {
  id: "photo-uuid-1",
  serviceId,
  url: "http://localhost/storage/foto.jpg",
  publicId: "friodesk/service-uuid-1/foto.jpg",
  createdAt: new Date(),
};

const fakeBuffer = Buffer.from("fake image content");

beforeEach(() => {
  jest.clearAllMocks();
  const uploadResult: UploadResult = {
    url: fakePhoto.url,
    publicId: fakePhoto.publicId,
  };
  mockGetStorage.mockReturnValue({
    upload: jest
      .fn<StorageProvider["upload"]>()
      .mockResolvedValue(uploadResult),
    delete: jest.fn<StorageProvider["delete"]>().mockResolvedValue(undefined),
  } as StorageProvider);
});

describe("Photos Service", () => {
  describe("uploadPhoto", () => {
    it("deve salvar foto com sucesso e retornar objeto com url e serviceId", async () => {
      mockServicesRepo.findServiceById.mockResolvedValue(fakeService);
      mockPhotosRepo.createPhoto.mockResolvedValue(fakePhoto);

      const result = await photosService.uploadPhoto(
        serviceId,
        userId,
        fakeBuffer,
        "foto.jpg",
      );

      expect(result.url).toBe(fakePhoto.url);
      expect(result.serviceId).toBe(serviceId);
      expect(mockPhotosRepo.createPhoto).toHaveBeenCalledWith({
        serviceId,
        url: fakePhoto.url,
        publicId: fakePhoto.publicId,
      });
    });

    it("deve rejeitar arquivo com extensão inválida (.pdf)", async () => {
      await expect(
        photosService.uploadPhoto(
          serviceId,
          userId,
          fakeBuffer,
          "documento.pdf",
        ),
      ).rejects.toMatchObject({
        message: "Formato de arquivo inválido",
        statusCode: 400,
      });

      expect(mockServicesRepo.findServiceById).not.toHaveBeenCalled();
    });

    it("deve rejeitar arquivo com extensão inválida (.exe)", async () => {
      await expect(
        photosService.uploadPhoto(serviceId, userId, fakeBuffer, "virus.exe"),
      ).rejects.toMatchObject({
        message: "Formato de arquivo inválido",
        statusCode: 400,
      });
    });

    it("deve retornar 400 quando nenhum arquivo for enviado", async () => {
      await expect(
        photosService.uploadPhoto(serviceId, userId, null, null),
      ).rejects.toMatchObject({ statusCode: 400 });

      expect(mockServicesRepo.findServiceById).not.toHaveBeenCalled();
    });

    it("deve retornar 404 quando serviceId não existir", async () => {
      mockServicesRepo.findServiceById.mockResolvedValue(undefined);

      await expect(
        photosService.uploadPhoto(
          "id-inexistente",
          userId,
          fakeBuffer,
          "foto.jpg",
        ),
      ).rejects.toMatchObject({
        message: "Serviço não encontrado",
        statusCode: 404,
      });

      expect(mockPhotosRepo.createPhoto).not.toHaveBeenCalled();
    });

    it("deve retornar 403 quando o serviço pertencer a outro usuário", async () => {
      mockServicesRepo.findServiceById.mockResolvedValue({
        ...fakeService,
        userId: otherUserId,
      });

      await expect(
        photosService.uploadPhoto(serviceId, userId, fakeBuffer, "foto.jpg"),
      ).rejects.toMatchObject({ statusCode: 403 });

      expect(mockPhotosRepo.createPhoto).not.toHaveBeenCalled();
    });
  });

  describe("listPhotosByService", () => {
    it("deve listar fotos de um serviço com sucesso", async () => {
      const segundaFoto = {
        ...fakePhoto,
        id: "photo-uuid-2",
        url: "http://localhost/storage/foto2.jpg",
      };
      mockPhotosRepo.findPhotosByServiceId.mockResolvedValue([
        fakePhoto,
        segundaFoto,
      ]);

      const result = await photosService.listPhotosByService(serviceId);

      expect(result).toHaveLength(2);
      expect(result[0].serviceId).toBe(serviceId);
      expect(result[1].serviceId).toBe(serviceId);
      expect(mockPhotosRepo.findPhotosByServiceId).toHaveBeenCalledWith(
        serviceId,
      );
    });

    it("deve retornar array vazio quando serviço não tiver fotos", async () => {
      mockPhotosRepo.findPhotosByServiceId.mockResolvedValue([]);

      const result = await photosService.listPhotosByService(serviceId);

      expect(result).toHaveLength(0);
      expect(mockPhotosRepo.findPhotosByServiceId).toHaveBeenCalledWith(
        serviceId,
      );
    });
  });
});
