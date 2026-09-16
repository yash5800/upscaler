import React, { useEffect, useRef, useState } from "react";
import { MODELS } from "../constants";
import type {
  ModelKey,
  Step,
  EnhancementOptions,
  ScaleFactor,
} from "../types";
import ParameterSlider from "./ParameterSlider";

interface UpscaleWorkspaceProps {
  imageUrl: string;

  modelKey: ModelKey;
  step: Step;

  isProcessing: boolean;
  isLoading: boolean;
  hasResult: boolean;

  resultUrl?: string;

  options: EnhancementOptions;

  onOptionsChange: (options: EnhancementOptions) => void;
  onModelChange: (key: ModelKey) => void;

  onUpscale: () => void;
  onDownload: (format?: "png" | "webp" | "jpeg") => void;

  onReset?: () => void;
  onAddFile?: (file: File) => void;
  onSelectThumb?: (url: string) => void;
  onResetSettings?: () => void;
  onRemoveThumb?: (url: string) => void;
}

/* ============================================================
   DEFAULT ENHANCEMENT SETTINGS

   All advanced enhancement controls start at 50.

   Reset restores these values.
   Model and scale are intentionally NOT included.
   ============================================================ */

const DEFAULT_ENHANCEMENT_SETTINGS = {
  sharpness: 50,
  denoise: 50,
  faceEnhancement: 50,
  colorLevel: 50,
  hdrLevel: 50,
  brightness: 50,
  contrast: 50,
};

