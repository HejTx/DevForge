import React, { useState } from 'react';
import { ProjectData } from '../types';
import MentorChat from './MentorChat';
import TestCaseViewer from './TestCaseViewer';
import CodeReviewer from './CodeReviewer';
import { generateReferenceSolution } from '../services/geminiService';
import { ArrowLeft, BookOpen, ListChecks, Server, ArrowRightLeft, AlertTriangle, Code2, ShieldCheck, Eye } from 'lucide-react';

interface ProjectWorkspaceProps {
  project: ProjectData;
  onBack: () => void;
}

const ProjectWorkspace: React.FC<ProjectWorkspaceProps> = ({ project, onBack }) => {
  const [activeTab, setActiveTab] = useState<'spec' | 'tests' | 'review' | 'solution'>('spec');
  const [solution, setSolution] = useState<string | null>(null);
  const [solutionLoading, setSolutionLoading] = useState(false);

  const handleRevealSolution = async () => {
    if (solution) return;
    
    setSolutionLoading(true);
    try {
        const sol = await generateReferenceSolution(project);
        setSolution(sol);
    } catch (e) {
        console.error(e);
    } finally {
        setSolutionLoading(false);
    }
  };

  return (
    <div className="animate-fade-up">
      <div className="flex items-center justify-between mb-6">
        <button
            onClick={onBack}
            className="group flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
        >
            <div className="p-1 rounded-full bg-white border border-slate-200 group-hover:border-slate-400 transition-colors">
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            </div>
            Back to Setup
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Content */}
        <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                <h1 className="text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">{project.title}</h1>
                <p className="text-lg text-slate-600 leading-relaxed">{project.objective}</p>
                {project.techStackRecommendation && (
                  <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold uppercase tracking-wide border border-slate-200">
                    <Server className="w-3.5 h-3.5" />
                    Recommended: {project.techStackRecommendation}
                  </div>
                )}
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 p-1 bg-slate-100/80 rounded-xl overflow-x-auto">
                <button 
                    onClick={() => setActiveTab('spec')}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeTab === 'spec' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    <BookOpen className="w-4 h-4" /> Spec
                </button>
                <button 
                    onClick={() => setActiveTab('tests')}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeTab === 'tests' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    <ListChecks className="w-4 h-4" /> Tests
                </button>
                <button 
                    onClick={() => setActiveTab('review')}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeTab === 'review' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-indigo-600'}`}
                >
                    <ShieldCheck className="w-4 h-4" />
                    Code Review
                </button>
                <button 
                    onClick={() => setActiveTab('solution')}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeTab === 'solution' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500 hover:text-indigo-600'}`}
                >
                    <Code2 className="w-4 h-4" />
                    Solution
                </button>
            </div>

            {/* Tab Content */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 min-h-[500px] p-8">
                {activeTab === 'spec' && (
                    <div className="space-y-10 animate-fade-up">
                        <section>
                            <h3 className="text-lg font-bold text-slate-800 mb-4">Description</h3>
                            <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed whitespace-pre-wrap bg-slate-50/50 p-6 rounded-xl border border-slate-100">
                                {project.description}
                            </div>
                        </section>

                        <section>
                            <h3 className="text-lg font-bold text-slate-800 mb-4">Functional Requirements</h3>
                            <ul className="space-y-3">
                                {project.functionalRequirements.map((req, i) => (
                                    <li key={i} className="group flex items-start gap-4 p-3 rounded-xl bg-white border border-slate-100 shadow-sm hover:border-blue-100 transition-all">
                                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-bold mt-0.5">
                                            {i + 1}
                                        </span>
                                        <span className="text-slate-700 leading-relaxed">{req}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-6">
                                <h4 className="flex items-center gap-2 font-bold text-amber-800 mb-3">
                                    <AlertTriangle className="w-4 h-4" /> Edge Cases
                                </h4>
                                <ul className="space-y-2">
                                    {project.edgeCases.map((ec, i) => (
                                        <li key={i} className="flex items-start gap-2 text-slate-700 text-sm">
                                            <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 flex-shrink-0"></div>
                                            <span>{ec}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                             <div className="bg-purple-50/50 border border-purple-100 rounded-xl p-6">
                                <h4 className="flex items-center gap-2 font-bold text-purple-800 mb-3">
                                    <ArrowRightLeft className="w-4 h-4" /> I/O Constraints
                                </h4>
                                <div className="space-y-3">
                                    <div className="text-sm">
                                        <span className="font-semibold text-purple-700">Input:</span> 
                                        <p className="text-slate-600 font-mono text-xs mt-1">{project.inputFormat}</p>
                                    </div>
                                    <div className="text-sm">
                                        <span className="font-semibold text-purple-700">Output:</span> 
                                        <p className="text-slate-600 font-mono text-xs mt-1">{project.outputFormat}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'tests' && (
                    <div className="animate-fade-up">
                        <TestCaseViewer testCases={project.testCases} />
                    </div>
                )}

                {activeTab === 'review' && (
                    <CodeReviewer project={project} />
                )}

                {activeTab === 'solution' && (
                    <div className="animate-fade-up">
                        {!solution ? (
                            <div className="flex flex-col items-center justify-center py-16 text-center">
                                <div className="p-4 bg-indigo-50 rounded-full mb-4">
                                    <Code2 className="w-8 h-8 text-indigo-500" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">Reference Solution</h3>
                                <p className="text-slate-500 max-w-md mb-8">Generate a production-grade solution to verify your approach.</p>
                                <button 
                                    onClick={handleRevealSolution}
                                    disabled={solutionLoading}
                                    className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-indigo-100 text-indigo-700 font-bold rounded-xl hover:bg-indigo-50 transition-colors"
                                >
                                    {solutionLoading ? (
                                        <>Generating...</>
                                    ) : (
                                        <>
                                            <Eye className="w-4 h-4" /> Reveal Solution
                                        </>
                                    )}
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <h3 className="text-lg font-bold text-slate-800">Reference Implementation</h3>
                                <div className="bg-slate-900 rounded-xl p-6 overflow-x-auto shadow-inner">
                                    <pre className="text-sm font-mono text-indigo-100">
                                        {solution}
                                    </pre>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>

        {/* Right Column: Mentor */}
        <div className="lg:col-span-1 animate-slide-in-right stagger-3">
            <div className="sticky top-6">
                <MentorChat project={project} />
            </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectWorkspace;