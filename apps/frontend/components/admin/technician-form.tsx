"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateTechnician } from "@/hooks/use-admin";

const schema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});

type FormValues = z.infer<typeof schema>;

interface TechnicianFormProps {
  onSuccess?: () => void;
}

export function TechnicianForm({ onSuccess }: TechnicianFormProps) {
  const { createTechnician, loading } = useCreateTechnician();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    // @ts-expect-error @hookform/resolvers
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormValues) => {
    const technician = await createTechnician(data.name, data.email, data.password);
    if (technician) {
      toast.success("Técnico cadastrado com sucesso!");
      onSuccess?.();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="tech-name">Nome completo</Label>
        <Input
          id="tech-name"
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
        <Label htmlFor="tech-email">E-mail</Label>
        <Input
          id="tech-email"
          type="email"
          autoComplete="off"
          placeholder="joao@empresa.com"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-xs text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="tech-password">Senha de acesso</Label>
        <Input
          id="tech-password"
          type="password"
          autoComplete="new-password"
          placeholder="Mínimo 6 caracteres"
          {...register("password")}
        />
        {errors.password && (
          <p className="text-xs text-destructive">{errors.password.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full gap-2" disabled={loading}>
        {loading && <Loader2 className="size-4 animate-spin" />}
        {loading ? "Cadastrando..." : "Cadastrar Técnico"}
      </Button>
    </form>
  );
}
