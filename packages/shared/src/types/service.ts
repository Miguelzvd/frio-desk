export type ServiceType = "preventiva" | "corretiva" | "instalação" | "inspeção"
export type ServiceStatus = "open" | "finished"

export interface Service {
  id: string
  userId: string
  type: ServiceType
  status: ServiceStatus
  createdAt: Date
  finishedAt: Date | null
}

export interface ChecklistItem {
  id: string
  serviceId: string
  label: string
  checked: boolean
}
