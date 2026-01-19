import React, { useState } from 'react';
import { Difficulty, UserPreferences } from '../types';
import { Loader2, Code2, Sparkles, Plus } from 'lucide-react';

interface SetupFormProps {
  onSubmit: (prefs: UserPreferences) => void;
  isLoading: boolean;
}

const LANGUAGES = ['Python', 'JavaScript', 'TypeScript', 'Java', 'C++', 'Go', 'Rust', 'Ruby'];
const POPULAR_CONCEPTS = ['Recursion', 'File I/O', 'REST API', 'Sorting Algorithms', 'Data Structures', 'Dynamic Programming', 'Concurrency', 'OOP'];

const SetupForm: React.FC<SetupFormProps> = ({ onSubmit, isLoading }) => {
  const [level, setLevel] = useState<Difficulty>(Difficulty.Beginner);
  const [language, setLanguage] = useState(LANGUAGES[0]);
  const [selectedConcepts, setSelectedConcepts] = useState<string[]>([]);
  const [customConcept, setCustomConcept] = useState('');

  const toggleConcept = (concept: string) => {
    if (selectedConcepts.includes(concept)) {
      setSelectedConcepts(selectedConcepts.filter(c => c !== concept));
    } else {
      setSelectedConcepts([...selectedConcepts, concept]);
    }
  };

  const handleCustomConceptAdd = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && customConcept.trim()) {
      e.preventDefault();
      if (!selectedConcepts.includes(customConcept.trim())) {
        setSelectedConcepts([...selectedConcepts, customConcept.trim()]);
      }
      setCustomConcept('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ level, language, concepts: selectedConcepts });
  };

  return (
    <div className="max-w-2xl mx-auto bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-8 animate-fade-up">
      <div className="mb-8 text-center">
        <div className="w-16 h-16 bg-gradient-to-tr from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm ring-4 ring-white">
          <Code2 className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Start Your Project</h2>
        <p className="text-slate-500 mt-2 text-sm font-medium">Configure your learning path and we'll generate a custom challenge.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Experience Level */}
        <div className="animate-fade-up stagger-1">
          <label className="block text-sm font-semibold text-slate-700 mb-3">Experience Level</label>
          <div className="grid grid-cols-3 gap-3">
            {Object.values(Difficulty).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setLevel(d)}
                className={`relative py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
                  level === d
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-200 ring-2 ring-blue-600 ring-offset-2'
                    : 'bg-white border border-slate-200 text-slate-600 hover:border-blue-300 hover:bg-blue-50/50'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Language Selection */}
        <div className="animate-fade-up stagger-2">
          <label className="block text-sm font-semibold text-slate-700 mb-3">Programming Language</label>
          <div className="relative">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full appearance-none rounded-xl border-slate-200 bg-slate-50 text-slate-700 font-medium focus:ring-2 focus:ring-blue-500 focus:border-transparent py-3 px-4 border shadow-sm transition-all hover:bg-white hover:border-blue-300 cursor-pointer"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
        </div>

        {/* Concepts */}
        <div className="animate-fade-up stagger-3">
          <label className="block text-sm font-semibold text-slate-700 mb-3">Target Concepts <span className="text-slate-400 font-normal">(Optional)</span></label>
          <div className="flex flex-wrap gap-2 mb-4">
            {POPULAR_CONCEPTS.map((concept) => (
              <button
                key={concept}
                type="button"
                onClick={() => toggleConcept(concept)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 border ${
                  selectedConcepts.includes(concept)
                    ? 'bg-blue-100 text-blue-700 border-blue-200 shadow-sm scale-105'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-600 hover:bg-slate-50'
                }`}
              >
                {concept}
              </button>
            ))}
          </div>
          <div className="relative group">
            <input
              type="text"
              value={customConcept}
              onChange={(e) => setCustomConcept(e.target.value)}
              onKeyDown={handleCustomConceptAdd}
              placeholder="Type custom concept and hit Enter..."
              className="w-full rounded-xl border-slate-200 bg-white text-slate-700 focus:ring-2 focus:ring-blue-500 py-3 px-4 pl-10 border shadow-sm text-sm transition-all group-hover:border-blue-300"
            />
            <Plus className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            {customConcept && (
              <button 
                type="button"
                onClick={() => {
                   if(customConcept.trim()) {
                      toggleConcept(customConcept.trim());
                      setCustomConcept('');
                   }
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs bg-slate-800 hover:bg-slate-900 text-white px-3 py-1.5 rounded-lg transition-colors animate-scale-in"
              >
                Add
              </button>
            )}
          </div>
          
          {selectedConcepts.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-xs font-bold text-slate-400 py-1.5 uppercase tracking-wider mr-1">Selected:</span>
              {selectedConcepts.map(c => (
                <span key={c} className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-white text-blue-700 border border-blue-100 shadow-sm animate-scale-in">
                  {c}
                  <button
                    type="button"
                    onClick={() => toggleConcept(c)}
                    className="ml-1.5 text-blue-300 hover:text-red-500 transition-colors"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full group bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-blue-200 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="animate-pulse">Crafting Project...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
              Generate Project
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default SetupForm;