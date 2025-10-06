import { ProcessingOptions } from '../types';

export class ImageProcessor {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d', { willReadFrequently: true })!;
  }

  setSize(width: number, height: number): void {
    this.canvas.width = width;
    this.canvas.height = height;
  }

  toGrayscale(imageData: ImageData): ImageData {
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      data[i] = gray;
      data[i + 1] = gray;
      data[i + 2] = gray;
    }
    return imageData;
  }

  applySobelOperator(imageData: ImageData, kernelSize: number = 3): ImageData {
    const width = imageData.width;
    const height = imageData.height;
    const src = imageData.data;
    const dst = new Uint8ClampedArray(src.length);

    const sobelX = [
      [-1, 0, 1],
      [-2, 0, 2],
      [-1, 0, 1]
    ];

    const sobelY = [
      [-1, -2, -1],
      [0, 0, 0],
      [1, 2, 1]
    ];

    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        let gx = 0, gy = 0;

        for (let ky = -1; ky <= 1; ky++) {
          for (let kx = -1; kx <= 1; kx++) {
            const idx = ((y + ky) * width + (x + kx)) * 4;
            const gray = 0.299 * src[idx] + 0.587 * src[idx + 1] + 0.114 * src[idx + 2];
            gx += gray * sobelX[ky + 1][kx + 1];
            gy += gray * sobelY[ky + 1][kx + 1];
          }
        }

        const magnitude = Math.sqrt(gx * gx + gy * gy);
        const idx = (y * width + x) * 4;
        dst[idx] = magnitude;
        dst[idx + 1] = magnitude;
        dst[idx + 2] = magnitude;
        dst[idx + 3] = 255;
      }
    }

    return new ImageData(dst, width, height);
  }

  applyCannyEdgeDetection(
    imageData: ImageData,
    options: ProcessingOptions
  ): ImageData {
    const width = imageData.width;
    const height = imageData.height;

    const grayscale = this.toGrayscale(new ImageData(
      new Uint8ClampedArray(imageData.data),
      width,
      height
    ));

    const blurred = this.gaussianBlur(grayscale);
    const gradients = this.computeGradients(blurred);
    const suppressed = this.nonMaximumSuppression(gradients);
    const edges = this.doubleThreshold(
      suppressed,
      options.cannyThreshold1,
      options.cannyThreshold2
    );

    return edges;
  }

  private gaussianBlur(imageData: ImageData): ImageData {
    const width = imageData.width;
    const height = imageData.height;
    const src = imageData.data;
    const dst = new Uint8ClampedArray(src.length);

    const kernel = [
      [1, 2, 1],
      [2, 4, 2],
      [1, 2, 1]
    ];
    const kernelSum = 16;

    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        let sum = 0;

        for (let ky = -1; ky <= 1; ky++) {
          for (let kx = -1; kx <= 1; kx++) {
            const idx = ((y + ky) * width + (x + kx)) * 4;
            sum += src[idx] * kernel[ky + 1][kx + 1];
          }
        }

        const idx = (y * width + x) * 4;
        const value = sum / kernelSum;
        dst[idx] = value;
        dst[idx + 1] = value;
        dst[idx + 2] = value;
        dst[idx + 3] = 255;
      }
    }

    return new ImageData(dst, width, height);
  }

  private computeGradients(imageData: ImageData): {
    magnitude: Float32Array;
    direction: Float32Array;
  } {
    const width = imageData.width;
    const height = imageData.height;
    const src = imageData.data;

    const magnitude = new Float32Array(width * height);
    const direction = new Float32Array(width * height);

    const sobelX = [[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]];
    const sobelY = [[-1, -2, -1], [0, 0, 0], [1, 2, 1]];

    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        let gx = 0, gy = 0;

        for (let ky = -1; ky <= 1; ky++) {
          for (let kx = -1; kx <= 1; kx++) {
            const idx = ((y + ky) * width + (x + kx)) * 4;
            const pixel = src[idx];
            gx += pixel * sobelX[ky + 1][kx + 1];
            gy += pixel * sobelY[ky + 1][kx + 1];
          }
        }

        const idx = y * width + x;
        magnitude[idx] = Math.sqrt(gx * gx + gy * gy);
        direction[idx] = Math.atan2(gy, gx);
      }
    }

    return { magnitude, direction };
  }

  private nonMaximumSuppression(gradients: {
    magnitude: Float32Array;
    direction: Float32Array;
  }): Float32Array {
    const { magnitude, direction } = gradients;
    const suppressed = new Float32Array(magnitude.length);
    const width = Math.sqrt(magnitude.length);

    for (let i = 0; i < magnitude.length; i++) {
      const y = Math.floor(i / width);
      const x = i % width;

      if (x === 0 || y === 0 || x === width - 1 || y === width - 1) {
        continue;
      }

      const angle = direction[i] * (180 / Math.PI);
      const normalizedAngle = ((angle % 180) + 180) % 180;

      let neighbor1 = 0, neighbor2 = 0;

      if ((normalizedAngle >= 0 && normalizedAngle < 22.5) || (normalizedAngle >= 157.5)) {
        neighbor1 = magnitude[i - 1];
        neighbor2 = magnitude[i + 1];
      } else if (normalizedAngle >= 22.5 && normalizedAngle < 67.5) {
        neighbor1 = magnitude[i - width + 1];
        neighbor2 = magnitude[i + width - 1];
      } else if (normalizedAngle >= 67.5 && normalizedAngle < 112.5) {
        neighbor1 = magnitude[i - width];
        neighbor2 = magnitude[i + width];
      } else {
        neighbor1 = magnitude[i - width - 1];
        neighbor2 = magnitude[i + width + 1];
      }

      if (magnitude[i] >= neighbor1 && magnitude[i] >= neighbor2) {
        suppressed[i] = magnitude[i];
      }
    }

    return suppressed;
  }

  private doubleThreshold(
    suppressed: Float32Array,
    lowThreshold: number,
    highThreshold: number
  ): ImageData {
    const width = Math.sqrt(suppressed.length);
    const height = width;
    const edges = new Uint8ClampedArray(suppressed.length * 4);

    const strong = 255;
    const weak = 75;

    for (let i = 0; i < suppressed.length; i++) {
      const value = suppressed[i];
      const idx = i * 4;

      if (value >= highThreshold) {
        edges[idx] = strong;
        edges[idx + 1] = strong;
        edges[idx + 2] = strong;
      } else if (value >= lowThreshold) {
        edges[idx] = weak;
        edges[idx + 1] = weak;
        edges[idx + 2] = weak;
      }
      edges[idx + 3] = 255;
    }

    return new ImageData(edges, width, height);
  }
}
