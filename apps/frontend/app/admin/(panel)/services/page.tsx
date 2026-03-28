"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, FileSpreadsheet } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ServicesTable } from "@/components/admin/services-table"
import { useAdminServices } from "@/hooks/use-admin"
import { SERVICE_TYPE_LABELS, SERVICE_STATUS_LABELS } from "@/lib/constants"
import type { ServiceType, ServiceStatus } from "@friodesk/shared"
import { PageHeader } from "@/components/ui/page-header"

const PAGE_SIZE = 8

const SERVICE_TYPES: ServiceType[] = ["preventiva", "corretiva", "instalação", "inspeção"]
const SERVICE_STATUSES: ServiceStatus[] = ["open", "finished"]

export default function AdminServicesPage() {
  const [cursorStack, setCursorStack] = useState<string[]>([])
  const [typeFilter, setTypeFilter] = useState<ServiceType | "all">("all")
  const [statusFilter, setStatusFilter] = useState<ServiceStatus | "all">("all")
  
  const currentCursor = cursorStack[cursorStack.length - 1]
  const { data, isLoading } = useAdminServices(currentCursor, typeFilter, statusFilter)

  const services = data?.data ?? []
  const total = data?.total ?? 0
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const currentPage = cursorStack.length + 1

  function handleNext() {
    if (data?.nextCursor) {
      setCursorStack((prev) => [...prev, data.nextCursor!])
    }
  }

  function handlePrev() {
    setCursorStack((prev) => prev.slice(0, -1))
  }

  function handleTypeChange(val: ServiceType | "all") {
    setTypeFilter(val)
    setCursorStack([]) 
  }

  function handleStatusChange(val: ServiceStatus | "all") {
    setStatusFilter(val)
    setCursorStack([])
  }

  return (
    <div className="space-y-6 p-1">
      <PageHeader
        title="Gestão de Serviços"
        description="Supervisão e gerenciamento completo do histórico de ocorrências."
      >
        <Button variant="outline" size="sm" className="h-9 gap-2 text-muted-foreground shadow-sm">
          <FileSpreadsheet className="size-4" />
          <span>Exportar Relatório</span>
        </Button>
      </PageHeader>

      <Card className="animate-in fade-in slide-in-from-bottom-6 duration-700 fill-mode-both delay-[150ms] border-border/40 shadow-sm overflow-hidden">
        <CardHeader className="border-b border-border/10 bg-muted/20 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-base font-semibold">Pesquisa e Filtragem</CardTitle>
              <CardDescription>
                Exibindo {total} registro{total !== 1 ? "s" : ""} no total
              </CardDescription>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              <Select value={typeFilter} onValueChange={(v) => handleTypeChange(v as ServiceType | "all")}>
                <SelectTrigger className="w-full sm:w-40 bg-background/50 h-9 capitalize shadow-sm">
                  <SelectValue placeholder="Tipo">
                    {typeFilter === "all" ? "Todos Tipos" : SERVICE_TYPE_LABELS[typeFilter as ServiceType]}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="capitalize">Todos Tipos</SelectItem>
                  {SERVICE_TYPES.map((t) => (
                    <SelectItem key={t} value={t} className="capitalize">
                      {SERVICE_TYPE_LABELS[t]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={(v) => handleStatusChange(v as ServiceStatus | "all")}>
                <SelectTrigger className="w-full sm:w-40 bg-background/50 h-9 capitalize shadow-sm">
                  <SelectValue placeholder="Status">
                    {statusFilter === "all" ? "Qualquer Status" : SERVICE_STATUS_LABELS[statusFilter as ServiceStatus]}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="capitalize">Qualquer Status</SelectItem>
                  {SERVICE_STATUSES.map((s) => (
                    <SelectItem key={s} value={s} className="capitalize">
                      {SERVICE_STATUS_LABELS[s]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full rounded-md" />
              ))}
            </div>
          ) : (
            <ServicesTable services={services} />
          )}
        </CardContent>

        <CardFooter className="flex items-center justify-between border-t border-border/10 bg-muted/10 px-6 py-4">
          <p className="text-xs text-muted-foreground font-medium">
            Página {currentPage} de {totalPages}
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handlePrev} disabled={cursorStack.length === 0 || isLoading} className="h-8 shadow-sm text-xs">
              <ChevronLeft className="size-3.5 mr-1" /> Anterior
            </Button>
            <Button variant="outline" size="sm" onClick={handleNext} disabled={!data?.nextCursor || isLoading} className="h-8 shadow-sm text-xs">
              Próxima <ChevronRight className="size-3.5 ml-1" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}