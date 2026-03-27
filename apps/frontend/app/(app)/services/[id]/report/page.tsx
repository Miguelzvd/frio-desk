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

export default function ServiceReportPage({ params }: Props) {
  const { id } = use(params);
  const { report, loading } = useReport(id);

  return (
    <div className="space-y-5 px-4 py-5">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="size-9 shrink-0"
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
        <div className="py-20 text-center">
          <p className="font-heading font-semibold">Relatório não encontrado</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Finalize o serviço e gere o relatório primeiro
          </p>
        </div>
      )}
    </div>
  );
}
