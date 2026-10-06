"use client";

import React from "react";
import { WorkCapacityAnalysis } from "@/lib/engine/analytics";
import { SpotlightCard, DecryptedText } from "@/components/react-bits";
import { Zap, Activity } from "lucide-react";

export interface WorkCapacityCardProps {
  capacity: WorkCapacityAnalysis;
}

export const WorkCapacityCard: React.FC<WorkCapacityCardProps> = ({ capacity }) => {
  return (
    <SpotlightCard className="h-full p-5 flex flex-col justify-between">
      <div>
        {/* Card Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-emerald-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300">
              Kinetic Work Capacity
            </h4>
          </div>
          <div className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${capacity.badgeColor}`}>
            {capacity.tier}
          </div>
        </div>

        {/* Big Score Display */}
        <div className="flex items-baseline gap-2 my-2">
          <div className="font-mono text-4xl font-extrabold text-white tracking-tight">
            <DecryptedText
              text={String(capacity.totalScore)}
              speed={40}
              maxIterations={6}
            />
          </div>
          <span className="text-zinc-500 font-mono text-sm">/ 100 PTS</span>
        </div>

        {/* Sub-Metric Point Breakdown */}
        <div className="grid grid-cols-3 gap-2 my-4">
          <div className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-2.5 text-center">
            <span className="text-[10px] uppercase tracking-wider text-zinc-400 block mb-0.5">Core (Plank)</span>
            <span className="font-mono text-sm font-bold text-sky-400">
              {capacity.plankScore} <span className="text-[10px] text-zinc-500">/ 25</span>
            </span>
          </div>

          <div className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-2.5 text-center">
            <span className="text-[10px] uppercase tracking-wider text-zinc-400 block mb-0.5">Squats Max</span>
            <span className="font-mono text-sm font-bold text-emerald-400">
              {capacity.squatsScore} <span className="text-[10px] text-zinc-500">/ 35</span>
            </span>
          </div>

          <div className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-2.5 text-center">
            <span className="text-[10px] uppercase tracking-wider text-zinc-400 block mb-0.5">3.5k Cardio</span>
            <span className="font-mono text-sm font-bold text-amber-400">
              {capacity.runningScore} <span className="text-[10px] text-zinc-500">/ 40</span>
            </span>
          </div>
        </div>

        {/* Physiological Summary */}
        <p className="text-xs text-zinc-300 leading-relaxed">
          <strong className="text-zinc-100">Physiological Adaptation: </strong>
          {capacity.physiologicalSummary}
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
        <span className="flex items-center gap-1.5">
          <Activity className="h-3.5 w-3.5 text-emerald-400" />
          <span>Aerobic & Muscular Conditioning</span>
        </span>
        <span className="font-mono text-zinc-300">
          {capacity.parsedRunMinutes ? `${capacity.parsedRunMinutes.toFixed(1)}m pace` : "Custom"}
        </span>
      </div>
    </SpotlightCard>
  );
};

export default WorkCapacityCard;
