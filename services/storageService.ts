import { ProjectData } from "../types";

const STORAGE_KEY = 'devforge_projects';

export const saveProject = (project: ProjectData): ProjectData => {
  const projects = getProjects();
  
  // Prepare project with ID and Timestamp if missing
  const projectToSave: ProjectData = {
    ...project,
    id: project.id || crypto.randomUUID(),
    createdAt: project.createdAt || Date.now(),
  };

  // Check if it already exists to update it, otherwise add to front
  const existingIndex = projects.findIndex(p => p.id === projectToSave.id);
  
  let newProjects;
  if (existingIndex >= 0) {
    newProjects = [...projects];
    newProjects[existingIndex] = projectToSave;
  } else {
    newProjects = [projectToSave, ...projects];
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(newProjects));
  return projectToSave;
};

export const getProjects = (): ProjectData[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error("Failed to load projects", e);
    return [];
  }
};

export const deleteProject = (id: string): ProjectData[] => {
  const projects = getProjects();
  const filtered = projects.filter(p => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  return filtered;
};