import React, { useEffect, useRef } from 'react';

export default function PixelatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const PIXEL_SIZE = 24;
    let cols = Math.ceil(width / PIXEL_SIZE);
    let rows = Math.ceil(height / PIXEL_SIZE);

    // Pixel matrix state
    interface Pixel {
      x: number;
      y: number;
      alpha: number;
      targetAlpha: number;
      color: string;
      speed: number;
    }

    const colors = [
      'rgba(129, 140, 248, ', // Violet
      'rgba(34, 211, 238, ',  // Cyan
      'rgba(168, 85, 247, ',  // Purple
      'rgba(99, 102, 241, ',  // Indigo
    ];

    let pixels: Pixel[] = [];

    function initPixels() {
      pixels = [];
      cols = Math.ceil(width / PIXEL_SIZE);
      rows = Math.ceil(height / PIXEL_SIZE);

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          // Add pixel nodes sparingly to create an elegant pixel mesh
          if (Math.random() < 0.18) {
            pixels.push({
              x: c * PIXEL_SIZE,
              y: r * PIXEL_SIZE,
              alpha: Math.random() * 0.15,
              targetAlpha: Math.random() * 0.35,
              color: colors[Math.floor(Math.random() * colors.length)],
              speed: 0.005 + Math.random() * 0.01,
            });
          }
        }
      }
    }

    initPixels();

    let mouseX = -1000;
    let mouseY = -1000;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initPixels();
    };

    window.addEventListener('resize', handleResize);

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      // Draw subtle grid lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.025)';
      ctx.lineWidth = 1;

      for (let x = 0; x < width; x += PIXEL_SIZE) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      for (let y = 0; y < height; y += PIXEL_SIZE) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw animated pixel blocks
      for (let p of pixels) {
        // Distance to mouse for interactive highlight
        const dx = p.x + PIXEL_SIZE / 2 - mouseX;
        const dy = p.y + PIXEL_SIZE / 2 - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        let currentAlpha = p.alpha;
        if (dist < 180) {
          const factor = 1 - dist / 180;
          currentAlpha = Math.min(0.7, p.alpha + factor * 0.55);
        } else {
          // Pulsating fade
          p.alpha += (p.targetAlpha - p.alpha) * p.speed;
          if (Math.abs(p.alpha - p.targetAlpha) < 0.01) {
            p.targetAlpha = Math.random() * 0.35;
          }
        }

        ctx.fillStyle = `${p.color}${currentAlpha})`;
        ctx.fillRect(p.x + 1, p.y + 1, PIXEL_SIZE - 2, PIXEL_SIZE - 2);

        // Draw 3D realistic edge highlight on hover
        if (dist < 120) {
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
          ctx.strokeRect(p.x + 1, p.y + 1, PIXEL_SIZE - 2, PIXEL_SIZE - 2);
        }
      }

      animId = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-80 transition-opacity duration-1000"
    />
  );
}
