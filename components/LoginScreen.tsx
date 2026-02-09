import React from 'react';
import { Terminal, Code2, Sparkles, LogIn } from 'lucide-react';

interface LoginScreenProps {
  onLogin: () => void;
  isLoading: boolean;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, isLoading }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-200/30 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-200/30 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-md w-full bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8 text-center animate-fade-up">
        <div className="w-20 h-20 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-slate-200">
          <Terminal className="w-10 h-10 text-white" />
        </div>

        <h1 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">DevForge</h1>
        <p className="text-slate-500 mb-8 font-medium">Build real projects. Master code.</p>

        <div className="space-y-4 mb-8 text-left">
           <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                <Code2 className="w-5 h-5" />
              </div>
              <div className="text-sm">
                <p className="font-bold text-slate-800">Generate Projects</p>
                <p className="text-slate-500 text-xs">Custom tailored specs & tests</p>
              </div>
           </div>
           <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="text-sm">
                <p className="font-bold text-slate-800">AI Mentorship</p>
                <p className="text-slate-500 text-xs">Guidance without the answers</p>
              </div>
           </div>
        </div>

        <button
          onClick={onLogin}
          disabled={isLoading}
          className="w-full py-4 px-6 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-lg transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <LogIn className="w-5 h-5" />
              <span>Sign in with Google</span>
            </>
          )}
        </button>
        
        <p className="mt-6 text-xs text-slate-400">
          By signing in, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
};

export default LoginScreen;