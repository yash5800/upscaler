# LiteRT.js Image Upscaler

Browser-only image super-resolution using ONNX Runtime Web. Runs completely client-side with no backend required.

## Features

- Drag & Drop image upload
- File picker support
- PNG, JPG, JPEG, WEBP support
- Maximum image size: 4096×4096
- WebGPU/WASM runtime with automatic detection
- Canvas-based bicubic fallback
- Download upscaled result as PNG

## Project Structure

```
litert-upscaler/
├── index.html          # Main UI
├── style.css           # Dark responsive CSS
├── script.js           # Vanilla JS + ONNX Runtime Web
├── vite.config.js      # Vite config (COOP/COEP headers)
├── package.json        # Dependencies
├── models/
│   ├── model.onnx      # ONNX super-resolution model (240KB)
│   └── README.md       # Model instructions
└── libs/
    ├── ort-wasm.wasm      # WASM runtime
    └── ort-wasm-simd.wasm  # SIMD WASM
```

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

Open http://localhost:3000 (or next available port)

## Building

```bash
npm run build
```

Output in `dist/` folder.

## Model Included

The app includes `models/model.onnx` - ONNX Model Zoo Super-Resolution-10:
- 240KB ONNX model
- 224×224 → 448×448 (2x upscale)
- Uses Y (luminance) channel processing

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
- Model may be too large for mobile browsers

**Slow inference**
- Enable WebAssembly SIMD
- Use WebGPU (HTTPS only)

**Memory errors**
- Reduce input image size