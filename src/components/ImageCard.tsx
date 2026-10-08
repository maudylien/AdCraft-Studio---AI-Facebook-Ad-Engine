import React from 'react';
import {
  Crop,
  Sparkles,
  FileText,
  Eye,
  Video,
  Trash2,
  ShieldCheck,
  AlertTriangle,
  XCircle,
  Loader2,
  Compass,
} from 'lucide-react';
import { AdImageItem } from '../types';

interface ImageCardProps {
  item: AdImageItem;
  onOpenCrop: (item: AdImageItem) => void;
  onAnalyze: (item: AdImageItem) => void;
  onOpenPolicy: (item: AdImageItem) => void;
  onOpenPostPack: (item: AdImageItem) => void;
  onOpenMockup: (item: AdImageItem) => void;
  onOpenVeo: (item: AdImageItem) => void;
  onRemove: (id: string) => void;
}

export const ImageCard: React.FC<ImageCardProps> = ({
  item,
  onOpenCrop,
  onAnalyze,
  onOpenPolicy,
  onOpenPostPack,
  onOpenMockup,
  onOpenVeo,
  onRemove,
}) => {
  const analysis = item.analysis;
  const policyStatus = analysis?.policyStatus || 'pass';

  return (
    <div className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-2xl overflow-hidden shadow-lg transition-all duration-200 flex flex-col group">
      {/* Image Preview & Overlay Badges */}
      <div className="relative aspect-square w-full bg-slate-950 overflow-hidden flex items-center justify-center">
        <img
          src={item.previewUrl}
          alt={item.name}
          className="w-full h-full object-contain group-hover:scale-[1.02] transition duration-300"
        />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
          <span className="text-[10px] font-semibold tracking-wide px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-md text-slate-200 border border-white/10">
            {item.width} × {item.height} ({item.aspectRatio})
          </span>

          {analysis && (
            <div
              className={`text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-md flex items-center space-x-1 border ${
                policyStatus === 'pass'
                  ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/30'
                  : policyStatus === 'warning'
                  ? 'bg-amber-950/80 text-amber-300 border-amber-500/30'
                  : 'bg-rose-950/80 text-rose-300 border-rose-500/30'
              }`}
            >
              {policyStatus === 'pass' && <ShieldCheck className="w-3 h-3 text-emerald-400" />}
              {policyStatus === 'warning' && <AlertTriangle className="w-3 h-3 text-amber-400" />}
              {policyStatus === 'violation' && <XCircle className="w-3 h-3 text-rose-400" />}
              <span className="uppercase">{policyStatus}</span>
            </div>
          )}
        </div>

        {/* Focal Point Indicator */}
        <div
          className="absolute w-4 h-4 rounded-full border-2 border-cyan-400 bg-cyan-400/30 -translate-x-1/2 -translate-y-1/2 pointer-events-none shadow-md shadow-cyan-500/50"
          style={{ left: `${item.focalPoint.x}%`, top: `${item.focalPoint.y}%` }}
          title={`Focal point: (${Math.round(item.focalPoint.x)}%, ${Math.round(item.focalPoint.y)}%)`}
        >
          <div className="w-1 h-1 bg-white rounded-full mx-auto my-1" />
        </div>

        {/* Quick Crop button overlay */}
        <button
          onClick={() => onOpenCrop(item)}
          className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-black/80 hover:bg-black text-white text-xs font-medium backdrop-blur-md flex items-center space-x-1.5 border border-white/15 transition shadow-md"
        >
          <Compass className="w-3.5 h-3.5 text-cyan-400" />
          <span>Focal Crop</span>
        </button>
      </div>

      {/* Info Section */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between">
            <h3 className="font-semibold text-sm text-slate-100 truncate pr-2" title={item.name}>
              {item.name}
            </h3>
            <button
              onClick={() => onRemove(item.id)}
              className="text-slate-500 hover:text-rose-400 transition p-1"
              title="Delete creative"
              aria-label="Delete"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Key Metrics / Scores */}
          {analysis ? (
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Overall Score</span>
                <span className="text-base font-bold text-slate-100">
                  {analysis.overallScore}
                  <span className="text-xs text-slate-500">/100</span>
                </span>
              </div>
              <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Thumb-Stop Power</span>
                <span className="text-base font-bold text-cyan-400">
                  {analysis.thumbStopScore}
                  <span className="text-xs text-slate-500">/100</span>
                </span>
              </div>
            </div>
          ) : (
            <div className="mt-3 p-2.5 bg-slate-950/40 rounded-xl border border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Ready for AI Deep Audit</span>
              <span className="text-[10px] text-slate-500">Unanalyzed</span>
            </div>
          )}

          {/* Model badge or short suggestion */}
          {analysis && analysis.croRecommendations.length > 0 && (
            <p className="mt-2 text-[11px] text-slate-400 line-clamp-1">
              💡 {analysis.croRecommendations[0].title}
            </p>
          )}
        </div>

        {/* Action Button Grid */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-1.5">
          <button
            onClick={() => onAnalyze(item)}
            disabled={item.isAnalyzing}
            className="col-span-2 py-2 px-3 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold flex items-center justify-center space-x-1.5 shadow-md shadow-blue-600/20 transition disabled:opacity-50"
          >
            {item.isAnalyzing ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Auditing Creative...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>{analysis ? 'Re-Audit Creative' : 'Deep Creative Audit'}</span>
              </>
            )}
          </button>

          <button
            onClick={() => onOpenPolicy(item)}
            className="py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white text-xs font-medium border border-slate-700/80 flex items-center justify-center space-x-1 transition"
            title="Meta Advertising Standards Compliance"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Policy Guard</span>
          </button>

          <button
            onClick={() => onOpenPostPack(item)}
            className="py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white text-xs font-medium border border-slate-700/80 flex items-center justify-center space-x-1 transition"
            title="Generate Facebook Ad Copy & Post Pack"
          >
            <FileText className="w-3.5 h-3.5 text-indigo-400" />
            <span>Post Pack</span>
          </button>

          <button
            onClick={() => onOpenMockup(item)}
            className="py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white text-xs font-medium border border-slate-700/80 flex items-center justify-center space-x-1 transition"
            title="Interactive Facebook Feed Mockup"
          >
            <Eye className="w-3.5 h-3.5 text-blue-400" />
            <span>Ad Mockup</span>
          </button>

          <button
            onClick={() => onOpenVeo(item)}
            className="py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white text-xs font-medium border border-slate-700/80 flex items-center justify-center space-x-1 transition"
            title="Animate into Video Ad with Veo"
          >
            <Video className="w-3.5 h-3.5 text-pink-400" />
            <span>Reel Motion</span>
          </button>
        </div>
      </div>
    </div>
  );
};
