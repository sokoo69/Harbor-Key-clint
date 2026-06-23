import React from 'react';
import { Building2 } from 'lucide-react';

export function PageBanner({ title, subtitle, icon: Icon = Building2 }) {
  return (
    <div className="relative overflow-hidden bg-ink p-8 sm:p-12 text-white border border-arch/20 shadow-sm mb-8">
      {/* Subtle Blueprint Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"></div>
      
      {/* Decorative architectural motif */}
      <div className="absolute right-0 top-0 h-full w-1/3 opacity-[0.03] pointer-events-none hidden sm:block">
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="xMaxYMax slice" fill="none" stroke="currentColor">
          <path d="M0 100V0l100 100H0zm50 0V50l50 50H50z" strokeWidth="0.5"/>
          <path d="M25 100V75l25 25H25zm50 0V75l25 25H75z" strokeWidth="0.5"/>
        </svg>
      </div>

      <div className="relative z-10 flex items-center justify-between">
        <div>
          {subtitle && (
            <p className="font-mono text-xs font-bold uppercase tracking-widest text-blueprint mb-3">
              {subtitle}
            </p>
          )}
          <h1 className="text-3xl sm:text-4xl font-bold font-display tracking-tight text-white">
            {title}
          </h1>
        </div>
        <div className="hidden sm:flex items-center justify-center h-16 w-16 border border-arch/20 bg-white/5 text-blueprint">
          <Icon className="h-8 w-8" />
        </div>
      </div>
    </div>
  );
}
