import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { AdminTechnician } from "@/hooks/use-admin"
import { Badge } from "@/components/ui/badge"
import { Wrench } from "lucide-react"

interface TechniciansTableProps {
  technicians: AdminTechnician[]
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "medium",
  }).format(new Date(iso))
}

export function TechniciansTable({ technicians }: TechniciansTableProps) {
  return (
    <Table>
      <TableHeader className="bg-transparent">
        <TableRow className="hover:bg-transparent border-b border-border/30">
          <TableHead className="pl-6 text-xs font-semibold tracking-wide text-muted-foreground w-1/3">NOME COMPLETO</TableHead>
          <TableHead className="text-xs font-semibold tracking-wide text-muted-foreground w-1/3">E-MAIL CORPORATIVO</TableHead>
          <TableHead className="text-xs font-semibold tracking-wide text-muted-foreground">TOTAL DE SERVIÇOS</TableHead>
          <TableHead className="pr-6 text-xs font-semibold tracking-wide text-muted-foreground text-right">CADASTRO</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {technicians.length === 0 ? (
          <TableRow className="hover:bg-transparent">
            <TableCell colSpan={4} className="text-center text-muted-foreground py-10">
              Nenhum técnico localizado em sistema
            </TableCell>
          </TableRow>
        ) : (
          technicians.map((tech) => (
            <TableRow 
              key={tech.id} 
              className="group border-b border-border/20 transition-colors hover:bg-muted/30"
            >
              <TableCell className="pl-6 py-4 font-medium text-sm text-foreground">
                <div className="flex items-center gap-3">
                  {/* Subtle placeholder avatar to spice up the list */}
                  <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs ring-1 ring-primary/20">
                    {tech.name?.substring(0, 2).toUpperCase()}
                  </div>
                  {tech.name}
                </div>
              </TableCell>
              <TableCell className="text-sm font-medium text-muted-foreground">
                {tech.email}
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className="font-mono text-xs gap-1.5 shadow-sm bg-secondary/50">
                  <Wrench className="size-3 text-muted-foreground" />
                  {tech._count?.services ?? 0}
                </Badge>
              </TableCell>
              <TableCell className="pr-6 text-right text-xs text-muted-foreground font-mono">
                {formatDate(tech.createdAt)}
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}
