import { GeminiProvider } from './gemini-provider.js';

// Initialize dedicated AI services with separate API keys
const ANALYSIS_SERVICE_CONFIG = {
  apiKey: process.env.AI_ANALYSIS_API_KEY,
  serviceName: 'analysis',
};

const CHAT_SERVICE_CONFIG = {
  apiKey: process.env.AI_CHAT_API_KEY,
  serviceName: 'chat',
};

// Create service instances
export const aiAnalysisServiceProvider = new GeminiProvider(ANALYSIS_SERVICE_CONFIG);
export const aiChatServiceProvider = new GeminiProvider(CHAT_SERVICE_CONFIG);
