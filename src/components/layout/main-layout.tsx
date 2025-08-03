
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
  
  const isAuthRoute = AUTH_ROUTES.includes(pathname);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  // If on an auth route, show the centered login/signup form
  if (isAuthRoute) {
    return <div className="min-h-screen flex items-center justify-center bg-background p-4">{children}</div>;
  }
  
  // If not logged in and not a guest, don't render children (auth context will redirect)
  if (!user && !isGuest) {
      return null;
  }

  // If we have a user or are a guest, render the full app layout
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
