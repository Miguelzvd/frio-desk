import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useServices } from "@/hooks/use-services";
import { useAuthStore } from "@/store/auth.store";
import { PageHeader } from "@/components/ui/page-header";

interface DashboardHeaderProps {
  onAddService: () => void;
}

export function DashboardHeader({ onAddService }: DashboardHeaderProps) {
  const user = useAuthStore((s) => s.user);
  const { data, isLoading } = useServices();
  const total = data?.pages[0]?.total ?? 0;
  const firstName = user?.name?.split(" ")[0] || "Técnico";

  if (isLoading || !user) {
    return (
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="space-y-2">
          <Skeleton className="h-9 w-52 rounded-lg" />
          <Skeleton className="h-4 w-72 rounded-md" />
        </div>
        <div className="hidden sm:block">
          <Skeleton className="h-10 w-36 rounded-md" />
        </div>
      </div>
    );
  }

  return (
    <PageHeader title="Área Operacional" description={`Olá, ${firstName}! Você tem ${total} serviço${total !== 1 ? "s" : ""} registrado${total !== 1 ? "s" : ""}.`}>
      {total > 0 && (
        <div className="hidden sm:flex items-center gap-2">
          <Button onClick={onAddService} className="gap-2">
            <Plus className="size-4" />
            <span>Novo Serviço</span>
          </Button>
        </div>
      )}
    </PageHeader>
  );
}
