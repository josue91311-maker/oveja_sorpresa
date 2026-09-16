import sharp from 'sharp';
import path from 'path';

export interface ImageProcessingOptions {
  purpose?: 'product' | 'banner' | 'logo';
  fitMode?: 'auto' | 'cover' | 'contain';
  backgroundColor?: string;
}

export interface ProcessedImageResult {
  buffer: Buffer;
  mimeType: string;
  extension: string;
  width: number;
  height: number;
  size: number;
}

export async function adaptAndOptimizeImage(
  inputBuffer: Buffer,
  originalFilename: string,
  options: ImageProcessingOptions = {}
): Promise<ProcessedImageResult> {
  const {
    purpose = 'product',
    fitMode = 'auto',
    backgroundColor = '#FFFFFF',
  } = options;

  // Auto-orient according to EXIF metadata (essential for smartphone photos)
  const image = sharp(inputBuffer).rotate();
  const metadata = await image.metadata();

  const originalWidth = metadata.width || 800;
  const originalHeight = metadata.height || 1000;
  const hasAlpha = metadata.hasAlpha || false;
  const isPng = (metadata.format === 'png');

  let targetWidth = 800;
  let targetHeight = 1000;
  let chosenFit: 'cover' | 'contain' | 'inside' = 'cover';

  if (purpose === 'product') {
    // Standard 4:5 Ecommerce portrait ratio for product cards & catalogs
    targetWidth = 800;
    targetHeight = 1000;

    const currentAspect = originalWidth / originalHeight;
    // 4:5 = 0.80. If between 0.70 and 0.88, it's already a good portrait ratio.
    if (fitMode === 'cover') {
      chosenFit = 'cover';
    } else if (fitMode === 'contain') {
      chosenFit = 'contain';
    } else {
      // 'auto': if photo is portrait (0.70 to 0.88), cover is seamless.
      // If photo is square or landscape (e.g. > 0.88) or very tall (< 0.70),
      // contain ensures the product is NEVER cut off.
      if (currentAspect >= 0.70 && currentAspect <= 0.88) {
        chosenFit = 'cover';
      } else {
        chosenFit = 'contain';
      }
    }

    image.resize(targetWidth, targetHeight, {
      fit: chosenFit,
      position: 'centre',
      background: hasAlpha ? { r: 255, g: 255, b: 255, alpha: 0 } : backgroundColor,
    });

  } else if (purpose === 'banner') {
    // Responsive widescreen banner
    targetWidth = 1920;
    targetHeight = 800;
    chosenFit = 'inside';

    image.resize(targetWidth, targetHeight, {
      fit: 'inside',
      withoutEnlargement: true,
    });

  } else if (purpose === 'logo') {
    // Brand Logo
    targetWidth = 500;
    targetHeight = 500;
    chosenFit = 'inside';

    image.resize(targetWidth, targetHeight, {
      fit: 'inside',
      withoutEnlargement: true,
      background: { r: 255, g: 255, b: 255, alpha: 0 },
    });
  }

  // Format & Compression
  // If original had alpha channel (transparent PNG/WebP), preserve transparency
  let outputBuffer: Buffer;
  let outputMimeType: string;
  let outputExtension: string;

  if (hasAlpha && isPng) {
    outputBuffer = await image
      .png({ quality: 90, compressionLevel: 8 })
      .toBuffer();
    outputMimeType = 'image/png';
    outputExtension = '.png';
  } else {
    // High-quality optimized JPEG (progressive, mozjpeg)
    outputBuffer = await image
      .jpeg({ quality: 88, mozjpeg: true, progressive: true })
      .toBuffer();
    outputMimeType = 'image/jpeg';
    outputExtension = '.jpg';
  }

  const finalMeta = await sharp(outputBuffer).metadata();

  return {
    buffer: outputBuffer,
    mimeType: outputMimeType,
    extension: outputExtension,
    width: finalMeta.width || targetWidth,
    height: finalMeta.height || targetHeight,
    size: outputBuffer.length,
  };
}
