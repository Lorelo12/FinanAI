
"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";
import { addTransactionFromText } from "@/app/actions";
import { useFinance } from "@/contexts/finance-context";
import { useToast } from "@/hooks/use-toast";

export function AITransactionForm() {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { addTransaction } = useFinance();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    setIsLoading(true);
    const result = await addTransactionFromText(text);
    setIsLoading(false);

    if (result.success && result.data) {
      addTransaction({
        type: result.data.type,
        amount: Math.abs(result.data.amount),
        description: result.data.description,
        category: result.data.category,
        date: result.data.date,
      });
      toast({
        title: "Sucesso!",
        description: "Transação adicionada com mágica.",
      });
      setText("");
    } else {
      toast({
        variant: "destructive",
        title: "Erro",
        description: result.error || "Não foi possível adicionar a transação.",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        placeholder="Ex: Gastei 50 reais no almoço de hoje com pizza"
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
