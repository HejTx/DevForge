import React from 'react';
import { Check, X, Sparkles, ShieldCheck, Code2, Zap } from 'lucide-react';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
}

const PremiumModal: React.FC<PremiumModalProps> = ({ isOpen, onClose, onUpgrade }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-scale-in">
        <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Free Tier */}
            <div className="p-8 md:p-12 bg-slate-50 border-r border-slate-100 flex flex-col">
                <h3 className="text-xl font-bold text-slate-900 mb-2">Hobbyist</h3>
                <div className="text-3xl font-bold text-slate-400 mb-6">$0 <span className="text-sm font-medium">/ forever</span></div>
                
                <ul className="space-y-4 mb-8 flex-1">
                    <li className="flex items-center gap-3 text-slate-600">
                        <Check className="w-5 h-5 text-slate-400" />
                        <span>Unlimited Project Generation</span>
                    </li>
                    <li className="flex items-center gap-3 text-slate-600">
                        <Check className="w-5 h-5 text-slate-400" />
                        <span>Basic Test Cases</span>
                    </li>
                    <li className="flex items-center gap-3 text-slate-600">
                        <Check className="w-5 h-5 text-slate-400" />
                        <span>AI Mentor Chat</span>
                    </li>
                    <li className="flex items-center gap-3 text-slate-400">
                        <X className="w-5 h-5" />
                        <span>Automated Code Review</span>
                    </li>
                    <li className="flex items-center gap-3 text-slate-400">
                        <X className="w-5 h-5" />
                        <span>Reference Solutions</span>
                    </li>
                </ul>

                <button 
                    onClick={onClose}
                    className="w-full py-3 px-4 rounded-xl border-2 border-slate-200 text-slate-600 font-bold hover:bg-slate-100 transition-colors"
                >
                    Continue Free
                </button>
            </div>

            {/* Pro Tier */}
            <div className="p-8 md:p-12 bg-slate-900 text-white flex flex-col relative overflow-hidden">
                <div className="absolute top-0 right-0 p-32 bg-indigo-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 p-32 bg-blue-600/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
                
                <div className="relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-4">
                        <Sparkles className="w-3 h-3" /> Recommended
                    </div>
                    <h3 className="text-xl font-bold mb-2">DevForge Pro</h3>
                    <div className="text-4xl font-bold mb-6">$12 <span className="text-sm font-medium opacity-60">/ month</span></div>
                    
                    <ul className="space-y-4 mb-8 flex-1">
                        <li className="flex items-center gap-3">
                            <div className="p-1 rounded bg-green-500/20 text-green-400"><Check className="w-4 h-4" /></div>
                            <span className="font-medium">Everything in Hobbyist</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <div className="p-1 rounded bg-indigo-500/20 text-indigo-400"><ShieldCheck className="w-4 h-4" /></div>
                            <span>AI Code Audits & Grading</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <div className="p-1 rounded bg-indigo-500/20 text-indigo-400"><Code2 className="w-4 h-4" /></div>
                            <span>Unlock Reference Solutions</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <div className="p-1 rounded bg-indigo-500/20 text-indigo-400"><Zap className="w-4 h-4" /></div>
                            <span>Priority Support</span>
                        </li>
                    </ul>

                    <button 
                        onClick={onUpgrade}
                        className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-400 hover:to-blue-500 text-white font-bold shadow-lg shadow-indigo-900/50 transition-all hover:scale-[1.02] active:scale-100"
                    >
                        Upgrade to Pro
                    </button>
                    <p className="text-center text-xs text-slate-500 mt-4">7-day money-back guarantee. Cancel anytime.</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumModal;