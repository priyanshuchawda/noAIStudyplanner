import { QueryType } from '../types/chat';

// Mock responses for different query types
const mockResponses = {
  study_advice: [
    "Try using the Pomodoro Technique: 25 minutes of focused study followed by a 5-minute break.",
    "Create a mind map to visualize and connect different concepts.",
    "Review your notes within 24 hours of taking them to improve retention.",
  ],
  homework_help: [
    "Break down complex problems into smaller, manageable steps.",
    "Start with the easier questions to build confidence.",
    "Use online resources and textbooks to supplement your understanding.",
  ],
  time_management: [
    "Create a weekly study schedule and stick to it.",
    "Prioritize tasks based on deadlines and importance.",
    "Set specific, achievable goals for each study session.",
  ],
};

export async function generateResponse(input: string, queryType: QueryType): Promise<string> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Get random response based on query type
  const responses = mockResponses[queryType];
  const randomIndex = Math.floor(Math.random() * responses.length);
  
  return `Based on your input: "${input}"\n\n${responses[randomIndex]}`;
}
