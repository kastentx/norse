import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';

export type ImageFormat = 'webp' | 'avif' | 'jpeg' | 'png' | 'svg';

export class ImageProcessor {
  /**
   * Save image in multiple formats
   */
  async saveImage(
    imageBuffer: Buffer,
    outputPath: string,
    formats: ImageFormat[] = ['webp', 'avif']
  ): Promise<string[]> {
    const savedPaths: string[] = [];
    
    // Ensure output directory exists
    const dir = path.dirname(outputPath);
    await fs.mkdir(dir, { recursive: true });

    // Get base path without extension
    const ext = path.extname(outputPath);
    const basePath = outputPath.slice(0, -ext.length);

    // Save in each requested format
    for (const format of formats) {
      const filePath = `${basePath}.${format}`;
      
      try {
        if (format === 'svg') {
          // SVG handling (if input is already SVG or needs conversion)
          await fs.writeFile(filePath, imageBuffer);
        } else {
          // Use sharp for raster formats
          await sharp(imageBuffer)
            .toFormat(format, {
              quality: format === 'avif' ? 80 : 90,
              effort: format === 'avif' ? 5 : undefined,
            })
            .toFile(filePath);
        }
        
        savedPaths.push(filePath);
        console.log(`✓ Saved: ${filePath}`);
      } catch (error) {
        console.error(`✗ Failed to save ${format}: ${error}`);
      }
    }

    return savedPaths;
  }

  /**
   * Generate blur placeholder for Next.js
   */
  async generateBlurPlaceholder(imageBuffer: Buffer): Promise<string> {
    const placeholder = await sharp(imageBuffer)
      .resize(10, 10, { fit: 'inside' })
      .blur()
      .toBuffer();
    
    return `data:image/jpeg;base64,${placeholder.toString('base64')}`;
  }

  /**
   * Optimize existing image
   */
  async optimizeImage(
    inputPath: string,
    outputPath?: string,
    options: {
      width?: number;
      height?: number;
      quality?: number;
      format?: ImageFormat;
    } = {}
  ): Promise<void> {
    const { width, height, quality = 85, format = 'webp' } = options;
    const output = outputPath || inputPath;

    await sharp(inputPath)
      .resize(width, height, { fit: 'cover', withoutEnlargement: true })
      .toFormat(format, { quality })
      .toFile(output);
  }

  /**
   * Get image dimensions
   */
  async getImageDimensions(
    imageBuffer: Buffer
  ): Promise<{ width: number; height: number }> {
    const metadata = await sharp(imageBuffer).metadata();
    return {
      width: metadata.width || 0,
      height: metadata.height || 0,
    };
  }

  /**
   * Resize image to specific dimensions
   */
  async resizeImage(
    imageBuffer: Buffer,
    width: number,
    height: number
  ): Promise<Buffer> {
    return sharp(imageBuffer)
      .resize(width, height, { fit: 'cover' })
      .toBuffer();
  }
}
