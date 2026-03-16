import React, { useState } from 'react';
import { AppState } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { CheckCircle2, Download, Printer, Settings } from 'lucide-react';

interface Props {
  settings: AppState['settings'];
  setSettings: React.Dispatch<React.SetStateAction<AppState['settings']>>;
  exportToSVG: () => boolean;
  printBanner: () => boolean;
  resetData: () => void;
}

export const ExportForm: React.FC<Props> = ({ settings, setSettings, exportToSVG, printBanner, resetData }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleExport = () => {
    setErrorMsg('');
    const success = exportToSVG();
    if (!success) setErrorMsg('Gagal mengekspor SVG. Pastikan banner sudah termuat.');
  };

  const handlePrint = () => {
    setErrorMsg('');
    const success = printBanner();
    if (!success) setErrorMsg('Gagal mencetak. Pastikan pop-up tidak diblokir oleh browser.');
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg flex items-start">
        <CheckCircle2 className="text-amber-600 mr-3 mt-0.5 shrink-0" size={20} />
        <div className="text-xs md:text-sm text-amber-900">
          <p className="font-semibold mb-1">Data Tersimpan Otomatis (Autosave Aktif)</p>
          <p className="text-amber-800">Sistem menggunakan memori peramban Anda. Anda dapat kembali kapan saja tanpa takut kehilangan data rancangan banner ini.</p>
        </div>
      </div>

      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
          {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-5 text-center hover:border-teal-300 transition-colors cursor-pointer" onClick={handleExport}>
          <div className="bg-teal-100 w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-teal-600">
            <Download size={24} />
          </div>
          <h3 className="font-bold text-slate-800 mb-2">Vector Mentahan</h3>
          <p className="text-xs text-slate-500 mb-4 h-8">Format SVG Murni. Cocok untuk dibawa ke percetakan spanduk (CorelDRAW).</p>
          <Button className="w-full" onClick={(e) => { e.stopPropagation(); handleExport(); }}>Download .SVG</Button>
        </Card>

        <Card className="p-5 text-center hover:border-teal-300 transition-colors cursor-pointer" onClick={handlePrint}>
          <div className="bg-indigo-100 w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-600">
            <Printer size={24} />
          </div>
          <h3 className="font-bold text-slate-800 mb-2">Cetak ke PDF (Laporan)</h3>
          <p className="text-xs text-slate-500 mb-4 h-8">Cetak ukuran 20x30cm. Cocok untuk lampiran dokumentasi desa.</p>
          <Button variant="outline" className="w-full border-indigo-200 text-indigo-700 hover:bg-indigo-50" onClick={(e) => { e.stopPropagation(); handlePrint(); }}>Print / Simpan PDF</Button>
        </Card>
      </div>

      <div className="pt-6 border-t border-slate-100 space-y-4">
        <div>
          <h4 className="font-medium text-slate-700 mb-3 text-sm flex items-center"><Settings size={16} className="mr-2"/> Tema Visual Banner</h4>
          <div className="flex gap-2">
            {['#0f766e', '#1d4ed8', '#be123c', '#b45309', '#4338ca', '#334155'].map(color => (
              <button 
                key={color} 
                title={`Pilih warna ${color}`}
                onClick={() => setSettings(prev => ({...prev, themeColor: color}))}
                className={`w-8 h-8 md:w-10 md:h-10 rounded-full border-4 shadow-sm transition-transform ${settings.themeColor === color ? 'border-slate-800 scale-110' : 'border-white hover:scale-105'}`}
                style={{backgroundColor: color}}
              />
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 text-center">
          {!showConfirm ? (
            <button onClick={() => setShowConfirm(true)} className="text-xs text-red-500 hover:text-red-700 underline underline-offset-2">Reset & Hapus Semua Data</button>
          ) : (
            <div className="bg-red-50 p-4 rounded-lg border border-red-200 animate-in fade-in zoom-in-95 duration-200">
              <p className="text-sm text-red-800 font-medium mb-3">Yakin ingin menghapus semua data dan mengulang dari awal?</p>
              <div className="flex justify-center gap-3">
                <Button variant="outline" className="text-xs py-1.5" onClick={() => setShowConfirm(false)}>Batal</Button>
                <Button className="bg-red-600 hover:bg-red-700 text-xs py-1.5" onClick={() => { setShowConfirm(false); resetData(); }}>Ya, Hapus Data</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
