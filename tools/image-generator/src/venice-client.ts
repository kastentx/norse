import axios, { AxiosInstance } from 'axios';

export interface VeniceImageOptions {
  width?: number;
  height?: number;
  style?: string;
  negativePrompt?: string;
  numImages?: number;
}

export interface VeniceImageResponse {
  images: Array<{
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
      baseURL: 'https://api.venice.ai/v1',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      timeout: 60000, // 60 second timeout for image generation
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
      width = 1024,
      height = 1024,
      style = 'fantasy',
      negativePrompt = 'low quality, blurry, distorted, watermark, text, signature',
      numImages = 1,
    } = options;

    try {
      const response = await this.client.post<VeniceImageResponse>('/images/generate', {
        prompt: `${prompt}\nStyle: ${style}`,
        width,
        height,
        num_images: numImages,
        negative_prompt: negativePrompt,
        // Add any Venice-specific parameters here
      });

      // Venice.ai returns either URL or base64
      const imageData = response.data.images[0];
      
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
        throw new Error('No image data returned from Venice.ai');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.error?.message || error.message;
        throw new Error(`Venice.ai API error: ${message}`);
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
