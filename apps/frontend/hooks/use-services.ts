"use client"

import { useState, useEffect, useCallback } from "react"
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { handleApiError } from "@/lib/error-handler"
import api from "@/lib/api"
import { buildCursorQuery } from "@/lib/pagination"
import type { ServiceType, ChecklistItem, PaginatedResponse } from "@friodesk/shared"

export interface ApiService {
  id: string
  userId: string
  type: ServiceType
  status: "open" | "finished"
  notes: string | null
  createdAt: string
  finishedAt: string | null
  checklist?: ChecklistItem[]
}

export function useServices() {
  return useInfiniteQuery({
    queryKey: ["services"],
    queryFn: async ({ pageParam }) => {
      const qs = buildCursorQuery(pageParam as string | undefined)
      const res = await api.get<PaginatedResponse<ApiService>>(`/services${qs}`)
      return res.data
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  })
}

export function useServiceDetail(id: string) {
  const [service, setService] = useState<
    (ApiService & { checklist: ChecklistItem[] }) | null
  >(null)
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    try {
      setLoading(true)
      const res = await api.get<ApiService & { checklist: ChecklistItem[] }>(
        `/services/${id}`
      )
      setService(res.data)
    } catch (err) {
      handleApiError(err, "Erro ao carregar serviço")
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    void fetch()
  }, [fetch])

  return { service, loading, refetch: fetch }
}

export function useCreateService() {
  const [loading, setLoading] = useState(false)
  const queryClient = useQueryClient()

  const createService = async (type: ServiceType) => {
    setLoading(true)
    try {
      const res = await api.post<ApiService & { checklist: ChecklistItem[] }>(
        "/services",
        { type }
      )
      toast.success("Serviço criado com sucesso!")
      await queryClient.invalidateQueries({ queryKey: ["services"] })
      await queryClient.invalidateQueries({ queryKey: ["admin", "services"] })
      return res.data
    } catch (err) {
      handleApiError(err, "Erro ao criar serviço")
      return null
    } finally {
      setLoading(false)
    }
  }

  return { createService, loading }
}

export function useToggleChecklist() {
  const toggleItem = async (
    serviceId: string,
    itemId: string,
    checked: boolean
  ) => {
    try {
      await api.patch(`/services/${serviceId}/checklist/${itemId}`, { checked })
    } catch (err) {
      handleApiError(err, "Erro ao atualizar checklist")
    }
  }

  return { toggleItem }
}

export function useFinishService() {
  const [loading, setLoading] = useState(false)
  const queryClient = useQueryClient()

  const finishService = async (id: string) => {
    setLoading(true)
    try {
      await api.patch(`/services/${id}`, { status: "finished", finishedAt: new Date().toISOString() })
      toast.success("Serviço finalizado!")
      await queryClient.invalidateQueries({ queryKey: ["services"] })
      await queryClient.invalidateQueries({ queryKey: ["admin", "services"] })
      return true
    } catch (err) {
      handleApiError(err, "Erro ao finalizar serviço")
      return false
    } finally {
      setLoading(false)
    }
  }

  return { finishService, loading }
}

export function useDeleteService() {
  const [loading, setLoading] = useState(false)
  const queryClient = useQueryClient()

  const deleteService = async (id: string) => {
    setLoading(true)
    try {
      await api.delete(`/services/${id}`)
      toast.success("Serviço cancelado.")
      await queryClient.invalidateQueries({ queryKey: ["services"] })
      await queryClient.invalidateQueries({ queryKey: ["admin", "services"] })
      return true
    } catch (err) {
      handleApiError(err, "Erro ao cancelar serviço")
      return false
    } finally {
      setLoading(false)
    }
  }

  return { deleteService, loading }
}

export function useSaveNotes() {
  const [loading, setLoading] = useState(false)
  const queryClient = useQueryClient()

  const saveNotes = async (id: string, notes: string) => {
    setLoading(true)
    try {
      await api.patch(`/services/${id}`, { notes })
      toast.success("Observação salva!")
      await queryClient.invalidateQueries({ queryKey: ["services"] })
      await queryClient.invalidateQueries({ queryKey: ["admin", "services"] })
      return true
    } catch (err) {
      handleApiError(err, "Erro ao salvar observação")
      return false
    } finally {
      setLoading(false)
    }
  }

  return { saveNotes, loading }
}
