import { useCallback, useEffect, useRef, useState } from 'react';
import { FilterType, FrameStats, ProcessingOptions } from '../types';
import { ImageProcessor } from '../utils/imageProcessing';
import { WebGLRenderer } from '../utils/webglRenderer';

interface UseFrameProcessorProps {
  videoElement: HTMLVideoElement | null;
  canvasElement: HTMLCanvasElement | null;
  filterType: FilterType;
  isActive: boolean;
  processingOptions: ProcessingOptions;
}

export const useFrameProcessor = ({
  videoElement,
  canvasElement,
  filterType,
  isActive,
  processingOptions
}: UseFrameProcessorProps) => {
  const [stats, setStats] = useState<FrameStats>({
    fps: 0,
    processingTime: 0,
    resolution: { width: 0, height: 0 },
    frameCount: 0
  });

  const imageProcessorRef = useRef<ImageProcessor | null>(null);
  const webglRendererRef = useRef<WebGLRenderer | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef<number>(0);
  const frameCountRef = useRef<number>(0);
  const fpsUpdateTimeRef = useRef<number>(0);
  const tempCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const tempCtxRef = useRef<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    if (!imageProcessorRef.current) {
      imageProcessorRef.current = new ImageProcessor();
    }

    if (canvasElement && !webglRendererRef.current) {
      try {
        webglRendererRef.current = new WebGLRenderer(canvasElement);
      } catch (err) {
        console.error('WebGL initialization failed:', err);
      }
    }

    if (!tempCanvasRef.current) {
      tempCanvasRef.current = document.createElement('canvas');
      tempCtxRef.current = tempCanvasRef.current.getContext('2d', {
        willReadFrequently: true
      });
    }

    return () => {
      if (webglRendererRef.current) {
        webglRendererRef.current.dispose();
        webglRendererRef.current = null;
      }
    };
  }, [canvasElement]);

  const processFrame = useCallback(() => {
    if (!videoElement || !canvasElement || !isActive) return;
    if (!videoElement.videoWidth || !videoElement.videoHeight) return;

    const startTime = performance.now();

    const width = videoElement.videoWidth;
    const height = videoElement.videoHeight;

    if (canvasElement.width !== width || canvasElement.height !== height) {
      canvasElement.width = width;
      canvasElement.height = height;
      webglRendererRef.current?.resize(width, height);
      imageProcessorRef.current?.setSize(width, height);

      if (tempCanvasRef.current) {
        tempCanvasRef.current.width = width;
        tempCanvasRef.current.height = height;
      }
    }

    if (!tempCtxRef.current || !tempCanvasRef.current) return;

    tempCtxRef.current.drawImage(videoElement, 0, 0, width, height);
    let imageData = tempCtxRef.current.getImageData(0, 0, width, height);

    if (filterType !== 'raw' && imageProcessorRef.current) {
      switch (filterType) {
        case 'grayscale':
          imageData = imageProcessorRef.current.toGrayscale(imageData);
          break;
        case 'sobel':
          imageData = imageProcessorRef.current.applySobelOperator(
            imageData,
            processingOptions.sobelKernelSize
          );
          break;
        case 'canny':
          imageData = imageProcessorRef.current.applyCannyEdgeDetection(
            imageData,
            processingOptions
          );
          break;
      }
    }

    if (webglRendererRef.current) {
      webglRendererRef.current.render(imageData);
    }

    const processingTime = performance.now() - startTime;
    frameCountRef.current++;

    const currentTime = performance.now();
    if (currentTime - fpsUpdateTimeRef.current >= 1000) {
      const fps = Math.round(
        (frameCountRef.current * 1000) / (currentTime - fpsUpdateTimeRef.current)
      );

      setStats({
        fps,
        processingTime: Math.round(processingTime * 100) / 100,
        resolution: { width, height },
        frameCount: frameCountRef.current
      });

      frameCountRef.current = 0;
      fpsUpdateTimeRef.current = currentTime;
    }

    lastFrameTimeRef.current = currentTime;
    animationFrameRef.current = requestAnimationFrame(processFrame);
  }, [videoElement, canvasElement, filterType, isActive, processingOptions]);

  useEffect(() => {
    if (isActive) {
      fpsUpdateTimeRef.current = performance.now();
      frameCountRef.current = 0;
      processFrame();
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isActive, processFrame]);

  return { stats };
};
