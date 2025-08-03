
"use client";

import { BottomNav } from "./bottom-nav";
import type { ReactNode } from "react";
import { useAuth } from "@/contexts/auth-context";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { TopBar } from "./top-bar";

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
    <div className="flex flex-col min-h-screen">
      <TopBar />
      <main className={cn("flex-1 pt-16 pb-16")}>
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
