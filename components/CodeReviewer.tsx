import React, { useState } from 'react';
import { ProjectData, CodeReviewResult } from '../types';
import { generateCodeReview } from '../services/geminiService';
import { Loader2, ShieldAlert, CheckCircle, Bug, FileCode } from 'lucide-react';

interface CodeReviewerProps {
  project: ProjectData;
}

const CodeReviewer: React.FC<CodeReviewerProps> = ({ project }) => {
  const [code, setCode] = useState('');
  const [result, setResult] = useState<CodeReviewResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleReview = async () => {
    if (!code.trim()) return;
    setLoading(true);
    try {
      const review = await generateCodeReview(project, code);
      setResult(review);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {!result ? (
        <div className="animate-fade-up">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Paste your solution code here for AI analysis
          </label>
          <div className="relative">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-64 p-4 rounded-xl bg-slate-900 text-slate-200 font-mono text-sm border border-slate-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
              placeholder="// Paste your solution code here..."
            />
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleReview}
              disabled={loading || !code.trim()}
              className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-sm"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldAlert className="w-4 h-4" />}
              {loading ? 'Analyzing Code...' : 'Run Security & Quality Audit'}
            </button>
          </div>
        </div>
      ) : (
        <div className="animate-fade-up space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
             <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-900">Audit Results</h3>
                <div className={`px-4 py-2 rounded-lg font-bold text-lg ${
                    result.score >= 90 ? 'bg-green-100 text-green-700' :
                    result.score >= 70 ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                }`}>
                    Score: {result.score}/100
                </div>
             </div>
             
             <p className="text-slate-600 mb-6 border-l-4 border-indigo-500 pl-4 py-1 bg-indigo-50/50 rounded-r-lg">
                {result.summary}
             </p>

             <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <h4 className="flex items-center gap-2 font-semibold text-green-700 mb-3">
                        <CheckCircle className="w-4 h-4" /> Strengths
                    </h4>
                    <ul className="space-y-2">
                        {result.strengths.map((s, i) => (
                            <li key={i} className="text-sm text-slate-600 bg-green-50 px-3 py-2 rounded-lg border border-green-100">{s}</li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h4 className="flex items-center gap-2 font-semibold text-amber-700 mb-3">
                        <Bug className="w-4 h-4" /> Areas for Improvement
                    </h4>
                    <ul className="space-y-2">
                        {result.weaknesses.map((w, i) => (
                            <li key={i} className="text-sm text-slate-600 bg-amber-50 px-3 py-2 rounded-lg border border-amber-100">{w}</li>
                        ))}
                    </ul>
                </div>
             </div>
             
             {result.securityConcerns.length > 0 && (
                 <div className="mt-6">
                    <h4 className="flex items-center gap-2 font-semibold text-red-700 mb-3">
                        <ShieldAlert className="w-4 h-4" /> Security Concerns
                    </h4>
                    <ul className="space-y-2">
                        {result.securityConcerns.map((s, i) => (
                            <li key={i} className="text-sm text-red-700 bg-red-50 px-3 py-2 rounded-lg border border-red-100">{s}</li>
                        ))}
                    </ul>
                 </div>
             )}
          </div>

          <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 shadow-sm overflow-hidden">
             <h4 className="flex items-center gap-2 font-semibold text-slate-200 mb-4">
                <FileCode className="w-4 h-4" /> Suggested Refactoring
             </h4>
             <pre className="text-sm font-mono text-indigo-300 overflow-x-auto whitespace-pre-wrap">
                {result.refactoredSnippet}
             </pre>
          </div>

          <div className="flex justify-end">
             <button 
                onClick={() => setResult(null)}
                className="text-slate-500 hover:text-slate-700 text-sm font-medium"
             >
                Submit New Revision
             </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CodeReviewer;