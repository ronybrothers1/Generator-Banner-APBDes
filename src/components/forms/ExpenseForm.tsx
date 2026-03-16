import React from 'react';
import { AppState, BudgetItem } from '../../types';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Plus, Trash2 } from 'lucide-react';
import { formatRupiah, parseSafeNumber, generateId, formatNumberWithDots } from '../../utils';

interface Props {
  expenses: AppState['expenses'];
  setExpenses: React.Dispatch<React.SetStateAction<AppState['expenses']>>;
  expenseTotals: Record<string, number>;
  totalExpense: number;
}

export const ExpenseForm: React.FC<Props> = ({ expenses, setExpenses, expenseTotals, totalExpense }) => {
  const addExpense = (categoryId: string) => {
    setExpenses(prev => prev.map(cat => cat.id === categoryId ? { ...cat, items: [...cat.items, { id: generateId(), name: 'Kegiatan Baru', amount: 0 }] } : cat));
  };
  const removeExpense = (categoryId: string, itemId: string) => {
    setExpenses(prev => prev.map(cat => cat.id === categoryId ? { ...cat, items: cat.items.filter(item => item.id !== itemId) } : cat));
  };
  const updateExpense = (categoryId: string, itemId: string, field: keyof BudgetItem, value: string | number) => {
    setExpenses(prev => prev.map(cat => cat.id === categoryId ? { ...cat, items: cat.items.map(item => item.id === itemId ? { ...item, [field]: value } : item) } : cat));
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {expenses.map((category) => {
        const catTotal = expenseTotals[category.id] || 0;
        return (
          <Card key={category.id} className="p-3 md:p-4 bg-slate-50/50">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-2 mb-3">
              <h4 className="font-bold text-slate-800 text-sm">{category.name}</h4>
              <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2 md:px-3 py-1 rounded-full w-fit">{formatRupiah(catTotal)}</span>
            </div>
            <div className="space-y-2">
              {category.items.map((item) => (
                <div key={item.id} className="flex flex-col md:flex-row gap-2 md:items-center bg-white p-2 rounded-md border border-slate-200">
                   <div className="flex-1 w-full"><Input placeholder="Nama Kegiatan" value={item.name} onChange={(e) => updateExpense(category.id, item.id, 'name', e.target.value)} className="text-xs h-9" /></div>
                   <div className="w-full md:w-1/3 flex gap-2">
                     <Input type="text" inputMode="numeric" placeholder="0" value={item.amount === 0 ? '' : formatNumberWithDots(item.amount)} onChange={(e) => updateExpense(category.id, item.id, 'amount', parseSafeNumber(e.target.value))} className="text-xs h-9 border-teal-200 focus:border-teal-500" />
                     <button onClick={() => removeExpense(category.id, item.id)} className="p-1.5 text-slate-400 hover:text-red-500 rounded bg-slate-50"><Trash2 size={16} /></button>
                   </div>
                </div>
              ))}
              <Button variant="outline" className="w-full text-xs mt-2 py-1.5 border-dashed" onClick={() => addExpense(category.id)}><Plus size={14} className="mr-1"/> Tambah Kegiatan</Button>
            </div>
          </Card>
        );
      })}
      <div className="bg-teal-50 p-4 rounded-lg flex justify-between items-center border border-teal-100">
        <span className="font-semibold text-teal-900 text-sm">Total Rencana Belanja:</span>
        <span className="font-bold text-lg text-teal-700">{formatRupiah(totalExpense)}</span>
      </div>
    </div>
  );
};
