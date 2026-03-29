"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, UserPlus } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { TechniciansTable } from "@/components/admin/technicians-table"
import { CreateTechnicianModal } from "@/components/admin/create-technician-modal"
import { useAdminTechnicians } from "@/hooks/use-admin"
import { PageHeader } from "@/components/ui/page-header"

const PAGE_SIZE = 8

export default function AdminTechniciansPage() {
  const [cursorStack, setCursorStack] = useState<string[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const currentCursor = cursorStack[cursorStack.length - 1]
  const { data, isLoading } = useAdminTechnicians(currentCursor)

  const technicians = data?.data ?? []
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

  if (isLoading && technicians.length === 0) {
    return (
      <div className="space-y-6 p-1">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-9 w-52 rounded-lg" />
            <Skeleton className="h-4 w-72 rounded-md" />
          </div>
          <Skeleton className="h-9 w-36 rounded-md" />
        </div>
        <Card className="border-border/40 shadow-sm overflow-hidden">
          <CardHeader className="border-b border-border/10 bg-muted/10 pb-4">
            <Skeleton className="h-5 w-36 rounded-md" />
            <Skeleton className="h-4 w-56 rounded-md" />
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full rounded-md" />
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-1">
      <PageHeader
        title="Diretório de Técnicos"
        description="Gerencie o corpo técnico e credenciais para acesso de campo."
      >
        <Button size="sm" className="h-9 gap-2" onClick={() => setIsModalOpen(true)}>
          <UserPlus className="size-4" />
          <span>Adicionar Técnico</span>
        </Button>
      </PageHeader>

      <Card className="animate-in fade-in slide-in-from-bottom-6 duration-700 fill-mode-both delay-[150ms] border-border/40 shadow-sm overflow-hidden">
        <CardHeader className="border-b border-border/10 bg-muted/10 pb-4">
          <CardTitle className="text-base font-semibold">Efetivo Cadastrado</CardTitle>
          <CardDescription>
            Mostrando a lista de {total} funcionário{total !== 1 ? "s" : ""} no total.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-0">
          <TechniciansTable technicians={technicians} />
        </CardContent>

        <CardFooter className="flex items-center justify-between border-t border-border/10 bg-muted/10 px-6 py-4">
          <p className="text-xs text-muted-foreground font-medium">
            Página {currentPage} de {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrev}
              disabled={cursorStack.length === 0 || isLoading}
              className="h-8 shadow-sm text-xs"
            >
              <ChevronLeft className="size-3.5 mr-1" />
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNext}
              disabled={!data?.nextCursor || isLoading}
              className="h-8 shadow-sm text-xs"
            >
              Próxima
              <ChevronRight className="size-3.5 ml-1" />
            </Button>
          </div>
        </CardFooter>
      </Card>

      <CreateTechnicianModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </div>
  )
}
