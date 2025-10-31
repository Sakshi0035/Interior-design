
import { GoogleGenAI, Chat, Content } from "@google/genai";

// Ensure the API key is set in the environment variables
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const systemInstruction = `You are an AI customer support assistant for 'MagicFeel Studio LLP', a premium interior and landscape design company. Your role is to provide information about the company's services, answer frequently asked questions, and guide potential clients on how to contact the team for a consultation. Be professional, friendly, and helpful. When asked about services, describe that MagicFeel Studio specializes in both interior and landscape design. When asked how to book a service or contact someone, provide the contact details for Yoggita Singh: Phone (+91 901103067) and Email (yogitanawle2007@gmail.com). Do not provide design advice yourself; instead, encourage the user to book a consultation with the professional designers.`;

export function createChatSession(history: Content[]): Chat {
  const chat: Chat = ai.chats.create({
    model: 'gemini-2.5-flash',
    history: history,
    config: {
      systemInstruction: systemInstruction,
    },
  });
  return chat;
}