export default function UpscaleWorkspace({
  imageUrl,
  modelKey,
  step,
  isProcessing,
  isLoading,
  hasResult,
  resultUrl,
  options,
  onOptionsChange,
  onModelChange,
  onUpscale,
  onDownload,
  onReset,
  onAddFile,
  onSelectThumb,
  onResetSettings,
  onRemoveThumb,
}: UpscaleWorkspaceProps) {
  const [advancedOpen, setAdvancedOpen] = useState(false);

  const busy = isProcessing || isLoading;
  const model = MODELS[modelKey];

  /* ============================================================
     RESET ADVANCED SETTINGS

     This resets ONLY enhancement settings.

     Model and scale remain unchanged.
     ============================================================ */

  const resetEnhancementSettings = () => {
    if (busy) return;

    onOptionsChange({
      ...options,

      sharpness:
        DEFAULT_ENHANCEMENT_SETTINGS.sharpness,

      denoise:
        DEFAULT_ENHANCEMENT_SETTINGS.denoise,

      faceEnhancement:
        DEFAULT_ENHANCEMENT_SETTINGS.faceEnhancement,

      colorLevel:
        DEFAULT_ENHANCEMENT_SETTINGS.colorLevel,

      hdrLevel:
        DEFAULT_ENHANCEMENT_SETTINGS.hdrLevel,

      brightness:
        DEFAULT_ENHANCEMENT_SETTINGS.brightness,

      contrast:
        DEFAULT_ENHANCEMENT_SETTINGS.contrast,
    } as EnhancementOptions);
  };

  /* ============================================================
     SCALE
     ============================================================ */

  const selectScale = (scale: ScaleFactor) => {
    if (busy) return;

    onOptionsChange({
      ...options,
      scale,
    });
  };

  /* ============================================================
     TOGGLE OPTION
     ============================================================ */

  const toggleOption = (
    key: keyof EnhancementOptions
  ) => {
    if (busy) return;

    onOptionsChange({
      ...options,
      [key]: !options[key],
    } as EnhancementOptions);
  };

  return (
    <div className="flex h-full w-full gap-6">
      {/* ======================================================
          IMAGE CANVAS
         ====================================================== */}

      <div className="relative flex min-w-0 flex-1 items-center justify-center bg-[#050505]">
        <div className="flex h-full max-h-full w-full min-w-0 flex-col items-center justify-center p-4">
          {/* ==================================================
              BEFORE / AFTER IMAGE
             ================================================== */}

          <div className="relative flex min-h-0 min-w-0 max-w-full flex-1 items-center justify-center">
            {hasResult && resultUrl ? (
              <BeforeAfterSlider
                before={imageUrl}
                after={resultUrl}
              />
            ) : (
              <div className="relative flex max-h-[72vh] max-w-full items-center justify-center overflow-hidden rounded-[10px] shadow-[0_30px_100px_rgba(0,0,0,.55)]">
                <img
                  src={imageUrl}
                  alt="Uploaded"
                  className="
                    block
                    max-h-[72vh]
                    max-w-full
                    object-contain
                    select-none
                  "
                  draggable={false}
                />
              </div>
            )}
          </div>

          {/* ==================================================
              PROCESSING OVERLAY
             ================================================== */}

          {isProcessing && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-[2px]">
              <div className="rounded-2xl border border-white/10 bg-[#111]/90 px-7 py-5 text-center shadow-2xl">
                <div className="mx-auto mb-3 h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-white" />

                <div className="font-semibold text-white">
                  Enhancing image…
                </div>

                <div className="mt-1 text-sm text-white/50">
                  AI is reconstructing details
                </div>
              </div>
            </div>
          )}

          {/* ==================================================
              UPLOAD STRIP
             ================================================== */}

          <div className="mt-4 w-full shrink-0">
            <UploadStrip
              imageUrl={imageUrl}
              onAddFile={onAddFile}
              onSelectThumb={onSelectThumb}
              onRemoveThumb={onRemoveThumb}
            />
          </div>
        </div>
      </div>

      {/* ======================================================
          RIGHT CONTROL PANEL
         ====================================================== */}

      <aside
        className="
          w-[420px]
          shrink-0
          overflow-y-auto
          rounded-lg
          border
          border-white/[0.07]
          bg-[#181818]
          p-5
        "
      >
        {/* ==================================================
            HEADER
           ================================================== */}

        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs text-white/40">
              Tool
            </div>

            <div className="text-lg font-bold text-white">
              Upscale
            </div>
          </div>

          {/* ==================================================
              RESET
              
              Resets enhancement controls to 50.
              Model and scale stay unchanged.
             ================================================== */}

          <button
            type="button"
            onClick={resetEnhancementSettings}
            disabled={busy}
            className="
              flex
              items-center
              gap-1.5
              text-sm
              text-white/60
              transition-colors
              hover:text-white
              disabled:opacity-30
            "
          >
            <svg
              className="h-3.5 w-3.5"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M4 12A8 8 0 1 0 7 5.8"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />

              <path
                d="M4 5V10H9"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            Reset
          </button>
        </div>

        {/* ==================================================
            MODEL
           ================================================== */}

        <div className="mt-6">
          <div className="text-xs text-white/60">
            Model
          </div>

          <select
            value={modelKey}
            onChange={(e) =>
              onModelChange(
                e.target.value as ModelKey
              )
            }
            disabled={busy}
            className="
              mt-2
              h-12
              w-full
              rounded-[10px]
              border
              border-white/[0.06]
              bg-white/[0.03]
              pl-3
              pr-3
              text-white
              outline-none
              transition-colors
              focus:border-white/20
              disabled:opacity-40
            "
          >
            {Object.keys(MODELS).map((k) => {
              const key = k as ModelKey;
              const m = MODELS[key];

              return (
                <option
                  key={key}
                  value={key}
                  className="text-black"
                >
                  {m.title || key}
                </option>
              );
            })}
          </select>

          <div className="mt-2 text-sm text-white/60">
            {model?.subtitle ||
              model?.description}
          </div>
        </div>

        {/* ==================================================
            SCALE FACTOR
           ================================================== */}

        <div className="mt-6">
          <div className="text-xs text-white/60">
            Scale factor
          </div>

          <div className="mt-2 flex gap-2">
            {[2, 4, 8].map((s) => {
              if (
                s === 8 &&
                model?.maxScale &&
                model.maxScale < 8
              ) {
                return null;
              }

              const active =
                options.scale ===
                (s as ScaleFactor);

              return (
                <button
                  key={s}
                  type="button"
                  onClick={() =>
                    selectScale(
                      s as ScaleFactor
                    )
                  }
                  disabled={busy}
                  className={`
                    rounded-lg
                    px-4
                    py-2
                    text-sm
                    font-semibold
                    transition-all

                    ${
                      active
                        ? "bg-white text-black shadow"
                        : "bg-white/[0.02] text-white/70 hover:bg-white/[0.06] hover:text-white"
                    }

                    disabled:opacity-30
                  `}
                >
                  x{s}
                </button>
              );
            })}
          </div>
        </div>

        {/* ==================================================
            ADVANCED SETTINGS
           ================================================== */}

        <div className="mt-6">
          <button
            type="button"
            onClick={() =>
              setAdvancedOpen((v) => !v)
            }
            className="
              flex
              w-full
              items-center
              justify-between
              text-left
              text-sm
              text-white/80
            "
          >
            <span>
              Advanced settings
            </span>

            <svg
              className={`
                h-4
                w-4
                text-white/40
                transition-transform
                duration-200

                ${
                  advancedOpen
                    ? "rotate-180"
                    : ""
                }
              `}
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M6 9L12 15L18 9"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {advancedOpen && (
            <div className="mt-4 space-y-5">
              {/* ==================================================
                  PRESETS
                 ================================================== */}

              {model?.presets && (
                <div>
                  <div className="text-xs text-white/60">
                    Preset
                  </div>

                  <div className="mt-2 flex flex-wrap gap-2">
                    {model.presets.map(
                      (p: string) => (
                        <button
                          key={p}
                          type="button"
                          disabled={busy}
                          onClick={() =>
                            onOptionsChange({
                              ...options,
                              preset: p,
                            })
                          }
                          className="
                            rounded-lg
                            bg-white/[0.02]
                            px-3
                            py-2
                            text-xs
                            text-white/80
                            transition-colors
                            hover:bg-white/[0.06]
                            hover:text-white
                            disabled:opacity-30
                          "
                        >
                          {p}
                        </button>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* ==================================================
                  SHARPNESS
                 ================================================== */}

              <ParameterSlider
                label="Sharpness"
                value={
                  options.sharpness ?? 50
                }
                min={0}
                max={100}
                onChange={(value) =>
                  onOptionsChange({
                    ...options,
                    sharpness: value,
                  })
                }
                info="Controls how strongly fine edges and details are enhanced."
              />

              {/* ==================================================
                  DENOISE
                 ================================================== */}

              <ParameterSlider
                label="Denoise"
                value={
                  options.denoise ?? 50
                }
                min={0}
                max={100}
                onChange={(value) =>
                  onOptionsChange({
                    ...options,
                    denoise: value,
                  })
                }
                info="Reduces noise, grain and compression artifacts."
              />

              {/* ==================================================
                  FACE ENHANCEMENT
                 ================================================== */}

              {model?.features?.faceRestore && (
                <ParameterSlider
                  label="Face enhancement"
                  value={
                    options.faceEnhancement ??
                    50
                  }
                  min={0}
                  max={100}
                  onChange={(value) =>
                    onOptionsChange({
                      ...options,
                      faceEnhancement:
                        value,
                    } as EnhancementOptions)
                  }
                  info="Controls the strength of facial detail restoration."
                />
              )}

              {/* ==================================================
                  COLOR ENHANCEMENT
                 ================================================== */}

              {model?.features?.colorEnhance && (
                <ParameterSlider
                  label="Color enhancement"
                  value={
                    options.colorLevel ??
                    (options.colorEnhance
                      ? 60
                      : 50)
                  }
                  min={0}
                  max={100}
                  onChange={(value) =>
                    onOptionsChange({
                      ...options,
                      colorLevel: value,
                      colorEnhance:
                        value > 0,
                    } as EnhancementOptions)
                  }
                  info="Enhances color richness, vibrancy and overall color balance."
                />
              )}

              {/* ==================================================
                  HDR
                 ================================================== */}

              {model?.features?.hdrBoost && (
                <ParameterSlider
                  label="HDR"
                  value={
                    options.hdrLevel ??
                    (options.hdrBoost
                      ? 60
                      : 50)
                  }
                  min={0}
                  max={100}
                  onChange={(value) =>
                    onOptionsChange({
                      ...options,
                      hdrLevel: value,
                      hdrBoost:
                        value > 0,
                    } as EnhancementOptions)
                  }
                  info="Enhances dynamic range, highlights and shadow details."
                />
              )}

              {/* ==================================================
                  BRIGHTNESS
                 ================================================== */}

              <ParameterSlider
                label="Brightness"
                value={
                  options.brightness ?? 50
                }
                min={0}
                max={100}
                onChange={(value) =>
                  onOptionsChange({
                    ...options,
                    brightness: value,
                  } as EnhancementOptions)
                }
                info="Adjusts the overall brightness of the image."
              />

              {/* ==================================================
                  CONTRAST
                 ================================================== */}

              <ParameterSlider
                label="Contrast"
                value={
                  options.contrast ?? 50
                }
                min={0}
                max={100}
                onChange={(value) =>
                  onOptionsChange({
                    ...options,
                    contrast: value,
                  } as EnhancementOptions)
                }
                info="Controls the difference between light and dark areas."
              />
            </div>
          )}
        </div>

        {/* ==================================================
            ACTIONS
           ================================================== */}

        <div className="mt-6">
          {hasResult ? (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() =>
                  onDownload("png")
                }
                className="
                  flex-1
                  rounded-lg
                  bg-[#C7FF00]
                  px-4
                  py-3
                  font-semibold
                  text-black
                  transition-all
                  hover:bg-[#D4FF3D]
                  active:scale-[0.99]
                "
              >
                Download result
              </button>

              <button
                type="button"
                onClick={onUpscale}
                disabled={busy}
                className="
                  rounded-lg
                  bg-white/[0.06]
                  px-4
                  py-3
                  text-white/90
                  transition-colors
                  hover:bg-white/[0.1]
                  disabled:opacity-30
                "
              >
                Re-enhance
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onUpscale}
              disabled={busy}
              className="
                w-full
                rounded-lg
                bg-[#C7FF00]
                px-4
                py-3
                font-semibold
                text-black
                transition-all
                hover:bg-[#D4FF3D]
                active:scale-[0.99]
                disabled:cursor-wait
                disabled:opacity-40
              "
            >
              {busy
                ? "Enhancing..."
                : `Upscale ✦  ${options.scale}x`}
            </button>
          )}
        </div>
      </aside>
    </div>
  );
}

/* ============================================================
   BEFORE / AFTER SLIDER

   LEFT  = ORIGINAL / OLD
   RIGHT = UPSCALED / NEW

   The images remain exactly the same size.
   Only the visible portion of the original changes.
   ============================================================ */

function BeforeAfterSlider({
  before,
  after,
}: {
  before: string;
  after: string;
}) {
  const containerRef =
    useRef<HTMLDivElement | null>(null);

  const [pos, setPos] = useState(50);

  const draggingRef =
    useRef(false);

  /* ----------------------------------------------------------
     Update slider position
     ---------------------------------------------------------- */

  const updatePosition = (
    clientX: number
  ) => {
    const container =
      containerRef.current;

    if (!container) return;

    const rect =
      container.getBoundingClientRect();

    if (!rect.width) return;

    const x =
      clientX - rect.left;

    const percentage =
      (x / rect.width) * 100;

    setPos(
      Math.min(
        100,
        Math.max(0, percentage)
      )
    );
  };

  /* ----------------------------------------------------------
     Global pointer movement
     ---------------------------------------------------------- */

  useEffect(() => {
    const handlePointerMove = (
      e: PointerEvent
    ) => {
      if (!draggingRef.current) return;

      updatePosition(e.clientX);
    };

    const handlePointerUp = () => {
      draggingRef.current = false;
    };

    window.addEventListener(
      "pointermove",
      handlePointerMove
    );

    window.addEventListener(
      "pointerup",
      handlePointerUp
    );

    return () => {
      window.removeEventListener(
        "pointermove",
        handlePointerMove
      );

      window.removeEventListener(
        "pointerup",
        handlePointerUp
      );
    };
  });

  /* ----------------------------------------------------------
     Start dragging
     ---------------------------------------------------------- */

  const handlePointerDown = (
    e: React.PointerEvent<HTMLDivElement>
  ) => {
    e.preventDefault();

    draggingRef.current = true;

    updatePosition(e.clientX);
  };

  /* ----------------------------------------------------------
     Keyboard support
     ---------------------------------------------------------- */

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLDivElement>
  ) => {
    let next = pos;

    switch (e.key) {
      case "ArrowLeft":
        next = Math.max(0, pos - 2);
        break;

      case "ArrowRight":
        next = Math.min(100, pos + 2);
        break;

      case "Home":
        next = 0;
        break;

      case "End":
        next = 100;
        break;

      default:
        return;
    }

    e.preventDefault();

    setPos(next);
  };

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      className="
        relative
        max-h-[72vh]
        max-w-full
        overflow-hidden
        rounded-[10px]
        touch-none
        select-none
        cursor-ew-resize
        shadow-[0_30px_100px_rgba(0,0,0,.6)]
      "
    >
      {/* =====================================================
          NEW / UPSCALED IMAGE

          This establishes the canvas dimensions.
         ===================================================== */}

      <img
        src={after}
        alt="Enhanced result"
        draggable={false}
        className="
          block
          max-h-[72vh]
          max-w-full
          object-contain
          select-none
        "
      />

      {/* =====================================================
          OLD / ORIGINAL IMAGE

          It sits exactly over the new image.

          clip-path reveals only the required percentage.
         ===================================================== */}

      <img
        src={before}
        alt="Original"
        draggable={false}
        className="
          absolute
          inset-0
          block
          h-full
          w-full
          object-contain
          select-none
        "
        style={{
          clipPath:
            `inset(0 ${100 - pos}% 0 0)`,
        }}
      />

      {/* =====================================================
          SLIDER LINE
         ===================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          inset-y-0
          z-20
          w-[2px]
          -translate-x-1/2
          bg-white
          shadow-[0_0_10px_rgba(0,0,0,.5)]
        "
        style={{
          left: `${pos}%`,
        }}
      >
        {/* ===================================================
            HANDLE
           =================================================== */}

        <div
          className="
            absolute
            left-1/2
            top-1/2
            flex
            h-[48px]
            w-[48px]
            -translate-x-1/2
            -translate-y-1/2
            items-center
            justify-center
            rounded-[14px]
            bg-white
            shadow-[0_8px_30px_rgba(0,0,0,.4)]
          "
        >
          <div className="flex items-center gap-[5px] text-black">
            {/* LEFT ARROW */}

            <svg
              width="7"
              height="12"
              viewBox="0 0 7 12"
              fill="none"
            >
              <path
                d="M6 1L1 6L6 11"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            {/* RIGHT ARROW */}

            <svg
              width="7"
              height="12"
              viewBox="0 0 7 12"
              fill="none"
            >
              <path
                d="M1 1L6 6L1 11"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* =====================================================
          ORIGINAL LABEL
         ===================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          left-3
          top-3
          z-30
          rounded-md
          bg-black/60
          px-2.5
          py-1
          text-[10px]
          font-bold
          uppercase
          tracking-wider
          text-white
          backdrop-blur-sm
        "
      >
        Original
      </div>

      {/* =====================================================
          ENHANCED LABEL
         ===================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          right-3
          top-3
          z-30
          rounded-md
          bg-black/60
          px-2.5
          py-1
          text-[10px]
          font-bold
          uppercase
          tracking-wider
          text-white
          backdrop-blur-sm
        "
      >
        Enhanced
      </div>

      {/* =====================================================
          ACCESSIBLE SLIDER

          Invisible interaction layer over divider.
         ===================================================== */}

      <div
        role="slider"
        aria-label="Before and after comparison"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pos)}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className="
          absolute
          inset-y-0
          z-40
          w-4
          -translate-x-1/2
          outline-none
        "
        style={{
          left: `${pos}%`,
        }}
      />
    </div>
  );
}

