import React, { useState } from 'react';
import {
  FileText,
  Copy,
  Check,
  Sparkles,
  Users,
  Hash,
  X,
  Target,
  ArrowRight,
} from 'lucide-react';
import { AdImageItem, PostPackData, SettingsState } from '../types';
import { copyToClipboard } from '../utils/postPack';

interface PostPackPanelProps {
  item: AdImageItem;
  isOpen: boolean;
  onClose: () => void;
  settings: SettingsState;
  onRegenerateCopy?: () => void;
  isGenerating?: boolean;
}

export const PostPackPanel: React.FC<PostPackPanelProps> = ({
  item,
  isOpen,
  onClose,
  settings,
  onRegenerateCopy,
  isGenerating,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [selectedStyleIndex, setSelectedStyleIndex] = useState(0);

  if (!isOpen) return null;

  const postPack: PostPackData | undefined = item.postPack;

  const handleCopy = async (text: string, key: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    }
  };

  const handleCopyAll = async () => {
    if (!postPack) return;
    const currentPrimary = postPack.primaryTexts[selectedStyleIndex]?.text || '';
    const headline = postPack.headlines[0] || '';
    const desc = postPack.descriptions[0] || '';
    const fullText = `=== FACEBOOK AD POST PACK ===\n\n[PRIMARY TEXT]\n${currentPrimary}\n\n[HEADLINE]\n${headline}\n\n[LINK DESCRIPTION]\n${desc}\n\n[RECOMMENDED CTA]\n${postPack.recommendedCta}\n\n[TARGET AUDIENCE]\nDemographics: ${postPack.targetAudience.demographics}\nInterests: ${postPack.targetAudience.interests.join(', ')}\n\n[HASHTAGS]\n${postPack.hashtags.join(' ')}`;
    handleCopy(fullText, 'all');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-950 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-bold text-slate-100">Ad Post Pack Generator</h2>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-950/80 text-indigo-300 border border-indigo-500/30">
                  Meta Copy Suite
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Ready-to-deploy ad copy: Primary Text variations, Headlines, Link Descriptions & Targeting.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {postPack ? (
            <>
              {/* Primary Text Style Selector */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    1. Primary Text Variations (Select Conversion Angle)
                  </span>
                  <div className="flex items-center space-x-1.5">
                    {postPack.primaryTexts.map((pt, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedStyleIndex(idx)}
                        className={`text-xs px-3 py-1 rounded-lg font-medium transition ${
                          selectedStyleIndex === idx
                            ? 'bg-indigo-600 text-white shadow'
                            : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {pt.style}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Primary Text Box */}
                {postPack.primaryTexts[selectedStyleIndex] && (
                  <div className="relative bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between text-xs text-indigo-400 font-semibold border-b border-slate-800/80 pb-2">
                      <div className="flex items-center space-x-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Hook Angle: {postPack.primaryTexts[selectedStyleIndex].hook}</span>
                      </div>
                      <button
                        onClick={() =>
                          handleCopy(
                            postPack.primaryTexts[selectedStyleIndex].text,
                            `primary-${selectedStyleIndex}`
                          )
                        }
                        className="flex items-center space-x-1 text-slate-400 hover:text-white transition px-2 py-1 rounded bg-slate-900 border border-slate-800"
                      >
                        {copiedKey === `primary-${selectedStyleIndex}` ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400 text-[11px]">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span className="text-[11px]">Copy Text</span>
                          </>
                        )}
                      </button>
                    </div>

                    <pre className="whitespace-pre-wrap font-sans text-xs text-slate-200 leading-relaxed max-h-48 overflow-y-auto">
                      {postPack.primaryTexts[selectedStyleIndex].text}
                    </pre>
                  </div>
                )}
              </div>

              {/* Headlines and Descriptions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Headlines */}
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    2. High-Converting Headlines
                  </span>
                  <div className="space-y-2">
                    {postPack.headlines.map((headline, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between space-x-2 text-xs"
                      >
                        <span className="font-semibold text-slate-200 truncate">{headline}</span>
                        <button
                          onClick={() => handleCopy(headline, `hl-${idx}`)}
                          className="text-slate-400 hover:text-white p-1 rounded bg-slate-900 shrink-0"
                          title="Copy headline"
                        >
                          {copiedKey === `hl-${idx}` ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Link Descriptions & CTA */}
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    3. Feed Link Descriptions & CTA
                  </span>
                  <div className="space-y-2">
                    {postPack.descriptions.map((desc, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between space-x-2 text-xs"
                      >
                        <span className="text-slate-300 truncate">{desc}</span>
                        <button
                          onClick={() => handleCopy(desc, `desc-${idx}`)}
                          className="text-slate-400 hover:text-white p-1 rounded bg-slate-900 shrink-0"
                          title="Copy description"
                        >
                          {copiedKey === `desc-${idx}` ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    ))}

                    <div className="p-3 bg-indigo-950/40 border border-indigo-500/30 rounded-xl flex items-center justify-between text-xs">
                      <span className="text-slate-300 font-medium">Recommended Button CTA:</span>
                      <span className="font-bold text-indigo-300 px-2 py-0.5 bg-indigo-900/60 rounded">
                        {postPack.recommendedCta.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Target Audience & Keywords */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center space-x-2 text-xs font-bold text-slate-200 uppercase tracking-wider">
                  <Target className="w-4 h-4 text-cyan-400" />
                  <span>Meta Ads Manager Targeting Recommendations</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Demographics Profile:</span>
                    <p className="text-slate-200 mt-0.5">{postPack.targetAudience.demographics}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Detailed Interest Keywords:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {postPack.targetAudience.interests.map((interest, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px]"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {postPack.hashtags.length > 0 && (
                  <div className="pt-2 border-t border-slate-900 flex items-center space-x-2 text-xs text-slate-400">
                    <Hash className="w-3.5 h-3.5 text-slate-500" />
                    <span>Hashtags: {postPack.hashtags.join(' ')}</span>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-400 text-sm">No post pack generated yet.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/70 flex items-center justify-between">
          {onRegenerateCopy && (
            <button
              onClick={onRegenerateCopy}
              disabled={isGenerating}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center space-x-1.5 transition disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{isGenerating ? 'Generating...' : 'Re-craft Copy'}</span>
            </button>
          )}

          <div className="flex items-center space-x-3 ml-auto">
            <button
              onClick={handleCopyAll}
              className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center space-x-2 shadow-md shadow-indigo-600/20 transition"
            >
              {copiedKey === 'all' ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>Entire Pack Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Complete Ad Package</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
