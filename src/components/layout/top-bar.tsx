
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sun, Moon, LogOut } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const menuItems = [
  { href: "/", label: "Dashboard" },
  { href: "/bills", label: "Contas" },
  { href: "/goals", label: "Metas" },
  { href: "/checklist", label: "Compras" },
];

export function TopBar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();

  const currentPage = menuItems.find((item) => item.href === pathname);
  const pageTitle = currentPage ? currentPage.label : "FinanAI";
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between h-16 px-4 bg-background border-b">
      <div className="flex items-center gap-2">
         {user && (
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.photoURL ?? ''} alt={user.displayName ?? 'User'} />
            <AvatarFallback>{user.displayName?.charAt(0) ?? 'U'}</AvatarFallback>
          </Avatar>
        )}
        <h1 className="text-lg font-bold">{pageTitle}</h1>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
        {user && (
          <Button asChild variant="ghost" size="icon" onClick={logout}>
            <Link href="/login">
              <LogOut className="h-5 w-5" />
            </Link>
          </Button>
        )}
      </div>
    </header>
  );
}
