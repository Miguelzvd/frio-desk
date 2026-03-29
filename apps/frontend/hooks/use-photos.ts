"use client"

import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"
import { handleApiError } from "@/lib/error-handler"
import api from "@/lib/api"
import type { Photo } from "@friodesk/shared"

export function usePhotos(serviceId: string) {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    try {
      setLoading(true)
      const res = await api.get<Photo[]>(`/services/${serviceId}/photos`)
      setPhotos(res.data)
    } catch (err) {
      handleApiError(err, "Erro ao carregar fotos")
    } finally {
      setLoading(false)
    }
  }, [serviceId])

  useEffect(() => {
    void fetch()
  }, [fetch])

  return { photos, loading, refetch: fetch }
}

export function useUploadPhoto(serviceId: string) {
  const [uploading, setUploading] = useState(false)

  const uploadPhoto = async (file: File) => {
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("photo", file)
      const res = await api.post<Photo>(`/services/${serviceId}/photos`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      toast.success("Foto enviada com sucesso!")
      return res.data
    } catch (err) {
      handleApiError(err, "Erro ao enviar foto")
      return null
    } finally {
      setUploading(false)
    }
  }

  return { uploadPhoto, uploading }
}

export function useDeletePhoto(serviceId: string) {
  const [deleting, setDeleting] = useState(false)

  const deletePhoto = async (photoId: string) => {
    setDeleting(true)
    try {
      await api.delete(`/services/${serviceId}/photos/${photoId}`)
      toast.success("Foto removida.")
      return true
    } catch (err) {
      handleApiError(err, "Erro ao remover foto")
      return false
    } finally {
      setDeleting(false)
    }
  }

  return { deletePhoto, deleting }
}
