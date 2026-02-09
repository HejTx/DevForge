import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { UserPreferences, ProjectData } from './types';
import { generateProject } from './services/geminiService';
import { saveProject, getProjects, deleteProject } from './services/storageService';
import { auth } from './services/firebase';
import { signInWithGoogle, logoutUser } from './services/userService';

import SetupForm from './components/SetupForm';
import ProjectWorkspace from './components/ProjectWorkspace';
import ProjectHistory from './components/ProjectHistory';
import LoginScreen from './components/LoginScreen';
import MathForgeLink from './components/MathForgeLink';

import { Terminal, History, LogOut } from 'lucide-react';

type ViewState = 'setup' | 'workspace' | 'history';

function App() {
  // Auth State
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [loginLoading, setLoginLoading] = useState(false);

  // App State
  const [project, setProject] = useState<ProjectData | null>(null);
  const [view, setView] = useState<ViewState>('setup');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedProjects, setSavedProjects] = useState<ProjectData[]>([]);

  // Listen for auth changes
  useEffect(() => {
    if (!auth) {
      console.warn("Auth service not available");
      setAuthLoading(false);
      return;
    }
    
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Load projects when user logs in
  useEffect(() => {
    const loadProjects = async () => {
      if (user) {
        try {
          const projects = await getProjects();
          setSavedProjects(projects);
        } catch (e) {
          console.error("Failed to load projects", e);
        }
      } else {
        setSavedProjects([]);
      }
    };
    loadProjects();
  }, [user]);

  const handleLogin = async () => {
    setLoginLoading(true);
    try {
      await signInWithGoogle();
    } catch (e) {
      console.error(e);
      setError("Login failed. Please try again.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    setProject(null);
    setView('setup');
  };

  const handleCreateProject = async (prefs: UserPreferences) => {
    setIsLoading(true);
    setError(null);
    try {
      const newProject = await generateProject(prefs);
      // Save to Firestore
      const saved = await saveProject(newProject);
      
      setSavedProjects(prev => [saved, ...prev]);
      setProject(saved);
      setView('workspace');
    } catch (e: any) {
      console.error(e);
      setError("Failed to generate project. Please check your API key and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectProject = (p: ProjectData) => {
    setProject(p);
    setView('workspace');
  };

  const handleDeleteProject = async (id: string) => {
    try {
      await deleteProject(id);
      setSavedProjects(prev => prev.filter(p => p.id !== id));
      if (project?.id === id) {
        setProject(null);
        setView('history');
      }
    } catch (e) {
      console.error("Failed to delete project", e);
      setError("Failed to delete project. Please try again.");
    }
  };

  const navigateHome = () => {
    setProject(null);
    setView('setup');
  };

  const navigateHistory = () => {
    setProject(null);
    setView('history');
  }

  // Loading screen for initial auth check
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium text-sm">Loading DevForge...</p>
        </div>
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return <LoginScreen onLogin={handleLogin} isLoading={loginLoading} />;
  }

  // Main App
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <MathForgeLink />
      
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={navigateHome}>
            <div className="bg-slate-900 p-2 rounded-lg">
              <Terminal className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 hidden sm:block">DevForge</h1>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4">
             {/* Navigation Buttons */}
             <div className="flex bg-slate-100 p-1 rounded-lg">
                <button 
                  onClick={navigateHome}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${view === 'setup' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Create
                </button>
                <button 
                  onClick={navigateHistory}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${view === 'history' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  <History className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">My Projects</span>
                </button>
             </div>

             <div className="h-6 w-px bg-slate-200 mx-1"></div>

             <div className="flex items-center gap-3">
               {user.photoURL && (
                 <img src={user.photoURL} alt="Profile" className="w-8 h-8 rounded-full border border-slate-200" />
               )}
               <button 
                 onClick={handleLogout}
                 className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                 title="Sign Out"
               >
                 <LogOut className="w-5 h-5" />
               </button>
             </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2 animate-fade-up">
            <span className="font-bold">Error:</span> {error}
          </div>
        )}

        {view === 'setup' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="text-center mb-12 max-w-2xl mx-auto">
                <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
                  Stop Watching Tutorials.<br />Start Building.
                </h1>
                <p className="text-lg text-slate-600 mb-8">
                  Generate realistic programming projects with test data and an AI mentor to guide you.
                </p>
             </div>
             <SetupForm onSubmit={handleCreateProject} isLoading={isLoading} />
          </div>
        )}

        {view === 'history' && (
          <ProjectHistory 
            projects={savedProjects}
            onSelectProject={handleSelectProject}
            onDeleteProject={handleDeleteProject}
            onCreateNew={navigateHome}
          />
        )}

        {view === 'workspace' && project && (
          <ProjectWorkspace 
            project={project} 
            onBack={navigateHistory} 
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