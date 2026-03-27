import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SERVICE_TYPE_LABELS, SERVICE_STATUS_LABELS } from "@/lib/constants"
import type { FullReport } from "@/hooks/use-report"
import { cn } from "@/lib/utils"

interface ReportViewProps {
  data: FullReport
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(iso))
}

export function ReportView({ data }: ReportViewProps) {
  const { report, service, checklist, photos } = data
  const isFinished = service.status === "finished"

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="font-heading text-lg">
                {SERVICE_TYPE_LABELS[service.type]}
              </CardTitle>
              <p className="mt-1 text-xs text-muted-foreground font-mono">
                #{service.id.slice(0, 8).toUpperCase()}
              </p>
            </div>
            <Badge
              className={cn(
                "text-[10px]",
                isFinished
                  ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
                  : "bg-amber-500/15 text-amber-700 dark:text-amber-400"
              )}
            >
              {SERVICE_STATUS_LABELS[service.status]}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-xs text-muted-foreground">Responsável</p>
            <p className="font-medium">{report.responsibleName}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Data</p>
            <p className="font-medium">{formatDate(report.createdAt as unknown as string)}</p>
          </div>
        </CardContent>
      </Card>

      {/* Checklist */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Checklist</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {checklist.map((item) => (
            <div key={item.id} className="flex items-center gap-2 text-sm">
              <div
                className={cn(
                  "size-4 shrink-0 rounded border-2",
                  item.checked
                    ? "border-primary bg-primary"
                    : "border-muted-foreground/30"
                )}
              />
              <span className={cn(item.checked && "line-through text-muted-foreground")}>
                {item.label}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Photos */}
      {photos.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">
              Fotos ({photos.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {photos.map((photo) => (
                <div
                  key={photo.id}
                  className="relative aspect-square overflow-hidden rounded-lg border border-border"
                >
                  <Image
                    src={photo.url}
                    alt="Foto do serviço"
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 50vw, 33vw"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notes */}
      {report.notes && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Observações</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {report.notes}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
