# LiteRT.js Image Upscaler

Browser-only image super-resolution using ONNX Runtime Web. Runs completely client-side with no backend required.

## Features

- Drag & drop image upload
- PNG, JPG, WEBP support
- Maximum input size: 4096×4096
- Two models: ESPCN (fast, 3×) and Real-ESRGAN (high quality, 4×)
- WebGPU/WASM runtime with automatic detection
- Tiled inference for large images
- Side-by-side before/after comparison slider
- Download upscaled result as PNG

## Project Structure

```
litert-upscaler/
├── index.html
├── package.json         # React, Vite, Tailwind
├── vite.config.ts       # COOP/COEP headers, port 3000
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
├── models/
│   ├── model.onnx              # ESPCN (235KB, 3×, Y-channel)
│   ├── Real-ESRGAN-x4plus.onnx # Real-ESRGAN (~65MB, 4×, RGB)
│   └── README.md
├── libs/
│   ├── ort-wasm.wasm
│   └── ort-wasm-simd.wasm
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── constants.ts        # Model configs, backend detection
    ├── types.ts
    ├── hooks/
    │   ├── useONNX.ts      # ONNX Runtime lifecycle
    │   ├── useImageFile.ts # File validation & reading
    │   └── useUpscale.ts   # Multi-pass upscale pipeline
    ├── utils/
    │   ├── upscale.ts      # ONNX session + tiled inference
    │   └── imageProcessing.ts  # Color space conversion
    └── components/
        ├── Header.tsx
        ├── StepIndicator.tsx
        ├── UploadArea.tsx
        ├── ImageComparison.tsx  # Before/after slider
        ├── ControlPanel.tsx
        ├── ModelInfoPanel.tsx
        ├── ProgressCard.tsx
        ├── StatsBar.tsx
        └── ErrorMessage.tsx
```

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

Open http://localhost:3000

## Building

```bash
npm run build
```

Output in `dist/` folder.

## Models

| Model | Scale | Channels | Size | Speed |
|-------|-------|----------|------|-------|
| ESPCN | 3× | Y (luminance) | 235KB | ~50ms/tile |
| Real-ESRGAN | 4× | RGB | 65MB | ~1-3s/tile |

## Deployment

Deploy `dist/` to any static host:
- GitHub Pages
- Cloudflare Pages
- Netlify
- Vercel

## Browser Compatibility

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| WASM | ✅ 57+ | ✅ 52+ | ✅ 11+ | ✅ 79+ |
| WebGPU | ✅ 113+ (HTTPS) | ❌ | ✅ 17+ (HTTPS) | ✅ 113+ (HTTPS) |

**Note:** WebGPU requires HTTPS or localhost.

## Troubleshooting

**Model fails to load**
- Check browser console for errors
- Real-ESRGAN is ~65MB and may take time to download

**Slow inference**
- Enable WebAssembly SIMD
- Use WebGPU (HTTPS only)

**Memory errors**
- Reduce input image size
- Use ESPCN model instead of Real-ESRGAN
