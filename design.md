# Build a Browser-Only ONNX Runtime Web Image Upscaler

A complete browser-only image upscaler using client-side ML inference with ONNX Runtime Web, built with React 18, TypeScript, and Tailwind CSS.

## Requirements

* React 18 + TypeScript + Vite + Tailwind CSS
* No backend
* No Node server required at runtime
* Runs completely inside the browser
* Works on GitHub Pages, Cloudflare Pages, Netlify and Vercel
* User images never leave the device

---

## Project Structure

```
litert-upscaler/
│
├── index.html                    # Shell with <div id="root">
├── vite.config.ts                # Vite + React plugin + COOP/COEP headers
├── tsconfig.json                 # TypeScript configuration
├── tailwind.config.js            # Extended colors + animations
├── postcss.config.js             # Tailwind + autoprefixer
│
├── src/
│   ├── main.tsx                  # ReactDOM.createRoot entry
│   ├── App.tsx                   # Root component, state management
│   ├── index.css                 # Tailwind directives + Inter font
│   ├── types.ts                  # All TypeScript types
│   ├── constants.ts              # MODELS config, backend detection
│   ├── env.d.ts                  # Module declarations
│   │
│   ├── hooks/
│   │   ├── useONNX.ts            # Load ONNX Runtime, manage sessions
│   │   ├── useImageFile.ts       # File reader, validation, metadata
│   │   └── useUpscale.ts         # Orchestrate upscale pipeline
│   │
│   ├── utils/
│   │   ├── imageProcessing.ts    # extractYCbCr, mergeToRgba, etc.
│   │   └── upscale.ts            # runPass, tiled inference, ONNX loader
│   │
│   └── components/
│       ├── Header.tsx            # Logo, gradient title, privacy badge, backend badge
│       ├── StepIndicator.tsx     # Upload → Configure → Process → Download steps
│       ├── UploadArea.tsx        # Drag & drop, file picker, file metadata
│       ├── ImageComparison.tsx   # Side-by-side cards + before/after slider with canvases
│       ├── ControlPanel.tsx      # Model select, scale select, upscale/download buttons
│       ├── ModelInfoPanel.tsx    # Collapsible model comparison with descriptions
│       ├── ProgressCard.tsx      # Animated progress bar with shimmer + step text
│       ├── StatsBar.tsx          # Input/output dims, model, backend, time pills
│       └── ErrorMessage.tsx      # Contextual error with dismiss
│
├── models/
│   ├── model.onnx               # ESPCN model (235KB, scale 3×)
│   ├── Real-ESRGAN-x4plus.onnx  # Real-ESRGAN model (65MB, scale 4×)
│   └── README.md                # Model instructions
│
├── libs/
│   ├── ort-wasm.wasm            # WASM runtime (~10MB)
│   └── ort-wasm-simd.wasm       # SIMD WASM (~10MB)
│
├── dist/                        # Built output
├── test.jpg                     # Test image
├── design.md                    # This file
├── README.md
└── package.json
```

---

## Architecture

### Component Tree

```
App (state owner)
├── Header                    — Logo, privacy badge, backend badge
├── StepIndicator             — 4-step workflow progress
├── UploadArea                — Drop zone / file picker
├── ErrorMessage              — Error display + dismiss
├── ImageComparison           — Side-by-side cards + slider
├── ControlPanel              — Model select, scale, buttons
├── ModelInfoPanel            — Collapsible model details
├── ProgressCard              — Processing progress
├── StatsBar                  — Result stats pills
└── Footer                    — Attribution
```

### State Management (App.tsx)

```
step: 'upload' | 'config' | 'processing' | 'result'
image: ImageData | null       — file, url, img, width, height, name, size
modelKey: 'espcn' | 'realesrgan'
scale: number                 — 3 | 6 | 9 for ESPCN, 4 | 8 | 12 for Real-ESRGAN
result: UpscaleResult | null  — rgba, width, height, time
error: string | null
isProcessing: boolean
progress: { percent: number, text: string }
```

### Custom Hooks

| Hook | Responsibility |
|------|----------------|
| `useONNX` | Dynamic import ONNX Runtime Web from CDN, detect backend (WebGPU/WASM), create/manage InferenceSession via refs |
| `useImageFile` | Read file via FileReader, validate type/size (max 4096×4096), create Image element, expose `{ imageData, isLoading, error, handleFile, clear }` |
| `useUpscale` | Orchestrate the full upscale pipeline: read canvas, extract channels (RGB or YCbCr), run multi-pass tiled inference, merge results, compute timing |

---

## Features Implemented

### Image Upload
- Drag & Drop with visual feedback (dashed border, scale animation, accent color)
- File Picker via click
- Shows file name and size after upload
- "Remove & choose another" button
- Supported: PNG, JPG, JPEG, WEBP
- Max: 4096×4096

### Model Loading
- ONNX Runtime Web loaded dynamically from CDN (`onnxruntime-web@1.17.3`)
- WASM binaries served from CDN (`jsdelivr`)
- Two model options with live switching
- Per-model badges: quality (teal), estimated time (amber), hardware requirements (coral)

### Model Architecture

**ESPCN** (`models/model.onnx`):
- Single-channel (Y) luminance processing
- 224×224 tile size, 3× scale per pass
- Color converted to YCbCr; Y upscaled via model, Cb/Cr via bicubic

