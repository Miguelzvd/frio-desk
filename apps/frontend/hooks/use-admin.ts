"use client";

import { useState, useEffect, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { handleApiError } from "@/lib/error-handler";
import api from "@/lib/api";
import { buildCursorQuery } from "@/lib/pagination";
import type {
  ServiceType,
  ChecklistItem,
  Photo,
  PaginatedResponse,
} from "@friodesk/shared";
import type { ApiService } from "@/hooks/use-services";

export interface AdminService extends ApiService {
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface AdminServiceDetail extends AdminService {
  checklist: ChecklistItem[];
  photos: Photo[];
}

export interface AdminTechnician {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  _count?: { services: number };
}

export interface AdminMetrics {
  totalServices: number;
  openServices: number;
  finishedServices: number;
  totalTechnicians: number;
  byType: Record<ServiceType, number>;
}

export function useAdminServices(
  cursor?: string,
  type?: string,
  status?: string,
) {
  return useQuery({
    queryKey: ["admin", "services", cursor, type, status],
    queryFn: async () => {
      const qs = buildCursorQuery(cursor, 8, {
        type: type || "all",
        status: status || "all",
      });
      const res = await api.get<PaginatedResponse<AdminService>>(
        `/services${qs}`,
      );
      return res.data;
    },
  });
}

export function useAdminServiceDetail(id: string) {
  const [service, setService] = useState<AdminServiceDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get<AdminServiceDetail>(`/services/${id}`);
      setService(res.data);
    } catch (err) {
      handleApiError(err, "Erro ao carregar serviço");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void fetch();
  }, [fetch]);

  return { service, loading, refetch: fetch };
}

export function useAdminTechnicians(cursor?: string) {
  return useQuery({
    queryKey: ["admin", "technicians", cursor],
    queryFn: async () => {
      const qs = buildCursorQuery(cursor);
      const res = await api.get<PaginatedResponse<AdminTechnician>>(
        `/users${qs}`,
      );
      return res.data;
    },
  });
}

export function useAdminMetrics(year?: number, month?: number) {
  return useQuery({
    queryKey: ["admin", "metrics", year, month],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (year !== undefined) params.set("year", String(year));
      if (month !== undefined) params.set("month", String(month));
      const qs = params.toString() ? `?${params.toString()}` : "";
      const res = await api.get<AdminMetrics>(`/services/metrics${qs}`);
      return res.data;
    },
  });
}


export function useCreateTechnician() {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const createTechnician = useCallback(
    async (name: string, email: string, password: string) => {
      try {
        setLoading(true);
        const res = await api.post<{ user: AdminTechnician }>("/users", {
          name,
          email,
          password,
        });
        await queryClient.invalidateQueries({ queryKey: ["admin", "technicians"] });
        return res.data.user;
      } catch (err) {
        handleApiError(err, "Erro ao criar técnico");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [queryClient],
  );

  return { createTechnician, loading };
}

export function useUpdateTechnician() {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const updateTechnician = useCallback(
    async (id: string, data: { name?: string; email?: string }) => {
      try {
        setLoading(true);
        const res = await api.patch<AdminTechnician>(`/users/${id}`, data);
        await queryClient.invalidateQueries({ queryKey: ["admin", "technicians"] });
        return res.data;
      } catch (err) {
        handleApiError(err, "Erro ao atualizar técnico");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [queryClient],
  );

  return { updateTechnician, loading };
}
