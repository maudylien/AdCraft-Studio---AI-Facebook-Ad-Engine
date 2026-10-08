import { AspectRatioOption } from '../types';

export const ASPECT_RATIOS: Record<
  AspectRatioOption,
  { label: string; sublabel: string; ratio: number; w: number; h: number; description: string }
> = {
  '1:1': {
    label: '1:1 Square',
    sublabel: 'FB & IG Feed',
    ratio: 1,
    w: 1080,
    h: 1080,
    description: 'Standard Meta feed placement for maximum inventory distribution.',
  },
  '4:5': {
    label: '4:5 Portrait',
    sublabel: 'Mobile Feed',
    ratio: 4 / 5,
    w: 1080,
    h: 1350,
    description: 'Takes up optimal screen real estate on mobile devices without clipping.',
  },
  '9:16': {
    label: '9:16 Full Screen',
    sublabel: 'Reels & Stories',
    ratio: 9 / 16,
    w: 1080,
    h: 1920,
    description: 'Immersive vertical format for Instagram Stories and Facebook Reels.',
  },
  '1.91:1': {
    label: '1.91:1 Landscape',
    sublabel: 'Link Ad / Desktop',
    ratio: 1.91,
    w: 1200,
    h: 628,
    description: 'Classic Facebook desktop and link carousel banner ad ratio.',
  },
};

/**
 * Loads an image from URL or dataURL
 */
export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(new Error('Failed to load image: ' + e));
    img.src = src;
  });
}

/**
 * Computes the crop window given natural image dimensions, target aspect ratio, and focal point (0-100%).
 */
export function calculateCropRect(
  naturalWidth: number,
  naturalHeight: number,
  targetRatio: number,
  focalXPercent: number,
  focalYPercent: number
): { sx: number; sy: number; sWidth: number; sHeight: number } {
  let sWidth = naturalWidth;
  let sHeight = naturalHeight;
  const currentRatio = naturalWidth / naturalHeight;

  if (currentRatio > targetRatio) {
    // Current is wider than target: trim width
    sWidth = naturalHeight * targetRatio;
    sHeight = naturalHeight;
  } else {
    // Current is taller than target: trim height
    sWidth = naturalWidth;
    sHeight = naturalWidth / targetRatio;
  }

  // Anchor focal point (x: 0-100%, y: 0-100%)
  const focalX = (focalXPercent / 100) * naturalWidth;
  const focalY = (focalYPercent / 100) * naturalHeight;

  let sx = focalX - sWidth / 2;
  let sy = focalY - sHeight / 2;

  // Clamp within image bounds
  if (sx < 0) sx = 0;
  if (sy < 0) sy = 0;
  if (sx + sWidth > naturalWidth) sx = naturalWidth - sWidth;
  if (sy + sHeight > naturalHeight) sy = naturalHeight - sHeight;

  return { sx, sy, sWidth, sHeight };
}

/**
 * Generates a cropped canvas as Data URL
 */
export async function generateCropDataUrl(
  imageSrc: string,
  targetRatio: AspectRatioOption,
  focalX: number = 50,
  focalY: number = 50,
  quality: number = 0.92
): Promise<string> {
  const img = await loadImage(imageSrc);
  const ratioMeta = ASPECT_RATIOS[targetRatio];
  const crop = calculateCropRect(img.naturalWidth, img.naturalHeight, ratioMeta.ratio, focalX, focalY);

  const canvas = document.createElement('canvas');
  canvas.width = ratioMeta.w;
  canvas.height = ratioMeta.h;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get 2d canvas context');

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  ctx.drawImage(img, crop.sx, crop.sy, crop.sWidth, crop.sHeight, 0, 0, ratioMeta.w, ratioMeta.h);

  return canvas.toDataURL('image/jpeg', quality);
}

/**
 * Downloads a data URL or blob
 */
export function downloadFile(url: string, filename: string) {
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

/**
 * Heuristic client-side analysis to calculate brightness, edge contrast, and simulated text-density
 */
export async function analyzeImageHeuristics(imageSrc: string): Promise<{
  estimatedTextDensity: number;
  contrastScore: number;
  isTooDark: boolean;
  isTooBright: boolean;
}> {
  try {
    const img = await loadImage(imageSrc);
    const canvas = document.createElement('canvas');
    const sampleW = 200;
    const sampleH = Math.round((sampleW / img.naturalWidth) * img.naturalHeight);
    canvas.width = sampleW;
    canvas.height = sampleH;
    const ctx = canvas.getContext('2d');
    if (!ctx) return { estimatedTextDensity: 12, contrastScore: 78, isTooDark: false, isTooBright: false };

    ctx.drawImage(img, 0, 0, sampleW, sampleH);
    const imageData = ctx.getImageData(0, 0, sampleW, sampleH);
    const data = imageData.data;

    let totalLuminance = 0;
    let highContrastEdges = 0;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const lum = 0.299 * r + 0.587 * g + 0.114 * b;
      totalLuminance += lum;

      if (i + 4 < data.length) {
        const nextLum = 0.299 * data[i + 4] + 0.587 * data[i + 5] + 0.114 * data[i + 6];
        if (Math.abs(lum - nextLum) > 55) {
          highContrastEdges++;
        }
      }
    }

    const pixelCount = sampleW * sampleH;
    const avgLuminance = totalLuminance / pixelCount;
    const edgeDensity = (highContrastEdges / pixelCount) * 100;
    
    // Heuristic estimation between 5% and 35%
    const estimatedTextDensity = Math.min(38, Math.max(4, Math.round(edgeDensity * 0.45)));
    const contrastScore = Math.min(99, Math.max(50, Math.round(edgeDensity * 1.5 + 45)));

    return {
      estimatedTextDensity,
      contrastScore,
      isTooDark: avgLuminance < 40,
      isTooBright: avgLuminance > 225,
    };
  } catch {
    return {
      estimatedTextDensity: 14,
      contrastScore: 82,
      isTooDark: false,
      isTooBright: false,
    };
  }
}
