import { useState, useRef } from 'react';
import { FilterType, ProcessingOptions } from './types';
import { useCamera } from './hooks/useCamera';
import { useFrameProcessor } from './hooks/useFrameProcessor';
import { VideoDisplay } from './components/VideoDisplay';
import { ControlPanel } from './components/ControlPanel';
import { StatsPanel } from './components/StatsPanel';
import { Eye } from 'lucide-react';

function App() {
  const [filterType, setFilterType] = useState<FilterType>('raw');
  const [processingOptions, setProcessingOptions] = useState<ProcessingOptions>({
    cannyThreshold1: 50,
    cannyThreshold2: 150,
    sobelKernelSize: 3
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { videoRef, isActive, error, startCamera, stopCamera } = useCamera();

  const { stats } = useFrameProcessor({
    videoElement: videoRef.current,
    canvasElement: canvasRef.current,
    filterType,
    isActive,
    processingOptions
  });

  const handleToggleCamera = () => {
    if (isActive) {
      stopCamera();
    } else {
      startCamera();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 rounded-lg p-3 shadow-lg">
                <Eye className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Real-Time Edge Detection Viewer
                </h1>
                <p className="text-gray-600 mt-1">
                  WebGL Rendering + OpenCV-style Image Processing
                </p>
              </div>
            </div>
          </div>
        </header>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-red-800 font-medium">Camera Error:</span>
              <span className="text-red-700">{error}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <VideoDisplay
              videoRef={videoRef}
              canvasRef={canvasRef}
              isActive={isActive}
            />
          </div>

          <div className="space-y-6">
            <ControlPanel
              isActive={isActive}
              filterType={filterType}
              processingOptions={processingOptions}
              onToggleCamera={handleToggleCamera}
              onFilterChange={setFilterType}
              onOptionsChange={setProcessingOptions}
            />

            <StatsPanel stats={stats} isActive={isActive} />
          </div>
        </div>

        <footer className="mt-12 text-center text-gray-600 text-sm">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-semibold text-gray-800 mb-3 text-base">
              Technical Implementation
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Image Processing</h4>
                <ul className="text-xs space-y-1">
                  <li>• Canny Edge Detection</li>
                  <li>• Sobel Operator</li>
                  <li>• Gaussian Blur</li>
                  <li>• Grayscale Conversion</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Rendering</h4>
                <ul className="text-xs space-y-1">
                  <li>• WebGL ES 2.0</li>
                  <li>• Custom Shaders (GLSL)</li>
                  <li>• Texture Mapping</li>
                  <li>• Hardware Acceleration</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Performance</h4>
                <ul className="text-xs space-y-1">
                  <li>• Real-time Processing</li>
                  <li>• 30+ FPS Target</li>
                  <li>• Low Latency Pipeline</li>
                  <li>• Optimized Algorithms</li>
                </ul>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
