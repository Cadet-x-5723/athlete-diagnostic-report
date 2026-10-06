"use client";

import React, { useState } from "react";
import { InjuryRiskFlag } from "@/lib/engine/analytics";
import { SpotlightCard } from "@/components/react-bits";
import { ShieldAlert, ShieldCheck, ChevronDown, ChevronUp, AlertCircle } from "lucide-react";

export interface InjuryMatrixCardProps {
  flags: InjuryRiskFlag[];
}

export const InjuryMatrixCard: React.FC<InjuryMatrixCardProps> = ({ flags }) => {
  const [expandedId, setExpandedId] = useState<string | null>(flags[0]?.id || null);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const getSeverityBadge = (severity: InjuryRiskFlag["severity"]) => {
    switch (severity) {
      case "critical":
        return "border-rose-500/40 bg-rose-950/30 text-rose-400";
      case "warning":
        return "border-amber-500/40 bg-amber-950/30 text-amber-400";
      case "advisory":
        return "border-sky-500/40 bg-sky-950/30 text-sky-400";
    }
  };

  return (
    <SpotlightCard className="h-full p-5 flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-amber-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300">
              Kinetic Injury & Pre-Hab Matrix
            </h4>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-zinc-200">
              {flags.length} {flags.length === 1 ? "Contraindication" : "Contraindications"}
            </span>
          </div>
        </div>

        {/* Flag List */}
        {flags.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-6 text-center rounded-xl border border-dashed border-zinc-800 bg-zinc-950/40">
            <ShieldCheck className="h-8 w-8 text-emerald-400 mb-2" />
            <span className="text-sm font-semibold text-zinc-200">Zero Kinetic Red Flags</span>
            <p className="text-xs text-zinc-500 mt-1 max-w-xs">
              Biomechanical markers reflect clean movement ranges and no active joint contraindications.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {flags.map((flag) => {
              const isExpanded = expandedId === flag.id;

              return (
                <div
                  key={flag.id}
                  className="rounded-xl border border-zinc-800/90 bg-zinc-950/70 p-3.5 transition-all"
                >
                  <div
                    onClick={() => toggleExpand(flag.id)}
                    className="flex cursor-pointer items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${getSeverityBadge(flag.severity)}`}>
                        {flag.severity}
                      </span>
                      <span className="text-xs font-semibold text-zinc-200">
                        {flag.title}
                      </span>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4 text-zinc-400" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-zinc-400" />
                    )}
                  </div>

                  {isExpanded && (
                    <div className="mt-3 pt-3 border-t border-zinc-800/60 space-y-2.5 text-xs">
                      <div>
                        <span className="text-[11px] font-bold text-rose-400 block mb-1">
                          🚫 Contraindicated Movements (Avoid):
                        </span>
                        <ul className="list-disc list-inside space-y-0.5 text-zinc-300">
                          {flag.contraindications.map((ci, idx) => (
                            <li key={idx}>{ci}</li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <span className="text-[11px] font-bold text-emerald-400 block mb-1">
                          🛡️ Recommended Pre-Hab Protocol:
                        </span>
                        <ul className="list-disc list-inside space-y-0.5 text-zinc-300">
                          {flag.correctiveProtocol.map((cp, idx) => (
                            <li key={idx}>{cp}</li>
                          ))}
                        </ul>
                      </div>

                      <p className="text-[11px] text-zinc-400 italic pt-1">
                        Mechanism: {flag.biomechanicalInsight}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-zinc-800/80 text-[11px] text-zinc-500">
        Deterministic sports science checks cross-referencing Stage 1, 4 & 5 pain points.
      </div>
    </SpotlightCard>
  );
};

export default InjuryMatrixCard;
