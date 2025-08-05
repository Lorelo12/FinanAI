"use client";

import type { ReactNode } from 'react';
import { AuthProvider } from '@/contexts/auth-context';
import { FinanceProvider } from '@/contexts/finance-context';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from 'next-themes';
import { ClientOnly } from '@/components/layout/client-only';
import { LanguageProvider } from '@/contexts/language-context';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <LanguageProvider>
        <AuthProvider>
          <FinanceProvider>
            {children}
            <ClientOnly>
              <Toaster />
            </ClientOnly>
          </FinanceProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
