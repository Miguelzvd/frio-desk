import { Header } from "@/components/layout/header";
import { BottomNav } from "@/components/layout/bottom-nav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col">
      <Header />
      <main className="flex-1 pb-20">{children}</main>
      <div className="sm:hidden">
        <BottomNav />
      </div>
    </div>
  );
}
