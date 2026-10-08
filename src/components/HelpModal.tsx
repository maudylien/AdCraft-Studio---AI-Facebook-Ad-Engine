import React from 'react';
import { HelpCircle, ShieldAlert, Sparkles, Smartphone, Layers, X, ExternalLink } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-950 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100">Meta Creative & Policy Playbook</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Pro tips and benchmarks for scaling high-converting Facebook & Instagram ads.
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
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-300 leading-relaxed">
          {/* Section 1: Aspect Ratios */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
            <div className="flex items-center space-x-2 text-slate-100 font-bold uppercase tracking-wider">
              <Smartphone className="w-4 h-4 text-cyan-400" />
              <span>1. Recommended Placement Ratios</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-slate-400">
              <li>
                <strong className="text-slate-200">1:1 Square (1080×1080):</strong> The gold standard for Desktop & Mobile feeds. Highest inventory compatibility.
              </li>
              <li>
                <strong className="text-slate-200">4:5 Vertical (1080×1350):</strong> Optimal for Mobile Feeds. Captures up to 25% more screen height without getting cut off.
              </li>
              <li>
                <strong className="text-slate-200">9:16 Full Screen (1080×1920):</strong> Mandatory for Instagram Stories, Facebook Reels, and TikTok.
              </li>
              <li>
                <strong className="text-slate-200">1.91:1 Landscape (1200×628):</strong> Standard for website link preview cards and desktop right-column ads.
              </li>
            </ul>
          </div>

          {/* Section 2: Policy Compliance */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
            <div className="flex items-center space-x-2 text-slate-100 font-bold uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4 text-emerald-400" />
              <span>2. Meta Advertising Standards Guardrails</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-slate-400">
              <li>
                <strong className="text-slate-200">The 20% Text Rule:</strong> While Meta no longer strictly rejects ads with over 20% text, ads with excessive text experience significantly higher CPMs and throttled distribution.
              </li>
              <li>
                <strong className="text-slate-200">No Personal Attributes:</strong> Never use questions like &ldquo;Struggling with debt?&rdquo; or direct assertions of age, disability, or weight. Frame solutions objectively around the product.
              </li>
              <li>
                <strong className="text-slate-200">No Deceptive UI:</strong> Fake video play buttons, false checkboxes, or non-functional sliders violate Meta deceptive content policies.
              </li>
            </ul>
          </div>

          {/* Section 3: High Thinking AI */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
            <div className="flex items-center space-x-2 text-slate-100 font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>3. Gemini 3.1 Pro High Thinking Reasoning</span>
            </div>
            <p className="text-slate-400">
              Our integrated deep thinking engine runs full cognitive simulations on your creatives. It evaluates visual scroll-stopping thumb power, breaks down psychological buyer motivators (FOMO, status elevation, problem alleviation), and generates multivariate A/B testing matrix hypotheses.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/70 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
