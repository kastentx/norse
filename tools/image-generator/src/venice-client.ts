import axios, { AxiosInstance } from 'axios';

export interface VeniceImageOptions {
  size?: string; // e.g., "1024x1024", "768x1024", "1536x1024"
  model?: string;
  outputFormat?: 'jpeg' | 'png' | 'webp';
  responseFormat?: 'b64_json' | 'url';
  numImages?: number;
}

export interface VeniceImageResponse {
  created: number;
  data: Array<{
    url?: string;
    b64_json?: string;
  }>;
}

export class VeniceAIClient {
  private client: AxiosInstance;
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.client = axios.create({
      baseURL: 'https://api.venice.ai/api/v1',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      timeout: 120000, // 120 second timeout for image generation
    });
  }

  /**
   * Generate an image using Venice.ai API
   */
  async generateImage(
    prompt: string,
    options: VeniceImageOptions = {}
  ): Promise<Buffer> {
    const {
      size = '1024x1024',
      model = process.env.VENICE_AI_MODEL || 'fluently-xl',
      outputFormat = 'png',
      responseFormat = 'b64_json',
      numImages = 1,
    } = options;

    try {
      const response = await this.client.post<VeniceImageResponse>('/images/generations', {
        model,
        prompt,
        size,
        output_format: outputFormat,
        response_format: responseFormat,
        n: numImages,
        moderation: 'low', // Disable content filtering for Norse mythology
      });

      // Venice.ai returns data array with b64_json or url
      const imageData = response.data.data?.[0];
      
      if (!imageData) {
        throw new Error('No image data returned from Venice.ai');
      }
      
      if (imageData.b64_json) {
        // Convert base64 to buffer
        return Buffer.from(imageData.b64_json, 'base64');
      } else if (imageData.url) {
        // Download from URL
        const imageResponse = await axios.get(imageData.url, {
          responseType: 'arraybuffer',
        });
        return Buffer.from(imageResponse.data);
      } else {
        throw new Error('No image data (b64_json or url) returned from Venice.ai');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorData = error.response?.data;
        const message = errorData?.error?.message || errorData?.error || error.message;
        const details = JSON.stringify(errorData, null, 2);
        throw new Error(`Venice.ai API error: ${message}\nDetails: ${details}`);
      }
      throw error;
    }
  }

  /**
   * Test API connection
   */
  async testConnection(): Promise<boolean> {
    try {
      // Attempt a simple request to verify credentials
      await this.client.get('/models'); // Adjust endpoint as needed
      return true;
    } catch {
      return false;
    }
  }
}
