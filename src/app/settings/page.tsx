
"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useFinance } from "@/contexts/finance-context";
import { AlertTriangle, Loader2 } from "lucide-react";
import { useState } from "react";

export default function SettingsPage() {
    const { resetAllData } = useFinance();
    const [isResetting, setIsResetting] = useState(false);

    const handleReset = async () => {
        setIsResetting(true);
        try {
            await resetAllData();
        } catch (error) {
            console.error("Failed to reset data", error);
        } finally {
            setIsResetting(false);
        }
    }

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <h2 className="text-3xl font-bold tracking-tight">Configurações</h2>
            
            <Card className="border-destructive">
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <AlertTriangle className="h-8 w-8 text-destructive" />
                        <div>
                            <CardTitle className="text-destructive">Zona de Perigo</CardTitle>
                            <CardDescription>
                                Ações nesta seção são permanentes e não podem ser desfeitas.
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                   <AlertDialog>
                    <AlertDialogTrigger asChild>
                         <Button variant="destructive">Resetar Todos os Dados</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>Você tem certeza absoluta?</AlertDialogTitle>
                        <AlertDialogDescription>
                           Esta ação não pode ser desfeita. Todos os seus dados, incluindo transações, contas e metas, serão permanentemente apagados.
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel disabled={isResetting}>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleReset}
                            disabled={isResetting}
                            className="bg-destructive hover:bg-destructive/90"
                        >
                            {isResetting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Sim, apagar tudo
                        </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                   </AlertDialog>
                </CardContent>
            </Card>
        </div>
    );
}
