"use client";

import Link from "next/link";
import { Plus, Wind } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ServiceCard } from "@/components/services/service-card";
import { useServices } from "@/hooks/use-services";

export default function DashboardPage() {
  const { services, loading } = useServices();

  return (
    <div className="relative min-h-full">
      <div className="space-y-1 px-4 py-5">
        <h2 className="font-heading text-xl font-bold">Meus Serviços</h2>
        <p className="text-sm text-muted-foreground">
          {services.length} serviço{services.length !== 1 ? "s" : ""} registrado
          {services.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="px-4 pb-6">
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-18 w-full rounded-xl" />
            ))}
          </div>
        ) : services.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-20 text-center">
            <div className="flex size-16 items-center justify-center rounded-full bg-muted">
              <Wind className="size-7 text-muted-foreground" />
            </div>
            <div>
              <p className="font-heading font-semibold">
                Nenhum serviço registrado ainda
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Toque no botão abaixo para criar seu primeiro serviço
              </p>
            </div>

            <Button render={<Link href="/services/new" />}>
              <Plus className="size-4" />
              Novo serviço
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        )}
      </div>

      {/* FAB */}
      {services.length > 0 && (
        <Link
          href="/services/new"
          className="fixed bottom-20 right-4 flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105 active:scale-95"
          aria-label="Novo serviço"
        >
          <Plus className="size-6" />
        </Link>
      )}
    </div>
  );
}
