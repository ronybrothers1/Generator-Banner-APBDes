import React from 'react';

export const Label = ({ children, className = '' }: {children: React.ReactNode, className?: string}) => (
  <label className={`block text-xs md:text-sm font-medium text-slate-700 mb-1 ${className}`}>{children}</label>
);
