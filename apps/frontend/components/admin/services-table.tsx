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
import type { ServiceType, ServiceStatus } from "@friodesk/shared";
import { cn } from "@/lib/utils";

interface ServicesTableProps {
  services: AdminService[];
  typeFilter: ServiceType | "all";
  statusFilter: ServiceStatus | "all";
  onTypeChange: (val: ServiceType | "all") => void;
  onStatusChange: (val: ServiceStatus | "all") => void;
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

export function ServicesTable({ 
  services,
  typeFilter,
  statusFilter,
  onTypeChange,
  onStatusChange
}: ServicesTableProps) {
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Select
          value={typeFilter}
          onValueChange={(v) => onTypeChange(v as ServiceType | "all")}
        >
          <SelectTrigger className="w-40 capitalize">
            <SelectValue placeholder="Tipo">
              {typeFilter === "all" ? "Todos" : SERVICE_TYPE_LABELS[typeFilter as ServiceType]}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="capitalize">Todos</SelectItem>
            {SERVICE_TYPES.map((t) => (
              <SelectItem key={t} value={t} className="capitalize">
                {SERVICE_TYPE_LABELS[t]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={statusFilter}
          onValueChange={(v) => onStatusChange(v as ServiceStatus | "all")}
        >
          <SelectTrigger className="w-40 capitalize">
            <SelectValue placeholder="Status">
              {statusFilter === "all" ? "Todos" : SERVICE_STATUS_LABELS[statusFilter as ServiceStatus]}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="capitalize">Todos</SelectItem>
            {SERVICE_STATUSES.map((s) => (
              <SelectItem key={s} value={s} className="capitalize">
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
            {services.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-muted-foreground py-8"
                >
                  Nenhum serviço encontrado
                </TableCell>
              </TableRow>
            ) : (
              services.map((service) => (
                <TableRow key={service.id}>
                  <TableCell className="font-medium text-sm capitalize">
                    {service.user?.name ?? "—"}
                  </TableCell>
                  <TableCell className="text-sm capitalize">
                    {SERVICE_TYPE_LABELS[service.type]}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={cn(
                        "text-[10px] capitalize",
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
      </div>
    </div>
  );
}