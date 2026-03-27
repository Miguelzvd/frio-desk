"use client"

import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"
import axios from "axios"
import api from "@/lib/api"
import type { ServiceType } from "@field-report/shared"
import type { ApiService } from "@/hooks/use-services"

export interface AdminService extends ApiService {
  user?: {
    id: string
    name: string
    email: string
  }
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

export function useAdminServices() {
  const [services, setServices] = useState<AdminService[]>([])
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    try {
      setLoading(true)
      const res = await api.get<AdminService[]>("services")
      setServices(res.data)
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message ?? "Erro ao carregar serviços")
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetch()
  }, [fetch])

  return { services, loading, refetch: fetch }
}

export function useAdminTechnicians() {
  const [technicians, setTechnicians] = useState<AdminTechnician[]>([])
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    try {
      setLoading(true)
      const res = await api.get<AdminTechnician[]>("technicians")
      setTechnicians(res.data)
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message ?? "Erro ao carregar técnicos")
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetch()
  }, [fetch])

  return { technicians, loading, refetch: fetch }
}

export function useAdminMetrics() {
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null)
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    try {
      setLoading(true)
      const res = await api.get<AdminMetrics>("/admin/metrics")
      setMetrics(res.data)
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message ?? "Erro ao carregar métricas")
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