**Real-ESRGAN** (`models/Real-ESRGAN-x4plus.onnx`):
- RGB 3-channel processing
- 128×128 tile size, 4× scale per pass
- Full color processing through model

**Multi-Pass Upscaling:**
- Dynamic scale: 3×/6×/9× (ESPCN) or 4×/8×/12× (Real-ESRGAN)
- Each pass feeds output back through model
- Inter-pass resizing handled automatically

### Tiled Inference
- Large images processed in tiles to manage memory
- Edge clamping for seamless tile boundaries
- Progress reported per tile per pass
- Yields to UI every 3 tiles via `setTimeout(0)` microtasks

### Runtime
- WebGPU preferred (HTTPS/localhost only) via `navigator.gpu` detection
- WebAssembly SIMD fallback
- Backend displayed as badge in header with green pulse dot

### Image Display
- Side-by-side original/upscaled cards with dimension labels
- Before/after comparison slider with draggable handle (clip-path based)
- Canvas-based rendering (original via `drawImage`, upscaled via `putImageData`)

### Progress
- Shimmer-animated gradient progress bar
- Descriptive phase text: "Reading image...", "Pass 1/3 — upscaling luminance...", "Merging color channels...", etc.
- Spinning loader icon during processing

### Download
- PNG download via `canvas.toBlob`
- Filename: `image_upscaled.png`

### UI/UX
- Modern dark theme with Inter font
- Deep purple + teal + amber + coral color palette (Tailwind extended colors)
- Glassmorphism cards with backdrop blur
- Animated background gradient
- 4-step workflow indicator (Upload → Configure → Process → Download)
- Collapsible model comparison panel with descriptions and recommendations
- Result stats bar (dimensions, model, backend, time)
- Keyboard shortcuts: `Enter` to upscale, `Escape` to clear
- Responsive grid (stacks to single column on mobile)
- "100% Private" badge with lock icon
- Smooth fade-in and slide-up animations on section mount

### Error Handling
- Unsupported file type
- Image exceeds 4096×4096
- Model load failure (with fallback and error message)
- Processing errors caught with user-friendly message
- All errors dismissible

### Performance
- `async/await` with microtask yielding
- Canvas tensor cleanup
- Non-blocking UI during processing
- `useCallback` / `useRef` to avoid unnecessary re-renders

### Vite Configuration
- React plugin (`@vitejs/plugin-react`)
- Dev server on port 3000
- COOP/COEP headers for SharedArrayBuffer (required by ONNX Runtime Web)
- Standard build output to `dist/`

---

## Design System

### Colors (tailwind.config.js)

| Token | Value | Usage |
|-------|-------|-------|
| `bg` | `#0b0b12` | Page background |
| `surface` | `#12121e` | Card backgrounds |
| `surface-card` | `#181825` | Elevated cards |
| `surface-hover` | `#1e1e30` | Hover state |
| `border` | `#2a2a3e` | Borders |
| `accent` | `#6c5ce7` | Primary purple |
| `accent-hover` | `#7d6ff0` | Hover purple |
| `teal` | `#00cec9` | Quality/success |
| `amber` | `#fdcb6e` | Time/warning |
| `coral` | `#ff6b6b` | Requirements/error |
| `muted` | `#8888a8` | Secondary text |
| `muted-dark` | `#55556a` | Muted text |

### Animations

| Name | Duration | Usage |
|------|----------|-------|
| `fade-in` | 0.5s | Section mount |
| `slide-up` | 0.4s | Cards, panels |
| `shimmer` | 2s infinite | Progress bar |
| `pulse-glow` | 2s infinite | Primary button |
| `spin-slow` | 3s linear | Loading spinner |

---

## Implementation Note

**ONNX Runtime Web** is used instead of **LiteRT.js** because:
- TFLite JS runtime (`@tensorflow/tfjs-tflite`) is not widely available
- ONNX Runtime has equivalent browser-only capabilities
- Same WebGPU/WASM detection and performance
- Works with any ONNX super-resolution model (ESPCN, FSRCNN, Real-ESRGAN)

---

## Backend Detection Logic

```typescript
export function detectBackend(): 'webgpu' | 'wasm' {
  const isSecure = location.hostname === 'localhost' || location.protocol === 'https:';
  if (isSecure && 'gpu' in navigator && navigator.gpu) return 'webgpu';
  return 'wasm';
}
```

---

## Data Flow

```
User drops file → UploadArea.onFile()
  → useImageFile.handleFile()    — reads file, creates Image, validates
  → setImageData(...)            — triggers re-render
  → App effect fires             — setStep('config'), loadModel(modelKey)
  → useONNX.loadModel()          — create ONNX InferenceSession

User clicks "Upscale" → ControlPanel.onUpscale()
  → setStep('processing')
  → useUpscale.upscale(img, modelKey, scale, onProgress)
    → extractRGB() or extractYCbCr()
    → for each pass:
        → runPass()              — tiled inference loop
        → onProgress()           — updates ProgressCard
    → rgbaFromTensor() or mergeToRgba()
  → setResult({ rgba, width, height, time })
  → setStep('result')
  → ImageComparison draws canvas + shows slider
  → StatsBar shows result pills
```

---

## To Run

```bash
npm install
npm run dev    # http://localhost:3000
npm run build  # for deployment
```
