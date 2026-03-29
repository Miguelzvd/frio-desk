"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { AdminTechnician } from "@/hooks/use-admin";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Wrench } from "lucide-react";
import { useState } from "react";
import { EditTechnicianModal } from "./edit-technician-modal";

interface TechniciansTableProps {
  technicians: AdminTechnician[];
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "medium",
  }).format(new Date(iso));
}

function formatServiceCount(count: number) {
  if (count >= 1000) return `${(count / 1000).toFixed(1).replace(".0", "")}k`;
  return String(count);
}

export function TechniciansTable({ technicians }: TechniciansTableProps) {
  const [selected, setSelected] = useState<AdminTechnician | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  const handleEdit = (tech: AdminTechnician) => {
    setSelected(tech);
    setEditOpen(true);
  };

  return (
    <>
      <Table>
        <TableHeader className="bg-transparent">
          <TableRow className="hover:bg-transparent border-b border-border/30">
            <TableHead className="pl-6 text-xs font-semibold tracking-wide text-muted-foreground w-1/3">NOME COMPLETO</TableHead>
            <TableHead className="text-xs font-semibold tracking-wide text-muted-foreground w-1/3">E-MAIL CORPORATIVO</TableHead>
            <TableHead className="text-xs font-semibold tracking-wide text-muted-foreground">SERVIÇOS</TableHead>
            <TableHead className="text-xs font-semibold tracking-wide text-muted-foreground">CADASTRO</TableHead>
            <TableHead className="pr-6 text-xs font-semibold tracking-wide text-muted-foreground text-right">AÇÕES</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {technicians.length === 0 ? (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={5} className="text-center text-muted-foreground py-10">
                Nenhum técnico localizado em sistema
              </TableCell>
            </TableRow>
          ) : (
            technicians.map((tech) => {
              const serviceCount = tech._count?.services ?? 0;
              return (
                <TableRow
                  key={tech.id}
                  className="group border-b border-border/20 transition-colors hover:bg-muted/30"
                >
                  <TableCell className="pl-6 py-4 font-medium text-sm text-foreground">
                    <div className="flex items-center gap-3">
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
                    <Badge
                      variant="secondary"
                      className="font-mono text-xs gap-1.5 shadow-sm bg-secondary/50"
                      title={serviceCount >= 1000 ? `${serviceCount} serviços` : undefined}
                    >
                      <Wrench className="size-3 text-muted-foreground" />
                      {formatServiceCount(serviceCount)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground font-mono">
                    {formatDate(tech.createdAt)}
                  </TableCell>
                  <TableCell className="pr-6 text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleEdit(tech)}
                    >
                      <Pencil className="size-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>

      <EditTechnicianModal
        technician={selected}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
    </>
  );
}
