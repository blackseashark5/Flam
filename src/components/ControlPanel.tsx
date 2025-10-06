import { FilterType, ProcessingOptions } from '../types';
import { Settings, Video, VideoOff } from 'lucide-react';

interface ControlPanelProps {
  isActive: boolean;
  filterType: FilterType;
  processingOptions: ProcessingOptions;
  onToggleCamera: () => void;
  onFilterChange: (filter: FilterType) => void;
  onOptionsChange: (options: ProcessingOptions) => void;
}

export const ControlPanel = ({
  isActive,
  filterType,
  processingOptions,
  onToggleCamera,
  onFilterChange,
  onOptionsChange
}: ControlPanelProps) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-gray-700" />
          <h2 className="text-lg font-semibold text-gray-800">Controls</h2>
        </div>
        <button
          onClick={onToggleCamera}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
            isActive
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          {isActive ? (
            <>
              <VideoOff className="w-4 h-4" />
              Stop Camera
            </>
          ) : (
            <>
              <Video className="w-4 h-4" />
              Start Camera
            </>
          )}
        </button>
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          Processing Filter
        </label>
        <div className="grid grid-cols-2 gap-2">
          {(['raw', 'grayscale', 'sobel', 'canny'] as FilterType[]).map((filter) => (
            <button
              key={filter}
              onClick={() => onFilterChange(filter)}
              className={`px-4 py-2 rounded-lg font-medium transition-all capitalize ${
                filterType === filter
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {filterType === 'canny' && (
        <div className="space-y-4 pt-4 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-700">Canny Edge Detection</h3>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <label className="text-gray-600">Low Threshold</label>
              <span className="font-mono text-gray-800">
                {processingOptions.cannyThreshold1}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="200"
              step="5"
              value={processingOptions.cannyThreshold1}
              onChange={(e) =>
                onOptionsChange({
                  ...processingOptions,
                  cannyThreshold1: parseInt(e.target.value)
                })
              }
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <label className="text-gray-600">High Threshold</label>
              <span className="font-mono text-gray-800">
                {processingOptions.cannyThreshold2}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="255"
              step="5"
              value={processingOptions.cannyThreshold2}
              onChange={(e) =>
                onOptionsChange({
                  ...processingOptions,
                  cannyThreshold2: parseInt(e.target.value)
                })
              }
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>
      )}

      {filterType === 'sobel' && (
        <div className="space-y-4 pt-4 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-700">Sobel Operator</h3>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <label className="text-gray-600">Kernel Size</label>
              <span className="font-mono text-gray-800">
                {processingOptions.sobelKernelSize}x{processingOptions.sobelKernelSize}
              </span>
            </div>
            <input
              type="range"
              min="3"
              max="7"
              step="2"
              value={processingOptions.sobelKernelSize}
              onChange={(e) =>
                onOptionsChange({
                  ...processingOptions,
                  sobelKernelSize: parseInt(e.target.value)
                })
              }
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>
      )}
    </div>
  );
};
