"use client";

import { use } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { ReportView } from "@/components/reports/report-view";
import { useReport, useCreateReport } from "@/hooks/use-report";
import { cn } from "@/lib/utils";

const schema = z.object({
  responsibleName: z.string().min(1, "Nome do responsável é obrigatório"),
  notes: z.string().min(1, "Observações são obrigatórias"),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  params: Promise<{ id: string }>;
}

export default function ServiceReportPage({ params }: Props) {
  const { id } = use(params);
  const { report, loading, refetch } = useReport(id);
  const { createReport, loading: submitting } = useCreateReport(id);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormValues) => {
    const result = await createReport(data);
    if (result) await refetch();
  };

  return (
    <div className="relative flex flex-col gap-5 min-h-full max-w-6xl mx-auto py-8 px-4">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="size-9 shrink-0"
          nativeButton={false}
          render={<Link href={`/services/${id}`} />}
        >
          <ArrowLeft className="size-4" />
        </Button>
        <h2 className="font-heading text-xl font-bold">Relatório</h2>
      </div>

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-48 w-full rounded-xl" />
          <Skeleton className="h-40 w-full rounded-xl" />
        </div>
      ) : report ? (
        <ReportView data={report} />
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Preencha os dados abaixo para gerar o relatório deste serviço.
          </p>

          <div className="space-y-1.5">
            <Label htmlFor="responsibleName">Nome do responsável</Label>
            <Input
              id="responsibleName"
              placeholder="Ex: João Silva"
              {...register("responsibleName")}
            />
            {errors.responsibleName && (
              <p className="text-xs text-destructive">
                {errors.responsibleName.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="notes">Observações</Label>
            <textarea
              id="notes"
              rows={5}
              placeholder="Descreva o que foi feito, condições encontradas, materiais utilizados..."
              className={cn(
                "w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 dark:bg-input/30",
              )}
              {...register("notes")}
            />
            {errors.notes && (
              <p className="text-xs text-destructive">{errors.notes.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting && <Loader2 className="mr-2 size-4 animate-spin" />}
            {submitting ? "Gerando relatório..." : "Gerar relatório"}
          </Button>
        </form>
      )}
    </div>
  );
}
