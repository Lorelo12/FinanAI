
"use client";

import { createContext, useContext, useEffect, useReducer, type ReactNode, useCallback, useState } from 'react';
import type { FinancialData, Transaction, Bill, Goal, ChecklistItem } from '@/lib/types';
import { useAuth } from './auth-context';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { doc, getDoc, setDoc } from 'firebase/firestore';
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


interface FinanceContextType {
  state: FinancialData;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  addBill: (bill: Omit<Bill, 'id' | 'paidForMonths'>) => void;
  payBill: (billId: string, month: string) => void;
  addGoal: (goal: Omit<Goal, 'id' | 'currentAmount'>) => void;
  addToGoal: (goalId: string, amount: number) => void;
  addChecklistItem: (item: Omit<ChecklistItem, 'id' | 'completed'>) => void;
  updateChecklistItem: (item: ChecklistItem) => void;
  deleteChecklistItem: (id: string) => void;
  resetAllData: () => Promise<void>;
  loading: boolean;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

const initialState: FinancialData = {
  transactions: [],
  bills: [],
  goals: [],
  checklistItems: [],
};

function financeReducer(state: FinancialData, action: Action): FinancialData {
  switch (action.type) {
    case 'SET_STATE':
      return action.payload;
    case 'RESET_STATE':
      return initialState;
    case 'ADD_TRANSACTION':
      return { ...state, transactions: [action.payload, ...state.transactions] };
    case 'ADD_BILL':
      return { ...state, bills: [...state.bills, action.payload] };
    case 'PAY_BILL':
      return {
        ...state,
        bills: state.bills.map(bill => 
          bill.id === action.payload.billId 
            ? { ...bill, paidForMonths: [...bill.paidForMonths, action.payload.month] }
            : bill
        ),
      };
    case 'ADD_GOAL':
      return { ...state, goals: [...state.goals, action.payload] };
    case 'ADD_TO_GOAL':
      return {
        ...state,
        goals: state.goals.map(goal => 
          goal.id === action.payload.goalId 
            ? { ...goal, currentAmount: goal.currentAmount + action.payload.amount }
            : goal
        ),
      };
    case 'ADD_CHECKLIST_ITEM':
      return { ...state, checklistItems: [...state.checklistItems, action.payload] };
    case 'UPDATE_CHECKLIST_ITEM':
      return {
        ...state,
        checklistItems: state.checklistItems.map(item =>
          item.id === action.payload.id ? action.payload : item
        ),
      };
    case 'DELETE_CHECKLIST_ITEM':
      return {
        ...state,
        checklistItems: state.checklistItems.filter(item => item.id !== action.payload),
      };
    default:
      return state;
  }
}

const LOCAL_STORAGE_GUEST_KEY = 'finanai-data-guest';

export function FinanceProvider({ children }: { children: ReactNode }) {
  const { user, isGuest } = useAuth();
  const [state, dispatch] = useReducer(financeReducer, initialState);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const checkUpcomingBills = (bills: Bill[]) => {
    const today = new Date();
    const currentDay = today.getDate();
    const currentMonthStr = format(today, 'yyyy-MM');

    bills.forEach(bill => {
      const isPaid = bill.paidForMonths.includes(currentMonthStr);
      if (!isPaid && bill.dueDate === currentDay) {
        toast({
          title: "Lembrete de Pagamento",
          description: `Sua conta "${bill.description}" vence hoje!`,
        });
      }
    });
  };
  
  // Load data
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      if (user) {
        // User is logged in, load from Firestore
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data() as FinancialData;
          dispatch({ type: 'SET_STATE', payload: data });
          checkUpcomingBills(data.bills);
        } else {
          // No data for this user in Firestore yet
          dispatch({ type: 'SET_STATE', payload: initialState });
        }
      } else if (isGuest) {
        // User is a guest, load from localStorage
        try {
            const storedData = localStorage.getItem(LOCAL_STORAGE_GUEST_KEY);
            if (storedData) {
                const data = JSON.parse(storedData);
                dispatch({ type: 'SET_STATE', payload: data });
                checkUpcomingBills(data.bills);
            } else {
                dispatch({ type: 'SET_STATE', payload: initialState });
            }
        } catch (error) {
            console.error("Failed to read from local storage", error);
            dispatch({ type: 'SET_STATE', payload: initialState });
        }
      } else {
        // No user or guest, do nothing
        dispatch({ type: 'SET_STATE', payload: initialState });
      }
      setLoading(false);
    }
    loadData();
  }, [user, isGuest]);
  
  // Save data
  useEffect(() => {
    async function saveData() {
      // Don't save if it's the initial state or still loading
      if (loading) return;

      if (user) {
        // User is logged in, save to Firestore
        try {
          const docRef = doc(db, "users", user.uid);
          await setDoc(docRef, state);
        } catch (error) {
           console.error("Error saving data to Firestore:", error);
           toast({ variant: 'destructive', title: 'Erro ao Salvar', description: 'Não foi possível salvar seus dados na nuvem.' });
        }
      } else if (isGuest) {
        // User is a guest, save to localStorage
         try {
            localStorage.setItem(LOCAL_STORAGE_GUEST_KEY, JSON.stringify(state));
         } catch (error) {
            console.error("Failed to write to local storage", error);
         }
      }
    }
    saveData();
  }, [state, user, isGuest, loading, toast]);


  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    dispatch({ type: 'ADD_TRANSACTION', payload: { ...transaction, id: crypto.randomUUID() } });
  };
  
  const addBill = (bill: Omit<Bill, 'id' | 'paidForMonths'>) => {
    dispatch({ type: 'ADD_BILL', payload: { ...bill, id: crypto.randomUUID(), paidForMonths: [] } });
  };

  const payBill = (billId: string, month: string) => {
    const bill = state.bills.find(b => b.id === billId);
    if(bill) {
      addTransaction({
        type: 'expense',
        amount: bill.amount,
        description: `Pagamento: ${bill.description}`,
        category: 'Contas',
        date: new Date().toISOString()
      });
      dispatch({ type: 'PAY_BILL', payload: { billId, month } });
    }
  };

  const addGoal = (goal: Omit<Goal, 'id' | 'currentAmount'>) => {
    dispatch({ type: 'ADD_GOAL', payload: { ...goal, id: crypto.randomUUID(), currentAmount: 0 } });
  };
  
  const addToGoal = (goalId: string, amount: number) => {
    const goal = state.goals.find(g => g.id === goalId);
    if(goal) {
       addTransaction({
        type: 'expense',
        amount: amount,
        description: `Contribuição para meta: ${goal.name}`,
        category: 'Metas',
        date: new Date().toISOString()
      });
      dispatch({type: 'ADD_TO_GOAL', payload: {goalId, amount}})
    }
  };

  const addChecklistItem = (item: Omit<ChecklistItem, 'id' | 'completed'>) => {
    dispatch({ type: 'ADD_CHECKLIST_ITEM', payload: { ...item, id: crypto.randomUUID(), completed: false } });
  };
  
  const updateChecklistItem = (item: ChecklistItem) => {
    dispatch({ type: 'UPDATE_CHECKLIST_ITEM', payload: item });
  };

  const deleteChecklistItem = (id: string) => {
    dispatch({ type: 'DELETE_CHECKLIST_ITEM', payload: id });
  };

  const resetAllData = async () => {
    if (user) {
        // For a logged-in user, clear the document in Firestore
        const docRef = doc(db, 'users', user.uid);
        await setDoc(docRef, initialState); // Overwrite with initial state
    } else if (isGuest) {
        // For a guest user, clear local storage
        localStorage.removeItem(LOCAL_STORAGE_GUEST_KEY);
    }
    dispatch({ type: 'RESET_STATE' });
    toast({ title: 'Sucesso!', description: 'Todos os seus dados foram apagados.' });
  };

  const value = { state, addTransaction, addBill, payBill, addGoal, addToGoal, addChecklistItem, updateChecklistItem, deleteChecklistItem, resetAllData, loading };

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>;
}

export function useFinance() {
  const context = useContext(FinanceContext);
  if (context === undefined) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
}
