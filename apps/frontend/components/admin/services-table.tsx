"use client";

import { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ExternalLink } from "lucide-react";
import { SERVICE_TYPE_LABELS, SERVICE_STATUS_LABELS } from "@/lib/constants";
import type { AdminService } from "@/hooks/use-admin";
import type { ServiceType, ServiceStatus } from "@field-report/shared";
import { cn } from "@/lib/utils";

interface ServicesTableProps {
  services: AdminService[];
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("pt-BR").format(new Date(iso));
}

const SERVICE_TYPES: ServiceType[] = [
  "preventiva",
  "corretiva",
  "instalação",
  "inspeção",
];
const SERVICE_STATUSES: ServiceStatus[] = ["open", "finished"];

export function ServicesTable({ services }: ServicesTableProps) {
  const [typeFilter, setTypeFilter] = useState<ServiceType | "all">("all");
  const [statusFilter, setStatusFilter] = useState<ServiceStatus | "all">(
    "all",
  );

  const filtered = services.filter((s) => {
    if (typeFilter !== "all" && s.type !== typeFilter) return false;
    if (statusFilter !== "all" && s.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Select
          value={typeFilter}
          onValueChange={(v) => setTypeFilter(v as ServiceType | "all")}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os tipos</SelectItem>
            {SERVICE_TYPES.map((t) => (
              <SelectItem key={t} value={t}>
                {SERVICE_TYPE_LABELS[t]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={statusFilter}
          onValueChange={(v) => setStatusFilter(v as ServiceStatus | "all")}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            {SERVICE_STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {SERVICE_STATUS_LABELS[s]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Técnico</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data</TableHead>
              <TableHead className="w-16" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-muted-foreground py-8"
                >
                  Nenhum serviço encontrado
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((service) => (
                <TableRow key={service.id}>
                  <TableCell className="font-medium text-sm">
                    {service.user?.name ?? "—"}
                  </TableCell>
                  <TableCell className="text-sm">
                    {SERVICE_TYPE_LABELS[service.type]}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={cn(
                        "text-[10px]",
                        service.status === "finished"
                          ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
                          : "bg-amber-500/15 text-amber-700 dark:text-amber-400",
                      )}
                    >
                      {SERVICE_STATUS_LABELS[service.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground font-mono">
                    {formatDate(service.createdAt)}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8"
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
      </div>
    </div>
  );
}
