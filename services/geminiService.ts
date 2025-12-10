import { GoogleGenAI, Chat, GenerativeModel } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";
import { UserState } from "../types";

let client: GoogleGenAI | null = null;
let chatSession: Chat | null = null;

const getClient = (): GoogleGenAI => {
  if (!client) {
    if (!process.env.API_KEY) {
      console.error("API_KEY not found in environment variables");
      throw new Error("API Key missing");
    }
    client = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return client;
};

export const initializeChat = async (userState: UserState) => {
  const ai = getClient();
  
  // Inject current user state into the system instruction dynamically
  const dynamicSystemInstruction = SYSTEM_INSTRUCTION.replace(
    "<USER_CONTEXT_MEMORY>\n* (This section is dynamically updated. Current state: New User. Initialize onboarding.)\n</USER_CONTEXT_MEMORY>",
    `<USER_CONTEXT_MEMORY>
Current User State:
- Stress Level: ${userState.stressLevel}/10
- Portfolio Drift: ${userState.portfolioDrift}%
- Health Score: ${userState.healthScore}/100
</USER_CONTEXT_MEMORY>`
  );

  chatSession = ai.chats.create({
    model: "gemini-2.5-flash",
    config: {
      systemInstruction: dynamicSystemInstruction,
      temperature: 0.7,
      maxOutputTokens: 2000,
    },
  });

  return chatSession;
};

export const sendMessageToGemini = async (message: string, userState: UserState) => {
  if (!chatSession) {
    await initializeChat(userState);
  }
  
  if (!chatSession) {
      throw new Error("Failed to initialize chat session");
  }

  try {
    const response = await chatSession.sendMessage({ message });
    return response.text;
  } catch (error) {
    console.error("Error sending message to Gemini:", error);
    throw error;
  }
};
