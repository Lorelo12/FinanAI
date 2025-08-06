
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

  const isAuthRoute = AUTH_ROUTES.includes(pathname);

  // Render nothing on the server to avoid hydration mismatches
  if (!isClient) {
    return null;
  }

  // If on an auth route, just render the children without the main layout
  if (isAuthRoute) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        {authLoading ? <Loader2 className="h-16 w-16 animate-spin text-primary" /> : children}
      </div>
    );
  }

  // If loading auth state and not a guest, show a full-screen loader
  // This prevents the main layout from flashing before auth is resolved
  if (authLoading && !isGuest) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  // If no user and not a guest, the AuthProvider will handle the redirect.
  // We can render a loader here as well to prevent content flash.
  if (!user && !isGuest) {
      return (
        <div className="flex h-screen items-center justify-center">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
        </div>
      );
  }

  // Render the main app layout
  return (
    <div className="flex flex-col min-h-screen">
      <TopBar />
      <main className={cn("flex-1 pb-16 md:pb-0")}>
        {children}
      </main>
      <div className="md:hidden">
        <BottomNav />
      </div>
    </div>
  );
}
