import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  ChevronRight,
  Clock,
  CheckCircle2,
  Calendar,
  Wrench,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { SERVICE_TYPE_LABELS, SERVICE_STATUS_LABELS } from "@/lib/constants";
import type { ApiService } from "@/hooks/use-services";
import { cn } from "@/lib/utils";

interface ServiceCardProps {
  service: ApiService;
  href?: string;
}

export function ServiceCard({ service, href }: ServiceCardProps) {
  const isFinished = service.status === "finished";
  const linkHref = href ?? `/services/${service.id}`;

  return (
    <Link href={linkHref} className="block group">
      <Card className="flex flex-col p-5 transition-all duration-200 hover:border-primary/40 hover:shadow-md active:scale-[0.99] gap-4">
        {/* CABEÇALHO: Ícone e Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex size-10 shrink-0 items-center justify-center rounded-full",
                isFinished
                  ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                  : "bg-amber-500/15 text-amber-600 dark:text-amber-400",
              )}
            >
              {isFinished ? (
                <CheckCircle2 className="size-5" />
              ) : (
                <Clock className="size-5" />
              )}
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Serviço{" "}
                <span className="font-mono">#{service.id.slice(0, 6)}</span>
              </p>
            </div>
          </div>

          <Badge
            variant={isFinished ? "default" : "secondary"}
            className={cn(
              "text-[10px] font-semibold uppercase tracking-wider pointer-events-none",
              isFinished
                ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 dark:bg-emerald-500/20"
                : "bg-amber-500/15 text-amber-700 dark:text-amber-400 dark:bg-amber-500/20",
            )}
          >
            {SERVICE_STATUS_LABELS[service.status]}
          </Badge>
        </div>

        {/* CORPO: Título Principal (Tipo) */}
        <div>
          <h3 className="flex items-center gap-2 font-heading text-xl font-bold leading-snug group-hover:text-primary transition-colors">
            <Wrench className="size-4 text-muted-foreground" />
            {SERVICE_TYPE_LABELS[service.type]}
          </h3>
        </div>

        {/* RODAPÉ: Data e Ação */}
        <div className="flex items-center justify-between pt-3 mt-1 border-t border-border/50 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Calendar className="size-4" />
            <span>
              {format(new Date(service.createdAt), "dd 'de' MMM, yyyy", {
                locale: ptBR,
              })}
            </span>
          </div>

          <div className="flex items-center gap-1 font-medium group-hover:text-primary transition-colors">
            Abrir
            <ChevronRight className="size-4 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </Card>
    </Link>
  );
}
