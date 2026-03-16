export type BudgetItem = { id: string; name: string; amount: number; };
export type ExpenseCategory = { id: string; name: string; items: BudgetItem[] };

export interface AppState {
  identity: {
    villageName: string;
    district: string;
    regency: string;
    year: string;
    title: string;
    headName: string;
    logoUrl: string | null;
    headPhotoUrl: string | null;
  };
  incomes: BudgetItem[];
  expenses: ExpenseCategory[];
  financing: {
    penerimaan: number;
    pengeluaran: number;
  };
  settings: {
    themeColor: string;
  };
}

export interface DerivedData {
  totalIncome: number;
  totalExpense: number;
  expenseTotals: Record<string, number>;
  netFinancing: number;
  silpa: number;
  isDeficit: boolean;
}
