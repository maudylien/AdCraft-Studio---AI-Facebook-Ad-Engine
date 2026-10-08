import React from 'react';
import {
  Sliders,
  Sparkles,
  Zap,
  Globe,
  Tag,
  ShoppingBag,
  Target,
  X,
  Check,
} from 'lucide-react';
import { SettingsState } from '../types';

interface SettingsPanelProps {
  settings: SettingsState;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: SettingsState) => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  settings,
  isOpen,
  onClose,
  onSave,
}) => {
  const [form, setForm] = React.useState<SettingsState>(settings);

  React.useEffect(() => {
    setForm(settings);
  }, [settings, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-950 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <Sliders className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100">Campaign & AI Intelligence Settings</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Customize brand voice, optimization objectives, and Gemini AI reasoning parameters.
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
          {/* Brand Info */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
              Brand & Product Information
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <span className="text-xs text-slate-400 block mb-1">Brand / Company Name</span>
                <input
                  type="text"
                  value={form.brandName}
                  onChange={(e) => setForm({ ...form, brandName: e.target.value })}
                  placeholder="e.g. AeroGlide, ZenWave"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <span className="text-xs text-slate-400 block mb-1">Target Market / Country</span>
                <input
                  type="text"
                  value={form.targetCountry}
                  onChange={(e) => setForm({ ...form, targetCountry: e.target.value })}
                  placeholder="e.g. US, Global, Indonesia"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <span className="text-xs text-slate-400 block mb-1">Key Product Details & Core Value</span>
              <textarea
                value={form.productDescription}
                onChange={(e) => setForm({ ...form, productDescription: e.target.value })}
                rows={2}
                placeholder="e.g. Ultra-lightweight carbon fiber running shoe for marathoners..."
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Industry Niche & Ad Objective */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1">
                Industry Niche
              </span>
              <select
                value={form.targetNiche}
                onChange={(e) => setForm({ ...form, targetNiche: e.target.value as any })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-blue-500"
              >
                <option value="ecommerce">E-commerce & Direct To Consumer</option>
                <option value="saas">B2B SaaS & Tech Products</option>
                <option value="fitness_beauty">Beauty, Health & Fitness</option>
                <option value="food_beverage">Food, Beverage & Gourmet</option>
                <option value="leadgen">Local Services & Lead Generation</option>
                <option value="real_estate">Real Estate & High Ticket</option>
                <option value="education">Courses, Info & Webinars</option>
              </select>
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-1">
                Meta Campaign Objective
              </span>
              <select
                value={form.adObjective}
                onChange={(e) => setForm({ ...form, adObjective: e.target.value as any })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-blue-500"
              >
                <option value="sales">Conversions & Online Sales (ROAS)</option>
                <option value="leads">Lead Generation & Sign-ups</option>
                <option value="traffic">Traffic & Click-Through Rate</option>
                <option value="brand_awareness">Brand Awareness & Reach</option>
              </select>
            </div>
          </div>

          {/* High Thinking Engine Toggle */}
          <div className="p-4 rounded-xl border border-purple-500/30 bg-purple-950/20 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-bold text-purple-200">
                  Gemini 3.1 Pro High Thinking Mode
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.useHighThinking}
                  onChange={(e) => setForm({ ...form, useHighThinking: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              When enabled, utilizes <code className="text-purple-300 font-mono">gemini-3.1-pro-preview</code> with <code className="text-purple-300 font-mono">thinkingLevel: HIGH</code> to perform deep cognitive audits: audience psychological triggers, competitor counter-angles, and CRO heuristics.
            </p>
          </div>

          {/* Auto Audit Toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
            <div>
              <span className="text-xs font-semibold text-slate-200 block">
                Auto-Audit On Image Upload
              </span>
              <span className="text-[11px] text-slate-400">
                Immediately evaluate policy compliance and score creative as soon as added.
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={form.autoAnalyzeOnUpload}
                onChange={(e) => setForm({ ...form, autoAnalyzeOnUpload: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Modal Footer */}
          <div className="pt-4 border-t border-slate-800 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center space-x-1.5 shadow-md shadow-blue-500/20 transition"
            >
              <Check className="w-4 h-4" />
              <span>Save Settings</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
