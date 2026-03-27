"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/auth.store";
import api from "@/lib/api";
import { LoginResponse } from "@/interface/login";

const schema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "Senha obrigatória"),
});

type FormValues = z.infer<typeof schema>;

export default function AdminLoginPage() {
  const router = useRouter();
  const { login, logout } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    // @ts-expect-error @hookform/resolvers
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormValues) => {
    try {
      const res = await api.post<LoginResponse>("/auth/login", data);
      if (res.data.user.role !== "admin") {
        logout();
        toast.error(
          "Acesso negado. Esta conta não tem permissão de administrador.",
        );
        return;
      }
      login(res.data.user);
      router.replace("/admin/dashboard");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.code === "ERR_NETWORK") {
          toast.error("Erro de conexão com servidor");
          return;
        }
        toast.error(err.response?.data?.message ?? "Credenciais inválidas");
        return;
      }
      toast.error("Erro desconhecido");
      return;
    }
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-sm space-y-8">
        <div className="flex flex-col items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-xl border border-border bg-muted shadow-sm">
            <ShieldCheck className="size-6 text-muted-foreground" />
          </div>
          <div className="text-center">
            <h1 className="font-heading text-2xl font-bold">Painel Admin</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Acesso restrito a administradores
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="admin@empresa.com"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-xs text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Verificando..." : "Entrar como administrador"}
          </Button>
        </form>
      </div>
    </div>
  );
}
