import { GoogleGenerativeAI } from '@google/generative-ai';
import { BaseAIProvider } from './base-provider.js';

export class GeminiProvider extends BaseAIProvider {
  constructor(config) {
    super(config);
    this.genAI = this.isConfigured() ? new GoogleGenerativeAI(this.apiKey) : null;
  }

  async sendMessage({ messages, systemPrompt }) {
    if (!this.isConfigured()) {
      throw new Error(`AI service not configured for ${this.serviceName}`);
    }

    const model = this.genAI.getGenerativeModel({ model: this.model });

    const history = [];
    if (systemPrompt) {
      history.push({ role: 'user', parts: [{ text: systemPrompt }] });
      history.push({ role: 'model', parts: [{ text: 'Understood.' }] });
    }

    for (const msg of messages) {
      history.push({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }],
      });
    }

    const chat = model.startChat({
      history: history.slice(0, -1),
      generationConfig: {
        maxOutputTokens: 4096,
        temperature: 0.7,
      },
    });

    const lastMessage = messages[messages.length - 1];
    const result = await chat.sendMessage(lastMessage.content);
    const response = await result.response;
    const content = response.text();
    const usage = response.usageMetadata;

    return {
      content,
      role: 'assistant',
      model: this.model,
      tokensSent: usage.promptTokenCount || Math.ceil(JSON.stringify(messages).length / 4),
      tokensReceived: usage.candidatesTokenCount || Math.ceil(content.length / 4),
    };
  }
}
