import React from 'react';
import { Sigma } from 'lucide-react';

const MathForgeLink = () => (
  <a 
    href="https://mathforgelearn.vercel.app/" 
    target="_blank" 
    rel="noopener noreferrer"
    className="fixed bottom-6 right-6 z-50 group flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-2 pr-5 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
  >
    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-amber-600 to-amber-700 text-white shadow-lg group-hover:scale-110 transition-transform">
      <Sigma className="h-5 w-5" />
    </div>
    <div className="flex flex-col">
      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Try Also</span>
      <span className="text-sm font-bold text-slate-950 group-hover:text-amber-700 transition-colors">MathForge</span>
    </div>
  </a>
);

export default MathForgeLink;