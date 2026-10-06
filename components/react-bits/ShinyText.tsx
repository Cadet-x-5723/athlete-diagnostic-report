"use client";

import React from "react";

export interface ShinyTextProps {
  text?: string;
  children?: React.ReactNode;
  disabled?: boolean;
  speed?: number;
  className?: string;
  shimmerColor?: string;
}

export const ShinyText: React.FC<ShinyTextProps> = ({
  text,
  children,
  disabled = false,
  speed = 3,
  className = "",
  shimmerColor = "rgba(255, 255, 255, 0.9)",
}) => {
  const content = text || children;

  if (disabled) {
    return <span className={className}>{content}</span>;
  }

  return (
    <span
      className={`relative inline-block overflow-hidden bg-clip-text font-medium text-transparent ${className}`}
      style={{
        backgroundImage: `linear-gradient(120deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.4) 35%, ${shimmerColor} 50%, rgba(255,255,255,0.4) 65%, rgba(255,255,255,0.4) 100%)`,
        backgroundSize: "200% 100%",
        WebkitBackgroundClip: "text",
        animation: `shiny-shimmer ${speed}s infinite linear`,
      }}
    >
      <style jsx>{`
        @keyframes shiny-shimmer {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
      `}</style>
      {content}
    </span>
  );
};

export default ShinyText;