/* ============================================================
   RANGE CONTROL

   Kept here for compatibility with the existing workspace.
   The advanced settings currently use ParameterSlider instead.
   ============================================================ */

function RangeControl({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs text-white/70">
        <div>{label}</div>

        <div className="font-semibold">
          {value}
        </div>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) =>
          onChange(
            Number(e.target.value)
          )
        }
        className="
          mt-2
          w-full
          accent-[#C7FF00]
        "
      />
    </div>
  );
}

/* ============================================================
   TOGGLE

   Kept for compatibility with existing code.
   ============================================================ */

function ToggleRow({
  label,
  enabled,
  onClick,
  disabled,
}: {
  label: string;
  enabled: boolean;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-white/80">
        {label}
      </div>

      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        aria-pressed={enabled}
        className={`
          h-7
          w-12
          rounded-full
          p-1
          transition-all

          ${
            enabled
              ? "bg-[#C7FF00]"
              : "bg-white/[0.06]"
          }

          disabled:opacity-30
        `}
      >
        <div
          className={`
            h-5
            w-5
            rounded-full
            bg-black
            transition-transform
            duration-200

            ${
              enabled
                ? "translate-x-5"
                : "translate-x-0"
            }
          `}
        />
      </button>
    </div>
  );
}

/* ============================================================
   UPLOAD STRIP
   ============================================================ */

