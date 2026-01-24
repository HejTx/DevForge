import React from 'react';
import { ProjectData } from '../types';
import { Calendar, Trash2, ArrowRight, Code2, Server } from 'lucide-react';

interface ProjectHistoryProps {
  projects: ProjectData[];
  onSelectProject: (project: ProjectData) => void;
  onDeleteProject: (id: string) => void;
  onCreateNew: () => void;
}

const ProjectHistory: React.FC<ProjectHistoryProps> = ({ projects, onSelectProject, onDeleteProject, onCreateNew }) => {
  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center animate-fade-up">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
          <Code2 className="w-10 h-10 text-slate-400" />
        </div>
        <h3 className="text-2xl font-bold text-slate-900 mb-2">No Projects Yet</h3>
        <p className="text-slate-500 max-w-md mb-8">
          You haven't generated any projects yet. Start your journey by creating your first challenge.
        </p>
        <button
          onClick={onCreateNew}
          className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
        >
          Create First Project
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-up">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Your Projects</h2>
        <button
          onClick={onCreateNew}
          className="px-4 py-2 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors"
        >
          + New Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div 
            key={project.id} 
            className="group relative bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col overflow-hidden"
          >
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex items-start justify-between mb-4">
                <div className="p-2 bg-blue-50 rounded-lg text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Code2 className="w-5 h-5" />
                </div>
                {project.createdAt && (
                  <span className="flex items-center gap-1.5 text-xs font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded-full">
                    <Calendar className="w-3 h-3" />
                    {new Date(project.createdAt).toLocaleDateString()}
                  </span>
                )}
              </div>
              
              <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2 leading-tight">
                {project.title}
              </h3>
              
              <p className="text-slate-500 text-sm mb-4 line-clamp-3 flex-1">
                {project.objective}
              </p>

              {project.techStackRecommendation && (
                <div className="flex items-center gap-2 text-xs text-slate-600 font-medium mb-4 bg-slate-50 p-2 rounded-lg">
                    <Server className="w-3 h-3" />
                    {project.techStackRecommendation.split(' ')[0]} {/* Simple truncation */}
                </div>
              )}
            </div>

            <div className="border-t border-slate-100 p-4 bg-slate-50/50 flex items-center justify-between">
               <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if(project.id) onDeleteProject(project.id);
                  }}
                  className="text-slate-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-colors"
                  title="Delete Project"
               >
                  <Trash2 className="w-4 h-4" />
               </button>

               <button
                  onClick={() => onSelectProject(project)}
                  className="flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
               >
                  Continue <ArrowRight className="w-4 h-4" />
               </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectHistory;