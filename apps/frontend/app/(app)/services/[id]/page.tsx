"use client";

import Link from "next/link";
import { use, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Trash2,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Checklist } from "@/components/services/checklist";
import { PhotoUpload } from "@/components/services/photo-upload";
import {
  useServiceDetail,
  useToggleChecklist,
  useFinishService,
  useDeleteService,
  useSaveNotes,
} from "@/hooks/use-services";
import { SERVICE_TYPE_LABELS, SERVICE_STATUS_LABELS } from "@/lib/constants";
import { cn } from "@/lib/utils";

import { PageHeader } from "@/components/ui/page-header";

import { PageContainer } from "@/components/ui/page-container";

interface Props {
  params: Promise<{ id: string }>;
}

export default function ServiceDetailPage({ params }: Props) {
  const { id } = use(params);
  const router = useRouter();
  const { service, loading, refetch } = useServiceDetail(id);
  const { toggleItem } = useToggleChecklist();
  const { finishService, loading: finishing } = useFinishService();
  const { deleteService, loading: deleting } = useDeleteService();
  const { saveNotes, loading: savingNotes } = useSaveNotes();

  const [cancelOpen, setCancelOpen] = useState(false);
  const [notes, setNotes] = useState<string | null>(null);

  if (service && notes === null) {
    setNotes(service.notes ?? "");
  }

  const handleToggle = async (itemId: string, checked: boolean) => {
    await toggleItem(id, itemId, checked);
  };

  const handleFinish = async () => {
    const ok = await finishService(id);
    if (ok) await refetch();
  };

  const handleConfirmCancel = async () => {
    const ok = await deleteService(id);
    if (ok) router.replace("/dashboard");
  };

  const handleSaveNotes = async () => {
    const ok = await saveNotes(id, notes ?? "");
    if (ok) await refetch();
  };

  if (loading) {
    return (
      <div className="space-y-4 px-4 py-8 max-w-6xl mx-auto">
        <Skeleton className="h-14 w-full md:w-1/2 lg:w-1/3 rounded-xl" />
        <Skeleton className="h-48 w-full rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  if (!service) return null;

  const isFinished = service.status === "finished";
  const currentNotes = notes ?? "";
  const canEditNotes = !isFinished || !service.notes;

  return (
    <>
      <PageContainer>
        <PageHeader
          title={
            <div className="flex items-center gap-3">
              <Button
                render={<Link href="/dashboard" />}
                nativeButton={false}
                variant="ghost"
                size="icon"
                className="size-10"
              >
                <ArrowLeft className="size-4" />
              </Button>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <span>{SERVICE_TYPE_LABELS[service.type]}</span>
                <Badge
                  className={cn(
                    "text-[10px] w-fit font-bold uppercase tracking-wider shadow-none border",
                    isFinished
                      ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 dark:bg-emerald-500/5"
                      : "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400 dark:bg-amber-500/5"
                  )}
                >
                  {SERVICE_STATUS_LABELS[service.status]}
                </Badge>
              </div>
            </div>
          }
          description={
            <span className="font-mono mt-1 text-sm inline-block px-1.5 py-0.5 rounded bg-muted/50 border border-border/40">
              #{id.slice(0, 8).toUpperCase()}
            </span>
          }
        />

        <div className="flex flex-col md:grid md:grid-cols-12 gap-6 animate-in fade-in slide-in-from-bottom-6 duration-700 fill-mode-both delay-[150ms]">
          
          <div className="md:col-span-8 space-y-6">
            {service.checklist && (
              <div className="rounded-2xl border border-border/40 shadow-sm bg-card p-5 sm:p-6 transition-colors hover:border-border">
                <Checklist
                  items={service.checklist}
                  serviceId={id}
                  readOnly={isFinished}
                  onToggle={handleToggle}
                />
              </div>
            )}

            {!isFinished && (
              <div className="rounded-2xl border border-border/40 shadow-sm bg-card p-5 sm:p-6 transition-colors hover:border-border">
                <PhotoUpload serviceId={id} />
              </div>
            )}
          </div>

          <div className="md:col-span-4 space-y-6">
            {canEditNotes ? (
              <div className="rounded-2xl border border-border/40 shadow-sm bg-card p-5 sm:p-6 space-y-3 transition-colors hover:border-border">
                <p className="font-heading font-semibold text-foreground/90">Apontamentos</p>
                <textarea
                  rows={6}
                  maxLength={500}
                  value={currentNotes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Relate os detalhes operacionais..."
                  className="w-full rounded-xl border border-input bg-muted/20 px-3.5 py-3 text-sm transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-primary/50 focus-visible:ring-2 focus-visible:ring-primary/20 resize-none"
                />
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium text-muted-foreground">
                    {currentNotes.length}/500
                  </span>
                  <Button
                    size="sm"
                    className="gap-2"
                    onClick={handleSaveNotes}
                    disabled={savingNotes}
                  >
                    {savingNotes ? (
                      <Loader2 className="size-3.5 animate-spin" />
                    ) : (
                      <Save className="size-3.5" />
                    )}
                    Salvar Dados
                  </Button>
                </div>
              </div>
            ) : isFinished && service.notes ? (
              <div className="rounded-2xl border border-border/40 shadow-sm bg-card p-5 sm:p-6 space-y-2">
                <p className="font-heading font-semibold text-foreground/90">Apontamentos da OS</p>
                <div className="p-3.5 rounded-xl bg-muted/30 border border-border/40">
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                    {service.notes}
                  </p>
                </div>
              </div>
            ) : null}

            {!isFinished && (
              <div className="rounded-2xl border border-border/40 shadow-sm bg-card p-5 sm:p-6 space-y-3">
                <p className="font-heading font-semibold text-foreground/90">Controle Operacional</p>
                <div className="space-y-2.5">
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
                    {finishing ? "Finalizando..." : "Concluir Manutenção"}
                  </Button>

                  <Button
                    variant="destructive"
                    className="w-full gap-2"
                    onClick={() => setCancelOpen(true)}
                    disabled={deleting}
                  >
                    <Trash2 className="size-4" />
                    Cancelar O.S.
                  </Button>
                </div>
              </div>
            )}
          </div>

        </div>
      </PageContainer>

      {cancelOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center animate-in fade-in duration-300">
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setCancelOpen(false)}
          />
          <div className="relative z-10 mx-4 w-full max-w-md rounded-2xl border border-border/40 bg-card p-8 shadow-2xl animate-in fade-in zoom-in-95 slide-in-from-bottom-4">
            <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive mb-5 ring-1 ring-destructive/20">
              <Trash2 className="size-6" />
            </div>
            <h3 className="font-heading text-xl font-bold">Cancelar Ordem de Serviço</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Você está prestes a excluir o registro desta O.S. permanentemente. Deseja prosseguir com o cancelamento imediato?
            </p>
            <div className="mt-8 flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setCancelOpen(false)}
                disabled={deleting}
              >
                Retornar
              </Button>
              <Button
                variant="destructive"
                className="flex-1 gap-2"
                onClick={handleConfirmCancel}
                disabled={deleting}
              >
                {deleting && <Loader2 className="size-4 animate-spin" />}
                Sim, Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
