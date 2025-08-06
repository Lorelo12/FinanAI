
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
  const { loading: authLoading, isGuest } = useAuth();
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

  // The AuthProvider will handle redirects if necessary.
  // We render the layout shell immediately to improve perceived performance.
  // Content inside `children` will be managed by its own loading states.
  return (
    <div className="flex flex-col min-h-screen">
      <TopBar />
      <main className={cn("flex-1 pt-16 md:pt-0 pb-16 md:pb-0")}>
        {children}
      </main>
      <div className="md:hidden">
        <BottomNav />
      </div>
    </div>
  );
}
