"use client";

import { createContext, useContext, useEffect, useReducer, useState, type ReactNode, useCallback } from 'react';
import type { FinancialData, Transaction, Bill, Goal, ChecklistItem } from '@/lib/types';
import { useAuth } from './auth-context';
import { useToast } from '@/hooks/use-toast';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

type Action =
  | { type: 'SET_STATE'; payload: FinancialData }
  | { type: 'RESET_STATE' }
  | { type: 'ADD_TRANSACTION'; payload: Omit<Transaction, 'id'> }
  | { type: 'ADD_BILL'; payload: Omit<Bill, 'id' | 'paidForMonths'> }
  | { type: 'PAY_BILL'; payload: { billId: string; month: string } }
  | { type: 'ADD_GOAL'; payload: Omit<Goal, 'id' | 'currentAmount'> }
  | { type: 'ADD_TO_GOAL'; payload: { goalId: string; amount: number } }
  | { type: 'ADD_CHECKLIST_ITEM'; payload: Omit<ChecklistItem, 'id' | 'completed'> }
  | { type: 'UPDATE_CHECKLIST_ITEM'; payload: ChecklistItem }
  | { type: 'DELETE_CHECKLIST_ITEM'; payload: string }
  | { type: 'TOGGLE_CHART_VISIBILITY' };

const initialState: FinancialData = {
  transactions: [],
  bills: [],
  goals: [],
  checklist: [],
  showChart: true,
};

function financeReducer(state: FinancialData, action: Action): FinancialData {
  switch (action.type) {
    case 'SET_STATE':
      return action.payload;
    case 'RESET_STATE':
      return initialState;
    case 'ADD_TRANSACTION':
      const newTransaction: Transaction = {
        ...action.payload,
        id: crypto.randomUUID(),
      };
      return { ...state, transactions: [newTransaction, ...state.transactions] };
    case 'ADD_BILL':
       const newBill: Bill = {
        ...action.payload,
        id: crypto.randomUUID(),
        paidForMonths: [],
      };
      return { ...state, bills: [...state.bills, newBill] };
    case 'PAY_BILL':
      const { billId, month } = action.payload;
      return {
        ...state,
        bills: state.bills.map(b =>
          b.id === billId ? { ...b, paidForMonths: [...(b.paidForMonths || []), month] } : b
        )
      };
    case 'ADD_GOAL':
       const newGoal: Goal = {
        ...action.payload,
        id: crypto.randomUUID(),
        currentAmount: 0,
      };
      return { ...state, goals: [...state.goals, newGoal] };
    case 'ADD_TO_GOAL':
      const { goalId, amount } = action.payload;
      return {
        ...state,
        goals: state.goals.map(g => g.id === goalId ? { ...g, currentAmount: g.currentAmount + amount } : g)
      };
    case 'ADD_CHECKLIST_ITEM':
        const newChecklistItem: ChecklistItem = {
            ...action.payload,
            id: crypto.randomUUID(),
            completed: false,
        };
        return { ...state, checklist: [...state.checklist, newChecklistItem] };
    case 'UPDATE_CHECKLIST_ITEM':
      return {
        ...state,
        checklist: state.checklist.map(item =>
          item.id === action.payload.id ? action.payload : item
        ),
      };
    case 'DELETE_CHECKLIST_ITEM':
      return {
        ...state,
        checklist: state.checklist.filter(item => item.id !== action.payload),
      };
    case 'TOGGLE_CHART_VISIBILITY':
        return {
            ...state,
            showChart: !state.showChart,
        };
    default:
      return state;
  }
}

interface FinanceContextProps {
  state: FinancialData;
  loading: boolean;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  addBill: (bill: Omit<Bill, 'id' | 'paidForMonths'>) => void;
  payBill: (billId: string, month: string) => void;
  addGoal: (goal: Omit<Goal, 'id' | 'currentAmount'>) => void;
  addToGoal: (goalId: string, amount: number) => void;
  addChecklistItem: (item: Omit<ChecklistItem, 'id' | 'completed'>) => void;
  updateChecklistItem: (item: ChecklistItem) => void;
  deleteChecklistItem: (itemId: string) => void;
  toggleChartVisibility: () => void;
  resetAllData: () => void;
}

