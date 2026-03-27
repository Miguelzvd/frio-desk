"use client";

import { Dispatch, SetStateAction } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ServiceForm } from "./service-form";

interface CreateServiceModalProps {
  open: boolean;
  onOpenChange: Dispatch<SetStateAction<boolean>>;
}

export function CreateServiceModal({ open, onOpenChange }: CreateServiceModalProps) {

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto sm:rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            Nova Ordem de Serviço
          </DialogTitle>
          <DialogDescription>
            Preencha os dados básicos abaixo para iniciar o atendimento.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          <ServiceForm onSuccess={() => onOpenChange(false)} />
        </div>
      </DialogContent>
    </Dialog>
  );
}