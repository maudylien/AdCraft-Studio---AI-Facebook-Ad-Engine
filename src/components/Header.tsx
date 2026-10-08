import React from 'react';
import { Sparkles, Sliders, HelpCircle, Layers, ShieldCheck, Zap } from 'lucide-react';
import { SettingsState } from '../types';

interface HeaderProps {
  settings: SettingsState;
  onOpenSettings: () => void;
  onOpenHelp: () => void;
  onLoadSample: () => void;
  itemsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  onOpenSettings,
  onOpenHelp,
  onLoadSample,
  itemsCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 p-0.5 flex items-center justify-center shadow-lg shadow-blue-500/25">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Layers className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                  AdCraft Studio
                </h1>
                <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  Meta Ad Engine
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                AI Deep Creative Optimizer & Multi-Format Crop Engine
              </p>
            </div>
          </div>

          {/* Center Badges & Model Mode */}
          <div className="hidden md:flex items-center space-x-2">
            <div
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                settings.useHighThinking
                  ? 'bg-purple-950/60 border-purple-500/40 text-purple-300 shadow-sm shadow-purple-500/20'
                  : 'bg-slate-800/80 border-slate-700 text-slate-300'
              }`}
            >
              {settings.useHighThinking ? (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
                  <span>High Thinking (Gemini 3.1 Pro)</span>
                </>
              ) : (
                <>
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Fast Mode (Gemini 3.8 Flash)</span>
                </>
              )}
            </div>

            <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-950/50 border border-emerald-500/30 text-emerald-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>PolicyGuard Active</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {itemsCount === 0 && (
              <button
                onClick={onLoadSample}
                className="hidden sm:inline-flex items-center space-x-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
              >
                <span>Load Sample Ads</span>
              </button>
            )}

            <button
              onClick={onOpenSettings}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition"
              title="Campaign & AI Settings"
              aria-label="Settings"
            >
              <Sliders className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenHelp}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition"
              title="Meta Ad Guidelines & Help"
              aria-label="Help"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
