"use client";

import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { SERVICE_TYPE_LABELS, SERVICE_STATUS_LABELS } from "@/lib/constants";
import type { AdminService } from "@/hooks/use-admin";
import { cn } from "@/lib/utils";

interface ServicesTableProps {
  services: AdminService[];
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("pt-BR").format(new Date(iso));
}

export function ServicesTable({ services }: ServicesTableProps) {
  return (
    <Table>
      <TableHeader className="bg-transparent">
        <TableRow className="hover:bg-transparent border-b border-border/30">
          <TableHead className="w-1/4 pl-6 text-xs font-semibold tracking-wide text-muted-foreground">TÉCNICO</TableHead>
          <TableHead className="w-1/4 text-xs font-semibold tracking-wide text-muted-foreground">TIPO DE SERVIÇO</TableHead>
          <TableHead className="w-1/4 text-xs font-semibold tracking-wide text-muted-foreground">STATUS</TableHead>
          <TableHead className="text-xs font-semibold tracking-wide text-muted-foreground">DATA</TableHead>
          <TableHead className="pr-6 w-16" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {services.length === 0 ? (
          <TableRow className="hover:bg-transparent">
            <TableCell
              colSpan={5}
              className="text-center text-muted-foreground py-10"
            >
              Nenhum serviço correspondente encontrado
            </TableCell>
          </TableRow>
        ) : (
          services.map((service) => (
            <TableRow 
              key={service.id} 
              className="group border-b border-border/20 transition-colors hover:bg-muted/30"
            >
              <TableCell className="pl-6 font-medium text-sm text-foreground capitalize">
                {service.user?.name ?? "—"}
              </TableCell>
              <TableCell className="text-sm font-medium text-muted-foreground capitalize">
                {SERVICE_TYPE_LABELS[service.type]}
              </TableCell>
              <TableCell>
                <Badge
                  className={cn(
                    "text-[10px] uppercase font-bold tracking-wider shadow-none border hover:bg-transparent transition-all",
                    service.status === "finished"
                      ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 dark:bg-emerald-500/5 dark:border-emerald-500/15"
                      : "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400 dark:bg-amber-500/5 dark:border-amber-500/15",
                  )}
                >
                  {SERVICE_STATUS_LABELS[service.status]}
                </Badge>
              </TableCell>
              <TableCell className="text-xs text-muted-foreground font-mono">
                {formatDate(service.createdAt)}
              </TableCell>
              <TableCell className="pr-6 text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 text-muted-foreground opacity-20 transition-opacity group-hover:opacity-100 hover:text-foreground hover:bg-background/80"
                  nativeButton={false}
                  render={<Link href={`/admin/services/${service.id}`} />}
                >
                  <ExternalLink className="size-3.5" />
                </Button>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}