import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { AdminTechnician } from "@/hooks/use-admin"

interface TechniciansTableProps {
  technicians: AdminTechnician[]
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("pt-BR").format(new Date(iso))
}

export function TechniciansTable({ technicians }: TechniciansTableProps) {
  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Serviços</TableHead>
            <TableHead>Cadastro</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {technicians.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                Nenhum técnico cadastrado
              </TableCell>
            </TableRow>
          ) : (
            technicians.map((tech) => (
              <TableRow key={tech.id}>
                <TableCell className="font-medium text-sm">{tech.name}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {tech.email}
                </TableCell>
                <TableCell className="font-mono text-sm">
                  {tech._count?.services ?? 0}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground font-mono">
                  {formatDate(tech.createdAt)}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
