import React from 'react';

export const Input = ({ className = '', ...props }: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input className={`w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all outline-none text-sm md:text-base disabled:bg-slate-100 disabled:text-slate-500 ${className}`} {...props} />
);
