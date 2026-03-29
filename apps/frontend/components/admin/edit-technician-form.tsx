"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUpdateTechnician } from "@/hooks/use-admin";
import type { AdminTechnician } from "@/hooks/use-admin";

const schema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
});

type FormValues = z.infer<typeof schema>;

interface EditTechnicianFormProps {
  technician: AdminTechnician;
  onSuccess?: () => void;
}

export function EditTechnicianForm({ technician, onSuccess }: EditTechnicianFormProps) {
  const { updateTechnician, loading } = useUpdateTechnician();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    // @ts-expect-error @hookform/resolvers
    resolver: zodResolver(schema),
    defaultValues: {
      name: technician.name,
      email: technician.email,
    },
  });

  const onSubmit = async (data: FormValues) => {
    const updated = await updateTechnician(technician.id, data);
    if (updated) {
      toast.success("Dados atualizados com sucesso!");
      onSuccess?.();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="edit-tech-name">Nome completo</Label>
        <Input
          id="edit-tech-name"
          type="text"
          autoComplete="off"
          placeholder="João da Silva"
          {...register("name")}
        />
        {errors.name && (
          <p className="text-xs text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="edit-tech-email">E-mail</Label>
        <Input
          id="edit-tech-email"
          type="email"
          autoComplete="off"
          placeholder="joao@empresa.com"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-xs text-destructive">{errors.email.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full gap-2" disabled={loading}>
        {loading && <Loader2 className="size-4 animate-spin" />}
        {loading ? "Salvando..." : "Salvar Alterações"}
      </Button>
    </form>
  );
}
