# ONNX Super-Resolution Models

## Available Models

### Current Model (Included)
- `model.onnx` - ONNX Model Zoo Super-Resolution-10
- 240KB, 224×224 → 448×448 (2x upscale)
- Works out of the box

---

### Alternative Models

Replace `model.onnx` with any of these for different quality/speed:

#### 1. ESPCN (lightweight, fast)
- Size: ~100KB
- Scale: 2x
- Download: https://github.com/krasserm/onnx-espcn/releases
- File: `espcn_16_192.onnx`

#### 2. FSRCNN (fast)
- Size: ~200KB
- Scale: 2x-4x
- Download: Hugging Face search "fsrcnn onnx"

#### 3. Real-ESRGAN (high quality)
- Size: 10-20MB
- Scale: 2x-4x
- Search: Hugging Face for "real-esrgan onnx"

#### 4. LapSRN (deep learning)
- Size: ~500KB
- Scale: 8x
- Search: Hugging Face for "lapsrn onnx"

---

### To Swap Models

1. Download your preferred model
2. Rename to `model.onnx` (or keep name for script update)
3. Replace `/models/model.onnx`
4. Restart dev server

### Model Requirements

The current script expects:
- Input: NCHW format, float32 [0,1] normalized
- Or: Grayscale Y channel for Super-Resolution-10

Adjust preprocessing in `script.js` if your model has different input requirements.