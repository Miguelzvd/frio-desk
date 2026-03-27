"use client"

import { useState } from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ChecklistItem } from "@field-report/shared"

interface ChecklistProps {
  items: ChecklistItem[]
  serviceId: string
  readOnly?: boolean
  onToggle?: (itemId: string, checked: boolean) => Promise<void>
}

export function Checklist({
  items,
  readOnly = false,
  onToggle,
}: ChecklistProps) {
  const [localItems, setLocalItems] = useState<ChecklistItem[]>(items)

  const handleToggle = async (item: ChecklistItem) => {
    if (readOnly || !onToggle) return

    const newChecked = !item.checked
    setLocalItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, checked: newChecked } : i))
    )
    await onToggle(item.id, newChecked)
  }

  const done = localItems.filter((i) => i.checked).length
  const total = localItems.length

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Checklist
        </span>
        <span className="font-mono text-xs text-muted-foreground">
          {done}/{total}
        </span>
      </div>

      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all duration-300"
          style={{ width: total > 0 ? `${(done / total) * 100}%` : "0%" }}
        />
      </div>

      <ul className="space-y-2">
        {localItems.map((item) => (
          <li
            key={item.id}
            className={cn(
              "flex items-center gap-3 rounded-lg border border-border p-3 transition-colors",
              !readOnly && "cursor-pointer hover:bg-muted/50",
              item.checked && "bg-primary/5 border-primary/20"
            )}
            onClick={() => handleToggle(item)}
          >
            <div
              className={cn(
                "flex size-5 shrink-0 items-center justify-center rounded border-2 transition-all",
                item.checked
                  ? "border-primary bg-primary"
                  : "border-muted-foreground/40"
              )}
            >
              {item.checked && <Check className="size-3 text-primary-foreground" strokeWidth={3} />}
            </div>
            <span
              className={cn(
                "text-sm leading-snug transition-colors",
                item.checked && "text-muted-foreground line-through"
              )}
            >
              {item.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
