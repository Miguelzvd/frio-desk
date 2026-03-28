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
    <Link href={linkHref} className="block group h-full">
      <Card className="relative h-full flex flex-col p-5 transition-all duration-300 border-border/40 hover:border-primary/30 hover:shadow-lg hover:-translate-y-1 bg-card group-hover:bg-gradient-to-br from-card to-primary/5 gap-4 overflow-hidden">
        
        {/* Decorative corner glow */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 size-24 rounded-full bg-primary/0 blur-2xl transition-colors duration-500 group-hover:bg-primary/10 pointer-events-none" />

        {/* CABEÇALHO: Ícone e Status */}
        <div className="flex items-start justify-between relative z-10">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex size-10 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110",
                isFinished
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-500/20"
                  : "bg-amber-500/10 text-amber-600 dark:text-amber-400 group-hover:bg-amber-500/20",
              )}
            >
              {isFinished ? (
                <CheckCircle2 className="size-5" />
              ) : (
                <Clock className="size-5" />
              )}
            </div>
            <div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                ID da Ordem
              </p>
              <p className="font-mono text-sm font-semibold text-foreground/80">
                #{service.id.slice(0, 6)}
              </p>
            </div>
          </div>

          <Badge
            className={cn(
              "text-[10px] font-bold uppercase tracking-wider pointer-events-none border shadow-none transition-colors",
              isFinished
                ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 dark:bg-emerald-500/5 group-hover:border-emerald-500/30"
                : "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400 dark:bg-amber-500/5 group-hover:border-amber-500/30",
            )}
          >
            {SERVICE_STATUS_LABELS[service.status]}
          </Badge>
        </div>

        <div className="flex-1 mt-2 relative z-10">
          <h3 className="flex items-center gap-2 font-heading text-xl font-bold leading-snug text-foreground group-hover:text-primary transition-colors">
            {SERVICE_TYPE_LABELS[service.type]}
          </h3>
          <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2">
            Ver e atualizar os check-lists ou preencher o apontamento desta ordem de trabalho.
          </p>
        </div>

        <div className="flex items-center justify-between pt-4 mt-1 border-t border-border/40 text-sm text-muted-foreground relative z-10">
          <div className="flex items-center gap-1.5">
            <Calendar className="size-3.5 opacity-70" />
            <span className="text-xs font-medium">
              {format(new Date(service.createdAt), "dd MMM, yyyy", {
                locale: ptBR,
              })}
            </span>
          </div>

          <div className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider group-hover:text-primary transition-colors">
            Acessar
            <ChevronRight className="size-4 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </Card>
    </Link>
  );
}
