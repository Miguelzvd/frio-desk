import Link from "next/link"
import { ChevronRight, Clock, CheckCircle2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { SERVICE_TYPE_LABELS, SERVICE_STATUS_LABELS } from "@/lib/constants"
import type { ApiService } from "@/hooks/use-services"
import { cn } from "@/lib/utils"

interface ServiceCardProps {
  service: ApiService
  href?: string
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(iso))
}

export function ServiceCard({ service, href }: ServiceCardProps) {
  const isFinished = service.status === "finished"
  const linkHref = href ?? `/services/${service.id}`

  return (
    <Link href={linkHref}>
      <Card className="flex items-center justify-between p-4 transition-colors hover:bg-muted/50 active:bg-muted">
        <div className="flex items-start gap-3">
          <div
            className={cn(
              "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full",
              isFinished
                ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                : "bg-amber-500/15 text-amber-600 dark:text-amber-400"
            )}
          >
            {isFinished ? (
              <CheckCircle2 className="size-4" />
            ) : (
              <Clock className="size-4" />
            )}
          </div>

          <div className="min-w-0">
            <p className="font-heading text-sm font-semibold leading-snug">
              {SERVICE_TYPE_LABELS[service.type]}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {formatDate(service.createdAt)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge
            variant={isFinished ? "default" : "secondary"}
            className={cn(
              "text-[10px] font-medium",
              isFinished &&
                "bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/20 dark:text-emerald-400",
              !isFinished &&
                "bg-amber-500/15 text-amber-700 hover:bg-amber-500/20 dark:text-amber-400"
            )}
          >
            {SERVICE_STATUS_LABELS[service.status]}
          </Badge>
          <ChevronRight className="size-4 text-muted-foreground" />
        </div>
      </Card>
    </Link>
  )
}
