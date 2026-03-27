"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ReportView } from "@/components/reports/report-view";
import { useReport } from "@/hooks/use-report";

interface Props {
  params: Promise<{ id: string }>;
}

export default function AdminServiceReportPage({ params }: Props) {
  const { id } = use(params);
  const { report, loading } = useReport(id);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          className="size-9 shrink-0"
          render={<Link href={`/admin/services/${id}`} />}
        >
          <ArrowLeft className="size-4" />
        </Button>
        <h2 className="font-heading text-xl font-bold">Relatório do Serviço</h2>
      </div>

      <div className="max-w-2xl">
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-32 w-full rounded-xl" />
            <Skeleton className="h-48 w-full rounded-xl" />
          </div>
        ) : report ? (
          <ReportView data={report} />
        ) : (
          <p className="text-muted-foreground">
            Relatório não encontrado para este serviço.
          </p>
        )}
      </div>
    </div>
  );
}
