"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, UserPlus } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { TechniciansTable } from "@/components/admin/technicians-table"
import { useAdminTechnicians } from "@/hooks/use-admin"

const PAGE_SIZE = 8

export default function AdminTechniciansPage() {
  const [cursorStack, setCursorStack] = useState<string[]>([])
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

  return (
    <div className="space-y-6 p-1">
      {/* Cabeçalho Premium */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div>
          <h1 className="text-3xl font-heading font-bold tracking-tight text-foreground">
            Diretório de Técnicos
          </h1>
          <p className="mt-1 text-sm text-muted-foreground font-medium">
            Gerencie o corpo técnico e credenciais para acesso de campo.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" className="h-9 gap-2 shadow-sm font-semibold">
            <UserPlus className="size-4" />
            <span>Adicionar Técnico</span>
          </Button>
        </div>
      </div>

      {/* Tabela de Dados (Container com Card) */}
      <Card className="animate-in fade-in slide-in-from-bottom-6 duration-700 fill-mode-both delay-[150ms] border-border/40 shadow-sm overflow-hidden">
        <CardHeader className="border-b border-border/10 bg-muted/10 pb-4">
          <CardTitle className="text-base font-semibold">Efetivo Cadastrado</CardTitle>
          <CardDescription>
            Mostrando a lista de {total} funcionário{total !== 1 ? "s" : ""} no total.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full rounded-md" />
              ))}
            </div>
          ) : (
            <TechniciansTable technicians={technicians} />
          )}
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
    </div>
  )
}
