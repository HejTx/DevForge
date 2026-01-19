import React, { useState } from 'react';
import { TestCase } from '../types';
import { Download, CheckCircle2, Code } from 'lucide-react';

interface TestCaseViewerProps {
  testCases: TestCase[];
}

const TestCaseViewer: React.FC<TestCaseViewerProps> = ({ testCases }) => {
  const [activeTab, setActiveTab] = useState(0);

  const handleDownload = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <h3 className="font-bold text-slate-800 flex items-center gap-2">
          <div className="p-1 bg-green-100 rounded text-green-600">
             <CheckCircle2 className="w-4 h-4" />
          </div>
          Test Suite
        </h3>
        <button
          onClick={() => {
            testCases.forEach((tc, i) => {
               handleDownload(`test_${i+1}_input.txt`, tc.input);
               handleDownload(`test_${i+1}_expected.txt`, tc.expectedOutput);
            });
          }}
          className="text-xs flex items-center gap-1.5 text-slate-600 hover:text-blue-700 font-semibold px-3 py-1.5 rounded-lg hover:bg-blue-50 border border-slate-200 hover:border-blue-100 transition-all active:scale-95"
        >
          <Download className="w-3.5 h-3.5" />
          Download All
        </button>
      </div>

      <div className="flex border-b border-slate-100 overflow-x-auto scrollbar-hide">
        {testCases.map((tc, idx) => (
          <button
            key={idx}
            onClick={() => setActiveTab(idx)}
            className={`px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-all ${
              activeTab === idx
                ? 'border-blue-500 text-blue-700 bg-blue-50/30'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
            }`}
          >
            {tc.name || `Case #${idx + 1}`}
          </button>
        ))}
      </div>

      <div className="p-6">
        <div key={activeTab} className="animate-fade-up">
            <div className="mb-6">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Scenario</p>
            <p className="text-sm text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-100 leading-relaxed shadow-sm">
                {testCases[activeTab].explanation}
            </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 group">
                <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Code className="w-3.5 h-3.5" /> Input
                </span>
                <button
                    onClick={() => handleDownload(`test_${activeTab + 1}_input.txt`, testCases[activeTab].input)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-xs text-blue-600 hover:underline flex items-center gap-1"
                >
                    <Download className="w-3 h-3" /> .txt
                </button>
                </div>
                <div className="relative">
                    <pre className="bg-slate-900 text-slate-100 p-4 rounded-xl text-sm font-mono overflow-auto max-h-56 whitespace-pre-wrap shadow-inner border border-slate-800 custom-scrollbar">
                    {testCases[activeTab].input}
                    </pre>
                    <div className="absolute top-0 right-0 p-2 text-[10px] text-slate-500 font-mono">stdin</div>
                </div>
            </div>

            <div className="space-y-2 group">
                <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Code className="w-3.5 h-3.5" /> Expected Output
                </span>
                <button
                    onClick={() => handleDownload(`test_${activeTab + 1}_expected.txt`, testCases[activeTab].expectedOutput)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-xs text-blue-600 hover:underline flex items-center gap-1"
                >
                    <Download className="w-3 h-3" /> .txt
                </button>
                </div>
                <div className="relative">
                    <pre className="bg-slate-900 text-slate-100 p-4 rounded-xl text-sm font-mono overflow-auto max-h-56 whitespace-pre-wrap shadow-inner border border-slate-800 custom-scrollbar">
                    {testCases[activeTab].expectedOutput}
                    </pre>
                    <div className="absolute top-0 right-0 p-2 text-[10px] text-slate-500 font-mono">stdout</div>
                </div>
            </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default TestCaseViewer;