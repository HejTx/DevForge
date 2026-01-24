export enum Difficulty {
  Beginner = 'Beginner',
  Intermediate = 'Intermediate',
  Advanced = 'Advanced',
}

export interface TestCase {
  name: string;
  input: string;
  expectedOutput: string;
  explanation: string;
}

export interface ProjectData {
  id?: string;
  createdAt?: number;
  title: string;
  description: string;
  objective: string;
  inputFormat: string;
  outputFormat: string;
  edgeCases: string[];
  functionalRequirements: string[];
  nonFunctionalRequirements: string[];
  techStackRecommendation: string;
  testCases: TestCase[];
}

export interface UserPreferences {
  level: Difficulty;
  language: string;
  concepts: string[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface CodeReviewResult {
  score: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  securityConcerns: string[];
  refactoredSnippet: string;
}