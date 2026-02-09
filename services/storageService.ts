import { db, auth } from "./firebase";
import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  deleteDoc, 
  query, 
  where
} from "firebase/firestore";
import { ProjectData } from "../types";

const COLLECTION = 'projects';

export const saveProject = async (project: ProjectData): Promise<ProjectData> => {
  if (!db || !auth?.currentUser) throw new Error("Database not initialized or user not logged in");
  
  const userId = auth.currentUser.uid;
  // Use existing ID or generate a new one
  const projectId = project.id || doc(collection(db, COLLECTION)).id;
  
  const projectData: ProjectData = {
    ...project,
    id: projectId,
    userId,
    createdAt: project.createdAt || Date.now()
  };

  await setDoc(doc(db, COLLECTION, projectId), projectData);
  return projectData;
};

export const getProjects = async (): Promise<ProjectData[]> => {
  if (!db || !auth?.currentUser) return [];

  try {
    // We fetch by userId and sort in memory to avoid needing a composite index immediately
    const q = query(
      collection(db, COLLECTION),
      where("userId", "==", auth.currentUser.uid)
    );
    
    const snapshot = await getDocs(q);
    const projects = snapshot.docs.map(d => d.data() as ProjectData);
    
    // Sort by createdAt descending
    return projects.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
};

export const deleteProject = async (id: string): Promise<void> => {
  if (!db || !auth?.currentUser) return;
  await deleteDoc(doc(db, COLLECTION, id));
};