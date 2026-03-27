"use client"

import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"
import axios from "axios"
import api from "@/lib/api"
import type { Photo } from "@field-report/shared"

export function usePhotos(serviceId: string) {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    try {
      setLoading(true)
      const res = await api.get<Photo[]>(`/photos/${serviceId}`)
      setPhotos(res.data)
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message ?? "Erro ao carregar fotos")
      }
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
      const res = await api.post<Photo>(`/photos/${serviceId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      toast.success("Foto enviada com sucesso!")
      return res.data
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message ?? "Erro ao enviar foto")
      }
      return null
    } finally {
      setUploading(false)
    }
  }

  return { uploadPhoto, uploading }
}
