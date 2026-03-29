"use client";

import { useState } from "react";
import { CalendarDays, ChevronDown } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { AvailablePeriod } from "@/hooks/use-available-periods";

const MONTH_LABELS: Record<number, string> = {
  1: "Janeiro", 2: "Fevereiro", 3: "Março", 4: "Abril",
  5: "Maio", 6: "Junho", 7: "Julho", 8: "Agosto",
  9: "Setembro", 10: "Outubro", 11: "Novembro", 12: "Dezembro",
};

interface MetricsPeriodFilterProps {
  periods: AvailablePeriod[];
  year: number;
  month: number;
  onSelect: (year: number, month: number) => void;
}

export function MetricsPeriodFilter({ periods, year, month, onSelect }: MetricsPeriodFilterProps) {
  const [open, setOpen] = useState(false);

  const availableYears = [...new Set(periods.map((p) => p.year))].sort((a, b) => b - a);
  const availableMonths = periods
    .filter((p) => p.year === year)
    .map((p) => p.month)
    .sort((a, b) => a - b);

  const onlyOneYear = availableYears.length <= 1;
  const onlyOneMonth = availableMonths.length <= 1;

  const label = `${MONTH_LABELS[month]} ${year}`;

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        className={cn(
          buttonVariants({ variant: "outline", size: "sm" }),
          "h-9 gap-2 text-muted-foreground",
        )}
      >
        <CalendarDays className="size-4" />
        <span>{label}</span>
        <ChevronDown className="size-3.5 opacity-50" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-60 p-3 space-y-4">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-1">
          Filtrar por período
        </p>

        <div className="space-y-3">
          <div className="space-y-1.5">
            <p className="text-xs text-muted-foreground px-1">Ano</p>
            {onlyOneYear ? (
              <p
                className="text-xs text-muted-foreground/60 italic px-1"
                title="Não há outros anos com registros além do atual"
              >
                Nenhum outro ano disponível
              </p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {availableYears.map((y) => (
                  <button
                    key={y}
                    type="button"
                    onClick={() => {
                      const monthsForYear = periods
                        .filter((p) => p.year === y)
                        .map((p) => p.month);
                      const newMonth = monthsForYear.includes(month)
                        ? month
                        : (monthsForYear[0] ?? month);
                      onSelect(y, newMonth);
                    }}
                    className={cn(
                      "rounded-md px-3 py-1 text-sm font-medium transition-colors",
                      y === year
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    {y}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <p className="text-xs text-muted-foreground px-1">Mês</p>
            {onlyOneMonth ? (
              <p
                className="text-xs text-muted-foreground/60 italic px-1"
                title="Não há outros meses com registros para o ano selecionado"
              >
                Nenhum outro mês disponível em {year}
              </p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {availableMonths.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => onSelect(year, m)}
                    className={cn(
                      "rounded-md px-2.5 py-1 text-sm font-medium transition-colors",
                      m === month
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    {MONTH_LABELS[m]}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
