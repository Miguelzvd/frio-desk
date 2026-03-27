"use client"

import { useState, useEffect, useCallback } from "react"
import { useQuery } from "@tanstack/react-query"
import { toast } from "sonner"
import axios from "axios"
import api from "@/lib/api"
import { buildCursorQuery } from "@/lib/pagination"
import type { ServiceType, ChecklistItem, Photo, PaginatedResponse } from "@friodesk/shared"
import type { ApiService } from "@/hooks/use-services"

export interface AdminService extends ApiService {
  user?: {
    id: string
    name: string
    email: string
  }
}

export interface AdminServiceDetail extends AdminService {
  checklist: ChecklistItem[]
  photos: Photo[]
}

export interface AdminTechnician {
  id: string
  name: string
  email: string
  role: string
  createdAt: string
  _count?: { services: number }
}

export interface AdminMetrics {
  totalServices: number
  openServices: number
  finishedServices: number
  totalTechnicians: number
  byType: Record<ServiceType, number>
}

export function useAdminServices(cursor?: string) {
  return useQuery({
    queryKey: ["admin", "services", cursor],
    queryFn: async () => {
      const qs = buildCursorQuery(cursor)
      const res = await api.get<PaginatedResponse<AdminService>>(`/services${qs}`)
      return res.data
    },
  })
}

export function useAdminServiceDetail(id: string) {
  const [service, setService] = useState<AdminServiceDetail | null>(null)
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    try {
      setLoading(true)
      const res = await api.get<AdminServiceDetail>(`/services/${id}`)
      setService(res.data)
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.error ?? "Erro ao carregar serviço")
      }
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    void fetch()
  }, [fetch])

  return { service, loading, refetch: fetch }
}

export function useAdminTechnicians(cursor?: string) {
  return useQuery({
    queryKey: ["admin", "technicians", cursor],
    queryFn: async () => {
      const qs = buildCursorQuery(cursor)
      const res = await api.get<PaginatedResponse<AdminTechnician>>(`/users${qs}`)
      return res.data
    },
  })
}

export function useAdminMetrics() {
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null)
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    try {
      setLoading(true)
      const res = await api.get<AdminMetrics>("/services/metrics")
      setMetrics(res.data)
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.error ?? "Erro ao carregar métricas")
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetch()
  }, [fetch])

  return { metrics, loading }
}
