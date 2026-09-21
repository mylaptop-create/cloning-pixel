import OpenAI from 'openai';

export interface LLMConfig {
  provider: string;
  baseUrl: string;
  apiKey: string;
  model: string;
}

export interface ConnectionTestResult {
  success: boolean;
  model: string;
  latencyMs: number;
  message?: string;
  error?: string;
}

export class LLMProviderService {
  private client: OpenAI;
  private model: string;

  constructor(config: LLMConfig) {
    this.model = config.model || 'gpt-4o';
    this.client = new OpenAI({
      baseURL: config.baseUrl || 'https://api.openai.com/v1',
      apiKey: config.apiKey || 'dummy-key',
    });
  }

  static async testConnection(config: LLMConfig): Promise<ConnectionTestResult> {
    const startTime = Date.now();
    try {
      const client = new OpenAI({
        baseURL: config.baseUrl || 'https://api.openai.com/v1',
        apiKey: config.apiKey || 'dummy-key',
      });

      const response = await client.chat.completions.create({
        model: config.model || 'gpt-4o',
        messages: [{ role: 'user', content: 'Ping. Respond with "pong" only.' }],
        max_tokens: 10,
      });

      const latencyMs = Date.now() - startTime;
      const content = response.choices[0]?.message?.content?.trim() || '';

      return {
        success: true,
        model: config.model,
        latencyMs,
        message: `Connection successful (${content})`,
      };
    } catch (err: any) {
      const latencyMs = Date.now() - startTime;
      // Sanitize key in error message if present
      const rawError = err?.message || String(err);
      const sanitizedError = rawError.replace(new RegExp(config.apiKey, 'g'), '***HIDDEN***');
      return {
        success: false,
        model: config.model,
        latencyMs,
        error: sanitizedError,
      };
    }
  }

  async complete(prompt: string, systemPrompt?: string): Promise<string> {
    const messages: OpenAI.ChatCompletionMessageParam[] = [];
    if (systemPrompt) {
      messages.push({ role: 'system', content: systemPrompt });
    }
    messages.push({ role: 'user', content: prompt });

    const response = await this.client.chat.completions.create({
      model: this.model,
      messages,
      temperature: 0.2,
    });

    return response.choices[0]?.message?.content || '';
  }

  async analyzeJson<T = any>(prompt: string, systemPrompt?: string): Promise<T> {
    const fullSystem = `${systemPrompt || ''}\nRespond strictly with valid JSON only. Do not include markdown code block formatting like \`\`\`json.`;
    const text = await this.complete(prompt, fullSystem);
    const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleaned) as T;
  }
}
