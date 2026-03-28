"use client";

import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
} from "recharts";
import { ClipboardList, Clock, CheckCircle2, Users, CalendarDays } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { MetricsCard } from "@/components/admin/metrics-card";
import { useAdminMetrics } from "@/hooks/use-admin";
import { SERVICE_TYPE_LABELS } from "@/lib/constants";
import type { ServiceType } from "@friodesk/shared";
import { useAuthStore } from "@/store/auth.store";
import { PageHeader } from "@/components/ui/page-header";

const CHART_COLORS = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
];

const SERVICE_TYPES: ServiceType[] = [
  "preventiva",
  "corretiva",
  "instalação",
  "inspeção",
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-border bg-background/95 p-3 text-sm shadow-xl backdrop-blur-sm">
        {label && <p className="mb-2 font-medium text-foreground">{label}</p>}
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="size-2.5 rounded-full"
              style={{ backgroundColor: entry.color || entry.payload?.fill }}
            />
            <span className="font-medium text-muted-foreground">
              {entry.name}: <span className="text-foreground">{entry.value}</span>
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function AdminDashboardPage() {
  const { metrics, loading } = useAdminMetrics();
  const user = useAuthStore((s) => s.user);

  if (loading) {
    return (
      <div className="space-y-8 p-1">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48 rounded-lg" />
            <Skeleton className="h-4 w-32 rounded-lg" />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-7">
          <Skeleton className="h-[350px] lg:col-span-4 rounded-2xl" />
          <Skeleton className="h-[350px] lg:col-span-3 rounded-2xl" />
        </div>
      </div>
    );
  }

  const byTypeData = SERVICE_TYPES.map((type) => ({
    name: SERVICE_TYPE_LABELS[type],
    total: metrics?.byType?.[type] ?? 0,
  }));

  const byStatusData = [
    { name: "Em andamento", value: metrics?.openServices ?? 0 },
    { name: "Concluídos", value: metrics?.finishedServices ?? 0 },
  ];

  return (
    <div className="space-y-8 p-1">
      <PageHeader
        title="Visão Geral"
        description={`Bem-vindo de volta, ${user?.name?.split(" ")[0] || "Admin"}. Aqui está o resumo atual das operações do FrioDesk.`}
      >
        <Button variant="outline" size="sm" className="h-9 gap-2 text-muted-foreground">
          <CalendarDays className="size-4" />
          <span>Últimos 30 dias</span>
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricsCard
          label="Total de Serviços"
          value={metrics?.totalServices ?? 0}
          icon={ClipboardList}
          accent
          className="animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both delay-[100ms]"
        />
        <MetricsCard
          label="Em andamento"
          value={metrics?.openServices ?? 0}
          icon={Clock}
          className="animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both delay-[200ms]"
        />
        <MetricsCard
          label="Concluídos"
          value={metrics?.finishedServices ?? 0}
          icon={CheckCircle2}
          className="animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both delay-[300ms]"
        />
        <MetricsCard
          label="Técnicos Ativos"
          value={metrics?.totalTechnicians ?? 0}
          icon={Users}
          className="animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both delay-[400ms]"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-7 animate-in fade-in slide-in-from-bottom-6 duration-700 fill-mode-both delay-[500ms]">
        
        <Card className="lg:col-span-4 border-border/40 shadow-sm overflow-hidden flex flex-col">
          <CardHeader className="border-b border-border/10 bg-muted/20 pb-4">
            <CardTitle className="text-base font-semibold">Serviços Segmentados por Tipo</CardTitle>
            <CardDescription>Distribuição de trabalhos operacionais agrupados</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 p-6 pt-8">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={byTypeData} barSize={42}>
                <defs>
                  <linearGradient id="primaryGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={1} />
                    <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0.6} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" opacity={0.4} />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
                  axisLine={false}
                  tickLine={false}
                  dy={10}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
                  axisLine={false}
                  tickLine={false}
                  dx={-10}
                />
                <Tooltip cursor={{ fill: "var(--color-muted)", opacity: 0.2 }} content={<CustomTooltip />} />
                <Bar
                  dataKey="total"
                  fill="url(#primaryGradient)"
                  radius={[6, 6, 0, 0]}
                  animationDuration={1500}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 border-border/40 shadow-sm flex flex-col">
          <CardHeader className="border-b border-border/10 bg-muted/20 pb-4">
            <CardTitle className="text-base font-semibold">Situação das Ordens</CardTitle>
            <CardDescription>Status geral das ordens de trabalho vigentes</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 p-6 flex flex-col items-center justify-center">
            <div className="w-full h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip content={<CustomTooltip />} />
                  <Pie
                    data={byStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={4}
                    dataKey="value"
                    stroke="none"
                    animationDuration={1500}
                    labelLine={false}
                    label={false}
                  >
                    {byStatusData.map((_, index) => (
                      <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend 
                    verticalAlign="bottom" 
                    height={36} 
                    iconType="circle" 
                    iconSize={10}
                    formatter={(value) => <span className="text-sm font-medium ml-1 text-foreground">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
      </div>
    </div>
  );
}
