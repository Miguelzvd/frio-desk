"use client";

import Link from "next/link";
import { use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, FileText, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Checklist } from "@/components/services/checklist";
import { PhotoUpload } from "@/components/services/photo-upload";
import {
  useServiceDetail,
  useToggleChecklist,
  useFinishService,
} from "@/hooks/use-services";
import { SERVICE_TYPE_LABELS, SERVICE_STATUS_LABELS } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface Props {
  params: Promise<{ id: string }>;
}

export default function ServiceDetailPage({ params }: Props) {
  const { id } = use(params);
  const router = useRouter();
  const { service, loading, refetch } = useServiceDetail(id);
  const { toggleItem } = useToggleChecklist();
  const { finishService, loading: finishing } = useFinishService();

  const handleToggle = async (itemId: string, checked: boolean) => {
    await toggleItem(id, itemId, checked);
  };

  const handleFinish = async () => {
    const ok = await finishService(id);
    if (ok) await refetch();
  };

  if (loading) {
    return (
      <div className="space-y-4 px-4 py-5">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-40 w-full rounded-xl" />
        <Skeleton className="h-56 w-full rounded-xl" />
      </div>
    );
  }

  if (!service) return null;

  const isFinished = service.status === "finished";

  return (
    <div className="space-y-5 px-4 py-5">
      {/* Back + Title */}
      <div className="flex items-start gap-3">
        <Button
          render={<Link href="/dashboard" />}
          variant="ghost"
          size="icon"
          className="mt-0.5 size-9 shrink-0"
        >
          <ArrowLeft className="size-4" />
        </Button>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h2 className="font-heading text-xl font-bold leading-none">
              {SERVICE_TYPE_LABELS[service.type]}
            </h2>
            <Badge
              className={cn(
                "text-[10px]",
                isFinished
                  ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
                  : "bg-amber-500/15 text-amber-700 dark:text-amber-400",
              )}
            >
              {SERVICE_STATUS_LABELS[service.status]}
            </Badge>
          </div>
          <p className="mt-1 font-mono text-[11px] text-muted-foreground">
            #{id.slice(0, 8).toUpperCase()}
          </p>
        </div>
      </div>

      {/* Checklist */}
      {service.checklist && (
        <div className="rounded-xl border border-border bg-card p-4">
          <Checklist
            items={service.checklist}
            serviceId={id}
            readOnly={isFinished}
            onToggle={handleToggle}
          />
        </div>
      )}

      {/* Photos */}
      {!isFinished && (
        <div className="rounded-xl border border-border bg-card p-4">
          <PhotoUpload serviceId={id} />
        </div>
      )}

      {/* Actions */}
      <div className="space-y-2 pb-2">
        {!isFinished && (
          <Button
            className="w-full gap-2"
            onClick={handleFinish}
            disabled={finishing}
          >
            {finishing ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <CheckCircle2 className="size-4" />
            )}
            {finishing ? "Finalizando..." : "Finalizar serviço"}
          </Button>
        )}

        <Button
          variant="outline"
          className="w-full gap-2"
          render={<Link href={`/services/${id}/report`} />}
        >
          <FileText className="size-4" />
          Ver relatório
        </Button>
      </div>
    </div>
  );
}
