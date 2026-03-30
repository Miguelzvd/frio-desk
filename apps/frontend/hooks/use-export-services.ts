"use client";

import { useState, useRef } from "react";
import api from "@/lib/api";
import { handleApiError } from "@/lib/error-handler";
import { SERVICE_TYPE_LABELS, SERVICE_STATUS_LABELS } from "@/lib/constants";
import type { ServiceType, ServiceStatus } from "@friodesk/shared";

interface ExportService {
  id: string;
  type: ServiceType;
  status: ServiceStatus;
  createdAt: string;
  finishedAt: string | null;
  user: { name: string; email: string };
}

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Intl.DateTimeFormat("pt-BR").format(new Date(iso));
}

function toCSV(rows: ExportService[]): string {
  const headers = [
    "Técnico",
    "E-mail",
    "Tipo",
    "Status",
    "Data de Abertura",
    "Data de Conclusão",
  ];

  const escape = (val: string) =>
    `"${val.replace(/"/g, '""')}"`;

  const lines = rows.map((s) =>
    [
      escape(s.user?.name ?? "—"),
      escape(s.user?.email ?? "—"),
      escape(SERVICE_TYPE_LABELS[s.type] ?? s.type),
      escape(SERVICE_STATUS_LABELS[s.status] ?? s.status),
      escape(formatDate(s.createdAt)),
      escape(formatDate(s.finishedAt)),
    ].join(",")
  );

  return "\uFEFF" + [headers.join(","), ...lines].join("\n");
}

function triggerDownload(csv: string, filename: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

interface UseExportServicesOptions {
  type?: string;
  status?: string;
}

export function useReportServices({ type, status }: UseExportServicesOptions) {
  const [loading, setLoading] = useState(false);
  const isGenerating = useRef(false);

  const generateReport = async () => {
    if (isGenerating.current) return;
    isGenerating.current = true;

    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (type && type !== "all") params.set("type", type);
      if (status && status !== "all") params.set("status", status);
      const qs = params.toString() ? `?${params.toString()}` : "";

      const res = await api.get<ExportService[]>(`/services/report${qs}`);
      const csv = toCSV(res.data);
      const date = new Date().toISOString().slice(0, 10);
      triggerDownload(csv, `relatorio-servicos-${date}.csv`);
    } catch (err) {
      handleApiError(err, "Erro ao gerar relatório");
      isGenerating.current = false;
      setLoading(false);
      return;
    }

    setTimeout(() => {
      isGenerating.current = false;
      setLoading(false);
    }, 1000);
  };

  return { generateReport, loading };
}
