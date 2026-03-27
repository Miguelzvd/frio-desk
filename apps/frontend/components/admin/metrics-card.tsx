import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface MetricsCardProps {
  label: string
  value: number | string
  icon: LucideIcon
  description?: string
  accent?: boolean
}

export function MetricsCard({
  label,
  value,
  icon: Icon,
  description,
  accent = false,
}: MetricsCardProps) {
  return (
    <Card className={cn(accent && "border-primary/30 bg-primary/5")}>
      <CardContent className="pt-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
              {label}
            </p>
            <p className="mt-1 font-heading text-3xl font-bold tracking-tight">
              {value}
            </p>
            {description && (
              <p className="mt-1 text-xs text-muted-foreground">{description}</p>
            )}
          </div>
          <div
            className={cn(
              "flex size-9 items-center justify-center rounded-lg",
              accent
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            )}
          >
            <Icon className="size-4" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
