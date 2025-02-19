import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export async function getGeminiResponse(prompt: string) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return text;
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw error;
  }
}

export async function getStudyAdvice(topic: string) {
  const prompt = `As a study advisor, provide concise, practical advice for studying ${topic}. Include:
1. Key study strategies
2. Common pitfalls to avoid
3. Recommended resources
Please keep the response focused and actionable.`;

  return getGeminiResponse(prompt);
}

export async function getHomeworkHelp(subject: string, question: string) {
  const prompt = `As a tutor, help me understand this ${subject} question: "${question}"
Please provide:
1. A clear explanation of the concept
2. Step-by-step guidance (without giving direct answers)
3. Related examples to understand better
Focus on helping me learn, not just getting the answer.`;

  return getGeminiResponse(prompt);
}

export async function getTimeManagementAdvice(schedule: string) {
  const prompt = `As a time management expert, help me optimize this schedule: "${schedule}"
Provide:
1. Schedule analysis
2. Efficiency improvements
3. Break and study session balance
4. Productivity tips
Keep suggestions practical and actionable.`;

  return getGeminiResponse(prompt);
}
