import React from 'react';
import { AppState, DerivedData } from '../../types';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Card } from '../ui/Card';
import { LayoutDashboard, AlertTriangle, PieChart } from 'lucide-react';
import { formatRupiah, parseSafeNumber, formatNumberWithDots } from '../../utils';

interface Props {
  financing: AppState['financing'];
  setFinancing: React.Dispatch<React.SetStateAction<AppState['financing']>>;
  derivedData: DerivedData;
}

export const FinancingForm: React.FC<Props> = ({ financing, setFinancing, derivedData }) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <Card className="p-4 md:p-5">
        <h3 className="font-semibold text-slate-800 mb-4 flex items-center"><LayoutDashboard size={18} className="mr-2 text-teal-600"/> Pembiayaan Desa</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Penerimaan (Dari Silpa thn lalu)</Label>
            <Input type="text" inputMode="numeric" value={financing.penerimaan === 0 ? '' : formatNumberWithDots(financing.penerimaan)} onChange={(e) => setFinancing(prev => ({...prev, penerimaan: parseSafeNumber(e.target.value)}))} placeholder="0" />
          </div>
          <div>
            <Label>Pengeluaran (Penyertaan Modal dll)</Label>
            <Input type="text" inputMode="numeric" value={financing.pengeluaran === 0 ? '' : formatNumberWithDots(financing.pengeluaran)} onChange={(e) => setFinancing(prev => ({...prev, pengeluaran: parseSafeNumber(e.target.value)}))} placeholder="0" />
          </div>
        </div>
      </Card>
      
      {derivedData.isDeficit && (
         <div className="bg-red-50 border border-red-200 p-4 rounded-lg flex items-start">
           <AlertTriangle className="text-red-600 shrink-0 mr-3 mt-0.5" size={20} />
           <div>
             <h4 className="text-red-800 font-semibold text-sm">Peringatan Defisit APBDes!</h4>
             <p className="text-red-700 text-xs mt-1">Total Belanja melebihi Pendapatan + Penerimaan Pembiayaan. Pastikan rancangan anggaran sudah seimbang (balance).</p>
           </div>
         </div>
      )}

      <Card className={`p-4 md:p-5 border-emerald-200 ${derivedData.isDeficit ? 'bg-red-50/50 border-red-200' : 'bg-emerald-50/30'}`}>
        <h3 className={`font-semibold mb-4 flex items-center ${derivedData.isDeficit ? 'text-red-800' : 'text-emerald-800'}`}><PieChart size={18} className="mr-2"/> Ringkasan & Estimasi SILPA</h3>
        <div className="space-y-3 text-sm">
           <div className="flex justify-between"><span className="text-slate-600">Total Pendapatan</span><span className="font-medium text-slate-900">{formatRupiah(derivedData.totalIncome)}</span></div>
           <div className="flex justify-between"><span className="text-slate-600">Total Belanja</span><span className="font-medium text-slate-900">{formatRupiah(derivedData.totalExpense)}</span></div>
           <div className="flex justify-between"><span className="text-slate-600">Surplus/Defisit</span><span className={`font-medium ${derivedData.totalIncome - derivedData.totalExpense >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>{formatRupiah(derivedData.totalIncome - derivedData.totalExpense)}</span></div>
           <div className="flex justify-between"><span className="text-slate-600">Pembiayaan Netto</span><span className="font-medium text-slate-900">{formatRupiah(derivedData.netFinancing)}</span></div>
           <div className={`border-t pt-3 flex justify-between items-center mt-2 ${derivedData.isDeficit ? 'border-red-200' : 'border-emerald-200'}`}>
             <span className={`font-bold ${derivedData.isDeficit ? 'text-red-800' : 'text-emerald-800'}`}>Estimasi SILPA</span>
             <span className={`font-bold text-lg md:text-xl ${derivedData.isDeficit ? 'text-red-700' : 'text-emerald-700'}`}>{formatRupiah(derivedData.silpa)}</span>
           </div>
        </div>
      </Card>
    </div>
  );
};
