"use client";

import React, { useRef, useCallback } from "react";

export interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
  spotlightSize?: number;
  isSelected?: boolean;
}

export const SpotlightCard: React.FC<SpotlightCardProps> = ({
  children,
  className = "",
  spotlightColor = "rgba(56, 189, 248, 0.14)", // Sky accent glow
  spotlightSize = 280,
  isSelected = false,
  ...props
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    el.style.setProperty("--mouse-x", `${x}px`);
    el.style.setProperty("--mouse-y", `${y}px`);
  }, []);

  const handlePointerEnter = useCallback(() => {
    const el = cardRef.current;
    if (el) {
      el.style.setProperty("--spotlight-opacity", "1");
    }
  }, []);

  const handlePointerLeave = useCallback(() => {
    const el = cardRef.current;
    if (el) {
      el.style.setProperty("--spotlight-opacity", "0");
    }
  }, []);

  return (
    <div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      className={`relative overflow-hidden rounded-xl border transition-all duration-200 select-none ${
        isSelected
          ? "border-sky-500 bg-sky-950/20 text-sky-200 shadow-[0_0_20px_rgba(56,189,248,0.15)] ring-1 ring-sky-500/40"
          : "border-zinc-800 bg-[#121217] text-zinc-300 hover:border-zinc-700 hover:text-zinc-100"
      } ${className}`}
      style={
        {
          "--mouse-x": "0px",
          "--mouse-y": "0px",
          "--spotlight-opacity": "0",
        } as React.CSSProperties
      }
      {...props}
    >
      {/* High-performance CSS variable-driven radial spotlight */}
      <div
        className="pointer-events-none absolute -inset-px rounded-xl transition-opacity duration-300 ease-out"
        style={{
          opacity: "var(--spotlight-opacity)",
          background: `radial-gradient(${spotlightSize}px circle at var(--mouse-x) var(--mouse-y), ${spotlightColor}, transparent 80%)`,
        }}
        aria-hidden="true"
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default SpotlightCard;
