"use client";

import { Dispatch, SetStateAction } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Wrench } from "lucide-react";
import { EditTechnicianForm } from "./edit-technician-form";
import type { AdminTechnician } from "@/hooks/use-admin";

interface EditTechnicianModalProps {
  technician: AdminTechnician | null;
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
}

function formatServiceCount(count: number) {
  if (count >= 1000) return `${(count / 1000).toFixed(1).replace(".0", "")}k`;
  return String(count);
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "long" }).format(new Date(iso));
}

export function EditTechnicianModal({ technician, open, onOpenChange }: EditTechnicianModalProps) {
  if (!technician) return null;

  const serviceCount = technician._count?.services ?? 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md sm:rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Editar Técnico</DialogTitle>
          <DialogDescription>
            Atualize os dados do colaborador de campo.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-4 rounded-xl bg-muted/40 border border-border/40 px-4 py-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm ring-1 ring-primary/20">
            {technician.name?.substring(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-heading font-semibold text-sm truncate">{technician.name}</p>
            <p className="text-xs text-muted-foreground truncate">{technician.email}</p>
          </div>
          <div className="shrink-0 flex flex-col items-end gap-1">
            <Badge variant="secondary" className="font-mono text-xs gap-1.5 bg-secondary/50">
              <Wrench className="size-3 text-muted-foreground" />
              {formatServiceCount(serviceCount)} serviço{serviceCount !== 1 ? "s" : ""}
            </Badge>
            <span className="text-[10px] text-muted-foreground">desde {formatDate(technician.createdAt)}</span>
          </div>
        </div>

        <div className="mt-2">
          <EditTechnicianForm
            technician={technician}
            onSuccess={() => onOpenChange(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
