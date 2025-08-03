"use client";

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel
} from "@/components/ui/sidebar";
import {
  Wallet,
  LayoutDashboard,
  Landmark,
  Target,
  ListChecks,
  User,
  LogIn,
  LogOut,
  Sun,
  Moon,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { Badge } from "../ui/badge";

const menuItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/bills", label: "Contas", icon: Landmark },
  { href: "/goals", label: "Metas", icon: Target },
  { href: "/checklist", label: "Lista de Compras", icon: ListChecks },
];

export function SidebarNav() {
  const pathname = usePathname();
  const { user, isGuest, logout, loading } = useAuth();
  const { theme, setTheme } = useTheme();

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Wallet className="size-8 text-primary" />
          <h1 className="text-xl font-bold">FinanAI</h1>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} legacyBehavior passHref>
                <SidebarMenuButton
                  isActive={pathname === item.href}
                  tooltip={item.label}
                >
                  <item.icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        {isGuest && (
             <SidebarGroup className="mt-4">
                <div className="p-4 bg-accent/20 border border-accent/30 rounded-lg text-center">
                    <p className="text-sm mb-2">Você está no modo convidado.</p>
                    <Link href="/login" passHref>
                        <Button size="sm">Criar conta</Button>
                    </Link>
                    <p className="text-xs text-muted-foreground mt-2">Salve seus dados na nuvem.</p>
                </div>
            </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarFooter>
         <div className="flex items-center justify-between p-2">
           {user && !isGuest ? (
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.photoURL ?? ''} alt={user.displayName ?? 'User'} />
                <AvatarFallback>{user.displayName?.charAt(0) ?? 'U'}</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium truncate">{user.displayName ?? user.email}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback><User /></AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">Convidado</span>
            </div>
          )}
          <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
           {user && !isGuest ? (
              <Button variant="ghost" size="icon" onClick={logout} disabled={loading}>
                <LogOut />
              </Button>
            ) : (
              <Link href="/login" passHref>
                <Button variant="ghost" size="icon" disabled={loading}>
                  <LogIn />
                </Button>
              </Link>
            )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
