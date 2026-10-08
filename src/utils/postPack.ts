import { PostPackData, SettingsState } from '../types';

export function createDefaultPostPack(imageName: string, settings: SettingsState): PostPackData {
  const brand = settings.brandName || 'Brand';
  const cleanName = imageName.replace(/[-_.]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  return {
    primaryTexts: [
      {
        style: 'Direct Response',
        hook: `Stop settling for ordinary results. Experience the breakthrough with ${brand}.`,
        text: `Stop settling for ordinary results. Experience the breakthrough with ${brand}.\n\nDesigned specifically for demanding creators and pros, our newest release brings unmatched performance, precision craftsmanship, and effortless daily comfort.\n\n⚡ Fast Priority Shipping\n🛡️ 30-Day Risk-Free Guarantee\n⭐ Rated 4.9/5 by 12,000+ Customers\n\nTap below to claim your exclusive launch pricing before stocks run out!`,
      },
      {
        style: 'Story & UGC',
        hook: `“I was skeptical at first, but this completely transformed my routine within 48 hours.”`,
        text: `“I was skeptical at first, but this completely transformed my routine within 48 hours.”\n\nIf you've been struggling to find a solution that actually delivers on its promises, meet ${cleanName}.\n\nNo unnecessary gimmicks—just pure, uncompromising quality engineered to make your life smoother.\n\nJoin thousands of satisfied believers today. Click Learn More to discover why everyone is making the switch.`,
      },
      {
        style: 'High Urgency / Offer',
        hook: `🚨 FLASH RELEASE: Save 25% Today Only with Code: VIPLAUNCH`,
        text: `🚨 FLASH RELEASE: Save 25% Today Only with Code: VIPLAUNCH\n\nUpgrade your daily setup with ${brand}. Limited batch crafted for this season—once it sells out, restocking won't happen for another 6 weeks!\n\n📦 Free Express Shipping on orders over $50\n🎁 Complimentary mystery gift with every order today\n\nDon't wait until it's gone. Tap 'Shop Now' to secure yours now!`,
      },
    ],
    headlines: [
      `Upgrade Your Everyday — Get 25% Off Today`,
      `The #1 Choice for Discerning Pros`,
      `Engineered for Peak Performance & Style`,
      `Risk-Free 30-Day In-Home Trial`,
    ],
    descriptions: [
      `Free Worldwide Delivery & Hassle-Free Returns`,
      `Over 15,000+ Verified 5-Star Reviews`,
      `Claim Your Special Introductory Discount Now`,
    ],
    recommendedCta: 'SHOP_NOW',
    targetAudience: {
      demographics: 'Ages 22-48, Urban & Suburban, Mobile Shoppers',
      interests: ['Online Shopping', 'Premium Lifestyle', 'Innovation & Tech', 'Product Design'],
      painPoints: [
        'Frustrated with low-durability alternatives',
        'Overpaying for outdated legacy brand products',
        'Looking for clean aesthetic with peak utility',
      ],
    },
    hashtags: ['#DirectToConsumer', '#MustHave', '#ProductLaunch', '#SmartDesign', '#LifeUpgrade'],
  };
}

export function copyToClipboard(text: string): Promise<boolean> {
  return navigator.clipboard
    .writeText(text)
    .then(() => true)
    .catch(() => false);
}
