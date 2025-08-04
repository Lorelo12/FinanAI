
"use client";

import { useFinance } from "@/contexts/finance-context";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from 'date-fns';
import { useToast } from "@/hooks/use-toast";
import { useState, useMemo, useEffect } from 'react';
import { cn } from "@/lib/utils";

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

export function BillsList() {
  const { state, payBill } = useFinance();
  const { toast } = useToast();
  const [currentDate, setCurrentDate] = useState<Date | null>(null);

  useEffect(() => {
    setCurrentDate(new Date());
  }, []);

  const handlePayBill = (billId: string, month: string) => {
    payBill(billId, month);
    toast({ title: "Sucesso!", description: "Pagamento registrado." });
  };
  
  const billsWithStatus = useMemo(() => {
    if (!currentDate) return [];
    
    const now = currentDate;
    const currentMonthStr = format(now, 'yyyy-MM');

    return state.bills.map(bill => {
      const dueDateThisMonth = new Date(now.getFullYear(), now.getMonth(), bill.dueDate);
      const isPaid = bill.paidForMonths?.includes(currentMonthStr);
      
      let status: 'paid' | 'overdue' | 'upcoming';
      if (isPaid) {
        status = 'paid';
      } else if (now > dueDateThisMonth) {
        status = 'overdue';
      } else {
        status = 'upcoming';
      }
      return { ...bill, status, isPaid };
    }).sort((a,b) => a.dueDate - b.dueDate);
  }, [state.bills, currentDate]);


  if (state.bills.length === 0) {
    return <p className="text-center text-muted-foreground pt-4">Nenhuma conta mensal cadastrada.</p>;
  }
  
  if (!currentDate) {
      return <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"></div>; // Return empty grid to avoid layout shift
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {billsWithStatus.map((bill) => {
        const currentMonthStr = format(currentDate, 'yyyy-MM');
        return (
          <Card key={bill.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                  <CardTitle>{bill.description}</CardTitle>
                  <Badge className={cn({
                    'bg-green-100 text-green-800 border-green-200 hover:bg-green-100': bill.status === 'paid',
                    'bg-red-100 text-red-800 border-red-200 hover:bg-red-100': bill.status === 'overdue',
                    'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100': bill.status === 'upcoming',
                    'dark:bg-green-900/50 dark:text-green-300 dark:border-green-800': bill.status === 'paid',
                    'dark:bg-red-900/50 dark:text-red-300 dark:border-red-800': bill.status === 'overdue',
                    'dark:bg-yellow-900/50 dark:text-yellow-300 dark:border-yellow-800': bill.status === 'upcoming',
                  })}>
                    {bill.status === 'paid' && 'Pago'}
                    {bill.status === 'overdue' && 'Vencido'}
                    {bill.status === 'upcoming' && 'A Vencer'}
                  </Badge>
              </div>
              <CardDescription>Vence todo dia {bill.dueDate}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{formatCurrency(bill.amount)}</p>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => handlePayBill(bill.id, currentMonthStr)} 
                disabled={bill.isPaid}
                className="w-full"
                variant={bill.isPaid ? 'secondary' : 'default'}
              >
                {bill.isPaid ? "Pagamento Confirmado" : "Confirmar Pagamento"}
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
