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
  const baseClasses = 'rounded-2xl bg-card border border-card-border shadow-sm dark:shadow-none';

  const hoverClasses = hover
    ? 'hover:shadow-md hover:-translate-y-1 dark:hover:shadow-[0_0_20px_rgba(43,89,255,0.1)] dark:hover:border-primary/30 transition-all duration-300'
    : '';

  return (
    <div className={`${baseClasses} ${hoverClasses} ${className}`}>
      {children}
    </div>
  );
}