const FinanceContext = createContext<FinanceContextProps | undefined>(undefined);

export function FinanceProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(financeReducer, initialState);
  const [financeLoading, setFinanceLoading] = useState(true);
  const { user, isGuest, loading: authLoading } = useAuth();
  const { toast } = useToast();

  const saveData = useCallback(async (data: FinancialData) => {
    if (authLoading || !user || isGuest) return;
    try {
      await setDoc(doc(db, 'users', user.uid), data, { merge: true });
    } catch (error) {
      console.error("Error saving data:", error);
      toast({
        title: "Erro ao Salvar",
        description: "Não foi possível salvar seus dados. Verifique sua conexão.",
        variant: "destructive",
      });
    }
  }, [user, isGuest, toast, authLoading]);

   useEffect(() => {
    if (authLoading) return;
    if (user && !isGuest) {
      setFinanceLoading(true);
      const docRef = doc(db, 'users', user.uid);
      const unsubscribe = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          const initialStateSafe: FinancialData = {
            transactions: data.transactions || [],
            bills: data.bills || [],
            goals: data.goals || [],
            checklist: data.checklist || [],
            showChart: data.showChart === undefined ? true : data.showChart,
          };
          dispatch({ type: 'SET_STATE', payload: initialStateSafe });
        } else {
          setDoc(docRef, initialState);
          dispatch({ type: 'SET_STATE', payload: initialState });
        }
        setFinanceLoading(false);
      }, (error) => {
        console.error("Error fetching user data:", error);
        toast({
          title: "Erro de Carregamento",
          description: "Não foi possível carregar seus dados financeiros.",
          variant: "destructive",
        });
        setFinanceLoading(false);
      });
      return () => unsubscribe();
    } else if (!user && !authLoading) {
      dispatch({ type: 'RESET_STATE' });
      setFinanceLoading(false);
    }
  }, [user, isGuest, toast, authLoading]);

  useEffect(() => {
    if (!financeLoading && state !== initialState) {
      saveData(state);
    }
  }, [state, financeLoading, saveData]);

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    dispatch({ type: 'ADD_TRANSACTION', payload: transaction });
  };

  const addBill = (bill: Omit<Bill, 'id' | 'paidForMonths'>) => {
    dispatch({ type: 'ADD_BILL', payload: bill });
  };

  const payBill = (billId: string, month: string) => {
    dispatch({ type: 'PAY_BILL', payload: { billId, month } });
  };

  const addGoal = (goal: Omit<Goal, 'id' | 'currentAmount'>) => {
    dispatch({ type: 'ADD_GOAL', payload: goal });
  };

  const addToGoal = (goalId: string, amount: number) => {
    dispatch({ type: 'ADD_TO_GOAL', payload: { goalId, amount } });
  };

  const addChecklistItem = (item: Omit<ChecklistItem, 'id' | 'completed'>) => {
    dispatch({ type: 'ADD_CHECKLIST_ITEM', payload: item });
  };

  const updateChecklistItem = (item: ChecklistItem) => {
    dispatch({ type: 'UPDATE_CHECKLIST_ITEM', payload: item });
  };

  const deleteChecklistItem = (itemId: string) => {
    dispatch({ type: 'DELETE_CHECKLIST_ITEM', payload: itemId });
  };
  
  const toggleChartVisibility = () => {
    dispatch({ type: 'TOGGLE_CHART_VISIBILITY' });
  };

  const resetAllData = async () => {
    if (authLoading || !user || isGuest) return;
    dispatch({ type: 'RESET_STATE' });
    // This will trigger the useEffect to save the empty state
  }

  return (
    <FinanceContext.Provider value={{
      state,
      loading: financeLoading || authLoading,
      addTransaction,
      addBill,
      payBill,
      addGoal,
      addToGoal,
      addChecklistItem,
      updateChecklistItem,
      deleteChecklistItem,
      toggleChartVisibility,
      resetAllData
    }}>
      {children}
    </FinanceContext.Provider>
  );
}

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (context === undefined) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};
