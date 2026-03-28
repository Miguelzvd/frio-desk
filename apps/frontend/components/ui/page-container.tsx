import * as React from "react"
import { cn } from "@/lib/utils"

export interface PageContainerProps extends React.HTMLAttributes<HTMLDivElement> {}

export function PageContainer({ className, children, ...props }: PageContainerProps) {
  return (
    <div
      className={cn(
        "relative flex flex-col gap-6 min-h-full max-w-6xl mx-auto py-8 px-4",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
