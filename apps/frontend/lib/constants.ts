import type { ServiceType, ServiceStatus } from "@friodesk/shared"

export const SERVICE_TYPE_LABELS: Record<ServiceType, string> = {
  preventiva: "Preventiva",
  corretiva: "Corretiva",
  "instalação": "Instalação",
  "inspeção": "Inspeção",
}

export const SERVICE_STATUS_LABELS: Record<ServiceStatus, string> = {
  open: "Em andamento",
  finished: "Concluído",
}

export const SERVICE_STATUS_BADGE: Record<
  ServiceStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  open: "secondary",
  finished: "default",
}
