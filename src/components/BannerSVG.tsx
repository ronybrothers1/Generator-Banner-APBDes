import React, { useMemo, forwardRef } from 'react';
import { AppState, DerivedData } from '../types';
import { formatRupiah } from '../utils';

interface Props {
  state: AppState;
  derivedData: DerivedData;
}

export const BannerSVG = React.memo(forwardRef<SVGSVGElement, Props>(({ state, derivedData }, ref) => {
  const layout = useMemo(() => {
    let leftH = 0;
    leftH += 80 + 60 + (state.incomes.length * 60) + 80 + 100; 
    leftH += 80 + 60 + 60 + 60 + 80 + 100 + 200;

    let rightH = 80;
    state.expenses.forEach(cat => {
      rightH += 60 + (cat.items.length * 60) + 50 + 40; 
    });
    rightH += 100 + 100;
    
    const chartHeight = 120 + (state.expenses.length * 48) + 40;
    rightH += chartHeight;

    const maxContentHeight = Math.max(leftH, rightH);
    const availableSpace = 2200; 
    const scale = maxContentHeight > availableSpace ? availableSpace / maxContentHeight : 1;

    return { scale, chartHeight };
  }, [state.incomes.length, state.expenses, state.financing]);

  const { themeColor } = state.settings;
  const colors = {
    primary: themeColor,
    secondary: '#f59e0b',
    accent: '#ecfdf5',
    textLight: '#ffffff',
    textDark: '#1e293b',
    textMuted: '#64748b',
    bgLight: '#f8fafc',
    tableBorder: '#cbd5e1',
  };

  const vW = 2000;
  const vH = 3000;

  const titleText = state.identity.title.toUpperCase();
  const villageText = `PEMERINTAH DESA ${state.identity.villageName.toUpperCase()}`;
  const distText = `KECAMATAN ${state.identity.district.toUpperCase()}, KABUPATEN ${state.identity.regency.toUpperCase()}`;

  const safeTextProps = (text: string, limit: number, length: string) => {
    if (text && text.length > limit) {
      return { textLength: length, lengthAdjust: "spacingAndGlyphs" as const };
    }
    return {};
  };

  return (
    <svg id="apbdes-banner-svg" ref={ref} xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox={`0 0 ${vW} ${vH}`} preserveAspectRatio="xMidYMid meet" width="100%" height="100%" className="w-full h-auto bg-white shadow-xl rounded-sm print-svg" style={{ fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif" }} shapeRendering="geometricPrecision" textRendering="geometricPrecision" imageRendering="optimizeQuality">
      <defs>
        <style dangerouslySetInnerHTML={{__html: `
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        `}} />
        <linearGradient id="headerGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={colors.primary} />
          <stop offset="100%" stopColor="#020617" />
        </linearGradient>
        <filter id="shadowLg" x="-10%" y="-10%" width="120%" height="120%"><feDropShadow dx="0" dy="10" stdDeviation="12" floodOpacity="0.15" /></filter>
        <filter id="shadowSm" x="-5%" y="-5%" width="110%" height="110%"><feDropShadow dx="0" dy="4" stdDeviation="5" floodOpacity="0.1" /></filter>
        <pattern id="dotPattern" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="2" fill={colors.primary} fillOpacity="0.04" /></pattern>
        <clipPath id="headPhotoClip">
          <rect x="8" y="8" width="224" height="274" rx="12" />
        </clipPath>
        <clipPath id="silpaClip">
          <rect x="0" y="0" width="900" height="200" rx="35" />
        </clipPath>
      </defs>

      <rect width={vW} height={vH} fill="#ffffff" />
      <rect width={vW} height={vH} fill="url(#dotPattern)" />
      
      {/* HEADER SECTION */}
      <g>
        <path d={`M0,0 L${vW},0 L${vW},360 Q${vW/2},440 0,360 Z`} fill="url(#headerGrad)" />
        {state.identity.logoUrl ? (
           <image href={state.identity.logoUrl} xlinkHref={state.identity.logoUrl} x="70" y="50" width="240" height="240" preserveAspectRatio="xMidYMid meet" />
        ) : (
           <g><circle cx="190" cy="170" r="110" fill="#ffffff" fillOpacity="0.1" /><text x="190" y="178" textAnchor="middle" fill="#ffffff" fillOpacity="0.5" fontSize="30" fontWeight="bold">LOGO</text></g>
        )}

        <text x={vW / 2} y="110" textAnchor="middle" fill={colors.secondary} fontSize="55" fontWeight="900" letterSpacing="4" {...safeTextProps(titleText, 25, "1200")}>{titleText}</text>
        <text x={vW / 2} y="200" textAnchor="middle" fill="#ffffff" fontSize="90" fontWeight="900" letterSpacing="1" {...safeTextProps(villageText, 22, "1250")}>{villageText}</text>
        <text x={vW / 2} y="260" textAnchor="middle" fill="#cbd5e1" fontSize="40" fontWeight="600" letterSpacing="2" {...safeTextProps(distText, 40, "1100")}>{distText}</text>
        
        <rect x={(vW/2) - 300} y="300" width="600" height="70" rx="35" fill={colors.secondary} filter="url(#shadowSm)" />
        <text x={vW / 2} y="348" textAnchor="middle" fill="#ffffff" fontSize="42" fontWeight="800" letterSpacing="1">TAHUN ANGGARAN {state.identity.year}</text>

        {state.identity.headPhotoUrl ? (
          <g transform={`translate(${vW - 320}, 40)`}>
            <rect x="0" y="0" width="240" height="290" rx="15" fill="#ffffff" filter="url(#shadowSm)" />
            <image href={state.identity.headPhotoUrl} xlinkHref={state.identity.headPhotoUrl} x="8" y="8" width="224" height="274" preserveAspectRatio="xMidYMid slice" clipPath="url(#headPhotoClip)" />
            <rect x="-40" y="260" width="320" height="46" rx="23" fill={colors.primary} />
            <text x="120" y="292" textAnchor="middle" fill="#ffffff" fontSize="22" fontWeight="bold">
              {state.identity.headName.length > 25 ? state.identity.headName.substring(0,22)+'...' : state.identity.headName}
            </text>
          </g>
        ) : (
           <g><circle cx={vW - 190} cy="170" r="110" fill="#ffffff" fillOpacity="0.1" /><text x={vW - 190} y="178" textAnchor="middle" fill="#ffffff" fillOpacity="0.5" fontSize="30" fontWeight="bold">FOTO</text></g>
        )}
      </g>

      {/* BODY LAYOUT */}
      <g transform={`translate(${vW/2}, 480) scale(${layout.scale})`}>
        
        {/* KOLOM KIRI */}
        <g transform="translate(-940, 0)">
          {/* PENDAPATAN */}
          <g>
            <rect x="0" y="0" width="900" height="80" rx="20" fill={colors.primary} filter="url(#shadowSm)" />
            <text x="450" y="52" textAnchor="middle" fill="#ffffff" fontSize="40" fontWeight="800">1. PENDAPATAN DESA</text>
            <rect x="0" y="100" width="900" height="60" rx="10" fill={colors.primary} fillOpacity="0.1" />
            <text x="40" y="140" fill={colors.primary} fontSize="28" fontWeight="bold">SUMBER PENDAPATAN</text>
            <text x="860" y="140" textAnchor="end" fill={colors.primary} fontSize="28" fontWeight="bold">ANGGARAN (Rp)</text>

            {(() => {
              let localY = 175;
              return state.incomes.map((item, idx) => {
                const y = localY + (idx * 60);
                return (
                  <g key={item.id}>
                    <rect x="0" y={y} width="900" height="60" rx="8" fill={idx % 2 === 0 ? '#ffffff' : colors.bgLight} />
                    <rect x="0" y={y} width="6" height="60" rx="3" fill={colors.primary} fillOpacity="0.5" />
                    <text x="30" y={y + 38} fill={colors.textDark} fontSize="26" fontWeight="600" {...safeTextProps(item.name, 35, "520")}>{item.name}</text>
                    <text x="860" y={y + 38} textAnchor="end" fill={colors.textDark} fontSize="30" fontWeight="800">{formatRupiah(item.amount)}</text>
                    <line x1="20" y1={y+60} x2="880" y2={y+60} stroke={colors.tableBorder} strokeWidth="1" strokeOpacity="0.5"/>
                  </g>
                );
              });
            })()}

            <g transform={`translate(0, ${175 + (state.incomes.length * 60) + 15})`}>
              <rect x="0" y="0" width="900" height="80" rx="15" fill={colors.primary} fillOpacity="0.08" stroke={colors.primary} strokeWidth="2" strokeDasharray="8,8" />
              <text x="30" y="52" fill={colors.primary} fontSize="34" fontWeight="900">JUMLAH PENDAPATAN</text>
              <text x="860" y="52" textAnchor="end" fill={colors.primary} fontSize="40" fontWeight="900">{formatRupiah(derivedData.totalIncome)}</text>
            </g>
          </g>

          {/* PEMBIAYAAN */}
          <g transform={`translate(0, ${175 + (state.incomes.length * 60) + 15 + 80 + 100})`}>
            <rect x="0" y="0" width="900" height="80" rx="20" fill={colors.primary} filter="url(#shadowSm)" />
            <text x="450" y="52" textAnchor="middle" fill="#ffffff" fontSize="40" fontWeight="800">3. PEMBIAYAAN DESA</text>
            <rect x="0" y="100" width="900" height="60" rx="10" fill={colors.primary} fillOpacity="0.1" />
            <text x="40" y="140" fill={colors.primary} fontSize="28" fontWeight="bold">URAIAN PEMBIAYAAN</text>
            <text x="860" y="140" textAnchor="end" fill={colors.primary} fontSize="28" fontWeight="bold">NOMINAL (Rp)</text>

            <rect x="0" y="175" width="900" height="60" rx="8" fill="#ffffff" />
            <rect x="0" y="175" width="6" height="60" rx="3" fill={colors.secondary} fillOpacity="0.8" />
            <text x="30" y="215" fill={colors.textDark} fontSize="28" fontWeight="600">Penerimaan (Silpa Tahun Sebelumnya)</text>
            <text x="860" y="215" textAnchor="end" fill={colors.textDark} fontSize="30" fontWeight="800">{formatRupiah(state.financing.penerimaan)}</text>

            <rect x="0" y="235" width="900" height="60" rx="8" fill={colors.bgLight} />
            <rect x="0" y="235" width="6" height="60" rx="3" fill={colors.secondary} fillOpacity="0.8" />
            <text x="30" y="275" fill={colors.textDark} fontSize="28" fontWeight="600">Pengeluaran (Penyertaan Modal, dll)</text>
            <text x="860" y="275" textAnchor="end" fill={colors.textDark} fontSize="30" fontWeight="800">{formatRupiah(state.financing.pengeluaran)}</text>

            <g transform={`translate(0, 315)`}>
              <rect x="0" y="0" width="900" height="80" rx="15" fill={colors.primary} fillOpacity="0.08" />
              <text x="30" y="52" fill={colors.primary} fontSize="34" fontWeight="900">PEMBIAYAAN NETTO</text>
              <text x="860" y="52" textAnchor="end" fill={colors.primary} fontSize="40" fontWeight="900">{formatRupiah(derivedData.netFinancing)}</text>
            </g>

            {/* SILPA */}
            <g transform={`translate(0, 440)`}>
              <rect x="0" y="0" width="900" height="200" rx="35" fill={colors.secondary} filter="url(#shadowLg)" />
              <path d="M0,0 L200,200 L0,200 Z" fill="#ffffff" fillOpacity="0.1" clipPath="url(#silpaClip)" />
              <text x="450" y="70" textAnchor="middle" fill="#ffffff" fontSize="36" fontWeight="900" letterSpacing="1">SISA LEBIH PEMBIAYAAN ANGGARAN (SILPA)</text>
              <rect x="100" y="100" width="700" height="75" rx="37.5" fill="#ffffff" />
              <text x="450" y="154" textAnchor="middle" fill={colors.secondary} fontSize={derivedData.silpa > 999999999 ? 42 : 52} fontWeight="900" letterSpacing="2">{formatRupiah(derivedData.silpa)}</text>
            </g>
          </g>
        </g>

        {/* KOLOM KANAN */}
        <g transform="translate(40, 0)">
          {/* BELANJA */}
          <g>
            <rect x="0" y="0" width="900" height="80" rx="20" fill={colors.primary} filter="url(#shadowSm)" />
            <text x="450" y="52" textAnchor="middle" fill="#ffffff" fontSize="40" fontWeight="800">2. RENCANA BELANJA DESA</text>
            
            {(() => {
              let localY = 110;
              return state.expenses.map((cat, idx) => {
                const catTotal = derivedData.expenseTotals[cat.id] || 0;
                const block = (
                  <g key={cat.id} transform={`translate(0, ${localY})`}>
                    <path d="M0,25 Q0,0 25,0 L875,0 Q900,0 900,25 L900,60 L0,60 Z" fill={colors.primary} fillOpacity="0.1" />
                    <rect x="0" y="0" width="10" height="60" fill={colors.primary} />
                    <text x="30" y="40" fill={colors.primary} fontSize="30" fontWeight="900" {...safeTextProps(cat.name, 45, "800")}>{cat.name.toUpperCase()}</text>
                    
                    {cat.items.map((item, iIdx) => {
                      const itemY = 65 + (iIdx * 60);
                      return (
                        <g key={item.id}>
                          <rect x="0" y={itemY} width="900" height="60" fill={iIdx % 2 === 0 ? '#ffffff' : colors.bgLight} />
                          <text x="30" y={itemY + 40} fill={colors.textDark} fontSize="26" fontWeight="500" {...safeTextProps(item.name, 40, "520")}>- {item.name}</text>
                          <text x="860" y={itemY + 40} textAnchor="end" fill={colors.textDark} fontSize="28" fontWeight="700">{formatRupiah(item.amount)}</text>
                        </g>
                      );
                    })}
                    
                    <g transform={`translate(0, ${65 + (cat.items.length * 60) + 10})`}>
                       <line x1="0" y1="0" x2="900" y2="0" stroke={colors.tableBorder} strokeWidth="2" strokeDasharray="4,4" />
                       <text x="30" y="34" fill={colors.textMuted} fontSize="24" fontStyle="italic">Subtotal {cat.name.split('.')[0]}</text>
                       <text x="860" y="34" textAnchor="end" fill={colors.primary} fontSize="28" fontWeight="900">{formatRupiah(catTotal)}</text>
                    </g>
                  </g>
                );
                localY += 60 + (cat.items.length * 60) + 60 + 20; 
                return block;
              });
            })()}

            {/* TOTAL BELANJA */}
            <g transform={`translate(0, ${(() => {
              let sy = 110;
              state.expenses.forEach(cat => sy += 60 + (cat.items.length * 60) + 60 + 20);
              return sy + 20;
            })()})`}>
              <rect x="0" y="0" width="900" height="80" rx="20" fill={colors.primary} fillOpacity="0.08" stroke={colors.primary} strokeWidth="3" strokeDasharray="10,10" />
              <text x="30" y="52" fill={colors.primary} fontSize="34" fontWeight="900">JUMLAH BELANJA</text>
              <text x="860" y="52" textAnchor="end" fill={colors.primary} fontSize="40" fontWeight="900">{formatRupiah(derivedData.totalExpense)}</text>
            </g>
          </g>

          {/* VISUALISASI GRAFIK BAR */}
          <g transform={`translate(0, ${(() => {
              let sy = 110;
              state.expenses.forEach(cat => sy += 60 + (cat.items.length * 60) + 60 + 20);
              return sy + 20 + 80 + 80;
            })()})`}>
            
            <rect x="0" y="0" width="900" height={layout.chartHeight} rx="25" fill="#ffffff" filter="url(#shadowSm)" stroke={colors.tableBorder} strokeWidth="1" />
            <path d="M0,25 Q0,0 25,0 L875,0 Q900,0 900,25 L900,70 L0,70 Z" fill={colors.bgLight} />
            <text x="450" y="46" textAnchor="middle" fill={colors.textDark} fontSize="28" fontWeight="900">VISUALISASI PROPORSI ANGGARAN BELANJA</text>
            
            <g transform="translate(40, 110)">
               {(() => {
                 const maxVal = Math.max(1, ...Object.values(derivedData.expenseTotals as Record<string, number>));
                 const barMaxWidth = 380;

                 return state.expenses.map((cat, i) => {
                   const val = derivedData.expenseTotals[cat.id] || 0;
                   const w = (val / maxVal) * barMaxWidth;
                   return (
                     <g key={`bar-${i}`} transform={`translate(0, ${i * 48})`}>
                       <text x="0" y="24" fill={colors.textDark} fontSize="22" fontWeight="600" {...safeTextProps(cat.name, 28, "340")}>{cat.name}</text>
                       <rect x="360" y="4" width={barMaxWidth} height="26" rx="13" fill={colors.bgLight} />
                       <rect x="360" y="4" width={w} height="26" rx="13" fill={colors.primary} />
                       <text x={360 + w + 15} y="24" fill={colors.primary} fontSize="22" fontWeight="800">{(val/1000000).toFixed(1).replace(/\.0$/, '')} Jt</text>
                     </g>
                   );
                 });
               })()}
            </g>
            <text x="450" y={layout.chartHeight - 20} textAnchor="middle" fill={colors.textMuted} fontSize="20" fontStyle="italic">* Grafik dalam jutaan rupiah untuk memudahkan pembacaan</text>
          </g>

        </g>
      </g>

      {/* FOOTER SECTION */}
      <g transform={`translate(0, 2780)`}>
         <line x1="80" y1="0" x2="1920" y2="0" stroke={colors.primary} strokeWidth="4" strokeOpacity="0.2" />
         <rect x="800" y="-20" width="400" height="40" rx="20" fill={colors.primary} fillOpacity="0.1" />
         <text x="1000" y="8" textAnchor="middle" fill={colors.primary} fontSize="22" fontWeight="bold" letterSpacing="2">TRANSPARANSI PUBLIK</text>
         <text x="1000" y="80" textAnchor="middle" fill={colors.textDark} fontSize="44" fontWeight="900" letterSpacing="1">MARI BERSAMA-SAMA MENGAWAL PEMBANGUNAN DESA!</text>
         <text x="1000" y="130" textAnchor="middle" fill={colors.textMuted} fontSize="32" fontStyle="italic">"Banner informasi ini dibuat sebagai wujud nyata pertanggungjawaban Pemerintah Desa {state.identity.villageName}."</text>
      </g>
    </svg>
  );
}));
