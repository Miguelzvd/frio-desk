"use client";

import { Dispatch, SetStateAction } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TechnicianForm } from "./technician-form";

interface CreateTechnicianModalProps {
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
}

export function CreateTechnicianModal({ open, onOpenChange }: CreateTechnicianModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md sm:rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Novo Técnico</DialogTitle>
          <DialogDescription>
            Preencha os dados de acesso do novo colaborador de campo.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          <TechnicianForm onSuccess={() => onOpenChange(false)} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
