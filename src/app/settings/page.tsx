
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useFinance } from "@/contexts/finance-context";
import { AlertTriangle, Loader2, LogOut } from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/contexts/auth-context";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/contexts/language-context";

export default function SettingsPage() {
    const { state, resetAllData, toggleChartVisibility } = useFinance();
    const { setTheme, theme } = useTheme();
    const { logout, isGuest } = useAuth();
    const { language, setLanguage, translations } = useLanguage();
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
        <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
            <h2 className="text-3xl font-bold tracking-tight">{translations.settings}</h2>

            <div className="space-y-8">
                {/* Seção da Conta */}
                {!isGuest && (
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold">Conta</h3>
                        <Separator />
                        <div className="flex items-center justify-between">
                            <Label className="flex flex-col space-y-1">
                                <span>Sair da sua conta</span>
                                <span className="font-normal leading-snug text-muted-foreground">
                                    Você será redirecionado para a tela de login.
                                </span>
                            </Label>
                            <Button variant="outline" onClick={logout}>
                                <LogOut className="mr-2 h-4 w-4" />
                                Sair
                            </Button>
                        </div>
                        {/* Botão de Reset movido para a seção Conta */}
                        <div className="flex items-center justify-between">
                            <Label className="flex flex-col space-y-1">
                                <span className="font-medium text-destructive">Resetar Todos os Dados</span>
                                <span className="font-normal leading-snug text-muted-foreground">
                                    Esta ação é permanente e não pode ser desfeita.
                                </span>
                            </Label>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive">
                                        <AlertTriangle className="mr-2 h-4 w-4" />
                                        Resetar
                                    </Button>
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
                        </div>
                    </div>
                )}
                <Separator />
                {/* Seção de Aparência */}
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold">{translations.appearance}</h3>
                    <Separator />
                    <div className="flex items-center justify-between">
                        <Label className="flex flex-col space-y-1">
                            <span>{translations.theme}</span>
                            <span className="font-normal leading-snug text-muted-foreground">
                                {translations.select_theme}
                            </span>
                        </Label>
                         <RadioGroup value={theme} onValueChange={setTheme} className="flex items-center">
                            <Label htmlFor="light" className="flex items-center gap-2 border rounded-md p-2 cursor-pointer hover:bg-accent has-[input:checked]:bg-accent">
                                <RadioGroupItem value="light" id="light" />
                                <span>Claro</span>
                            </Label>
                            <Label htmlFor="dark" className="flex items-center gap-2 border rounded-md p-2 cursor-pointer hover:bg-accent has-[input:checked]:bg-accent">
                                <RadioGroupItem value="dark" id="dark" />
                                <span>Escuro</span>
                            </Label>
                             <Label htmlFor="system" className="flex items-center gap-2 border rounded-md p-2 cursor-pointer hover:bg-accent has-[input:checked]:bg-accent">
                                <RadioGroupItem value="system" id="system" />
                                <span>Sistema</span>
                            </Label>
                        </RadioGroup>
                    </div>
                    <Separator />
                     <div className="flex items-center justify-between">
                        <Label className="flex flex-col space-y-1">
                            <span>{translations.language}</span>
                            <span className="font-normal leading-snug text-muted-foreground">
                                {translations.select_language}
                            </span>
                        </Label>
                         <RadioGroup value={language} onValueChange={(value) => setLanguage(value as 'pt' | 'en')} className="flex items-center">
                            <Label htmlFor="pt" className="flex items-center gap-2 border rounded-md p-2 cursor-pointer hover:bg-accent has-[input:checked]:bg-accent">
                                <RadioGroupItem value="pt" id="pt" />
                                <span>Português</span>
                            </Label>
                            <Label htmlFor="en" className="flex items-center gap-2 border rounded-md p-2 cursor-pointer hover:bg-accent has-[input:checked]:bg-accent">
                                <RadioGroupItem value="en" id="en" />
                                <span>Inglês</span>
                            </Label>
                        </RadioGroup>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                        <Label htmlFor="chart-visibility" className="flex flex-col space-y-1">
                            <span>Exibir Gráfico na Tela Inicial</span>
                            <span className="font-normal leading-snug text-muted-foreground">
                                Mostrar ou ocultar o gráfico de receitas e despesas.
                            </span>
                        </Label>
                        <Switch
                            id="chart-visibility"
                            checked={state.showChart}
                            onCheckedChange={toggleChartVisibility}
                        />
                    </div>
                </div>
                <Separator />
                {/* Botão de Reset movido para fora da seção Conta */}{!isGuest && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label className="flex flex-col space-y-1">
                                <span className="font-medium text-destructive">Resetar Todos os Dados</span>
                                <span className="font-normal leading-snug text-muted-foreground">
                                    Esta ação é permanente e não pode ser desfeita.
                                </span>
                            </Label>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive">
                                        <AlertTriangle className="mr-2 h-4 w-4" />
                                        Resetar
                                    </Button>
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
                                        <AlertDialogAction onClick={handleReset} disabled={isResetting} className="bg-destructive hover:bg-destructive/90">
                                            {isResetting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                            Sim, apagar tudo
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </div>
                )}

                {/* Seção de Dados */}
                {!isGuest && (
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-destructive">Zona de Perigo</h3>
                        <Separator />
                        {/* O conteúdo desta seção foi movido para a seção "Conta" */}
                    </div>
                )}
            </div>
        </div>
    );
}
