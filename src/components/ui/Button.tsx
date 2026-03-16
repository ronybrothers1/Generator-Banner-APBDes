import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyle = "inline-flex items-center justify-center px-4 py-2 font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-teal-600 hover:bg-teal-700 text-white focus:ring-teal-500 shadow-sm",
    secondary: "bg-slate-100 hover:bg-slate-200 text-slate-700 focus:ring-slate-500 border border-slate-200",
    danger: "bg-red-50 hover:bg-red-100 text-red-600 focus:ring-red-500",
    outline: "border border-slate-300 hover:bg-slate-50 text-slate-700 focus:ring-slate-500"
  };
  return <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>{children}</button>;
};
