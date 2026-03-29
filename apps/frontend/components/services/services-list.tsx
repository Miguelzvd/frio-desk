import { useRef } from "react";
import { Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ServiceCard } from "@/components/services/service-card";
import { EmptyState } from "@/components/services/empty-state";
import { useServices } from "@/hooks/use-services";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";

interface ServicesListProps {
  onAddService: () => void;
}

export function ServicesList({ onAddService }: ServicesListProps) {
  const sentinelRef = useRef<HTMLDivElement>(null);

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isError,
  } = useServices();

  const services = data?.pages.flatMap((p) => p.data) ?? [];

  useIntersectionObserver(
    sentinelRef,
    fetchNextPage,
    hasNextPage && !isFetchingNextPage && !isError
  );

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-44 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (services.length === 0) {
    return <EmptyState onAction={onAddService} />;
  }

  return (
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
  );
}
