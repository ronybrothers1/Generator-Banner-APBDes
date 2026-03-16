import React, { useState, useMemo, useRef, useEffect } from 'react';
import { AppState, DerivedData } from './types';
import { defaultState, STORAGE_KEY } from './constants';
import { sanitizeFilename } from './utils';
import { BannerSVG } from './components/BannerSVG';
import { IdentityForm } from './components/forms/IdentityForm';
import { IncomeForm } from './components/forms/IncomeForm';
import { ExpenseForm } from './components/forms/ExpenseForm';
import { FinancingForm } from './components/forms/FinancingForm';
import { ExportForm } from './components/forms/ExportForm';
import { Button } from './components/ui/Button';
import { Card } from './components/ui/Card';
import { Info, FileText, PieChart, LayoutDashboard, Download, ChevronLeft, ChevronRight, BarChart3, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [state, setState] = useState<AppState>(defaultState);
  const [activeStep, setActiveStep] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  const steps = useMemo(() => [
    { title: 'Identitas', icon: <Info size={18} /> },
    { title: 'Pendapatan', icon: <FileText size={18} /> },
    { title: 'Belanja', icon: <PieChart size={18} /> },
    { title: 'Pembiayaan', icon: <LayoutDashboard size={18} /> },
    { title: 'Export', icon: <Download size={18} /> },
  ], []);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setState(JSON.parse(saved));
      } catch (e) {
        console.error("Gagal membaca autosave data.");
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch (e) {
        console.warn("Gagal menyimpan autosave (mungkin memori penuh):", e);
      }
    }
  }, [state, isLoaded]);

  const derivedData = useMemo<DerivedData>(() => {
    const totalIncome = state.incomes.reduce((acc, curr) => acc + (curr.amount || 0), 0);
    
    const expenseTotals: Record<string, number> = {};
    let totalExpense = 0;
    
    state.expenses.forEach(cat => {
      const catTotal = cat.items.reduce((sum, item) => sum + (item.amount || 0), 0);
      expenseTotals[cat.id] = catTotal;
      totalExpense += catTotal;
    });

    const netFinancing = (state.financing.penerimaan || 0) - (state.financing.pengeluaran || 0);
    const silpa = (totalIncome - totalExpense) + netFinancing;
    const isDeficit = silpa < 0;

    return { totalIncome, totalExpense, expenseTotals, netFinancing, silpa, isDeficit };
  }, [state.incomes, state.expenses, state.financing]);

  const resetData = () => {
    setState(defaultState);
    localStorage.removeItem(STORAGE_KEY);
    setActiveStep(0);
  };

  const handleIdentityChange = (field: keyof AppState['identity'], value: string) => {
    setState(prev => ({ ...prev, identity: { ...prev.identity, [field]: value } }));
  };

  const getPhysicalSvgData = (width: string, height: string) => {
    if (!svgRef.current) return null;
    const clonedSvg = svgRef.current.cloneNode(true) as SVGSVGElement;
    clonedSvg.setAttribute('width', width);
    clonedSvg.setAttribute('height', height);
    return new XMLSerializer().serializeToString(clonedSvg);
  };

  const exportToSVG = (): boolean => {
    try {
      // SVG export uses 20x30 cm
      const svgData = getPhysicalSvgData('20cm', '30cm');
      if (!svgData) {
        console.error('SVG belum siap dirender.');
        return false;
      }
      
      const fullSvgData = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n` + svgData;
      const blob = new Blob([fullSvgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const safeName = sanitizeFilename(state.identity.villageName || 'desa');
      link.download = `Banner_APBDes_${safeName}_${state.identity.year}_20x30cm.svg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      return true;
    } catch (err) {
      console.error('Gagal mengekspor SVG:', err);
      return false;
    }
  };

  const printBanner = (): boolean => {
    try {
      // PDF export uses 20x30 cm
      const svgData = getPhysicalSvgData('20cm', '30cm');
      if (!svgData) {
        console.error('SVG belum siap dirender.');
        return false;
      }
      
      const safeName = sanitizeFilename(state.identity.villageName || 'desa');
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Banner_APBDes_${safeName}_${state.identity.year}_20x30cm</title>
              <style>
                body { margin: 0; padding: 0; background: white; display: flex; justify-content: center; align-items: center; }
                svg { width: 100%; height: 100%; }
                @media print {
                  @page { 
                    size: 20cm 30cm; /* Memaksa ukuran kertas PDF menjadi 20x30 cm */
                    margin: 0; 
                  }
                  body { 
                    margin: 0; 
                    -webkit-print-color-adjust: exact; 
                    print-color-adjust: exact; 
                  }
                }
              </style>
            </head>
            <body>
              ${svgData}
              <script>
                window.onload = () => {
                  setTimeout(() => {
                    window.print();
                    window.close();
                  }, 800);
                };
              </script>
            </body>
          </html>
        `);
        printWindow.document.close();
        return true;
      } else {
        console.error('Pop-up diblokir oleh browser. Harap izinkan pop-up untuk mencetak.');
        return false;
      }
    } catch (err) {
      console.error('Gagal mencetak:', err);
      return false;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          @page { size: 2000px 3000px; margin: 0; }
          body * { visibility: hidden; }
          body { background: white; margin: 0; padding: 0; }
          .print-svg, .print-svg * { visibility: visible; }
          .print-svg { 
            position: absolute; left: 0; top: 0; 
            width: 100%; height: 100%; 
          }
          .print-hidden { display: none !important; }
        }
      `}} />

      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 print-hidden">
        <div className="max-w-screen-2xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-teal-600 p-2 rounded-lg text-white"><BarChart3 size={20} /></div>
            <h1 className="font-bold text-lg hidden sm:block text-slate-800">APBDes<span className="font-light text-slate-500">Banner</span></h1>
          </div>
          <div className="flex items-center gap-2">
            {isLoaded && <span className="text-xs text-emerald-600 flex items-center bg-emerald-50 px-2 py-1 rounded hidden sm:flex"><CheckCircle2 size={12} className="mr-1"/> Autosaved</span>}
            <div className="text-xs md:text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full">
              Cetak: 2000x3000px (2:3)
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-screen-2xl w-full mx-auto p-2 md:p-4 grid grid-cols-1 xl:grid-cols-12 gap-4 md:gap-6 print-hidden">
        
        {/* LEFT PANEL: WIZARD FORM */}
        <div className="xl:col-span-5 flex flex-col min-h-[500px] h-auto xl:h-[calc(100vh-6rem)]">
          <Card className="flex-1 flex flex-col relative overflow-hidden shadow-md">
            <div className="bg-slate-50 border-b border-slate-200 px-2 py-3 overflow-x-auto whitespace-nowrap hide-scrollbar flex gap-2">
              <style dangerouslySetInnerHTML={{__html:` .hide-scrollbar::-webkit-scrollbar { display: none; } `}}/>
              {steps.map((step, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveStep(idx)}
                  className={`flex items-center px-3 py-2 rounded-lg text-xs md:text-sm font-medium transition-all flex-shrink-0
                    ${activeStep === idx ? 'bg-white text-teal-700 shadow-sm border border-slate-200' : 'text-slate-500 hover:bg-slate-100'}
                  `}
                >
                  <span className={`mr-2 ${activeStep === idx ? 'text-teal-600' : 'text-slate-400'}`}>{step.icon}</span>
                  {step.title}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-4 md:p-6 scroll-smooth bg-white">
              {activeStep === 0 && <IdentityForm identity={state.identity} onChange={handleIdentityChange} />}
              {activeStep === 1 && <IncomeForm incomes={state.incomes} setIncomes={(val) => setState(prev => ({...prev, incomes: typeof val === 'function' ? val(prev.incomes) : val}))} totalIncome={derivedData.totalIncome} />}
              {activeStep === 2 && <ExpenseForm expenses={state.expenses} setExpenses={(val) => setState(prev => ({...prev, expenses: typeof val === 'function' ? val(prev.expenses) : val}))} expenseTotals={derivedData.expenseTotals} totalExpense={derivedData.totalExpense} />}
              {activeStep === 3 && <FinancingForm financing={state.financing} setFinancing={(val) => setState(prev => ({...prev, financing: typeof val === 'function' ? val(prev.financing) : val}))} derivedData={derivedData} />}
              {activeStep === 4 && <ExportForm settings={state.settings} setSettings={(val) => setState(prev => ({...prev, settings: typeof val === 'function' ? val(prev.settings) : val}))} exportToSVG={exportToSVG} printBanner={printBanner} resetData={resetData} />}
            </div>

            <div className="bg-slate-50 border-t border-slate-200 p-4 flex justify-between items-center">
              <Button variant="secondary" onClick={() => setActiveStep(p => Math.max(0, p - 1))} disabled={activeStep === 0} className={`text-xs md:text-sm ${activeStep===0 && 'opacity-50'}`}>
                <ChevronLeft size={16} className="mr-1" /> Kembali
              </Button>
              {activeStep < steps.length - 1 ? (
                <Button onClick={() => setActiveStep(p => Math.min(steps.length - 1, p + 1))} className="text-xs md:text-sm">
                  Lanjut <ChevronRight size={16} className="ml-1" />
                </Button>
              ) : (
                <Button onClick={exportToSVG} className="bg-teal-600 hover:bg-teal-700 text-xs md:text-sm">
                  <Download size={16} className="mr-2" /> Unduh .SVG
                </Button>
              )}
            </div>
          </Card>
        </div>

        {/* RIGHT PANEL: LIVE PREVIEW */}
        <div className="xl:col-span-7 bg-slate-200 rounded-xl overflow-hidden shadow-inner relative flex flex-col border border-slate-300 min-h-[500px] xl:h-[calc(100vh-6rem)]">
          <div className="bg-slate-800 text-slate-300 text-xs py-2 px-4 flex justify-between items-center shadow-md z-10">
            <span className="flex items-center font-medium"><LayoutDashboard size={14} className="mr-2 text-teal-400"/> Autofit Canvas (2x3 Meter)</span>
            <span className="bg-slate-700 px-2 py-1 rounded-md text-slate-200 border border-slate-600">Pure Component Render</span>
          </div>
          
          <div className="flex-1 overflow-auto p-4 md:p-8 flex items-start justify-center pattern-bg">
            <style dangerouslySetInnerHTML={{__html: `
              .pattern-bg {
                background-color: #e2e8f0;
                background-image: radial-gradient(#cbd5e1 1px, transparent 1px);
                background-size: 20px 20px;
              }
            `}} />
            <div className="w-full max-w-[600px] xl:max-w-[700px] transition-all duration-500 ease-in-out hover:shadow-2xl ring-1 ring-slate-900/5 bg-white">
              <BannerSVG ref={svgRef} state={state} derivedData={derivedData} />
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
