"use client";

import { BottomNav } from "./bottom-nav";
import type { ReactNode } from "react";
import { useAuth } from "@/contexts/auth-context";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { TopBar } from "./top-bar";

const AUTH_ROUTES = ['/login', '/signup'];

export function MainLayout({ children }: { children: ReactNode }) {
  const { user, loading: authLoading, isGuest } = useAuth();
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  const isAuthRoute = AUTH_ROUTES.includes(pathname);

  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  if (isAuthRoute) {
    return <div className="min-h-screen flex items-center justify-center bg-background p-4">{children}</div>;
  }
  
  if (!user && !isGuest) {
      return (
        <div className="flex h-screen items-center justify-center">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
        </div>
      );
  }

  return (
    <div className="flex flex-col min-h-screen">
       <TopBar />
      <main className={cn("flex-1 pb-16 md:pb-0")}>
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
