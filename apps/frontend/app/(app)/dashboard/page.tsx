"use client";

import { useState } from "react";
import { CreateServiceModal } from "@/components/services/create-service-modal";
import { ServicesList } from "@/components/services/services-list";
import { DashboardHeader } from "@/components/services/dashboard-header";
import { PageContainer } from "@/components/ui/page-container";
import { Plus } from "lucide-react";
import { useServices } from "@/hooks/use-services";

export default function DashboardPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { data } = useServices();
  const total = data?.pages[0]?.total ?? 0;


  return (
    <PageContainer>
      <DashboardHeader onAddService={() => setIsModalOpen(true)} />

      <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 fill-mode-both delay-[150ms]">
        <ServicesList onAddService={() => setIsModalOpen(true)} />
      </div>

      {total > 0 && (
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
