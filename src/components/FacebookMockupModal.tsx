import React, { useState } from 'react';
import {
  Smartphone,
  Monitor,
  ThumbsUp,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Globe,
  X,
  ExternalLink,
  Heart,
  Smile,
  Check,
  Copy,
} from 'lucide-react';
import { AdImageItem, AspectRatioOption, SettingsState } from '../types';
import { ASPECT_RATIOS } from '../utils/imageEngine';

interface FacebookMockupModalProps {
  item: AdImageItem;
  isOpen: boolean;
  onClose: () => void;
  settings: SettingsState;
}

export const FacebookMockupModal: React.FC<FacebookMockupModalProps> = ({
  item,
  isOpen,
  onClose,
  settings,
}) => {
  const [deviceMode, setDeviceMode] = useState<'mobile' | 'desktop'>('mobile');
  const [mockupRatio, setMockupRatio] = useState<AspectRatioOption>('1:1');
  const [isExpandedText, setIsExpandedText] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(1420);

  if (!isOpen) return null;

  const brandName = settings.brandName || 'AdCraft Brand';
  const postPack = item.postPack;
  const primaryText =
    postPack?.primaryTexts[0]?.text ||
    `Experience the future of performance with ${brandName}. Engineered with premium materials, designed for maximum longevity, and crafted to exceed your expectations.\n\n⚡ Instant Free Shipping\n🛡️ 30-Day Money-Back Guarantee\n⭐ Over 10,000+ Verified 5-Star Reviews\n\nTap below to explore our exclusive launch collection!`;
  const headline = postPack?.headlines[0] || `${brandName} — Premium Collection`;
  const cta = postPack?.recommendedCta?.replace('_', ' ') || 'Shop Now';

  const toggleLike = () => {
    if (isLiked) {
      setIsLiked(false);
      setLikeCount((prev) => prev - 1);
    } else {
      setIsLiked(true);
      setLikeCount((prev) => prev + 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-bold text-slate-100">Meta Facebook Feed Mockup</h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-950 text-blue-400 border border-blue-800">
                Live Simulator
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Preview how your creative and copy render in realistic Facebook mobile & desktop newsfeeds.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            {/* Device Switcher */}
            <div className="flex items-center bg-slate-800 p-0.5 rounded-lg border border-slate-700">
              <button
                onClick={() => setDeviceMode('mobile')}
                className={`flex items-center space-x-1 px-2.5 py-1 rounded text-xs font-medium transition ${
                  deviceMode === 'mobile' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Mobile</span>
              </button>
              <button
                onClick={() => setDeviceMode('desktop')}
                className={`flex items-center space-x-1 px-2.5 py-1 rounded text-xs font-medium transition ${
                  deviceMode === 'desktop' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>Desktop</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto bg-slate-950/90 flex flex-col items-center">
          {/* Ratio bar */}
          <div className="mb-4 flex items-center space-x-2 text-xs">
            <span className="text-slate-400">Preview Aspect Ratio:</span>
            {(['1:1', '4:5', '1.91:1'] as AspectRatioOption[]).map((r) => (
              <button
                key={r}
                onClick={() => setMockupRatio(r)}
                className={`px-3 py-1 rounded-md font-medium transition ${
                  mockupRatio === r
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {r} ({ASPECT_RATIOS[r].sublabel})
              </button>
            ))}
          </div>

          {/* Facebook Card Frame */}
          <div
            className={`bg-[#242526] text-[#E4E6EB] rounded-xl shadow-2xl border border-slate-700/60 overflow-hidden font-sans transition-all duration-300 ${
              deviceMode === 'mobile' ? 'w-full max-w-[420px]' : 'w-full max-w-[560px]'
            }`}
          >
            {/* Post Header */}
            <div className="p-3.5 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow">
                  {brandName.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className="font-semibold text-sm text-[#E4E6EB] hover:underline cursor-pointer">
                      {brandName}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1 text-xs text-[#B0B3B8]">
                    <span>Sponsored</span>
                    <span>·</span>
                    <Globe className="w-3 h-3 text-[#B0B3B8]" />
                  </div>
                </div>
              </div>
              <button className="text-[#B0B3B8] hover:text-white p-1 rounded-full hover:bg-[#3A3B3C]">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>

            {/* Primary Text */}
            <div className="px-3.5 pb-2 text-sm text-[#E4E6EB] leading-normal">
              <div className={isExpandedText ? '' : 'line-clamp-3 whitespace-pre-line'}>
                {primaryText}
              </div>
              {primaryText.length > 140 && !isExpandedText && (
                <button
                  onClick={() => setIsExpandedText(true)}
                  className="text-xs text-[#B0B3B8] hover:underline font-semibold mt-0.5"
                >
                  See more
                </button>
              )}
            </div>

            {/* Creative Image */}
            <div
              className="w-full bg-black overflow-hidden flex items-center justify-center relative cursor-pointer group"
              style={{
                aspectRatio: `${ASPECT_RATIOS[mockupRatio].ratio}`,
              }}
            >
              <img
                src={item.previewUrl}
                alt="Ad Creative"
                className="w-full h-full object-cover group-hover:scale-[1.01] transition duration-300"
              />
            </div>

            {/* Link Preview Bar */}
            <div className="bg-[#3A3B3C] p-3 flex items-center justify-between border-t border-b border-[#3E4042]">
              <div className="pr-3 flex-1 overflow-hidden">
                <span className="text-[11px] uppercase tracking-wide text-[#B0B3B8] block truncate">
                  {brandName.toLowerCase().replace(/\s+/g, '')}.com
                </span>
                <span className="text-sm font-semibold text-[#E4E6EB] block truncate mt-0.5">
                  {headline}
                </span>
                <span className="text-xs text-[#B0B3B8] block truncate hidden sm:block">
                  {postPack?.descriptions[0] || 'Exclusive launch pricing available for a limited time.'}
                </span>
              </div>
              <button className="px-4 py-1.5 rounded bg-[#4E4F50] hover:bg-[#5E5F60] text-sm font-semibold text-white shrink-0 transition">
                {cta}
              </button>
            </div>

            {/* Social Reactions Bar */}
            <div className="px-3.5 py-2.5 flex items-center justify-between text-xs text-[#B0B3B8] border-b border-[#3E4042]">
              <div className="flex items-center space-x-1.5">
                <div className="flex -space-x-1">
                  <div className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center text-white">
                    <ThumbsUp className="w-2.5 h-2.5 fill-current" />
                  </div>
                  <div className="w-4 h-4 rounded-full bg-rose-500 flex items-center justify-center text-white">
                    <Heart className="w-2.5 h-2.5 fill-current" />
                  </div>
                </div>
                <span>{likeCount.toLocaleString()}</span>
              </div>

              <div className="flex items-center space-x-3">
                <span>142 comments</span>
                <span>38 shares</span>
              </div>
            </div>

            {/* Action Buttons: Like, Comment, Share */}
            <div className="px-2 py-1 flex items-center justify-between text-xs font-semibold text-[#B0B3B8]">
              <button
                onClick={toggleLike}
                className={`flex-1 py-1.5 rounded flex items-center justify-center space-x-1.5 hover:bg-[#3A3B3C] transition ${
                  isLiked ? 'text-blue-400' : ''
                }`}
              >
                <ThumbsUp className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                <span>Like</span>
              </button>
              <button className="flex-1 py-1.5 rounded flex items-center justify-center space-x-1.5 hover:bg-[#3A3B3C] transition">
                <MessageCircle className="w-4 h-4" />
                <span>Comment</span>
              </button>
              <button className="flex-1 py-1.5 rounded flex items-center justify-center space-x-1.5 hover:bg-[#3A3B3C] transition">
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/70 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            Preview is formatted to exact Meta Advertising Feed specifications.
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
