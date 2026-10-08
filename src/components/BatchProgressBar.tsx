import React from 'react';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

interface BatchProgressBarProps {
  total: number;
  current: number;
  currentTaskName: string;
  isProcessing: boolean;
  failedCount?: number;
}

export const BatchProgressBar: React.FC<BatchProgressBarProps> = ({
  total,
  current,
  currentTaskName,
  isProcessing,
  failedCount = 0,
}) => {
  if (!isProcessing && current === 0) return null;

  const percentage = total > 0 ? Math.min(100, Math.round((current / total) * 100)) : 0;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl mb-6">
      <div className="flex items-center justify-between text-xs mb-2">
        <div className="flex items-center space-x-2">
          {isProcessing ? (
            <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          )}
          <span className="font-semibold text-slate-200">
            {isProcessing ? 'Batch Processing in Progress...' : 'Batch Completed'}
          </span>
          <span className="text-slate-400">({current} of {total} completed)</span>
        </div>

        <div className="flex items-center space-x-3">
          {failedCount > 0 && (
            <span className="flex items-center text-rose-400 space-x-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{failedCount} failed</span>
            </span>
          )}
          <span className="font-bold text-blue-400">{percentage}%</span>
        </div>
      </div>

      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <p className="text-[11px] text-slate-400 mt-2 truncate">
        {currentTaskName || 'Processing queue...'}
      </p>
    </div>
  );
};
