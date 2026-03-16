import React, { useState } from 'react';
import { AppState } from '../../types';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Image as ImageIcon, AlertCircle } from 'lucide-react';

interface Props {
  identity: AppState['identity'];
  onChange: (field: keyof AppState['identity'], value: string) => void;
}

export const IdentityForm: React.FC<Props> = ({ identity, onChange }) => {
  const [errorMsg, setErrorMsg] = useState('');

  const handleImageUpload = (field: 'logoUrl' | 'headPhotoUrl', e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg('');
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/jpeg') && !file.type.startsWith('image/png')) {
        setErrorMsg(`Format file tidak valid. Harap unggah format JPG atau PNG.`);
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        setErrorMsg(`Ukuran file ${file.name} melebihi batas 2MB.`);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        onChange(field, reader.result as string);
      };
      reader.onerror = () => {
        setErrorMsg("Gagal membaca file gambar. Coba gambar lain.");
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start text-sm">
          <AlertCircle className="shrink-0 mr-2 mt-0.5" size={16} />
          <p>{errorMsg}</p>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><Label>Judul Banner</Label><Input value={identity.title} onChange={(e) => onChange('title', e.target.value)} placeholder="Contoh: INFO GRAFIS APBDES" /></div>
        <div><Label>Tahun Anggaran</Label><Input type="number" min="2000" max="2100" value={identity.year} onChange={(e) => onChange('year', e.target.value)} /></div>
        <div><Label>Nama Desa</Label><Input value={identity.villageName} onChange={(e) => onChange('villageName', e.target.value)} /></div>
        <div><Label>Kecamatan</Label><Input value={identity.district} onChange={(e) => onChange('district', e.target.value)} /></div>
        <div><Label>Kabupaten</Label><Input value={identity.regency} onChange={(e) => onChange('regency', e.target.value)} /></div>
        <div><Label>Nama Kepala Desa</Label><Input value={identity.headName} onChange={(e) => onChange('headName', e.target.value)} /></div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
        <div className="p-4 border-2 border-dashed border-slate-200 rounded-xl text-center hover:bg-slate-50 transition-colors relative">
          <ImageIcon className="mx-auto text-slate-400 mb-2" size={32} />
          <Label className="cursor-pointer text-teal-600 hover:text-teal-700 block after:absolute after:inset-0">
            Upload Logo Desa
            <input type="file" accept="image/png, image/jpeg" className="hidden" onChange={(e) => handleImageUpload('logoUrl', e)} />
          </Label>
          <p className="text-xs text-slate-500 mt-1">PNG/JPG Max 2MB</p>
        </div>
        <div className="p-4 border-2 border-dashed border-slate-200 rounded-xl text-center hover:bg-slate-50 transition-colors relative">
          <ImageIcon className="mx-auto text-slate-400 mb-2" size={32} />
          <Label className="cursor-pointer text-teal-600 hover:text-teal-700 block after:absolute after:inset-0">
            Upload Foto Kepala Desa
            <input type="file" accept="image/png, image/jpeg" className="hidden" onChange={(e) => handleImageUpload('headPhotoUrl', e)} />
          </Label>
          <p className="text-xs text-slate-500 mt-1">PNG/JPG Max 2MB</p>
        </div>
      </div>
    </div>
  );
};
