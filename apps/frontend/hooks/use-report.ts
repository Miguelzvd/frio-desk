"use client"

import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"
import axios from "axios"
import api from "@/lib/api"
import type { Report, ChecklistItem, Photo } from "@field-report/shared"
import type { ApiService } from "@/hooks/use-services"

export interface FullReport {
  report: Report
  service: ApiService
  checklist: ChecklistItem[]
  photos: Photo[]
}

export function useReport(serviceId: string) {
  const [report, setReport] = useState<FullReport | null>(null)
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    try {
      setLoading(true)
      const res = await api.get<FullReport>(`/reports/${serviceId}`)
      setReport(res.data)
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message ?? "Erro ao carregar relatório")
      }
    } finally {
      setLoading(false)
    }
  }, [serviceId])

  useEffect(() => {
    void fetch()
  }, [fetch])

  return { report, loading, refetch: fetch }
}

export function useCreateReport(serviceId: string) {
  const [loading, setLoading] = useState(false)

  const createReport = async (data: {
    responsibleName: string
    notes: string
  }) => {
    setLoading(true)
    try {
      const res = await api.post<Report>(`/reports/${serviceId}`, data)
      toast.success("Relatório gerado com sucesso!")
      return res.data
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message ?? "Erro ao gerar relatório")
      }
      return null
    } finally {
      setLoading(false)
    }
  }

  return { createReport, loading }
}