function UploadStrip({
  imageUrl,
  onAddFile,
  onSelectThumb,
  onRemoveThumb,
}: {
  imageUrl?: string;
  onAddFile?: (file: File) => void;
  onSelectThumb?: (url: string) => void;
  onRemoveThumb?: (url: string) => void;
}) {
  const inputRef =
    useRef<HTMLInputElement | null>(null);

  const [thumbs, setThumbs] =
    useState<string[]>(
      () =>
        imageUrl
          ? [imageUrl]
          : []
    );

  /* ----------------------------------------------------------
     Add new image when main image changes
     ---------------------------------------------------------- */

  useEffect(() => {
    if (!imageUrl) return;

    setThumbs((prev) => {
      if (prev.includes(imageUrl)) {
        return prev;
      }

      return [
        ...prev,
        imageUrl,
      ];
    });
  }, [imageUrl]);

  /* ----------------------------------------------------------
     Open file picker
     ---------------------------------------------------------- */

  const handleClick = () => {
    inputRef.current?.click();
  };

  /* ----------------------------------------------------------
     New file
     ---------------------------------------------------------- */

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      e.target.files?.[0];

    if (file) {
      const reader =
        new FileReader();

      reader.onload = () => {
        const dataUrl =
          reader.result as string;

        setThumbs((prev) => {
          if (
            prev.includes(dataUrl)
          ) {
            return prev;
          }

          return [
            ...prev,
            dataUrl,
          ];
        });
      };

      reader.readAsDataURL(file);

      if (onAddFile) {
        onAddFile(file);
      }
    }

    e.target.value = "";
  };

  return (
    <div className="relative w-full">
      {/* FILE INPUT */}

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={handleChange}
        className="hidden"
      />

      <div className="flex items-center gap-4">
        {/* ==================================================
            ADD BUTTON
           ================================================== */}

        <button
          type="button"
          onClick={handleClick}
          className="
            flex
            h-20
            w-20
            shrink-0
            items-center
            justify-center
            rounded-lg
            border
            border-white/10
            bg-white/[0.02]
            text-white/70
            transition-all
            hover:border-white/20
            hover:bg-white/[0.05]
            hover:text-white
          "
        >
          <div className="flex flex-col items-center">
            <div className="text-3xl leading-none">
              +
            </div>

            <div className="mt-1 text-xs">
              Add
            </div>
          </div>
        </button>

        {/* ==================================================
            THUMBNAILS
           ================================================== */}

        <div className="flex gap-2 overflow-x-auto py-2">
          {thumbs.map((t) => (
            <div
              key={t}
              className="relative shrink-0"
            >
              <img
                src={t}
                className="
                  h-20
                  w-20
                  cursor-pointer
                  rounded
                  border
                  border-white/10
                  object-cover
                  transition-all
                  hover:border-white/30
                "
                alt="Thumbnail"
                draggable={false}
                onClick={() => {
                  if (onSelectThumb) {
                    onSelectThumb(t);
                  }
                }}
              />

              {/* REMOVE */}

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();

                  const ok =
                    window.confirm(
                      "Remove this thumbnail?"
                    );

                  if (!ok) return;

                  setThumbs((prev) =>
                    prev.filter(
                      (p) => p !== t
                    )
                  );

                  if (onRemoveThumb) {
                    onRemoveThumb(t);
                  }
                }}
                className="
                  absolute
                  -right-1
                  -top-1
                  flex
                  h-6
                  w-6
                  items-center
                  justify-center
                  rounded-full
                  bg-black/70
                  text-xs
                  text-white
                  transition-colors
                  hover:bg-black
                "
                aria-label="Remove thumbnail"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}