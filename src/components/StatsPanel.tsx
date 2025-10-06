import { FrameStats } from '../types';
import { Activity, Clock, Maximize2, Hash } from 'lucide-react';

interface StatsPanelProps {
  stats: FrameStats;
  isActive: boolean;
}

export const StatsPanel = ({ stats, isActive }: StatsPanelProps) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Performance Metrics</h2>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">FPS</span>
          </div>
          <div className="text-3xl font-bold text-blue-700">
            {isActive ? stats.fps : 0}
          </div>
          <div className="text-xs text-blue-600 mt-1">frames per second</div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-900">Processing Time</span>
          </div>
          <div className="text-3xl font-bold text-green-700">
            {isActive ? stats.processingTime.toFixed(2) : '0.00'}
          </div>
          <div className="text-xs text-green-600 mt-1">milliseconds</div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Maximize2 className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-900">Resolution</span>
          </div>
          <div className="text-xl font-bold text-purple-700">
            {stats.resolution.width} × {stats.resolution.height}
          </div>
          <div className="text-xs text-purple-600 mt-1">pixels</div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Hash className="w-4 h-4 text-orange-600" />
            <span className="text-sm font-medium text-orange-900">Total Frames</span>
          </div>
          <div className="text-3xl font-bold text-orange-700">
            {stats.frameCount}
          </div>
          <div className="text-xs text-orange-600 mt-1">processed</div>
        </div>
      </div>

      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Camera Status</span>
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                isActive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
              }`}
            />
            <span className={`font-medium ${isActive ? 'text-green-700' : 'text-gray-500'}`}>
              {isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
