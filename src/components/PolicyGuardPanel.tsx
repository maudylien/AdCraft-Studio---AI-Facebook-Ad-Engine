import React from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  XCircle,
  ExternalLink,
  Sparkles,
  Info,
  CheckCircle2,
  X,
} from 'lucide-react';
import { AdImageItem } from '../types';
import { META_POLICY_RULES, evaluatePolicyScore } from '../utils/policyLint';

interface PolicyGuardPanelProps {
  item: AdImageItem;
  isOpen: boolean;
  onClose: () => void;
  onAutoFixTrigger?: (issueMsg: string) => void;
}

export const PolicyGuardPanel: React.FC<PolicyGuardPanelProps> = ({
  item,
  isOpen,
  onClose,
  onAutoFixTrigger,
}) => {
  if (!isOpen) return null;

  const analysis = item.analysis;
  const textDensity = item.estimatedTextDensity || (analysis?.policyCompliance.textOverlayScore ?? 14);
  const issues = analysis?.policyCompliance.issues || [];
  const { status, score, grade } = evaluatePolicyScore(textDensity, issues.length);

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-bold text-slate-100">Meta PolicyGuard</h2>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
                  Ad Standards Linter
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Automated compliance check for Meta Facebook & Instagram Ad policies.
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
          {/* Top Score Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block">Compliance Grade</span>
                <span
                  className={`text-2xl font-black ${
                    grade === 'A+' || grade === 'A'
                      ? 'text-emerald-400'
                      : grade === 'B'
                      ? 'text-amber-400'
                      : 'text-rose-400'
                  }`}
                >
                  Grade {grade}
                </span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center font-bold text-slate-200">
                {score}/100
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block">Text Density (20% rule)</span>
                <span
                  className={`text-xl font-bold ${
                    textDensity <= 20 ? 'text-emerald-400' : 'text-amber-400'
                  }`}
                >
                  ~{textDensity}% Text
                </span>
              </div>
              <div className="text-[10px] font-semibold text-slate-500 text-right">
                {textDensity <= 20 ? 'Optimal Reach' : 'May reduce reach'}
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block">Identified Issues</span>
                <span className="text-xl font-bold text-slate-100">
                  {issues.length === 0 ? 'None (Clean)' : `${issues.length} Flagged`}
                </span>
              </div>
              <div>
                {issues.length === 0 ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                ) : (
                  <AlertTriangle className="w-6 h-6 text-amber-400" />
                )}
              </div>
            </div>
          </div>

          {/* Text Density Visual Meter */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-200 flex items-center space-x-1.5">
                <Info className="w-3.5 h-3.5 text-blue-400" />
                <span>Text Overlay Volume vs 20% Meta Benchmark</span>
              </span>
              <span className="font-mono text-slate-300">{textDensity}% area covered</span>
            </div>

            <div className="relative w-full h-3 bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  textDensity <= 20
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                    : 'bg-gradient-to-r from-amber-500 to-rose-500'
                }`}
                style={{ width: `${Math.min(100, textDensity * 2)}%` }}
              />
              {/* 20% marker line */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-white/70"
                style={{ left: '40%' }}
                title="20% standard threshold"
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>0% (Minimal text)</span>
              <span className="text-emerald-400 font-semibold">20% Optimal Boundary</span>
              <span>50%+ (High penalty)</span>
            </div>
          </div>

          {/* Policy Compliance Checks */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Meta Advertising Standards Checks
            </h3>

            <div className="space-y-2.5">
              {META_POLICY_RULES.map((rule) => {
                const isFlagged = issues.some((i) => i.rule.toLowerCase().includes(rule.category.toLowerCase()));
                return (
                  <div
                    key={rule.id}
                    className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-start justify-between space-x-3"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="mt-0.5">
                        {isFlagged ? (
                          <AlertTriangle className="w-4 h-4 text-amber-400" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-semibold text-slate-200">{rule.name}</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                            {rule.category}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">{rule.description}</p>
                      </div>
                    </div>

                    <a
                      href={rule.standardUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-500 hover:text-slate-300 p-1"
                      title="View official Meta Policy document"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Flagged Issues Details (if any) */}
          {issues.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-rose-400">
                Action Items & Fix Recommendations
              </h3>
              <div className="space-y-2">
                {issues.map((issue, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-500/30 text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-rose-200">{issue.rule}</span>
                      <span className="text-[10px] uppercase font-bold text-rose-400 px-1.5 py-0.5 rounded bg-rose-900/40">
                        {issue.severity} priority
                      </span>
                    </div>
                    <p className="text-slate-300">{issue.message}</p>
                    <div className="mt-2 p-2 bg-slate-900/90 rounded border border-slate-800 text-slate-300 flex items-start space-x-2">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-amber-300">Suggested Adjustment: </span>
                        {issue.fixSuggestion}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/70 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
          >
            Close Policy Guard
          </button>
        </div>
      </div>
    </div>
  );
};
