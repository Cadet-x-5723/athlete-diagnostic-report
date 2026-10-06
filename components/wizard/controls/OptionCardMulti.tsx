"use client";

import React from "react";
import { SpotlightCard } from "@/components/react-bits";
import { sound } from "@/lib/audio/soundEffects";
import { Check } from "lucide-react";

export interface OptionCardMultiProps {
  label: string;
  value: string;
  selectedValues?: string[];
  onToggle: (value: string) => void;
  description?: string;
  className?: string;
}

export const OptionCardMulti: React.FC<OptionCardMultiProps> = ({
  label,
  value,
  selectedValues = [],
  onToggle,
  description,
  className = "",
}) => {
  const isSelected = selectedValues.includes(value);

  const handleClick = () => {
    sound.playClick();
    onToggle(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <SpotlightCard
      isSelected={isSelected}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="checkbox"
      aria-checked={isSelected}
      tabIndex={0}
      className={`cursor-pointer p-4 transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${className}`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-col">
          <span className={`text-sm font-medium ${isSelected ? "text-cyan-300 font-semibold" : "text-zinc-200"}`}>
            {label}
          </span>
          {description && (
            <span className="mt-0.5 text-xs text-zinc-400 leading-relaxed">
              {description}
            </span>
          )}
        </div>
        <div
          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-all ${
            isSelected
              ? "border-cyan-400 bg-cyan-500/20 text-cyan-300 shadow-[0_0_8px_rgba(6,182,212,0.4)]"
              : "border-white/[0.1] bg-black/40 text-transparent"
          }`}
        >
          <Check className="h-3 w-3 stroke-[3]" />
        </div>
      </div>
    </SpotlightCard>
  );
};

export default OptionCardMulti;
