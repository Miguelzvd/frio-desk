import { Plus, Wind } from "lucide-react"
import { Button } from "@/components/ui/button"

interface EmptyStateProps {
  onAction: () => void
}

export function EmptyState({ onAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-5 py-24 text-center animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="relative flex size-20 items-center justify-center rounded-full bg-primary/5 ring-1 ring-primary/10">
        <div className="absolute inset-0 rounded-full bg-primary/10 blur-xl"></div>
        <Wind className="size-8 text-primary/60 relative z-10" />
      </div>
      <div>
        <p className="font-heading text-lg font-bold text-foreground">
          Nenhum serviço registrado ainda
        </p>
        <p className="mt-1.5 text-sm text-muted-foreground max-w-sm mx-auto">
          Você ainda não possui ordens de serviço. Comece adicionando um novo registro para acompanhar seus atendimentos.
        </p>
      </div>

      <Button onClick={onAction} className="mt-2 h-10 px-6 shadow-md transition-all hover:scale-105 active:scale-95 group">
        <Plus className="size-4 mr-2 transition-transform group-hover:rotate-90" />
        Registrar Primeiro Serviço
      </Button>
    </div>
  )
}
