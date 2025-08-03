
"use client";

import { useFinance } from '@/contexts/finance-context';
import { useMemo } from 'react';
import { SummaryCards } from '@/components/features/dashboard/summary-cards';
import { AITransactionForm } from '@/components/features/dashboard/ai-transaction-form';
import { DistributionChart } from '@/components/features/dashboard/distribution-chart';
import { RecentTransactions } from '@/components/features/dashboard/recent-transactions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/auth-context';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const { state, loading } = useFinance();
  const { user } = useAuth();

  const { income, expenses, balance } = useMemo(() => {
    const income = state.transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const expenses = state.transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    const balance = income - expenses;
    return { income, expenses, balance };
  }, [state.transactions]);
  
  const welcomeMessage = useMemo(() => {
    if (user?.displayName) return `Bem-vindo, ${user.displayName.split(' ')[0]}!`;
    return "Bem-vindo!";
  }, [user]);

  if (loading) {
    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <Skeleton className="h-9 w-48" />
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Skeleton className="h-28" />
                <Skeleton className="h-28" />
                <Skeleton className="h-28 col-span-2" />
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Skeleton className="col-span-4 h-48" />
                <Skeleton className="col-span-4 lg:col-span-3 h-48" />
            </div>
            <Skeleton className="h-72" />
        </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">{welcomeMessage}</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <SummaryCards income={income} expenses={expenses} balance={balance} />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Adicionar com Mágica</CardTitle>
          </CardHeader>
          <CardContent>
            <AITransactionForm />
          </CardContent>
        </Card>
        <Card className="col-span-4 lg:col-span-3">
          <CardHeader>
            <CardTitle>Visão Geral</CardTitle>
          </CardHeader>
          <CardContent>
            <DistributionChart income={income} expenses={expenses} />
          </CardContent>
        </Card>
      </div>
       <Card>
        <CardHeader>
            <CardTitle>Últimas Transações</CardTitle>
        </CardHeader>
        <CardContent>
            <RecentTransactions transactions={state.transactions.slice(0, 10)} />
        </CardContent>
       </Card>
    </div>
  );
}
