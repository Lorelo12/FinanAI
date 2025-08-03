"use client";

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { SidebarNav } from "./sidebar-nav";
import { BottomNav } from "./bottom-nav";
import { useIsMobile } from "@/hooks/use-mobile";
import type { ReactNode } from "react";
import { useAuth } from "@/contexts/auth-context";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

const AUTH_ROUTES = ['/login', '/signup'];

export function MainLayout({ children }: { children: ReactNode }) {
  const isMobile = useIsMobile();
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
      {!isMobile && <SidebarNav />}
      <SidebarInset>
        <div className={cn("min-h-screen", isMobile ? "pb-16" : "")}>
          {children}
        </div>
      </SidebarInset>
      {isMobile && <BottomNav />}
    </SidebarProvider>
  );
}
