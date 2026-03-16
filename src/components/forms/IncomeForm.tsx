import React from 'react';
import { AppState, BudgetItem } from '../../types';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Button } from '../ui/Button';
import { Plus, Trash2 } from 'lucide-react';
import { formatRupiah, parseSafeNumber, generateId, formatNumberWithDots } from '../../utils';

interface Props {
  incomes: AppState['incomes'];
  setIncomes: React.Dispatch<React.SetStateAction<AppState['incomes']>>;
  totalIncome: number;
}

export const IncomeForm: React.FC<Props> = ({ incomes, setIncomes, totalIncome }) => {
  const addIncome = () => setIncomes(prev => [...prev, { id: generateId(), name: 'Sumber Baru', amount: 0 }]);
  const removeIncome = (id: string) => setIncomes(prev => prev.filter(item => item.id !== id));
  const updateIncome = (id: string, field: keyof BudgetItem, value: string | number) => {
    setIncomes(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-slate-800">Rincian Pendapatan</h3>
        <Button onClick={addIncome} variant="outline" className="text-xs py-1.5"><Plus size={14} className="mr-1" /> Tambah</Button>
      </div>
      {incomes.map((item) => (
        <div key={item.id} className="flex flex-col sm:flex-row gap-3 items-center bg-slate-50 p-3 rounded-lg border border-slate-200">
          <div className="flex-1 w-full">
             <Label className="text-[10px] uppercase text-slate-500">Uraian Sumber Dana</Label>
             <Input value={item.name} onChange={(e) => updateIncome(item.id, 'name', e.target.value)} />
          </div>
          <div className="w-full sm:w-1/3">
             <Label className="text-[10px] uppercase text-teal-600 font-bold">Anggaran (Rp)</Label>
             <Input type="text" inputMode="numeric" value={item.amount === 0 ? '' : formatNumberWithDots(item.amount)} onChange={(e) => updateIncome(item.id, 'amount', parseSafeNumber(e.target.value))} placeholder="0" />
          </div>
          <button onClick={() => removeIncome(item.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors mt-4 sm:mt-5">
            <Trash2 size={18} />
          </button>
        </div>
      ))}
      <div className="bg-teal-50 p-4 rounded-lg flex justify-between items-center border border-teal-100 mt-4">
        <span className="font-semibold text-teal-900 text-sm">Total Pendapatan:</span>
        <span className="font-bold text-lg text-teal-700">{formatRupiah(totalIncome)}</span>
      </div>
    </div>
  );
};
