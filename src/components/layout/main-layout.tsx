"use client";

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { BottomNav } from "./bottom-nav";
import type { ReactNode } from "react";
import { useAuth } from "@/contexts/auth-context";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

const AUTH_ROUTES = ['/login', '/signup'];

export function MainLayout({ children }: { children: ReactNode }) {
  const { user, loading, isGuest } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      const isAuthRoute = AUTH_ROUTES.includes(pathname);
      if (user && !isGuest && isAuthRoute) {
        router.push('/');
      }
    }
  }, [user, loading, isGuest, pathname, router]);


  if (AUTH_ROUTES.includes(pathname)) {
    return <div className="min-h-screen flex items-center justify-center bg-background">{children}</div>;
  }

  return (
    <SidebarProvider>
      <SidebarInset>
        <div className={cn("min-h-screen", "pb-16")}>
          {children}
        </div>
      </SidebarInset>
      <BottomNav />
    </SidebarProvider>
  );
}
