
"use client";

import { useFinance } from "@/contexts/finance-context";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ContributeDialog } from "./contribute-dialog";

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

export function GoalsList() {
  const { state } = useFinance();

  if (state.goals.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">Nenhuma meta de poupança cadastrada.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {state.goals.map((goal) => {
        const progress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
        return (
          <Card key={goal.id}>
            <CardHeader>
              <CardTitle>{goal.name}</CardTitle>
              <CardDescription>
                Meta: {formatCurrency(goal.targetAmount)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Progress value={progress} />
                <p className="text-sm text-muted-foreground">
                  {formatCurrency(goal.currentAmount)} de {formatCurrency(goal.targetAmount)} ({progress.toFixed(0)}%)
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <ContributeDialog goal={goal} />
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
