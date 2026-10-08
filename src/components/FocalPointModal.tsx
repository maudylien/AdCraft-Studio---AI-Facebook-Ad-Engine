import React, { useState, useRef, useEffect, useCallback } from 'react';
import { X, Download, Check, Sparkles, RefreshCw, ZoomIn } from 'lucide-react';
import { AdImageItem, AspectRatioOption } from '../types';
import { ASPECT_RATIOS, generateCropDataUrl, downloadFile } from '../utils/imageEngine';

interface FocalPointModalProps {
  item: AdImageItem;
  isOpen: boolean;
  onClose: () => void;
  onSaveFocalPoint: (itemId: string, focal: { x: number; y: number }) => void;
}

export const FocalPointModal: React.FC<FocalPointModalProps> = ({
  item,
  isOpen,
  onClose,
  onSaveFocalPoint,
}) => {
  const [focal, setFocal] = useState<{ x: number; y: number }>(item.focalPoint);
  const [activeTab, setActiveTab] = useState<AspectRatioOption>('1:1');
  const [croppedPreviews, setCroppedPreviews] = useState<Record<AspectRatioOption, string | null>>({
    '1:1': null,
    '4:5': null,
    '9:16': null,
    '1.91:1': null,
  });
  const [isExporting, setIsExporting] = useState(false);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  // Sync when item opens
  useEffect(() => {
    setFocal(item.focalPoint);
  }, [item]);

  // Generate cropped preview data URLs whenever focal point changes
  const updatePreviews = useCallback(async () => {
    const ratios: AspectRatioOption[] = ['1:1', '4:5', '9:16', '1.91:1'];
    const updated: Record<AspectRatioOption, string | null> = {
      '1:1': null,
      '4:5': null,
      '9:16': null,
      '1.91:1': null,
    };

    for (const r of ratios) {
      try {
        const url = await generateCropDataUrl(item.previewUrl, r, focal.x, focal.y, 0.85);
        updated[r] = url;
      } catch (err) {
        console.error('Error generating crop for', r, err);
      }
    }
    setCroppedPreviews(updated);
  }, [item.previewUrl, focal.x, focal.y]);

  useEffect(() => {
    if (isOpen) {
      updatePreviews();
    }
  }, [isOpen, updatePreviews]);

  if (!isOpen) return null;

  const handlePointerInteraction = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current) return;
    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    setFocal({ x, y });
  };

  const handleSave = () => {
    onSaveFocalPoint(item.id, focal);
    onClose();
  };

  const handleDownloadCrop = async (ratio: AspectRatioOption) => {
    try {
      const dataUrl = await generateCropDataUrl(item.previewUrl, ratio, focal.x, focal.y, 0.95);
      const cleanName = item.name.replace(/\.[^/.]+$/, '');
      downloadFile(dataUrl, `${cleanName}_${ratio.replace(':', 'x')}_adcraft.jpg`);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDownloadAllCrops = async () => {
    setIsExporting(true);
    try {
      const ratios: AspectRatioOption[] = ['1:1', '4:5', '9:16', '1.91:1'];
      for (const r of ratios) {
        await handleDownloadCrop(r);
      }
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-5xl shadow-2xl flex flex-col overflow-hidden max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-bold text-slate-100">Smart Focal Point & Multi-Crop</h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800">
                Meta Ad Placements
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Click or drag the crosshair on the source image to keep the hero product or subject in focus across all ad dimensions.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Source Image with Crosshair selector */}
          <div className="lg:col-span-6 flex flex-col space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span className="font-semibold flex items-center space-x-1.5">
                <ZoomIn className="w-4 h-4 text-cyan-400" />
                <span>Original Creative (Click to pin focal center)</span>
              </span>
              <span className="text-slate-400 font-mono text-[11px]">
                X: {Math.round(focal.x)}% | Y: {Math.round(focal.y)}%
              </span>
            </div>

            <div
              ref={imageContainerRef}
              onClick={handlePointerInteraction}
              onMouseDown={(e) => {
                handlePointerInteraction(e);
                const onMouseMove = (moveEvent: MouseEvent) => {
                  if (!imageContainerRef.current) return;
                  const rect = imageContainerRef.current.getBoundingClientRect();
                  const x = Math.max(0, Math.min(100, ((moveEvent.clientX - rect.left) / rect.width) * 100));
                  const y = Math.max(0, Math.min(100, ((moveEvent.clientY - rect.top) / rect.height) * 100));
                  setFocal({ x, y });
                };
                const onMouseUp = () => {
                  window.removeEventListener('mousemove', onMouseMove);
                  window.removeEventListener('mouseup', onMouseUp);
                };
                window.addEventListener('mousemove', onMouseMove);
                window.addEventListener('mouseup', onMouseUp);
              }}
              className="relative select-none cursor-crosshair rounded-xl overflow-hidden bg-slate-950 border border-slate-700 aspect-square flex items-center justify-center shadow-inner group"
            >
              <img
                src={item.previewUrl}
                alt={item.name}
                className="w-full h-full object-contain pointer-events-none"
              />

              {/* Rule of thirds grid guidelines */}
              <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none opacity-20">
                <div className="border-r border-b border-white" />
                <div className="border-r border-b border-white" />
                <div className="border-b border-white" />
                <div className="border-r border-b border-white" />
                <div className="border-r border-b border-white" />
                <div className="border-b border-white" />
                <div className="border-r border-white" />
                <div className="border-r border-white" />
                <div />
              </div>

              {/* Focal crosshair pin */}
              <div
                className="absolute pointer-events-none -translate-x-1/2 -translate-y-1/2 transition-transform duration-75"
                style={{ left: `${focal.x}%`, top: `${focal.y}%` }}
              >
                <div className="relative flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full border-2 border-cyan-400 bg-cyan-400/20 shadow-lg shadow-cyan-500/50 flex items-center justify-center animate-pulse">
                    <div className="w-2 h-2 rounded-full bg-cyan-300" />
                  </div>
                  {/* Crosshair lines */}
                  <div className="absolute w-14 h-[1px] bg-cyan-400/80" />
                  <div className="absolute h-14 w-[1px] bg-cyan-400/80" />
                </div>
              </div>

              <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded text-[10px] text-slate-300 pointer-events-none">
                💡 Drag target to key product or face
              </div>
            </div>

            {/* Quick Presets */}
            <div className="flex items-center space-x-2 pt-1">
              <span className="text-[11px] text-slate-400">Quick Align:</span>
              <button
                onClick={() => setFocal({ x: 50, y: 50 })}
                className="text-[11px] px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                Center (50/50)
              </button>
              <button
                onClick={() => setFocal({ x: 50, y: 35 })}
                className="text-[11px] px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                Upper Third (Portrait)
              </button>
              <button
                onClick={() => setFocal({ x: 35, y: 50 })}
                className="text-[11px] px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                Left Third
              </button>
            </div>
          </div>

          {/* Right: Live Placement Previews & Export */}
          <div className="lg:col-span-6 flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-200">
                Format Previews (Meta Placement Ready)
              </span>
              <button
                onClick={updatePreviews}
                className="text-xs text-slate-400 hover:text-cyan-400 flex items-center space-x-1 transition"
                title="Refresh preview renders"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Re-render</span>
              </button>
            </div>

            {/* Ratio selection tabs */}
            <div className="grid grid-cols-4 gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800">
              {(Object.keys(ASPECT_RATIOS) as AspectRatioOption[]).map((r) => (
                <button
                  key={r}
                  onClick={() => setActiveTab(r)}
                  className={`py-2 px-1 text-center rounded-lg transition text-xs font-medium ${
                    activeTab === r
                      ? 'bg-blue-600 text-white shadow'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <div className="font-bold">{r}</div>
                  <div className="text-[10px] opacity-75 truncate">{ASPECT_RATIOS[r].sublabel}</div>
                </button>
              ))}
            </div>

            {/* Active Preview Display */}
            <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 flex flex-col items-center justify-center min-h-[300px]">
              <div className="text-center mb-3">
                <span className="text-xs font-bold text-slate-200">
                  {ASPECT_RATIOS[activeTab].label} ({ASPECT_RATIOS[activeTab].w} × {ASPECT_RATIOS[activeTab].h}px)
                </span>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {ASPECT_RATIOS[activeTab].description}
                </p>
              </div>

              {croppedPreviews[activeTab] ? (
                <div
                  className="relative rounded-lg overflow-hidden border border-slate-700 shadow-xl max-h-[260px] flex items-center justify-center bg-black"
                  style={{
                    aspectRatio: `${ASPECT_RATIOS[activeTab].ratio}`,
                    width: activeTab === '9:16' ? '150px' : activeTab === '1.91:1' ? '300px' : '220px',
                  }}
                >
                  <img
                    src={croppedPreviews[activeTab]!}
                    alt="Cropped output"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="py-12 text-xs text-slate-500 animate-pulse">Rendering preview...</div>
              )}

              <div className="mt-4 flex items-center space-x-2">
                <button
                  onClick={() => handleDownloadCrop(activeTab)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center space-x-1.5 transition"
                >
                  <Download className="w-3.5 h-3.5 text-blue-400" />
                  <span>Download {activeTab} JPEG</span>
                </button>
              </div>
            </div>

            {/* All 4 Formats Thumbnail Strip */}
            <div className="grid grid-cols-4 gap-2 pt-2">
              {(Object.keys(ASPECT_RATIOS) as AspectRatioOption[]).map((r) => (
                <div
                  key={r}
                  onClick={() => setActiveTab(r)}
                  className={`cursor-pointer rounded-lg border p-1.5 transition text-center ${
                    activeTab === r ? 'border-cyan-400 bg-cyan-950/20' : 'border-slate-800 hover:border-slate-700 bg-slate-950'
                  }`}
                >
                  <div className="h-14 flex items-center justify-center overflow-hidden rounded bg-black">
                    {croppedPreviews[r] ? (
                      <img src={croppedPreviews[r]!} alt={r} className="h-full object-cover" />
                    ) : (
                      <span className="text-[10px] text-slate-600">...</span>
                    )}
                  </div>
                  <span className="text-[10px] font-semibold text-slate-300 block mt-1">{r}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <button
            onClick={handleDownloadAllCrops}
            disabled={isExporting}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center space-x-2 border border-slate-700 transition"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <span>{isExporting ? 'Exporting...' : 'Export All 4 Ratios'}</span>
          </button>

          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold flex items-center space-x-2 shadow-md shadow-blue-500/20 transition"
            >
              <Check className="w-4 h-4" />
              <span>Apply Focal Point</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
