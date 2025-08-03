
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Wallet } from "lucide-react";

interface SummaryCardsProps {
  income: number;
  expenses: number;
  balance: number;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

export function SummaryCards({ income, expenses, balance }: SummaryCardsProps) {
  const cards = [
    {
      key: 'income',
      title: 'Receitas',
      icon: TrendingUp,
      amount: formatCurrency(income),
      description: 'Total de entradas no mês',
      color: 'text-green-500',
      cols: 'col-span-1'
    },
    {
      key: 'expenses',
      title: 'Despesas',
      icon: TrendingDown,
      amount: formatCurrency(expenses),
      description: 'Total de saídas no mês',
      color: 'text-red-500',
      cols: 'col-span-1'
    },
    {
      key: 'balance',
      title: 'Saldo Atual',
      icon: Wallet,
      amount: formatCurrency(balance),
      description: 'Balanço do mês',
      color: balance >= 0 ? 'text-primary' : 'text-destructive',
      cols: 'col-span-2'
    },
  ]

  return (
    <>
      {cards.map((card) => (
         <Card key={card.key} className={card.cols}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <card.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${card.color}`}>{card.amount}</div>
            <p className="text-xs text-muted-foreground">{card.description}</p>
          </CardContent>
        </Card>
      ))}
    </>
  );
}
