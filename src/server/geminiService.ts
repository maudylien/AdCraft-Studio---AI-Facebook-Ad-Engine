import { GoogleGenAI, ThinkingLevel, Type } from '@google/genai';

const apiKey = process.env.GEMINI_API_KEY || '';

export const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

export interface AnalyzePayload {
  imageBytes?: string | null; // base64
  imageUrl?: string | null;
  imageName: string;
  brandName?: string;
  niche?: string;
  objective?: string;
  useHighThinking?: boolean;
}

export interface GenerateCopyPayload {
  imageContext?: string;
  brandName: string;
  productDescription?: string;
  niche?: string;
  objective?: string;
  targetCountry?: string;
}

/**
 * Analyzes an ad creative image with Deep Thinking (gemini-3.1-pro-preview with ThinkingLevel.HIGH)
 * or fast fallback.
 */
export async function analyzeAdCreative(payload: AnalyzePayload) {
  const model = payload.useHighThinking ? 'gemini-3.1-pro-preview' : 'gemini-3.8-flash';

  const parts: any[] = [];

  if (payload.imageBytes) {
    parts.push({
      inlineData: {
        mimeType: 'image/jpeg',
        data: payload.imageBytes,
      },
    });
  }

  const promptText = `You are a world-class Meta Advertising Strategist, Creative Director, and Conversion Rate Optimization (CRO) Expert.
Analyze this Facebook / Instagram ad creative for the brand "${payload.brandName || 'Brand'}" in the niche "${payload.niche || 'E-commerce'}" with objective "${payload.objective || 'Sales'}".

Evaluate the creative thoroughly:
1. Overall Creative Score (0-100)
2. Thumb-Stop Power Score (0-100): probability of halting a scrolling user on mobile feed within 1.5 seconds.
3. Meta Policy Compliance:
   - Estimate text overlay percentage (0-100%). Note whether it violates the 20% rule guideline.
   - Detect if there are prohibited personal attributes claims, sensational before/after imagery, deceptive UI (fake play buttons), or unverified absolute guarantees.
   - List any specific issues with rule, severity (high/medium/low), message, and actionable fix suggestions.
4. Visual Hierarchy:
   - Identify focal point quality, key visual strengths, and recommended visual improvements.
5. Audience Psychological Triggers:
   - Primary angle, emotional appeal, target customer persona, and core buying motivators.
6. Conversion Rate Optimization (CRO) Recommendations:
   - Specific, high-impact changes to contrast, lighting, call-to-action placement, text framing, or emotional hook.
7. A/B Creative Testing Matrix:
   - 3 distinct test variant angles (Variant A, B, C) with hypotheses.

Respond in strict valid JSON matching the schema provided.`;

  parts.push({ text: promptText });

  const config: any = {
    responseMimeType: 'application/json',
    systemInstruction:
      'You are a rigorous, data-driven Facebook Advertising compliance auditor and creative optimizer. Always return strictly valid JSON matching the requested structure.',
    responseSchema: {
      type: Type.OBJECT,
      properties: {
        overallScore: { type: Type.INTEGER, description: 'Score between 0 and 100' },
        thumbStopScore: { type: Type.INTEGER, description: 'Score between 0 and 100' },
        policyStatus: { type: Type.STRING, description: 'pass, warning, or violation' },
        policyCompliance: {
          type: Type.OBJECT,
          properties: {
            textOverlayScore: { type: Type.INTEGER, description: 'Estimated text area percentage' },
            hasPersonalAttributes: { type: Type.BOOLEAN },
            hasSensationalClaims: { type: Type.BOOLEAN },
            hasDeceptiveUI: { type: Type.BOOLEAN },
            issues: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  rule: { type: Type.STRING },
                  severity: { type: Type.STRING },
                  message: { type: Type.STRING },
                  fixSuggestion: { type: Type.STRING },
                },
                required: ['rule', 'severity', 'message', 'fixSuggestion'],
              },
            },
          },
          required: ['textOverlayScore', 'hasPersonalAttributes', 'hasSensationalClaims', 'hasDeceptiveUI', 'issues'],
        },
        visualHierarchy: {
          type: Type.OBJECT,
          properties: {
            focalPointQuality: { type: Type.STRING },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            improvements: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ['focalPointQuality', 'strengths', 'improvements'],
        },
        psychologicalTriggers: {
          type: Type.OBJECT,
          properties: {
            primaryAngle: { type: Type.STRING },
            emotionalAppeal: { type: Type.STRING },
            targetPersona: { type: Type.STRING },
            buyingMotivators: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ['primaryAngle', 'emotionalAppeal', 'targetPersona', 'buyingMotivators'],
        },
        croRecommendations: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              category: { type: Type.STRING },
              title: { type: Type.STRING },
              action: { type: Type.STRING },
            },
            required: ['category', 'title', 'action'],
          },
        },
        abTestIdeas: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              variantName: { type: Type.STRING },
              angle: { type: Type.STRING },
              hypothesis: { type: Type.STRING },
            },
            required: ['variantName', 'angle', 'hypothesis'],
          },
        },
      },
      required: [
        'overallScore',
        'thumbStopScore',
        'policyStatus',
        'policyCompliance',
        'visualHierarchy',
        'psychologicalTriggers',
        'croRecommendations',
        'abTestIdeas',
      ],
    },
  };

  // As per instructions: "You MUST use the gemini-3.1-pro-preview model and set thinkingLevel to ThinkingLevel.HIGH. Do not set maxOutputTokens."
  if (payload.useHighThinking) {
    config.thinkingConfig = {
      thinkingLevel: ThinkingLevel.HIGH,
    };
  }

  try {
    const response = await ai.models.generateContent({
      model,
      contents: parts.length === 1 ? parts[0].text : { parts },
      config,
    });

    const text = response.text || '{}';
    const parsed = JSON.parse(text);

    return {
      ...parsed,
      modelUsed: model,
      analyzedAt: new Date().toISOString(),
    };
  } catch (err: any) {
    console.error('Error in analyzeAdCreative:', err);
    throw err;
  }
}

