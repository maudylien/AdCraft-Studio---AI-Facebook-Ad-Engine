export interface PolicyRuleDefinition {
  id: string;
  name: string;
  category: 'Text Density' | 'Sensationalism' | 'Personal Attributes' | 'Deceptive UI' | 'Prohibited Claims';
  standardUrl: string;
  description: string;
  threshold?: number;
}

export const META_POLICY_RULES: PolicyRuleDefinition[] = [
  {
    id: 'meta-text-rule',
    name: 'Text Overlay Density (20% Rule)',
    category: 'Text Density',
    standardUrl: 'https://www.facebook.com/business/help/980593475366490',
    description: 'Images with text occupying less than 20% of the area receive lower CPMs and broader reach.',
    threshold: 20,
  },
  {
    id: 'meta-personal-attributes',
    name: 'Personal Attributes & Inquiries',
    category: 'Personal Attributes',
    standardUrl: 'https://transparency.fb.com/policies/ad-standards/objectionable-content/personal-attributes',
    description: 'Ads must not assert or imply personal characteristics (race, religion, financial status, disability).',
  },
  {
    id: 'meta-before-after',
    name: 'Misleading Before-and-After Imagery',
    category: 'Sensationalism',
    standardUrl: 'https://transparency.fb.com/policies/ad-standards/deceptive-content/unrealistic-outcomes',
    description: 'Ads promoting health, weight loss, or cosmetic improvements must not portray unlikely results.',
  },
  {
    id: 'meta-deceptive-ui',
    name: 'Deceptive UI & Non-Existent Functionality',
    category: 'Deceptive UI',
    standardUrl: 'https://transparency.fb.com/policies/ad-standards/deceptive-content/non-functional-landing-pages',
    description: 'Ads must not feature fake play buttons, fake radio buttons, or fraudulent interface controls.',
  },
  {
    id: 'meta-prohibited-claims',
    name: 'Get-Rich-Quick & Absolute Guarantees',
    category: 'Prohibited Claims',
    standardUrl: 'https://transparency.fb.com/policies/ad-standards/deceptive-content/financial-products-services',
    description: 'Absolute guarantees of income or overnight transformation without verifiable disclaimers.',
  },
];

export function evaluatePolicyScore(textDensity: number, issuesCount: number): {
  status: 'pass' | 'warning' | 'violation';
  score: number;
  grade: 'A+' | 'A' | 'B' | 'C' | 'D';
} {
  let score = 100;
  if (textDensity > 20) {
    score -= (textDensity - 20) * 2;
  }
  score -= issuesCount * 15;
  score = Math.max(20, Math.min(100, Math.round(score)));

  let status: 'pass' | 'warning' | 'violation' = 'pass';
  let grade: 'A+' | 'A' | 'B' | 'C' | 'D' = 'A+';

  if (score >= 90) {
    status = 'pass';
    grade = 'A+';
  } else if (score >= 80) {
    status = 'pass';
    grade = 'A';
  } else if (score >= 65) {
    status = 'warning';
    grade = 'B';
  } else if (score >= 50) {
    status = 'warning';
    grade = 'C';
  } else {
    status = 'violation';
    grade = 'D';
  }

  return { status, score, grade };
}
