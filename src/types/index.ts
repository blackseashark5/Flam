export type FilterType = 'raw' | 'grayscale' | 'canny' | 'sobel';

export interface FrameStats {
  fps: number;
  processingTime: number;
  resolution: {
    width: number;
    height: number;
  };
  frameCount: number;
}

export interface ProcessingOptions {
  cannyThreshold1: number;
  cannyThreshold2: number;
  sobelKernelSize: number;
}
