
"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";
import { addFromText } from "@/app/actions";
import { useFinance } from "@/contexts/finance-context";
import { useToast } from "@/hooks/use-toast";
import type { AIResponseData } from "@/app/actions";

export function AITransactionForm() {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { addTransaction, addBill } = useFinance();
  const { toast } = useToast();

  const processResult = (result: AIResponseData) => {
    if (result.type === 'transaction') {
      if (!result.amount || !result.description || !result.category || !result.date || !result.transactionType) {
        throw new Error(`Dados incompletos para transação: ${result.description}`);
      }
      addTransaction({
          type: result.transactionType,
          amount: Math.abs(result.amount),
          description: result.description,
          category: result.category,
          date: result.date,
      });
    } else if (result.type === 'bill') {
        if (!result.description || !result.dueDate || !result.amount) {
            throw new Error(`Dados incompletos para conta: ${result.description}. É preciso informar o valor.`);
        }
        addBill({
            description: result.description,
            amount: Math.abs(result.amount),
            dueDate: result.dueDate,
        });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    setIsLoading(true);
    const result = await addFromText(text);
    setIsLoading(false);

    if (result.success && result.data) {
      try {
        result.data.forEach(processResult);
        toast({
          title: "Sucesso!",
          description: `${result.data.length} item(ns) adicionado(s) com mágica.`,
        });
        setText("");
      } catch (error: any) {
         toast({
          variant: "destructive",
          title: "Erro ao Adicionar",
          description: error.message || "Não foi possível adicionar um dos itens.",
        });
      }
    } else {
      toast({
        variant: "destructive",
        title: "Erro da IA",
        description: result.error || "Não foi possível processar o texto.",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        placeholder="Ex: Gastei 50 no almoço, ou, conta de luz R$150 todo dia 10"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={3}
        disabled={isLoading}
      />
      <Button type="submit" className="w-full" disabled={isLoading || !text.trim()}>
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Sparkles className="mr-2 h-4 w-4" />
        )}
        Adicionar
      </Button>
    </form>
  );
}
