"use client";

import Link from "next/link";
import { Icon, User, Wind } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuthStore } from "@/store/auth.store";

export function Header() {
  const { user } = useAuthStore();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="flex h-14 items-center justify-between px-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-md bg-primary">
            <Wind className="size-4 text-primary-foreground" />
          </div>
          <span className="font-heading font-bold text-sm tracking-wide">
            FieldReport
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <ThemeToggle />

          <span className="hidden sm:block text-xs text-muted-foreground ">
            <Link
              href={"/profile"}
              className={
                "flex flex-1 flex-row justify-center items-center gap-1 py-2 text-xs font-medium transition-colors text-foreground hover:text-primary"
              }
            >
              <User className={"size-5 hove:text-primary"} strokeWidth={2.5} />
              {user?.name}
            </Link>
          </span>
        </div>
      </div>
    </header>
  );
}
