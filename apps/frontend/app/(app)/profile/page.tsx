"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/store/auth.store";
import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { PageContainer } from "@/components/ui/page-container";

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  if (!user) {
    return (
      <PageContainer>
        <div className="flex items-center gap-3">
          <Skeleton className="size-9 rounded-md" />
          <Skeleton className="h-8 w-40 rounded-lg" />
        </div>
        <div className="max-w-2xl w-full mt-4">
          <Card className="border-border/40 shadow-sm">
            <CardContent className="pt-6 pb-6">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <Skeleton className="size-20 rounded-full shrink-0" />
                <div className="space-y-2 w-full">
                  <Skeleton className="h-6 w-44 rounded-md" />
                  <Skeleton className="h-4 w-56 rounded-md" />
                  <Skeleton className="h-6 w-28 rounded-full mt-1" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Skeleton className="mt-6 h-10 w-full rounded-md" />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title={
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="size-9"
              nativeButton={false}
              render={<Link href="/dashboard" />}
            >
              <ArrowLeft className="size-4" />
            </Button>
            <span>Minha Conta</span>
          </div>
        }
        description="Gerencie seus dados e acesse as configurações."
      />

      <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 fill-mode-both delay-[150ms] max-w-2xl w-full">
        <Card className="border-border/40 shadow-sm transition-all hover:shadow-md">
          <CardContent className="pt-6 pb-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="flex size-20 shrink-0 items-center justify-center rounded-full bg-primary/10 ring-1 ring-primary/20 shadow-inner">
                <User className="size-10 text-primary" />
              </div>
              <div className="min-w-0 text-center sm:text-left flex-1">
                <p className="font-heading text-xl font-bold truncate text-foreground">
                  {user?.name}
                </p>
                <p className="mt-0.5 text-sm font-medium text-muted-foreground truncate">
                  {user?.email}
                </p>
                <div className="mt-3">
                  <span className="inline-flex items-center rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-primary">
                    Técnico Operacional
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 flex flex-col gap-3">
          <Button
            variant="destructive"
            className="w-full gap-2"
            onClick={handleLogout}
          >
            <LogOut className="size-4" />
            Encerrar Sessão
          </Button>
        </div>
      </div>
    </PageContainer>
  );
}
