import { useEffect, useRef } from "react";
import gsap from "gsap";
import "../index.css";

const WORDS = [
  { text: "PIXELIFY", accent: true },
  { text: "local", accent: false },
  { text: "AI", accent: true },
  { text: "for", accent: false },
  { text: "your", accent: false },
  { text: "images", accent: true },
  { text: "upscale", accent: true },
  { text: "restore", accent: false },
  { text: "enhance", accent: true },
  { text: "without", accent: false },
  { text: "uploading", accent: false },
  { text: "anything", accent: true },
  { text: "to", accent: false },
  { text: "the", accent: false },
  { text: "cloud", accent: true },
  { text: "your", accent: false },
  { text: "pixels", accent: true },
  { text: "stay", accent: false },
  { text: "yours", accent: true },
];

type Box = {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
};

type WordData = {
  text: string;
  accent: boolean;
  fs: number;
  x: number;
  y: number;
  box: Box;
};

export default function PixelifyStory() {
  const rootRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const world = worldRef.current;

    if (!root || !world) return;

    let timeline: gsap.core.Timeline | null = null;

    let resizeTimer: ReturnType<typeof setTimeout> | null =
      null;

    /*
     * ------------------------------------------------
     * BUILD
     * ------------------------------------------------
     */

    const build = () => {
      /*
       * Kill previous animation before rebuilding.
       */
      timeline?.kill();
      timeline = null;

      world.innerHTML = "";

      /*
       * Get current section size.
       */
      const frameW = root.clientWidth;
      const frameH = root.clientHeight;

      if (!frameW || !frameH) return;

      const mobile = frameW <= 640;

      /*
       * ------------------------------------------------
       * RESPONSIVE SETTINGS
       * ------------------------------------------------
       */

      const base = Math.max(
        mobile ? 48 : 70,
        Math.min(frameW, frameH) *
          (mobile ? 0.15 : 0.14)
      );

      const ratio = mobile ? 0.68 : 0.72;

      const gapRatio = mobile ? 0.055 : 0.07;

      const cameraMargin = mobile
        ? 1.12
        : 1.28;

      /*
       * ------------------------------------------------
       * MEASUREMENT ELEMENT
       * ------------------------------------------------
       */

      const ruler =
        document.createElement("div");

      ruler.style.cssText = `
        position: absolute;
        left: -10000px;
        top: 0;

        white-space: nowrap;
        visibility: hidden;
        pointer-events: none;

        font-family:
          "Helvetica Neue",
          Helvetica,
          Arial,
          sans-serif;

        font-weight: 700;
        text-transform: uppercase;

        letter-spacing: -0.02em;
        line-height: 0.78;
      `;

      world.appendChild(ruler);

      /*
       * ------------------------------------------------
       * CALCULATE WORD POSITIONS
       * ------------------------------------------------
       */

      const words: WordData[] = [];

      let currentBox: Box | null = null;

      WORDS.forEach((word, index) => {
        /*
         * First word is the largest.
         */
        const fs =
          index === 0
            ? base
            : Math.max(
                mobile ? 20 : 24,
                (currentBox!.y1 -
                  currentBox!.y0) *
                  ratio
              );

        ruler.style.fontSize = `${fs}px`;

        ruler.textContent = word.text;

        /*
         * Use offsetWidth because the element
         * is hidden from the visual layout.
         */
        const width = ruler.offsetWidth;

        const height = fs * 0.78;

        const gap = fs * gapRatio;

        let x = 0;
        let y = 0;

        /*
         * First word.
         */
        if (index === 0) {
          x = 0;
          y = 0;
        }

        /*
         * Continue horizontally or vertically
         * depending on the current world ratio.
         */
        else if (
          (currentBox!.x1 -
            currentBox!.x0) /
            (currentBox!.y1 -
              currentBox!.y0) <
          frameW / frameH
        ) {
          /*
           * Grow horizontally.
           */
          x =
            currentBox!.x1 +
            gap;

          y =
            currentBox!.y1 -
            height;
        } else {
          /*
           * Grow vertically.
           */
          x =
            currentBox!.x0;

          y =
            currentBox!.y1 +
            gap;
        }

        /*
         * Update bounding box.
         */
        const nextBox: Box = currentBox
          ? {
              x0: Math.min(
                currentBox.x0,
                x
              ),

              y0: Math.min(
                currentBox.y0,
                y
              ),

              x1: Math.max(
                currentBox.x1,
                x + width
              ),

              y1: Math.max(
                currentBox.y1,
                y + height
              ),
            }
          : {
              x0: x,
              y0: y,
              x1: x + width,
              y1: y + height,
            };

        currentBox = nextBox;

        words.push({
          text: word.text,
          accent: word.accent,
          fs,
          x,
          y,
          box: {
            ...nextBox,
          },
        });
      });

      /*
       * Remove measurement element.
       */
      world.removeChild(ruler);

      /*
       * ------------------------------------------------
       * CREATE ACTUAL WORD ELEMENTS
       * ------------------------------------------------
       */

      const elements =
        words.map((word) => {
          const element =
            document.createElement("div");

          element.className =
            word.accent
              ? "pixelify-word pixelify-accent"
              : "pixelify-word";

          element.textContent =
            word.text;

          element.style.left =
            `${word.x}px`;

          element.style.top =
            `${word.y}px`;

          element.style.fontSize =
            `${word.fs}px`;

          world.appendChild(
            element
          );

          return element;
        });

      /*
       * ------------------------------------------------
       * FORCE BROWSER LAYOUT
       * ------------------------------------------------
       */

      elements.forEach((element) => {
        void element.offsetWidth;
      });

      /*
       * ------------------------------------------------
       * CALCULATE ACTUAL WORLD BOUNDS
       * ------------------------------------------------
       */

      let fullBox: Box | null = null;

      elements.forEach((element) => {
        const rect: Box = {
          x0: element.offsetLeft,

          y0: element.offsetTop,

          x1:
            element.offsetLeft +
            element.offsetWidth,

          y1:
            element.offsetTop +
            element.offsetHeight,
        };

        fullBox = fullBox
          ? {
              x0: Math.min(
                fullBox.x0,
                rect.x0
              ),

              y0: Math.min(
                fullBox.y0,
                rect.y0
              ),

              x1: Math.max(
                fullBox.x1,
                rect.x1
              ),

              y1: Math.max(
                fullBox.y1,
                rect.y1
              ),
            }
          : rect;
      });

      if (!fullBox) return;

      /*
       * ------------------------------------------------
       * CAMERA CALCULATION
       * ------------------------------------------------
       */

      const poseFor = (
        box: Box,
        multiplier: number
      ) => {
        const width =
          (box.x1 - box.x0) *
          multiplier;

        const height =
          (box.y1 - box.y0) *
          multiplier;

        /*
         * Safety check.
         */
        if (
          width <= 0 ||
          height <= 0
        ) {
          return {
            x: 0,
            y: 0,
            scale: 1,
          };
        }

        /*
         * Fit world inside viewport.
         */
        const scale =
          Math.min(
            frameW / width,
            frameH / height
          );

        return {
          x:
            frameW / 2 -
            ((box.x0 + box.x1) *
              scale) /
              2,

          y:
            frameH / 2 -
            ((box.y0 + box.y1) *
              scale) /
              2,

          scale,
        };
      };

      /*
       * ------------------------------------------------
       * CAMERA POSITIONS
       * ------------------------------------------------
       */

      const firstPose =
        poseFor(
          words[0].box,
          cameraMargin
        );

      const finalPose =
        poseFor(
          fullBox,
          mobile ? 1.08 : 1.18
        );

      /*
       * ------------------------------------------------
       * STATIC WORLD CONFIGURATION
       * ------------------------------------------------
       *
       * Only properties that don't change
       * during the animation go here.
       */

      gsap.set(world, {
        transformOrigin: "0 0",

        force3D: true,
      });

      /*
       * ------------------------------------------------
       * TIMELINE
       * ------------------------------------------------
       *
       * IMPORTANT:
       *
       * The initial camera state and word state
       * are INSIDE the timeline.
       *
       * Therefore repeat:-1 always starts from
       * the same position.
       */

      timeline =
        gsap.timeline({
          repeat: -1,

          /*
           * Small pause before restarting.
           */
          repeatDelay: 0.5,
        });

      /*
       * ------------------------------------------------
       * RESET CAMERA
       * ------------------------------------------------
       */

      timeline.set(
        world,
        {
          x: firstPose.x,

          y: firstPose.y,

          scale: firstPose.scale,
        },
        0
      );

      /*
       * ------------------------------------------------
       * RESET ALL WORDS
       * ------------------------------------------------
       */

      timeline.set(
        elements,
        {
          opacity: 0,

          y: 10,

          scale: 0.985,

          force3D: true,
        },
        0
      );

      /*
       * ------------------------------------------------
       * SHOW FIRST WORD
       * ------------------------------------------------
       */

      timeline.set(
        elements[0],
        {
          opacity: 1,

          y: 0,

          scale: 1,
        },
        0
      );

      /*
       * ------------------------------------------------
       * TIMING
       * ------------------------------------------------
       */

      const STEP = mobile
        ? 0.48
        : 0.55;

      const MOVE = mobile
        ? 0.42
        : 0.48;

      /*
       * ------------------------------------------------
       * ANIMATE WORDS
       * ------------------------------------------------
       */

      words.forEach(
        (word, index) => {
          if (index === 0) return;

          const time =
            index * STEP;

          const pose =
            poseFor(
              word.box,
              cameraMargin
            );

          /*
           * WORD REVEAL
           *
           * Only opacity + transform.
           *
           * No blur/filter.
           */

          timeline!.to(
            elements[index],
            {
              opacity: 1,

              y: 0,

              scale: 1,

              duration: 0.2,

              ease: "power2.out",

              overwrite: "auto",

              force3D: true,
            },
            time
          );

          /*
           * CAMERA MOVEMENT
           */

          timeline!.to(
            world,
            {
              x: pose.x,

              y: pose.y,

              scale: pose.scale,

              duration: MOVE,

              ease: "power3.inOut",

              overwrite: "auto",

              force3D: true,
            },
            time
          );
        }
      );

      /*
       * ------------------------------------------------
       * FINAL PULL BACK
       * ------------------------------------------------
       */

      timeline.to(
        world,
        {
          x: finalPose.x,

          y: finalPose.y,

          scale: finalPose.scale,

          duration: 1.1,

          ease: "power3.inOut",

          overwrite: "auto",

          force3D: true,
        },
        words.length *
          STEP +
          0.35
      );

      /*
       * ------------------------------------------------
       * HOLD COMPLETE MESSAGE
       * ------------------------------------------------
       */

      timeline.to(
        {},
        {
          duration: 2.2,
        }
      );
    };

    /*
     * ------------------------------------------------
     * INITIAL BUILD
     * ------------------------------------------------
     */

    build();

    /*
     * ------------------------------------------------
     * INTERSECTION OBSERVER
     * ------------------------------------------------
     *
     * Pause GSAP when the section isn't visible.
     */

    const intersectionObserver =
      new IntersectionObserver(
        ([entry]) => {
          if (!timeline) return;

          if (
            entry.isIntersecting
          ) {
            timeline.resume();
          } else {
            timeline.pause();
          }
        },
        {
          threshold: 0.05,
        }
      );

    intersectionObserver.observe(
      root
    );

    /*
     * ------------------------------------------------
     * RESIZE OBSERVER
     * ------------------------------------------------
     */

    const resizeObserver =
      new ResizeObserver(() => {
        if (resizeTimer) {
          clearTimeout(
            resizeTimer
          );
        }

        resizeTimer =
          setTimeout(() => {
            build();
          }, 150);
      });

    resizeObserver.observe(
      root
    );

    /*
     * ------------------------------------------------
     * CLEANUP
     * ------------------------------------------------
     */

    return () => {
      intersectionObserver.disconnect();

      resizeObserver.disconnect();

      if (resizeTimer) {
        clearTimeout(
          resizeTimer
        );
      }

      timeline?.kill();

      timeline = null;

      world.innerHTML = "";
    };
  }, []);

  return (
    <section
      ref={rootRef}
      className="pixelify-story"
    >
      <div className="pixelify-stage">
        <div
          ref={worldRef}
          className="pixelify-world"
        />
      </div>

      <div className="pixelify-vignette" />
    </section>
  );
}