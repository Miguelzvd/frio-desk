"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  Wrench,
  PackagePlus,
  ClipboardList,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { SERVICE_TYPE_LABELS } from "@/lib/constants";
import { useCreateService } from "@/hooks/use-services";
import type { ServiceType } from "@friodesk/shared";

const schema = z.object({
  type: z.enum(["preventiva", "corretiva", "instalação", "inspeção"] as const),
});

type FormValues = z.infer<typeof schema>;

const TYPE_CARDS = [
  { type: "preventiva" as ServiceType, icon: ShieldCheck },
  { type: "corretiva" as ServiceType, icon: Wrench },
  { type: "instalação" as ServiceType, icon: PackagePlus },
  { type: "inspeção" as ServiceType, icon: ClipboardList },
];

interface ServiceFormProps {
  onSuccess?: () => void;
}

export function ServiceForm({ onSuccess }: ServiceFormProps) {
  const router = useRouter();
  const { createService, loading } = useCreateService();
  const [isRedirecting, setIsRedirecting] = useState(false);

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    // @ts-expect-error @hookform/resolvers
    resolver: zodResolver(schema),
  });

  const selectedType = watch("type");

  const onSubmit = async (data: FormValues) => {
    const service = await createService(data.type);
    if (service) {
      toast.success("Serviço criado com sucesso!");
      onSuccess?.();
      setIsRedirecting(true);
      router.push(`/services/${service.id}`);
    }
  };

  const isBusy = loading || isRedirecting;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-3">
        <Label>Tipo de serviço</Label>
        <div className="grid grid-cols-2 gap-3">
          {TYPE_CARDS.map(({ type, icon: Icon }) => {
            const isSelected = selectedType === type;
            return (
              <button
                key={type}
                type="button"
                disabled={isBusy}
                onClick={() => setValue("type", type, { shouldValidate: true })}
                className={cn(
                  "flex flex-col items-center justify-center gap-2 rounded-xl border p-4 text-sm font-medium transition-all",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  "disabled:pointer-events-none disabled:opacity-50",
                  isSelected
                    ? "border-primary bg-primary/10 ring-2 ring-primary text-primary"
                    : "border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <Icon className="size-6" />
                <span>{SERVICE_TYPE_LABELS[type]}</span>
              </button>
            );
          })}
        </div>
        {errors.type && (
          <p className="text-xs text-destructive">
            Selecione um tipo de serviço
          </p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isBusy}>
        {isBusy ? (
          <>
            <Loader2 className="mr-2 size-4 animate-spin" />
            Criando serviço...
          </>
        ) : (
          "Criar serviço"
        )}
      </Button>
    </form>
  );
}
