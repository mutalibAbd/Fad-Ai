'use client';

import { ReactNode } from 'react';

interface SoftCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export default function SoftCard({ 
  children, 
  className = '', 
  hover = true 
}: SoftCardProps) {
  const baseClasses = 'rounded-2xl bg-white border border-slate-100 shadow-sm';
  
  const hoverClasses = hover
    ? 'hover:shadow-md hover:-translate-y-1 transition-all duration-300'
    : '';

  return (
    <div className={`${baseClasses} ${hoverClasses} ${className}`}>
      {children}
    </div>
  );
}