/**
 * Generates Post Pack copy variations for Facebook Ads
 */
export async function generateAdCopy(payload: GenerateCopyPayload) {
  const model = 'gemini-3.8-flash';

  const prompt = `Write a high-converting Facebook and Instagram Ad Post Pack for brand "${payload.brandName}".
Product details: "${payload.productDescription || 'Premium product'}".
Niche: "${payload.niche || 'E-commerce'}". Objective: "${payload.objective || 'Sales'}". Target country: "${payload.targetCountry || 'Global'}".

Provide:
1. Three distinct Primary Text variations:
   - "Direct Response" (Problem-Agitate-Solve with bullet points and bold offer)
   - "Story & UGC" (First person testimonial style, emotional, authentic transformation)
   - "High Urgency / Offer" (Flash scarcity, clear discount, strong call to action)
2. Four short punchy headlines (under 40 characters each, suitable for Facebook link ads)
3. Three link description texts (under 15 words)
4. Recommended Call To Action button (one of: SHOP_NOW, LEARN_MORE, SIGN_UP, GET_OFFER, BOOK_NOW)
5. Targeting profile: demographics, 4 specific Facebook interest keywords, 3 customer pain points
6. Five relevant hashtags.

Return JSON strictly matching the schema.`;

  const config: any = {
    responseMimeType: 'application/json',
    responseSchema: {
      type: Type.OBJECT,
      properties: {
        primaryTexts: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              style: { type: Type.STRING },
              hook: { type: Type.STRING },
              text: { type: Type.STRING },
            },
            required: ['style', 'hook', 'text'],
          },
        },
        headlines: { type: Type.ARRAY, items: { type: Type.STRING } },
        descriptions: { type: Type.ARRAY, items: { type: Type.STRING } },
        recommendedCta: { type: Type.STRING },
        targetAudience: {
          type: Type.OBJECT,
          properties: {
            demographics: { type: Type.STRING },
            interests: { type: Type.ARRAY, items: { type: Type.STRING } },
            painPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ['demographics', 'interests', 'painPoints'],
        },
        hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
      required: ['primaryTexts', 'headlines', 'descriptions', 'recommendedCta', 'targetAudience', 'hashtags'],
    },
  };

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config,
  });

  const text = response.text || '{}';
  return JSON.parse(text);
}
