
"use client";

import { useState } from "react";
import { useFinance } from "@/contexts/finance-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export function ShoppingChecklist() {
  const { state, addChecklistItem, updateChecklistItem, deleteChecklistItem } = useFinance();
  const [newItemText, setNewItemText] = useState("");

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    const items = newItemText.split(',').filter(item => item.trim() !== '');
    if (items.length > 0) {
      items.forEach(itemText => {
        addChecklistItem({ text: itemText.trim() });
      });
      setNewItemText("");
    }
  };

  const handleToggleItem = (id: string, completed: boolean) => {
    const item = state.checklistItems.find((i) => i.id === id);
    if (item) {
      updateChecklistItem({ ...item, completed });
    }
  };

  return (
    <Card>
      <CardContent className="p-4 md:p-6">
        <form onSubmit={handleAddItem} className="flex gap-2 mb-4">
          <Input
            type="text"
            placeholder="Adicionar item(ns)..."
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
          />
          <Button type="submit" disabled={!newItemText.trim()}>
             <Plus className="h-4 w-4 md:mr-2" />
             <span className="hidden md:inline">Adicionar</span>
          </Button>
        </form>
        <div className="space-y-2">
          {state.checklistItems.length === 0 ? (
             <p className="text-center text-muted-foreground pt-4">Sua lista de compras está vazia.</p>
          ) : (
            state.checklistItems.map((item) => (
                <div
                key={item.id}
                className="flex items-center p-2 rounded-md hover:bg-accent/50"
                >
                <Checkbox
                    id={`item-${item.id}`}
                    checked={item.completed}
                    onCheckedChange={(checked) => handleToggleItem(item.id, !!checked)}
                    className="mr-3"
                />
                <label
                    htmlFor={`item-${item.id}`}
                    className={cn("flex-1 cursor-pointer", {
                    "line-through text-muted-foreground": item.completed,
                    })}
                >
                    {item.text}
                </label>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => deleteChecklistItem(item.id)}
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
                </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
