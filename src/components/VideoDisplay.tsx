import { useRef, useEffect } from 'react';

interface VideoDisplayProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  isActive: boolean;
}

export const VideoDisplay = ({ videoRef, canvasRef, isActive }: VideoDisplayProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current && canvasRef.current) {
        const container = containerRef.current;
        const canvas = canvasRef.current;

        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;

        canvas.style.width = `${containerWidth}px`;
        canvas.style.height = `${containerHeight}px`;
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [canvasRef]);

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-4">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-green-400 animate-pulse' : 'bg-gray-500'}`} />
          Real-Time Video Processing
        </h2>
      </div>

      <div
        ref={containerRef}
        className="relative bg-gray-900 aspect-video flex items-center justify-center"
      >
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="absolute inset-0 w-full h-full object-contain hidden"
        />
        <canvas
          ref={canvasRef}
          className="w-full h-full object-contain"
        />
        {!isActive && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="w-24 h-24 mx-auto bg-gray-800 rounded-full flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-gray-400 text-lg font-medium">Camera Inactive</p>
                <p className="text-gray-500 text-sm mt-1">
                  Click "Start Camera" to begin processing
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>WebGL Rendering Engine</span>
          <span className="font-mono">OpenCV-style Processing</span>
        </div>
      </div>
    </div>
  );
};
