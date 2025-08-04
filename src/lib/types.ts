
export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  category: string;
  date: string; // ISO string
}

export interface Bill {
  id: string;
  description: string;
  amount: number;
  dueDate: number; // Day of the month
  paidForMonths: string[]; // e.g., ['2023-10', '2023-11']
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
}

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface FinancialData {
  transactions: Transaction[];
  bills: Bill[];
  goals: Goal[];
  checklist: ChecklistItem[];
  showChart: boolean;
}
