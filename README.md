```markdown
# 🎥 Real-Time Video Processing System (Web + TypeScript)

This repository implements a **real-time camera frame processing and visualization system** using **React + TypeScript**.  
It is fully modular, supporting **custom hooks, WebGL-based processing, and live performance statistics** — all built purely in the web environment (no native Kotlin or Android code).

---

## 🧭 Overview

The project enables **real-time video capture, frame-by-frame analysis, and GPU-accelerated rendering** using modern browser APIs.  
Each part of the system — from camera access to frame processing and visualization — is isolated into independent modules inside `/src`.

---

## 🧩 Folder Structure

```

src/
├── components/
│   ├── ControlPanel.tsx
│   ├── StatsPanel.tsx
│   └── VideoDisplay.tsx
│
├── hooks/
│   ├── useCamera.ts
│   └── useFrameProcessor.ts
│
├── types/
│   └── index.ts
│
├── utils/
│   ├── imageProcessing.ts
│   └── webglRenderer.ts
│
├── App.tsx
└── index.css

````

---

## ⚙️ Features Implemented (Web)

### 🎬 Core Features
- **Live Camera Stream** handled by `useCamera.ts` using `navigator.mediaDevices.getUserMedia()`.
- **Per-Frame Processing** pipeline built via `useFrameProcessor.ts`.
- **Real-Time Frame Display** inside `VideoDisplay.tsx` with canvas overlays.
- **WebGL Rendering** for high-performance filters and frame manipulation in `webglRenderer.ts`.
- **Custom Image Filters** and operations implemented in `imageProcessing.ts`.
- **Performance Visualization** with `StatsPanel.tsx` showing FPS, latency, and frame drop counts.
- **Interactive Controls** via `ControlPanel.tsx` for toggling effects, camera on/off, and processing parameters.
- **Type Safety** through centralized TypeScript interfaces (`types/index.ts`).

---

## 🧱 Component Architecture

### 1. **VideoDisplay.tsx**
- Responsible for mounting a `<video>` or `<canvas>` element.
- Draws frames from the media stream.
- Uses `requestAnimationFrame()` for synchronized updates.

### 2. **StatsPanel.tsx**
- Tracks performance metrics such as frame rate, render time, and GPU usage.
- Displays in a compact, responsive UI panel.

### 3. **ControlPanel.tsx**
- Provides buttons and toggles to start/stop the stream and enable filters.
- Communicates directly with the processing hooks to update rendering behavior.

---

## 🧠 Hook Architecture

### 🔹 useCamera.ts
Handles camera initialization and stream management.

**Key Responsibilities:**
- Requests user camera access using `getUserMedia`.
- Binds the stream to a `<video>` element reference.
- Handles camera errors, permissions, and fallback scenarios.

```ts
const useCamera = () => {
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(mediaStream => setStream(mediaStream))
      .catch(err => console.error("Camera Error:", err));
  }, []);

  return stream;
};
````

---

### 🔹 useFrameProcessor.ts

Handles per-frame image processing logic, often linked to WebGL or CPU-based algorithms.

**Key Responsibilities:**

* Reads current video frames.
* Sends them to WebGL shaders or image processing functions.
* Returns processed frame data for rendering.

---

## ⚡ Utility Modules

### 🧮 imageProcessing.ts

Contains CPU-based processing functions using Canvas 2D APIs:

* Grayscale conversion
* Edge detection
* Histogram normalization
* Pixel manipulation

### 🎨 webglRenderer.ts

Handles GPU-accelerated rendering via WebGL shaders:

* Framebuffers for offscreen rendering.
* GLSL-based shader programs for color correction, blur, and threshold effects.
* Efficient GPU data uploads and texture mapping.

---

## 🧰 Type Definitions (types/index.ts)

Defines shared interfaces for components and hooks.

Example:

```ts
export interface FrameData {
  timestamp: number;
  width: number;
  height: number;
  pixels: Uint8Array;
}
```

---

## 🧠 Application Flow

```
useCamera.ts
    ↓ (MediaStream)
VideoDisplay.tsx
    ↓ (Raw Frames)
useFrameProcessor.ts
    ↓ (Processed Frame Buffers)
webglRenderer.ts / imageProcessing.ts
    ↓ (GPU/CPU)
StatsPanel.tsx
```

* The **camera stream** is captured via `useCamera`.
* Each frame is passed into `useFrameProcessor` for transformation.
* Processed frames are rendered by **WebGL** or **Canvas**.
* Metrics are displayed through **StatsPanel**.

---

## 🧩 Setup Instructions

### 1️⃣ Install Dependencies

```bash
npm install
```

### 2️⃣ Run the Development Server

```bash
npm run dev
```

### 3️⃣ Open in Browser

Visit:

```
http://localhost:5173/
```

---

## 📸 Screenshots / Demo

| Component            | Description                           | Screenshot                                   |
| -------------------- | ------------------------------------- | -------------------------------------------- |
| **VideoDisplay.tsx** | Live camera feed rendered to canvas   | ![Video Display](./assets/video-display.png) |
| **StatsPanel.tsx**   | Frame rate and performance monitoring | ![Stats Panel](./assets/stats-panel.png)     |
| **ControlPanel.tsx** | Interactive UI controls               | ![Control Panel](./assets/control-panel.gif) |

*(Place screenshots/GIFs inside `assets/` directory in project root.)*

---

## 🧠 Key Technical Highlights

* **Real-time frame rendering** with minimal latency.
* **WebGL acceleration** using custom shader logic.
* **Type-safe, component-based architecture** with React hooks.
* **Scalable modular structure** — easily extendable for new effects or ML-based frame processors.
* **Performance optimized** using requestAnimationFrame and buffer re-use.

---

## 🧩 Tools & Technologies

| Layer         | Tools Used                                      |
| ------------- | ----------------------------------------------- |
| **Framework** | React (Vite)                                    |
| **Language**  | TypeScript                                      |
| **Graphics**  | WebGL, Canvas 2D                                |
| **Hooks**     | Custom React hooks for frame and stream control |
| **Styling**   | CSS (index.css)                                 |

---

## 🤝 Credits

* **Developed by:** Ranveer Raj
* **Focus:** WebGL acceleration, TypeScript architecture, and real-time frame processing pipeline.

---


---


```
```
