import path from "path"
import { getStorage } from "../../storage/storage.factory"
import * as photosRepository from "./photos.repository"
import * as servicesRepository from "../services/services.repository"
import { PhotoSelect } from "../../db/schema"

const VALID_EXTENSIONS = [".jpg", ".jpeg", ".png"]

export async function uploadPhoto(
  serviceId: string,
  userId: string,
  fileBuffer: Buffer | null,
  originalName: string | null
): Promise<PhotoSelect> {
  if (!fileBuffer || !originalName) {
    throw Object.assign(new Error("Nenhum arquivo enviado"), { statusCode: 400 })
  }

  const ext = path.extname(originalName).toLowerCase()
  if (!VALID_EXTENSIONS.includes(ext)) {
    throw Object.assign(new Error("Formato de arquivo inválido"), { statusCode: 400 })
  }

  const service = await servicesRepository.findServiceById(serviceId)
  if (!service) {
    throw Object.assign(new Error("Serviço não encontrado"), { statusCode: 404 })
  }

  if (service.userId !== userId) {
    throw Object.assign(new Error("Acesso negado"), { statusCode: 403 })
  }

  const storage = getStorage()
  const { url, publicId } = await storage.upload(
    fileBuffer,
    originalName,
    `friodesk/${serviceId}`
  )

  return photosRepository.createPhoto({ serviceId, url, publicId })
}

export async function listPhotosByService(serviceId: string): Promise<PhotoSelect[]> {
  return photosRepository.findPhotosByServiceId(serviceId)
}

export async function deletePhoto(
  photoId: string,
  serviceId: string,
  userId: string
): Promise<void> {
  const photo = await photosRepository.findPhotoById(photoId)
  if (!photo || photo.serviceId !== serviceId) {
    throw Object.assign(new Error("Foto não encontrada"), { statusCode: 404 })
  }

  const service = await servicesRepository.findServiceById(serviceId)
  if (!service || service.userId !== userId) {
    throw Object.assign(new Error("Acesso negado"), { statusCode: 403 })
  }

  const storage = getStorage()
  await storage.delete(photo.publicId)
  await photosRepository.deletePhoto(photoId)
}
