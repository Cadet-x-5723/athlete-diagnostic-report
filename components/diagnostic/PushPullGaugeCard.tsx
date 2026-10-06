"use client";

import React from "react";
import { PushPullAnalysis } from "@/lib/engine/analytics";
import { SpotlightCard, DecryptedText } from "@/components/react-bits";
import { Scale, AlertTriangle, ShieldCheck, AlertCircle } from "lucide-react";

export interface PushPullGaugeCardProps {
  analysis: PushPullAnalysis;
}

export const PushPullGaugeCard: React.FC<PushPullGaugeCardProps> = ({ analysis }) => {
  const getStatusIcon = () => {
    switch (analysis.status) {
      case "optimal":
        return <ShieldCheck className="h-5 w-5 text-emerald-400" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-amber-400" />;
      case "danger":
        return <AlertCircle className="h-5 w-5 text-rose-400" />;
    }
  };

  const getStatusBadge = () => {
    switch (analysis.status) {
      case "optimal":
        return "border-emerald-500/30 bg-emerald-950/20 text-emerald-400";
      case "warning":
        return "border-amber-500/30 bg-amber-950/20 text-amber-400";
      case "danger":
        return "border-rose-500/30 bg-rose-950/20 text-rose-400";
    }
  };

  // Normalizing ratio for a 0-100 visual progress bar (optimal 2:1 is center at ~50%)
  const clampedRatio = isFinite(analysis.ratio) ? Math.min(analysis.ratio, 5) : 5;
  const barPercent = Math.min(100, Math.max(5, (clampedRatio / 4) * 100));

  return (
    <SpotlightCard className="h-full p-5 flex flex-col justify-between">
      <div>
        {/* Card Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Scale className="h-4 w-4 text-sky-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300">
              Push-to-Pull Equilibrium
            </h4>
          </div>
          <div className={`flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getStatusBadge()}`}>
            {getStatusIcon()}
            <span>{analysis.classification.split("(")[0].trim()}</span>
          </div>
        </div>

        {/* Metric Display */}
        <div className="flex items-baseline gap-3 my-3">
          <div className="font-mono text-3xl font-extrabold text-white tracking-tight">
            <DecryptedText text={analysis.ratioFormatted} speed={30} maxIterations={8} />
          </div>
          <span className="text-xs text-zinc-400 font-medium">
            (P: {analysis.pushups} reps / PU: {analysis.pullups} reps)
          </span>
        </div>

        {/* Visual Balance Bar */}
        <div className="space-y-1.5 my-3">
          <div className="flex justify-between text-[11px] text-zinc-500 font-mono">
            <span>Pull Dominant (1:1)</span>
            <span className="text-emerald-400">Optimal (1.5 - 2.5:1)</span>
            <span>Push Dominant (4+:1)</span>
          </div>
          <div className="relative h-2 w-full rounded-full bg-zinc-800/80 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                analysis.status === "optimal"
                  ? "bg-gradient-to-r from-emerald-500 to-sky-400"
                  : analysis.status === "warning"
                  ? "bg-amber-400"
                  : "bg-rose-500"
              }`}
              style={{ width: `${barPercent}%` }}
            />
          </div>
        </div>

        {/* Risk Factor */}
        <p className="text-xs text-zinc-300 leading-relaxed mt-3">
          <strong className="text-zinc-100">Biomechanical Assessment: </strong>
          {analysis.riskFactor}
        </p>
      </div>

      {/* Actionable Prescription Footer */}
      <div className="mt-4 pt-3 border-t border-zinc-800/80">
        <p className="text-xs text-sky-300/90 leading-relaxed font-medium">
          💡 <strong className="text-sky-200">Prescription: </strong>
          {analysis.recommendation}
        </p>
      </div>
    </SpotlightCard>
  );
};

export default PushPullGaugeCard;
