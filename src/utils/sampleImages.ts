export interface SampleImagePreset {
  id: string;
  name: string;
  category: string;
  description: string;
  url: string;
  width: number;
  height: number;
  defaultFocal: { x: number; y: number };
}

export const SAMPLE_IMAGES: SampleImagePreset[] = [
  {
    id: 'sample-sneaker',
    name: 'AeroGlide Pro - Running Shoe',
    category: 'E-commerce Footwear',
    description: 'Vibrant studio product shot with bold colors and clean shadow',
    url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80',
    width: 1200,
    height: 800,
    defaultFocal: { x: 50, y: 50 },
  },
  {
    id: 'sample-skincare',
    name: 'Glow Botanical Face Serum',
    category: 'Beauty & Skincare',
    description: 'Minimalist organic cosmetic dropper bottle with natural botanicals',
    url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1200&q=80',
    width: 1200,
    height: 1200,
    defaultFocal: { x: 50, y: 48 },
  },
  {
    id: 'sample-coffee',
    name: 'Artisan Cold Brew Bottle',
    category: 'Food & Beverage',
    description: 'Refreshing iced craft coffee bottle with rustic condensation',
    url: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=1200&q=80',
    width: 1200,
    height: 1500,
    defaultFocal: { x: 50, y: 45 },
  },
  {
    id: 'sample-headphones',
    name: 'ZenWave ANC Headphones',
    category: 'Consumer Electronics',
    description: 'Premium wireless headphones on dark textured backdrop',
    url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80',
    width: 1200,
    height: 900,
    defaultFocal: { x: 50, y: 52 },
  },
  {
    id: 'sample-fitness',
    name: 'PulseFit Smart Gym Tracker',
    category: 'Health & Fitness',
    description: 'Athletic lifestyle shot emphasizing high performance and focus',
    url: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=1200&q=80',
    width: 1200,
    height: 800,
    defaultFocal: { x: 45, y: 40 },
  },
];
