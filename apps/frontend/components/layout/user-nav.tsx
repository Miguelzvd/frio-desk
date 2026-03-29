"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { LogOut, User } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function UserNav() {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  return (
    <>
      <div className="hidden sm:block relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen((prev) => !prev)}
          className="flex items-center gap-2 py-2 px-3 rounded-full text-xs font-medium transition-colors text-foreground hover:bg-muted"
        >
           <div className="flex size-6 items-center justify-center rounded-full bg-primary/10">
            <User className="size-4 text-primary" strokeWidth={2.5} />
          </div>
          <span className="max-w-[120px] truncate">{user?.name?.split(" ")[0]}</span>
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-56 rounded-xl border border-border bg-card p-1 shadow-md animate-in fade-in zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=closed]:zoom-out-95">
            <div className="px-3 py-2 border-b border-border/40 pb-3 mb-1">
              <p className="font-heading font-bold text-sm truncate">{user?.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              <p className="mt-1.5 inline-block rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-primary">
                Técnico
              </p>
            </div>
            
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 h-9 text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={handleLogout}
            >
              <LogOut className="size-4" />
              Sair da conta
            </Button>
          </div>
        )}
      </div>
      
      <Link
        href="/profile"
        className="sm:hidden flex flex-row justify-center items-center gap-1 py-2 text-xs font-medium transition-colors text-foreground hover:text-primary"
      >
        <User className="size-5" strokeWidth={2.5} />
      </Link>
    </>
  );
}
