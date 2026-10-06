"use client";

import React, { useEffect, useRef } from "react";

export interface DotFieldProps {
  className?: string;
  dotSize?: number;
  gap?: number;
  baseColor?: string;
  glowColor?: string;
  proximity?: number;
  enableMouseInteraction?: boolean;
}

export const DotField: React.FC<DotFieldProps> = ({
  className = "",
  dotSize = 1.2,
  gap = 28,
  baseColor = "rgba(113, 113, 122, 0.22)", // zinc-500 subtle
  glowColor = "rgba(56, 189, 248, 0.7)",   // sky-400 accent
  proximity = 120,
  enableMouseInteraction = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({
    x: -1000,
    y: -1000,
    active: false,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let isVisible = true;

    const resize = () => {
      if (!canvas) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.parentElement?.clientHeight || window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener("resize", resize);

    const handleVisibilityChange = () => {
      isVisible = !document.hidden;
      if (isVisible) {
        render();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    const handlePointerMove = (e: PointerEvent) => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true,
      };
    };

    const handlePointerLeave = () => {
      mouseRef.current.active = false;
    };

    if (enableMouseInteraction) {
      window.addEventListener("pointermove", handlePointerMove, { passive: true });
      window.addEventListener("pointerleave", handlePointerLeave, { passive: true });
    }

    let time = 0;
    const render = () => {
      if (!isVisible) return;
      time += 0.015;

      ctx.clearRect(0, 0, width, height);

      const mouse = mouseRef.current;
      const cols = Math.ceil(width / gap);
      const rows = Math.ceil(height / gap);

      for (let i = 0; i <= cols; i++) {
        for (let j = 0; j <= rows; j++) {
          const x = i * gap;
          const y = j * gap;

          // Subtle organic ambient breathing
          const ambientWave = Math.sin(time + (i * 0.2) + (j * 0.2)) * 0.3;
          let currentSize = dotSize + ambientWave * 0.4;
          let color = baseColor;

          if (enableMouseInteraction && mouse.active) {
            const dx = mouse.x - x;
            const dy = mouse.y - y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < proximity) {
              const factor = 1 - dist / proximity;
              currentSize = dotSize + factor * 2;
              color = glowColor;
            }
          }

          ctx.beginPath();
          ctx.arc(x, y, Math.max(0.5, currentSize), 0, Math.PI * 2);
          ctx.fillStyle = color;
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (enableMouseInteraction) {
        window.removeEventListener("pointermove", handlePointerMove);
        window.removeEventListener("pointerleave", handlePointerLeave);
      }
    };
  }, [dotSize, gap, baseColor, glowColor, proximity, enableMouseInteraction]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 z-0 opacity-80 ${className}`}
      aria-hidden="true"
    />
  );
};

export default DotField;
