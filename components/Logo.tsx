import React from 'react';
import Link from 'next/link';
import { Box } from 'lucide-react';

interface LogoProps {
  variant?: 'light' | 'dark';
  className?: string;
  href?: string;
}

export default function Logo({ variant = 'light', className = '', href = '/' }: LogoProps) {
  const content = (
    <div className={`flex items-center gap-2.5 font-bold tracking-tight text-xl ${className}`}>
      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-600 to-brand-700 flex items-center justify-center text-white shadow-sm shadow-brand-500/30">
        <Box className="w-5 h-5" />
      </div>
      <span className={variant === 'dark' ? 'text-white' : 'text-slate-900'}>
        StockSync
      </span>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-block transition-opacity hover:opacity-90">
        {content}
      </Link>
    );
  }

  return content;
}
