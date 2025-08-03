
"use client";

import { BottomNav } from "./bottom-nav";
import type { ReactNode } from "react";
import { useAuth } from "@/contexts/auth-context";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { TopBar } from "./top-bar";
import { Loader2 } from "lucide-react";

const AUTH_ROUTES = ['/login', '/signup'];

export function MainLayout({ children }: { children: ReactNode }) {
  const { user, loading, isGuest } = useAuth();
  const pathname = usePathname();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  if (isGuest && !AUTH_ROUTES.includes(pathname)) {
      return null;
  }

  if (user && AUTH_ROUTES.includes(pathname)) {
      return null;
  }

  if (AUTH_ROUTES.includes(pathname)) {
    return <div className="min-h-screen flex items-center justify-center bg-background p-4">{children}</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar />
      <main className={cn("flex-1 pt-16 pb-16")}>
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
