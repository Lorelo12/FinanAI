
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
      const isPaid = bill.paidForMonths.includes(currentMonthStr);
      
      let status: 'paid' | 'overdue' | 'upcoming';
      if (isPaid) {
        status = 'paid';
      } else if (now > dueDateThisMonth) {
        status = 'overdue';
      } else {
        status = 'upcoming';
      }
      return { ...bill, status };
    }).sort((a,b) => a.dueDate - b.dueDate);
  }, [state.bills, currentDate]);


  if (state.bills.length === 0) {
    return <p className="text-center text-muted-foreground pt-4">Nenhuma conta mensal cadastrada.</p>;
  }
  
  if (!currentDate) {
      return null;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {billsWithStatus.map((bill) => {
        const currentMonthStr = format(currentDate, 'yyyy-MM');
        const isPaid = bill.status === 'paid';
        return (
          <Card key={bill.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                  <CardTitle>{bill.description}</CardTitle>
                  <Badge variant="outline" className={cn({
                    'text-green-600 border-green-500 font-semibold': bill.status === 'paid',
                    'text-red-600 border-red-500 font-semibold': bill.status === 'overdue',
                    'text-yellow-600 border-yellow-500 font-semibold': bill.status === 'upcoming',
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
                disabled={isPaid}
                className="w-full"
                variant={isPaid ? 'secondary' : 'default'}
              >
                {isPaid ? "Pagamento Confirmado" : "Confirmar Pagamento"}
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
