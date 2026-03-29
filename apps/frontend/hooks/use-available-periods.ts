"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export interface AvailablePeriod {
  year: number;
  month: number;
}

export function useAvailablePeriods() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "metrics", "periods"],
    queryFn: async () => {
      const res = await api.get<AvailablePeriod[]>("/services/metrics/periods");
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  return { periods: data ?? [], isLoading };
}
