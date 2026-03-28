"use client";

import { useRef, useState } from "react";
import { Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ServiceCard } from "@/components/services/service-card";
import { useServices } from "@/hooks/use-services";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { CreateServiceModal } from "@/components/services/create-service-modal";
import { EmptyState } from "@/components/services/empty-state";
import { useAuthStore } from "@/store/auth.store";
import { PageHeader } from "@/components/ui/page-header";

import { PageContainer } from "@/components/ui/page-container";

export default function DashboardPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const user = useAuthStore((s) => s.user);

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isError,
  } = useServices();

  const services = data?.pages.flatMap((p) => p.data) ?? [];
  const total = data?.pages[0]?.total ?? 0;

  useIntersectionObserver(
    sentinelRef,
    fetchNextPage,
    hasNextPage && !isFetchingNextPage && !isError,
  );

  return (
    <PageContainer>
      <PageHeader 
        title="Área Operacional"
        description={`Olá, ${user?.name?.split(" ")[0] || "Técnico"}! Você tem ${total} serviço${total !== 1 ? "s" : ""} registrado${total !== 1 ? "s" : ""}.`}
      >
        <div className="hidden sm:flex items-center gap-2">
          <Button onClick={() => setIsModalOpen(true)} className="gap-2">
            <Plus className="size-4" />
            <span>Novo Serviço</span>
          </Button>
        </div>
      </PageHeader>

      <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 fill-mode-both delay-[150ms]">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-44 w-full rounded-xl" />
            ))}
          </div>
        ) : services.length === 0 ? (
          <EmptyState onAction={() => setIsModalOpen(true)} />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {services.map((service, idx) => (
                <div 
                  key={service.id} 
                  className="animate-in fade-in zoom-in-95 duration-500 fill-mode-both"
                  style={{ animationDelay: `${(idx % 8) * 50}ms` }}
                >
                  <ServiceCard service={service} />
                </div>
              ))}
            </div>

            <div ref={sentinelRef} className="h-1" />

            {isFetchingNextPage && (
              <div className="flex justify-center py-6">
                <Loader2 className="size-6 animate-spin text-muted-foreground" />
              </div>
            )}
          </>
        )}
      </div>

      {services.length > 0 && (
        <button
          onClick={() => setIsModalOpen(true)}
          className="sm:hidden fixed bottom-20 right-4 z-[100] flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 transition-transform active:scale-95 cursor-pointer"
          aria-label="Novo serviço"
        >
          <Plus className="size-6" />
        </button>
      )}

      <CreateServiceModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </PageContainer>
  );
}
