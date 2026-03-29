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

  const description = isLoading ? (
    <Skeleton className="h-5 w-[280px] mt-1 bg-muted-foreground/10" />
  ) : (
    `Olá, ${firstName}! Você tem ${total} serviço${total !== 1 ? "s" : ""} registrado${total !== 1 ? "s" : ""}.`
  );

  return (
      <PageHeader title="Área Operacional" description={description}>
        {isLoading ? (
          <div className="hidden sm:flex items-center gap-2">
            <Skeleton className="h-10 w-[140px] rounded-md bg-muted-foreground/10" />
          </div>
        ) : total > 0 ? (
          <div className="hidden sm:flex items-center gap-2">
            <Button onClick={onAddService} className="gap-2">
              <Plus className="size-4" />
              <span>Novo Serviço</span>
            </Button>
          </div>
        ) : null}
      </PageHeader>
  );
}
