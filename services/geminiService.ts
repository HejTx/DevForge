import { GoogleGenAI, Type } from "@google/genai";
import { ProjectData, UserPreferences, Difficulty, CodeReviewResult } from "../types";

const getClient = () => {
  // Ensure we are using the env var correctly
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY is missing from environment variables");
    throw new Error("API_KEY environment variable is missing.");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateProject = async (prefs: UserPreferences): Promise<ProjectData> => {
  const ai = getClient();
  
  const conceptsStr = prefs.concepts.length > 0 ? ` focusing on ${prefs.concepts.join(', ')}` : '';
  const prompt = `Create a highly detailed and rigorous programming project specification for a ${prefs.level} level developer in ${prefs.language}${conceptsStr}. 

  The project must simulate a real-world technical task. It requires:
  1. A clear Problem Statement (Description).
  2. Precise Input/Output definitions (e.g., "Input is read from STDIN. First line contains integer N...").
  3. Explicit Edge Case handling requirements (e.g., "Handle integer overflow", "Empty arrays").
  4. Functional requirements.

  The description should be verbose enough to leave no ambiguity about the expected behavior.

  Include 3-5 distinct test cases with raw string inputs and expected outputs. Ensure the inputs are provided as they would appear in a raw text file (handling newlines etc).`;

  try {
    console.log("Calling Gemini for project generation...");
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: "You are a senior technical lead designing a comprehensive project specification.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            objective: { type: Type.STRING },
            inputFormat: { type: Type.STRING, description: "Detailed specification of input format (source, structure, constraints)." },
            outputFormat: { type: Type.STRING, description: "Detailed specification of output format." },
            edgeCases: { 
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of specific edge cases to handle."
            },
            functionalRequirements: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            nonFunctionalRequirements: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            techStackRecommendation: { type: Type.STRING },
            testCases: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  input: { type: Type.STRING },
                  expectedOutput: { type: Type.STRING },
                  explanation: { type: Type.STRING }
                },
                required: ["name", "input", "expectedOutput", "explanation"]
              }
            }
          },
          required: ["title", "description", "objective", "inputFormat", "outputFormat", "edgeCases", "functionalRequirements", "testCases"]
        }
      }
    });

    const text = response.text;
    console.log("Raw Gemini response:", text);

    if (!text) throw new Error("No response text from Gemini");
    
    // Improved JSON parsing: find the first '{' and the last '}'
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');
    
    if (firstBrace === -1 || lastBrace === -1) {
      throw new Error("Valid JSON object not found in response");
    }

    const jsonStr = text.substring(firstBrace, lastBrace + 1);
    
    return JSON.parse(jsonStr) as ProjectData;
  } catch (error) {
    console.error("Error generating project:", error);
    throw error;
  }
};

export const getMentorHint = async (
  project: ProjectData, 
  history: { role: string, text: string }[], 
  currentQuery: string
): Promise<string> => {
  const ai = getClient();

  const context = `
    Current Project: ${project.title}
    Objective: ${project.objective}
    Description: ${project.description}
    Input Format: ${project.inputFormat}
    Output Format: ${project.outputFormat}
    Edge Cases: ${project.edgeCases.join('; ')}
    Requirements: ${project.functionalRequirements.join('; ')}
  `;

  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    history: history.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.text }]
    })),
    config: {
      systemInstruction: `You are a Socratic mentor for a programming student. 
      The student is working on the project described below.
      Your goal is to guide them to the solution without writing the code for them.
      - Do not provide full code snippets.
      - Ask leading questions.
      - Explain concepts (e.g., recursion, hashmaps) if they are stuck on the theory.
      - Help debug logic errors by asking them to trace their code.
      - Be encouraging but firm on them doing the work.
      
      ${context}`
    }
  });

  const result = await chat.sendMessage({ message: currentQuery });
  return result.text || "I couldn't generate a hint right now.";
};

export const generateCodeReview = async (project: ProjectData, userCode: string): Promise<CodeReviewResult> => {
  const ai = getClient();

  const prompt = `Review the following code submission for the project "${project.title}".
  
  Project Requirements:
  ${project.functionalRequirements.join('\n')}
  
  User Code:
  ${userCode}
  
  Provide a strict, professional code review focusing on:
  1. Correctness (Does it solve the problem?)
  2. Efficiency (Big O time/space complexity)
  3. Clean Code (Naming, modularity)
  4. Security (if applicable)
  
  Provide a refactored snippet for the most critical improvement.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER, description: "Score out of 100" },
            summary: { type: Type.STRING, description: "Executive summary of the review" },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
            securityConcerns: { type: Type.ARRAY, items: { type: Type.STRING } },
            refactoredSnippet: { type: Type.STRING, description: "A code snippet showing a better way to do a specific part" }
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");

    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');
    if (firstBrace === -1 || lastBrace === -1) throw new Error("Invalid JSON in review response");
    
    const jsonStr = text.substring(firstBrace, lastBrace + 1);
    return JSON.parse(jsonStr) as CodeReviewResult;
  } catch (error) {
    console.error("Error generating code review:", error);
    throw error;
  }
};

export const generateReferenceSolution = async (project: ProjectData): Promise<string> => {
  const ai = getClient();
  
  const prompt = `Generate a production-grade reference solution for the following project in ${project.techStackRecommendation || 'the most appropriate language'}.
  
  Title: ${project.title}
  Description: ${project.description}
  
  Include comments explaining key decisions.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt
  });
  
  return response.text || "Unable to generate solution.";
}