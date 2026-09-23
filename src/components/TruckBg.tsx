'use client';

import { useEffect } from 'react';

export default function AnimationPage() {
  useEffect(() => {
    const embedScript = document.createElement('script');

    embedScript.type = 'text/javascript';

    embedScript.textContent = `
      !function(){
        if(!window.UnicornStudio){
          window.UnicornStudio={isInitialized:!1};

          var i=document.createElement("script");

          i.src="https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.33/dist/unicornStudio.umd.js";

          i.onload=function(){
            window.UnicornStudio.isInitialized ||
            (
              UnicornStudio.init(),
              window.UnicornStudio.isInitialized=!0
            )
          };

          (document.head || document.body).appendChild(i)
        }
      }();
    `;

    document.head.appendChild(embedScript);

    const style = document.createElement('style');

    style.textContent = `
      [data-us-project] {
        position: relative !important;
        overflow: hidden !important;
      }

      [data-us-project] canvas {
        clip-path: inset(0 0 10% 0) !important;
      }

      [data-us-project] * {
        pointer-events: none !important;
      }

      [data-us-project] a[href*="unicorn"],
      [data-us-project] button[title*="unicorn"],
      [data-us-project] div[title*="Made with"],
      [data-us-project] .unicorn-brand,
      [data-us-project] [class*="brand"],
      [data-us-project] [class*="credit"],
      [data-us-project] [class*="watermark"] {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        position: absolute !important;
        left: -9999px !important;
        top: -9999px !important;
      }

      /*
       * Blinking background dots
       */
      .blinking-dots {
        position: absolute;
        inset: 0;
        pointer-events: none;

        background-image:
          radial-gradient(circle at 8% 18%, rgba(255,255,255,.75) 0 1px, transparent 1.5px),
          radial-gradient(circle at 18% 72%, rgba(255,255,255,.45) 0 1px, transparent 1.5px),
          radial-gradient(circle at 29% 35%, rgba(255,255,255,.65) 0 1px, transparent 1.5px),
          radial-gradient(circle at 41% 82%, rgba(255,255,255,.4) 0 1px, transparent 1.5px),
          radial-gradient(circle at 53% 24%, rgba(255,255,255,.7) 0 1px, transparent 1.5px),
          radial-gradient(circle at 64% 66%, rgba(255,255,255,.5) 0 1px, transparent 1.5px),
          radial-gradient(circle at 75% 38%, rgba(255,255,255,.7) 0 1px, transparent 1.5px),
          radial-gradient(circle at 87% 78%, rgba(255,255,255,.45) 0 1px, transparent 1.5px),
          radial-gradient(circle at 94% 20%, rgba(255,255,255,.65) 0 1px, transparent 1.5px);

        animation: pixelifyDots 4s ease-in-out infinite alternate;
      }

      @keyframes pixelifyDots {
        0% {
          opacity: .25;
        }

        25% {
          opacity: .55;
        }

        50% {
          opacity: .3;
        }

        75% {
          opacity: .7;
        }

        100% {
          opacity: .4;
        }
      }

      /*
       * Second dot layer with different timing
       */
      .blinking-dots::after {
        content: "";
        position: absolute;
        inset: 0;

        background-image:
          radial-gradient(circle at 14% 45%, rgba(255,255,255,.5) 0 1px, transparent 1.5px),
          radial-gradient(circle at 36% 12%, rgba(255,255,255,.6) 0 1px, transparent 1.5px),
          radial-gradient(circle at 48% 55%, rgba(255,255,255,.4) 0 1px, transparent 1.5px),
          radial-gradient(circle at 71% 15%, rgba(255,255,255,.55) 0 1px, transparent 1.5px),
          radial-gradient(circle at 82% 52%, rgba(255,255,255,.65) 0 1px, transparent 1.5px);

        animation: pixelifyDotsReverse 3s ease-in-out infinite alternate;
      }

      @keyframes pixelifyDotsReverse {
        0% {
          opacity: .65;
        }

        35% {
          opacity: .2;
        }

        70% {
          opacity: .7;
        }

        100% {
          opacity: .3;
        }
      }
    `;

    document.head.appendChild(style);

    const hideBranding = () => {
      const selectors = [
        '[data-us-project]',
        '[data-us-project="OMzqyUv6M3kSnv0JeAtC"]',
        '.unicorn-studio-container',
        'canvas[aria-label*="Unicorn"]',
      ];

      selectors.forEach((selector) => {
        const containers = document.querySelectorAll(selector);

        containers.forEach((container) => {
          const allElements = container.querySelectorAll('*');

          allElements.forEach((el) => {
            const text = (el.textContent || '').toLowerCase();
            const title = (el.getAttribute('title') || '').toLowerCase();
            const href = (el.getAttribute('href') || '').toLowerCase();

            if (
              text.includes('made with') ||
              text.includes('unicorn') ||
              title.includes('made with') ||
              title.includes('unicorn') ||
              href.includes('unicorn.studio')
            ) {
              el.style.display = 'none';
              el.style.visibility = 'hidden';
              el.style.opacity = '0';
              el.style.pointerEvents = 'none';
              el.style.position = 'absolute';
              el.style.left = '-9999px';
              el.style.top = '-9999px';

              try {
                el.remove();
              } catch {}
            }
          });
        });
      });
    };

    hideBranding();

    const interval = setInterval(hideBranding, 100);

    return () => {
      clearInterval(interval);

      if (document.head.contains(embedScript)) {
        document.head.removeChild(embedScript);
      }

      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-black">
      
      {/* Unicorn Studio background */}
      <div className="absolute inset-0 w-full h-full hidden lg:block">
        <div
          data-us-project="OMzqyUv6M3kSnv0JeAtC"
          style={{
            width: '100%',
            height: '100%',
            minHeight: '100vh',
          }}
        />
      </div>

      {/* Blinking dots */}
      <div className="blinking-dots absolute inset-0 z-10" />

    </main>
  );
}