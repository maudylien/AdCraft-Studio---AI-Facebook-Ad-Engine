import React, { useRef, useState } from 'react';
import { UploadCloud, Image as ImageIcon, Sparkles, Plus } from 'lucide-react';
import { SAMPLE_IMAGES, SampleImagePreset } from '../utils/sampleImages';

interface DropZoneProps {
  onFilesSelected: (files: File[]) => void;
  onSampleSelected: (preset: SampleImagePreset) => void;
  onLoadAllSamples: () => void;
  hasItems: boolean;
}

export const DropZone: React.FC<DropZoneProps> = ({
  onFilesSelected,
  onSampleSelected,
  onLoadAllSamples,
  hasItems,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const validFiles = Array.from(e.dataTransfer.files).filter((file) =>
        file.type.startsWith('image/')
      );
      if (validFiles.length > 0) {
        onFilesSelected(validFiles);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const validFiles = Array.from(e.target.files).filter((file) =>
        file.type.startsWith('image/')
      );
      if (validFiles.length > 0) {
        onFilesSelected(validFiles);
      }
    }
    // reset input value so re-uploading same file triggers change
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="w-full space-y-4">
      {/* Upload Drop Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-200 overflow-hidden ${
          isDragOver
            ? 'border-blue-500 bg-blue-500/10 scale-[1.005]'
            : 'border-slate-700 hover:border-slate-600 bg-slate-900/60 hover:bg-slate-900/90'
        } ${hasItems ? 'py-6 px-6' : 'py-12 px-6 text-center'}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/avif"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />

        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600/20 to-cyan-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <UploadCloud className="w-6 h-6" />
          </div>

          <div className="text-center">
            <p className="text-sm font-semibold text-slate-200">
              Drag & drop Meta ad creatives here, or{' '}
              <span className="text-blue-400 underline decoration-blue-400/50 underline-offset-2">
                browse files
              </span>
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Supports high-res PNG, JPG, WebP. Multiple files supported for batch processing.
            </p>
          </div>
        </div>
      </div>

      {/* Preset Samples Picker */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-300">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Or try ready-to-test sample ad creatives:</span>
          </div>
          <button
            onClick={onLoadAllSamples}
            className="text-xs text-blue-400 hover:text-blue-300 font-medium transition flex items-center space-x-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Load All 5 Presets</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
          {SAMPLE_IMAGES.map((preset) => (
            <button
              key={preset.id}
              onClick={() => onSampleSelected(preset)}
              className="group text-left relative overflow-hidden rounded-lg border border-slate-800 hover:border-blue-500/50 bg-slate-950 transition hover:shadow-lg hover:shadow-blue-500/10"
            >
              <div className="h-20 w-full overflow-hidden bg-slate-800 relative">
                <img
                  src={preset.url}
                  alt={preset.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <span className="absolute bottom-1 left-1 text-[9px] font-semibold bg-black/70 backdrop-blur-xs text-white px-1.5 py-0.5 rounded">
                  {preset.category}
                </span>
              </div>
              <div className="p-2">
                <p className="text-xs font-medium text-slate-200 truncate group-hover:text-blue-400 transition">
                  {preset.name}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
