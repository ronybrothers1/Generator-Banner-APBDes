import { AppState } from './types';
import { generateId } from './utils';

export const STORAGE_KEY = 'apbdes_banner_autosave_v1';

export const defaultState: AppState = {
  identity: {
    villageName: 'Sukamaju',
    district: 'Nusantara',
    regency: 'Merdeka',
    year: new Date().getFullYear().toString(),
    title: 'INFO GRAFIS APBDES',
    headName: 'Bpk. Ahmad Susanto, S.E.',
    logoUrl: null,
    headPhotoUrl: null,
  },
  incomes: [
    { id: generateId(), name: 'Pendapatan Asli Desa', amount: 50000000 },
    { id: generateId(), name: 'Dana Desa (Pusat)', amount: 850000000 },
    { id: generateId(), name: 'Alokasi Dana Desa', amount: 350000000 },
    { id: generateId(), name: 'Bagi Hasil Pajak & Retribusi', amount: 25000000 },
    { id: generateId(), name: 'Bantuan Provinsi & Kabupaten', amount: 100000000 },
  ],
  expenses: [
    {
      id: generateId(), name: '1. Penyelenggaraan Pemerintahan', items: [
        { id: generateId(), name: 'Penghasilan Tetap & Tunjangan', amount: 320000000 },
        { id: generateId(), name: 'Operasional Perkantoran', amount: 50000000 },
      ]
    },
    {
      id: generateId(), name: '2. Pelaksanaan Pembangunan', items: [
        { id: generateId(), name: 'Pembangunan Jalan Lingkungan', amount: 450000000 },
        { id: generateId(), name: 'Pembangunan Saluran Irigasi', amount: 150000000 },
      ]
    },
    {
      id: generateId(), name: '3. Pembinaan Kemasyarakatan', items: [
        { id: generateId(), name: 'Pembinaan Karang Taruna', amount: 20000000 },
        { id: generateId(), name: 'Festival Budaya Desa', amount: 30000000 },
      ]
    },
    {
      id: generateId(), name: '4. Pemberdayaan Masyarakat', items: [
        { id: generateId(), name: 'Pelatihan UMKM Desa', amount: 40000000 },
        { id: generateId(), name: 'Bantuan Bibit Pertanian', amount: 60000000 },
      ]
    },
    {
      id: generateId(), name: '5. Penanggulangan Bencana', items: [
        { id: generateId(), name: 'Bantuan Langsung Tunai (BLT)', amount: 150000000 },
        { id: generateId(), name: 'Dana Cadangan Bencana', amount: 50000000 },
      ]
    },
  ],
  financing: { penerimaan: 55000000, pengeluaran: 0 },
  settings: { themeColor: '#0f766e' }
};
