export interface AdImageItem {
  id: string;
  name: string;
  file?: File;
  previewUrl: string;
  width: number;
  height: number;
  aspectRatio: string; // e.g. "1:1", "16:9", "9:16", "4:5", "1.91:1"
  focalPoint: { x: number; y: number }; // percentages 0-100
  analysis?: DeepAdAnalysis;
  postPack?: PostPackData;
  isAnalyzing?: boolean;
  error?: string;
  estimatedTextDensity?: number; // 0-100 percentage
}

export interface DeepAdAnalysis {
  overallScore: number;
  thumbStopScore: number;
  policyStatus: 'pass' | 'warning' | 'violation';
  policyCompliance: {
    textOverlayScore: number; // percentage of estimated text area
    hasPersonalAttributes: boolean;
    hasSensationalClaims: boolean;
    hasDeceptiveUI: boolean;
    issues: Array<{
      rule: string;
      severity: 'high' | 'medium' | 'low';
      message: string;
      fixSuggestion: string;
    }>;
  };
  visualHierarchy: {
    focalPointQuality: string;
    strengths: string[];
    improvements: string[];
  };
  psychologicalTriggers: {
    primaryAngle: string;
    emotionalAppeal: string;
    targetPersona: string;
    buyingMotivators: string[];
  };
  croRecommendations: Array<{
    category: 'Contrast & Lighting' | 'Call to Action' | 'Copy Overlay' | 'Framing & Crop' | 'Emotional Hook';
    title: string;
    action: string;
  }>;
  abTestIdeas: Array<{
    variantName: string;
    angle: string;
    hypothesis: string;
  }>;
  modelUsed: string;
  thinkingProcess?: string; // Captured reasoning from Gemini 3.1 Pro High Thinking
  analyzedAt: string;
}

export interface PostPackData {
  primaryTexts: Array<{
    style: 'Direct Response' | 'Story & UGC' | 'High Urgency / Offer';
    text: string;
    hook: string;
  }>;
  headlines: string[];
  descriptions: string[];
  recommendedCta: 'SHOP_NOW' | 'LEARN_MORE' | 'SIGN_UP' | 'GET_OFFER' | 'BOOK_NOW';
  targetAudience: {
    demographics: string;
    interests: string[];
    painPoints: string[];
  };
  hashtags: string[];
}

export type AspectRatioOption = '1:1' | '9:16' | '1.91:1' | '4:5';

export interface AspectRatioMeta {
  ratio: AspectRatioOption;
  label: string;
  sublabel: string;
  w: number;
  h: number;
  description: string;
}

export interface SettingsState {
  brandName: string;
  productDescription: string;
  targetNiche: 'ecommerce' | 'saas' | 'leadgen' | 'fitness_beauty' | 'food_beverage' | 'real_estate' | 'education';
  adObjective: 'sales' | 'leads' | 'traffic' | 'brand_awareness';
  useHighThinking: boolean;
  autoAnalyzeOnUpload: boolean;
  targetCountry: string;
}
