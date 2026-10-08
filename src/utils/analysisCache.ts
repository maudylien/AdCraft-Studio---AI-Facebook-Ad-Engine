import { DeepAdAnalysis, PostPackData } from '../types';

const ANALYSIS_CACHE_KEY = 'adcraft_analysis_cache_v1';

export function getCachedAnalysis(imageId: string): DeepAdAnalysis | null {
  try {
    const raw = sessionStorage.getItem(`${ANALYSIS_CACHE_KEY}_${imageId}`);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveCachedAnalysis(imageId: string, data: DeepAdAnalysis): void {
  try {
    sessionStorage.setItem(`${ANALYSIS_CACHE_KEY}_${imageId}`, JSON.stringify(data));
  } catch {
    // sessionStorage full or unavailable
  }
}

export function getCachedPostPack(imageId: string): PostPackData | null {
  try {
    const raw = sessionStorage.getItem(`${ANALYSIS_CACHE_KEY}_postpack_${imageId}`);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveCachedPostPack(imageId: string, data: PostPackData): void {
  try {
    sessionStorage.setItem(`${ANALYSIS_CACHE_KEY}_postpack_${imageId}`, JSON.stringify(data));
  } catch {
    // sessionStorage full or unavailable
  }
}
