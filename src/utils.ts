export const formatRupiah = (angka: number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka || 0);
};

export const generateId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2, 15);
};

export const sanitizeFilename = (name: string) => {
  return name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
};

export const parseSafeNumber = (val: string | number) => {
  if (val === '') return 0;
  if (typeof val === 'string') {
    const cleanStr = val.replace(/\D/g, '');
    const parsed = parseFloat(cleanStr);
    return isNaN(parsed) ? 0 : parsed;
  }
  return isNaN(val) ? 0 : val;
};

export const formatNumberWithDots = (val: number | string) => {
  if (!val) return '';
  const numStr = val.toString().replace(/\D/g, '');
  return numStr.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};
