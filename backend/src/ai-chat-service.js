import { aiChatServiceProvider } from './ai/index.js';
import { logAIRequest } from './utils/logger.js';
import { withExponentialBackoff } from './utils/retry.js';

export class AIChatService {
  constructor() {
    this.provider = aiChatServiceProvider;
  }

  buildClientContext(client, aiAnalysis, salesCoachReport) {
    const parts = [];

    parts.push(`## Business Basics
- Business Name: ${client?.business_name || 'Not Provided'}
- Owner Name: ${client?.owner_name || 'Not Provided'}
- Address: ${client?.address_name || 'Not Provided'}
- Phone: ${client?.owner_contact_number || 'Not Provided'}`);

    if (aiAnalysis) {
      parts.push(`## AI Analysis
- Google Rating: ${aiAnalysis?.google_reviews?.average_rating || 'N/A'}
- Status: ${aiAnalysis?.status || 'Not Completed'}`);
    }

    return parts.join('\n');
  }

  async sendMessage(params) {
    const {
      client,
      aiAnalysis,
      salesCoachReport,
      aiContext,
      messages,
      clientId,
    } = params;

    const startTimestamp = new Date();
    const systemPrompt = this.buildClientContext(client, aiAnalysis, salesCoachReport);

    // Use only last 15 messages for token efficiency
    const recentMessages = messages.slice(-15);

    try {
      const result = await withExponentialBackoff(
        async () => {
          return await this.provider.sendMessage({
            messages: recentMessages,
            systemPrompt,
          });
        },
        {
          maxRetries: 3,
          initialDelayMs: 1000,
          onRetry: ({ attempt, delayMs, error }) => {
            console.log(`[AI Retry] Attempt ${attempt} failed, retrying in ${delayMs}ms: ${error.message}`);
          },
        }
      );

      const endTimestamp = new Date();
      const responseTimeMs = endTimestamp - startTimestamp;

      logAIRequest({
        timestamp: startTimestamp.toISOString(),
        clientId,
        service: 'chat',
        requestType: 'chat-message',
        tokensSent: result.tokensSent,
        tokensReceived: result.tokensReceived,
        responseTimeMs,
        error: null,
      });

      return result;
    } catch (error) {
      const endTimestamp = new Date();
      const responseTimeMs = endTimestamp - startTimestamp;

      logAIRequest({
        timestamp: startTimestamp.toISOString(),
        clientId,
        service: 'chat',
        requestType: 'chat-message',
        tokensSent: Math.ceil(JSON.stringify(recentMessages).length / 4),
        tokensReceived: 0,
        responseTimeMs,
        error: error.message,
      });

      // Determine user-friendly error type
      let errorType = 'general';
      if (error.message.includes('429') || error.message.toLowerCase().includes('quota')) {
        errorType = 'rate_limit';
      } else if (error.message.toLowerCase().includes('not configured')) {
        errorType = 'not_configured';
      } else if (error.message.toLowerCase().includes('timeout')) {
        errorType = 'timeout';
      }

      throw {
        type: errorType,
        originalError: error,
      };
    }
  }

  async generateConversationSummary(messages) {
    if (!this.provider.isConfigured()) return null;
    try {
      const result = await this.provider.sendMessage({
        messages: [
          {
            role: 'user',
            content: `Summarize this conversation in 3-5 sentences:\n${messages.map(m => `${m.role}: ${m.content}`).join('\n')}`,
          },
        ],
      });
      return result.content;
    } catch (err) {
      console.error('Error generating summary:', err);
      return null;
    }
  }
}

export const aiChatService = new AIChatService();
