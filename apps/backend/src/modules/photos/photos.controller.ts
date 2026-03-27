import { Request, Response } from "express"
import * as photosService from "./photos.service"
import * as photosRepository from "./photos.repository"

export async function deletePhoto(req: Request, res: Response): Promise<void> {
  try {
    await photosService.deletePhoto(
      req.params.photoId as string,
      req.params.id as string,
      req.user!.userId
    )
    res.status(204).send()
  } catch (err) {
    const error = err as Error & { statusCode?: number }
    res.status(error.statusCode ?? 500).json({ error: error.message, statusCode: error.statusCode ?? 500 })
  }
}

export async function getPhotos(req: Request, res: Response): Promise<void> {
  try {
    const photos = await photosRepository.findPhotosByServiceId(
      req.params.id as string,
    )
    res.json(photos)
  } catch (err) {
    const error = err as Error & { statusCode?: number }
    res
      .status(error.statusCode ?? 500)
      .json({ error: error.message, statusCode: error.statusCode ?? 500 })
  }
}

export async function uploadPhoto(req: Request, res: Response): Promise<void> {
  try {
    if (!req.file) {
      res.status(400).json({ error: "Nenhum arquivo enviado", statusCode: 400 })
      return
    }

    const photo = await photosService.uploadPhoto(
      req.params.id as string,
      req.user!.userId,
      req.file.buffer,
      req.file.originalname
    )

    res.status(201).json(photo)
  } catch (err) {
    const error = err as Error & { statusCode?: number }
    res.status(error.statusCode ?? 500).json({ error: error.message, statusCode: error.statusCode ?? 500 })
  }
}
