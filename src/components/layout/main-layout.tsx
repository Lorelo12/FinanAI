
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
  const { user, loading } = useAuth();
  const pathname = usePathname();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  const isAuthRoute = AUTH_ROUTES.includes(pathname);

  // If we are on an auth route, just render the children in a centered layout.
  // This is for the login page.
  if (isAuthRoute) {
    return <div className="min-h-screen flex items-center justify-center bg-background p-4">{children}</div>;
  }
  
  // If there is no user and we are not on an auth route, we shouldn't render anything.
  // The AuthProvider will handle the redirect.
  if (!user) {
      return null;
  }

  // If we have a user and are not on an auth route, render the full app layout.
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
