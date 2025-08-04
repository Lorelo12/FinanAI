"use client";

import { createContext, useContext, useEffect, useReducer, type ReactNode, useCallback, useState } from 'react';
import type { FinancialData, Transaction, Bill, Goal, ChecklistItem } from '@/lib/types';
import { useAuth } from './auth-context';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';


type Action =
  | { type: 'SET_STATE'; payload: FinancialData }
  | { type: 'RESET_STATE' }
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'ADD_BILL'; payload: Bill }
  | { type: 'PAY_BILL'; payload: { billId: string; month: string } }
  | { type: 'ADD_GOAL'; payload: Goal }
  | { type: 'ADD_TO_GOAL'; payload: { goalId: string; amount: number } }
  | { type: 'ADD_CHECKLIST_ITEM'; payload: ChecklistItem }
  | { type: 'UPDATE_CHECKLIST_ITEM'; payload: ChecklistItem }
  | { type: 'DELETE_CHECKLIST_ITEM'; payload: string };

const initialState: FinancialData = {
  transactions: [],
  bills: [],
  goals: [],
  checklist: [],
};

function financeReducer(state: FinancialData, action: Action): FinancialData {
  switch (action.type) {
    case 'SET_STATE':
      return action.payload;
    case 'RESET_STATE':
      return initialState;
    case 'ADD_TRANSACTION':
      return { ...state, transactions: [...state.transactions, action.payload] };
    case 'ADD_BILL':
      return { ...state, bills: [...state.bills, action.payload] };
    case 'PAY_BILL':
      const { billId, month } = action.payload;
      const billToUpdate = state.bills.find(b => b.id === billId);
      if (billToUpdate) {
        const updatedPayments = { ...billToUpdate.payments, [month]: true };
        const updatedBill = { ...billToUpdate, payments: updatedPayments };
        return { ...state, bills: state.bills.map(b => b.id === billId ? updatedBill : b) };
      }
      return state;
    case 'ADD_GOAL':
      return { ...state, goals: [...state.goals, action.payload] };
    case 'ADD_TO_GOAL':
      const { goalId, amount } = action.payload;
      return {
        ...state,
        goals: state.goals.map(g => g.id === goalId ? { ...g, currentAmount: g.currentAmount + amount } : g)
      };
    case 'ADD_CHECKLIST_ITEM':
      return { ...state, checklist: [...state.checklist, action.payload] };
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
    default:
      return state;
  }
}

interface FinanceContextProps {
  state: FinancialData;
  dispatch: React.Dispatch<Action>;
  loading: boolean;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'date'>) => Promise<void>;
  addBill: (bill: Omit<Bill, 'id' | 'payments'>) => Promise<void>;
  payBill: (billId: string, month: string) => Promise<void>;
  addGoal: (goal: Omit<Goal, 'id' | 'currentAmount'>) => Promise<void>;
  addToGoal: (goalId: string, amount: number) => Promise<void>;
  addChecklistItem: (item: Omit<ChecklistItem, 'id' | 'completed'>) => Promise<void>;
  updateChecklistItem: (item: ChecklistItem) => Promise<void>;
  deleteChecklistItem: (itemId: string) => Promise<void>;
}

const FinanceContext = createContext<FinanceContextProps | undefined>(undefined);

export function FinanceProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(financeReducer, initialState);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      const docRef = doc(db, 'users', user.uid);
      const unsubscribe = onSnapshot(docRef, (doc) => {
        if (doc.exists()) {
          dispatch({ type: 'SET_STATE', payload: doc.data() as FinancialData });
        }
        setLoading(false);
      }, (error) => {
        console.error("Error fetching user data:", error);
        toast({
          title: "Error",
          description: "Failed to load your financial data. Please try again later.",
          variant: "destructive",
        });
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
      dispatch({ type: 'RESET_STATE' });
      setLoading(false);
    }
  }, [user, toast]);

  const saveData = useCallback(async (newState: FinancialData) => {
    if (!user) return;
    try {
      await setDoc(doc(db, 'users', user.uid), newState);
    } catch (error) {
      console.error("Error saving data:", error);
      toast({
        title: "Error",
        description: "Failed to save your data. Please check your connection.",
        variant: "destructive",
      });
    }
  }, [user, toast]);

  const addTransaction = async (transaction: Omit<Transaction, 'id' | 'date'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: crypto.randomUUID(),
      date: format(new Date(), 'yyyy-MM-dd'),
    };
    const newState = { ...state, transactions: [...state.transactions, newTransaction] };
    dispatch({ type: 'ADD_TRANSACTION', payload: newTransaction });
    await saveData(newState);
  };

  const addBill = async (bill: Omit<Bill, 'id' | 'payments'>) => {
    const newBill: Bill = {
      ...bill,
      id: crypto.randomUUID(),
      payments: {},
    };
    const newState = { ...state, bills: [...state.bills, newBill] };
    dispatch({ type: 'ADD_BILL', payload: newBill });
    await saveData(newState);
  };

  const payBill = async (billId: string, month: string) => {
    const billToUpdate = state.bills.find(b => b.id === billId);
    if (billToUpdate) {
      const updatedPayments = { ...billToUpdate.payments, [month]: true };
      const updatedBill = { ...billToUpdate, payments: updatedPayments };
      const newState = { ...state, bills: state.bills.map(b => b.id === billId ? updatedBill : b) };
      dispatch({ type: 'PAY_BILL', payload: { billId, month } });
      await saveData(newState);
    }
  };

  const addGoal = async (goal: Omit<Goal, 'id' | 'currentAmount'>) => {
    const newGoal: Goal = {
      ...goal,
      id: crypto.randomUUID(),
      currentAmount: 0,
    };
    const newState = { ...state, goals: [...state.goals, newGoal] };
    dispatch({ type: 'ADD_GOAL', payload: newGoal });
    await saveData(newState);
  };

  const addToGoal = async (goalId: string, amount: number) => {
    const goalToUpdate = state.goals.find(g => g.id === goalId);
    if (goalToUpdate) {
      const updatedGoal = { ...goalToUpdate, currentAmount: goalToUpdate.currentAmount + amount };
      const newState = { ...state, goals: state.goals.map(g => g.id === goalId ? updatedGoal : g) };
      dispatch({ type: 'ADD_TO_GOAL', payload: { goalId, amount } });
      await saveData(newState);
    }
  };

  const addChecklistItem = async (item: Omit<ChecklistItem, 'id' | 'completed'>) => {
    const newChecklistItem: ChecklistItem = {
      ...item,
      id: crypto.randomUUID(),
      completed: false,
    };
    const newState = { ...state, checklist: [...state.checklist, newChecklistItem] };
    dispatch({ type: 'ADD_CHECKLIST_ITEM', payload: newChecklistItem });
    await saveData(newState);
  };

  const updateChecklistItem = async (item: ChecklistItem) => {
    const newState = { ...state, checklist: state.checklist.map(i => i.id === item.id ? item : i) };
    dispatch({ type: 'UPDATE_CHECKLIST_ITEM', payload: item });
    await saveData(newState);
  };

  const deleteChecklistItem = async (itemId: string) => {
    const newState = { ...state, checklist: state.checklist.filter(i => i.id !== itemId) };
    dispatch({ type: 'DELETE_CHECKLIST_ITEM', payload: itemId });
    await saveData(newState);
  };


  return (
    <FinanceContext.Provider value={{
      state,
      dispatch,
      loading,
      addTransaction,
      addBill,
      payBill,
      addGoal,
      addToGoal,
      addChecklistItem,
      updateChecklistItem,
      deleteChecklistItem,
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
