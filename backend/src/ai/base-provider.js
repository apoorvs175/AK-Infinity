export class BaseAIProvider {
  constructor({ apiKey, serviceName, model = 'gemini-2.0-flash' }) {
    this.apiKey = apiKey;
    this.serviceName = serviceName;
    this.model = model;
  }

  isConfigured() {
    return !!this.apiKey;
  }

  async sendMessage(params) {
    throw new Error('sendMessage not implemented');
  }
}
