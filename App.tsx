import React, { useState } from 'react';
import { UserPreferences, ProjectData } from './types';
import { generateProject } from './services/geminiService';
import SetupForm from './components/SetupForm';
import ProjectWorkspace from './components/ProjectWorkspace';
import { Terminal } from 'lucide-react';

function App() {
  const [project, setProject] = useState<ProjectData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateProject = async (prefs: UserPreferences) => {
    setIsLoading(true);
    setError(null);
    try {
      const newProject = await generateProject(prefs);
      setProject(newProject);
    } catch (e: any) {
      console.error(e);
      setError("Failed to generate project. Please check your API key and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-slate-900 p-2 rounded-lg">
              <Terminal className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">DevForge</h1>
          </div>
          <div className="text-sm text-slate-500 font-medium">
             Project-Based Learning
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
            <span className="font-bold">Error:</span> {error}
          </div>
        )}

        {!project ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="text-center mb-12 max-w-2xl mx-auto">
                <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
                  Stop Watching Tutorials.<br />Start Building.
                </h1>
                <p className="text-lg text-slate-600">
                  Generate realistic programming projects with test data and an AI mentor to guide you when you get stuck.
                </p>
             </div>
             <SetupForm onSubmit={handleCreateProject} isLoading={isLoading} />
          </div>
        ) : (
          <ProjectWorkspace 
            project={project} 
            onBack={() => setProject(null)} 
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white mt-auto py-8">
         <div className="max-w-7xl mx-auto px-4 text-center text-slate-400 text-sm">
            <p>&copy; {new Date().getFullYear()} DevForge. Powered by Google Gemini.</p>
         </div>
      </footer>
    </div>
  );
}

export default App;
