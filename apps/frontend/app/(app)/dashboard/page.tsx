"use client";

import { useRef } from "react";
import Link from "next/link";
import { Loader2, Plus, Wind } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ServiceCard } from "@/components/services/service-card";
import { useServices } from "@/hooks/use-services";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";

export default function DashboardPage() {
  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useServices();

  const services = data?.pages.flatMap((p) => p.data) ?? [];
  const total = data?.pages[0]?.total ?? 0;

  const sentinelRef = useRef<HTMLDivElement>(null);
  useIntersectionObserver(sentinelRef, fetchNextPage, hasNextPage && !isFetchingNextPage);

  return (
    <div className="relative flex flex-col gap-5 min-h-full max-w-6xl mx-auto py-8 px-4">
      <div className="space-y-1 px-4 py-5">
        <h2 className="font-heading text-xl font-bold">Meus Serviços</h2>
        <p className="text-sm text-muted-foreground">
          {total} serviço{total !== 1 ? "s" : ""} registrado
          {total !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
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

            <Button nativeButton={false} render={<Link href="/services/new" />}>
              <Plus className="size-4" />
              Novo serviço
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {services.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>

            {/* Sentinel para IntersectionObserver */}
            <div ref={sentinelRef} className="h-1" />

            {isFetchingNextPage && (
              <div className="flex justify-center py-4">
                <Loader2 className="size-5 animate-spin text-muted-foreground" />
              </div>
            )}

            {!hasNextPage && services.length > 0 && (
              <p className="text-center text-xs text-muted-foreground py-4">
                Todos os serviços carregados
              </p>
            )}
          </>
        )}

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
    </div>
  );
}
