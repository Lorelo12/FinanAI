"use client";

import type { ReactNode } from 'react';
import { AuthProvider } from '@/contexts/auth-context';
import { FinanceProvider } from '@/contexts/finance-context';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from 'next-themes';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        <FinanceProvider>
          {children}
          <Toaster />
        </FinanceProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
