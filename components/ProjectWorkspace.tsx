import React from 'react';
import { ProjectData } from '../types';
import MentorChat from './MentorChat';
import TestCaseViewer from './TestCaseViewer';
import { ArrowLeft, BookOpen, Target, ListChecks, Server, ArrowRightLeft, AlertTriangle } from 'lucide-react';

interface ProjectWorkspaceProps {
  project: ProjectData;
  onBack: () => void;
}

const ProjectWorkspace: React.FC<ProjectWorkspaceProps> = ({ project, onBack }) => {
  return (
    <div className="animate-fade-up">
      <button
        onClick={onBack}
        className="group mb-6 flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
      >
        <div className="p-1 rounded-full bg-white border border-slate-200 group-hover:border-slate-400 transition-colors">
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
        </div>
        Back to Setup
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Project Spec */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 animate-fade-up stagger-1">
            <div className="border-b border-slate-100 pb-6 mb-6">
                <h1 className="text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">{project.title}</h1>
                <p className="text-lg text-slate-600 leading-relaxed">{project.objective}</p>
                {project.techStackRecommendation && (
                  <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold uppercase tracking-wide border border-slate-200">
                    <Server className="w-3.5 h-3.5" />
                    Recommended: {project.techStackRecommendation}
                  </div>
                )}
            </div>

            <div className="space-y-10">
                <section className="animate-fade-up stagger-2">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2.5">
                        <div className="p-1.5 bg-blue-100 rounded-lg text-blue-600">
                            <BookOpen className="w-5 h-5" />
                        </div>
                        Description
                    </h3>
                    <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed whitespace-pre-wrap bg-slate-50/50 p-6 rounded-xl border border-slate-100">
                        {project.description}
                    </div>
                </section>

                <section className="animate-fade-up stagger-3">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2.5">
                        <div className="p-1.5 bg-purple-100 rounded-lg text-purple-600">
                            <ArrowRightLeft className="w-5 h-5" />
                        </div>
                        I/O Format
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 hover:border-purple-200 transition-colors">
                            <h4 className="text-xs font-bold text-slate-500 mb-3 uppercase tracking-wider flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                                Input Specification
                            </h4>
                            <p className="text-sm text-slate-700 font-mono whitespace-pre-wrap leading-relaxed">{project.inputFormat}</p>
                        </div>
                        <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 hover:border-purple-200 transition-colors">
                            <h4 className="text-xs font-bold text-slate-500 mb-3 uppercase tracking-wider flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-purple-600"></span>
                                Output Specification
                            </h4>
                            <p className="text-sm text-slate-700 font-mono whitespace-pre-wrap leading-relaxed">{project.outputFormat}</p>
                        </div>
                    </div>
                </section>

                <section className="animate-fade-up stagger-4">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2.5">
                         <div className="p-1.5 bg-amber-100 rounded-lg text-amber-600">
                            <AlertTriangle className="w-5 h-5" />
                        </div>
                        Edge Cases
                    </h3>
                    <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-6">
                        <ul className="grid grid-cols-1 gap-3">
                            {project.edgeCases.map((ec, i) => (
                                <li key={i} className="flex items-start gap-3 text-slate-700 text-sm">
                                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 flex-shrink-0"></div>
                                    <span>{ec}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>

                <section className="animate-fade-up stagger-5">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2.5">
                         <div className="p-1.5 bg-red-100 rounded-lg text-red-600">
                            <Target className="w-5 h-5" />
                        </div>
                        Functional Requirements
                    </h3>
                    <ul className="space-y-3">
                        {project.functionalRequirements.map((req, i) => (
                            <li key={i} className="group flex items-start gap-4 p-3 rounded-xl bg-white border border-slate-100 shadow-sm hover:border-red-100 hover:shadow-md transition-all">
                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-red-50 text-red-600 flex items-center justify-center text-xs font-bold mt-0.5 group-hover:bg-red-600 group-hover:text-white transition-colors">
                                    {i + 1}
                                </span>
                                <span className="text-slate-700 leading-relaxed">{req}</span>
                            </li>
                        ))}
                    </ul>
                </section>

                {project.nonFunctionalRequirements && project.nonFunctionalRequirements.length > 0 && (
                    <section className="animate-fade-up stagger-5">
                        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2.5">
                            <div className="p-1.5 bg-teal-100 rounded-lg text-teal-600">
                                <ListChecks className="w-5 h-5" />
                            </div>
                            Constraints & Goals
                        </h3>
                        <ul className="list-disc pl-5 space-y-2 text-slate-600 marker:text-teal-500">
                            {project.nonFunctionalRequirements.map((req, i) => (
                                <li key={i} className="pl-2">{req}</li>
                            ))}
                        </ul>
                    </section>
                )}
            </div>
          </div>

          <div className="animate-fade-up stagger-5">
              <TestCaseViewer testCases={project.testCases} />
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