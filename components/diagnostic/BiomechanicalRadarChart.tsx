"use client";

import React, { useMemo } from "react";
import { useAssessment } from "@/lib/store/useAssessment";
import { SpotlightCard } from "@/components/react-bits";
import { Compass, ShieldCheck } from "lucide-react";

export interface RadarMetric {
  key: string;
  label: string;
  score: number; // 0 - 100
  benchmark: string;
  color: string;
}

export const BiomechanicalRadarChart: React.FC<{ className?: string }> = ({ className = "" }) => {
  const { data } = useAssessment();

  const metrics: RadarMetric[] = useMemo(() => {
    // 1. Push Power (0 to 100 based on pushups; 40+ reps is 100)
    const pushups = data.s1_pushups || 0;
    const pushScore = Math.min(100, Math.round((pushups / 40) * 100));

    // 2. Pull Capacity (0 to 100 based on pullups; 18+ reps is 100)
    const pullups = data.s1_pullups || 0;
    const pullScore = Math.min(100, Math.round((pullups / 18) * 100));

    // 3. Core Isometric (plank brackets)
    let coreScore = 30;
    if (data.s1_plank?.includes("120+")) coreScore = 100;
    else if (data.s1_plank?.includes("90-120")) coreScore = 80;
    else if (data.s1_plank?.includes("60-90")) coreScore = 65;
    else if (data.s1_plank?.includes("30-60")) coreScore = 45;

    // 4. Squat Power (squats max; 50+ reps is 100)
    const squats = data.s1_squats || 0;
    const squatScore = Math.min(100, Math.round((squats / 50) * 100));

    // 5. Aerobic Stamina (1.5 mile run time)
    let aeroScore = 40;
    if (data.s1_run_time) {
      const match = data.s1_run_time.match(/(\d+(\.\d+)?)/);
      if (match) {
        const mins = parseFloat(match[1]);
        if (mins < 9.5) aeroScore = 100;
        else if (mins < 11) aeroScore = 88;
        else if (mins < 13) aeroScore = 75;
        else if (mins < 15) aeroScore = 60;
        else aeroScore = 45;
      }
    }

    // 6. Kinetic Mobility & Symmetry
    let mobScore = 70;
    if (data.s4_squat_mob?.toLowerCase().includes("deep") || data.s4_squat_mob?.toLowerCase().includes("flat")) {
      mobScore += 15;
    }
    if (data.s4_shoulder_mob?.toLowerCase().includes("full") || data.s4_shoulder_mob?.toLowerCase().includes("overhead")) {
      mobScore += 15;
    }
    if (data.s4_asymmetry && data.s4_asymmetry !== "Balanced") {
      mobScore -= 20;
    }
    if (data.s1_pain && data.s1_pain.length > 0 && !data.s1_pain.includes("None")) {
      mobScore -= data.s1_pain.length * 8;
    }
    mobScore = Math.max(15, Math.min(100, mobScore));

    return [
      { key: "push", label: "Push Power", score: pushScore, benchmark: `${pushups} reps`, color: "#38bdf8" },
      { key: "pull", label: "Pull Capacity", score: pullScore, benchmark: `${pullups} reps`, color: "#0ea5e9" },
      { key: "core", label: "Core Isometric", score: coreScore, benchmark: data.s1_plank || "Untested", color: "#10b981" },
      { key: "squat", label: "Squat Volume", score: squatScore, benchmark: `${squats} reps`, color: "#34d399" },
      { key: "aero", label: "Aerobic VO2", score: aeroScore, benchmark: data.s1_run_time || "Untested", color: "#f59e0b" },
      { key: "mob", label: "Kinetic Mobility", score: mobScore, benchmark: `${mobScore}% Reserve`, color: "#818cf8" },
    ];
  }, [data]);

  const size = 320;
  const center = size / 2;
  const radius = 105;
  const totalAxes = metrics.length;
  const angleStep = (Math.PI * 2) / totalAxes;

  // Compute vertices for polygon
  const polygonPoints = useMemo(() => {
    return metrics
      .map((m, i) => {
        const angle = i * angleStep - Math.PI / 2;
        const r = (m.score / 100) * radius;
        const x = center + r * Math.cos(angle);
        const y = center + r * Math.sin(angle);
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(" ");
  }, [metrics, angleStep, center, radius]);

  // Average Athletic Equilibrium Index
  const averageIndex = Math.round(metrics.reduce((acc, curr) => acc + curr.score, 0) / metrics.length);

  return (
    <SpotlightCard className={`p-5 flex flex-col justify-between ${className}`}>
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-3 border-b border-white/[0.08] pb-3">
          <div className="flex items-center gap-2">
            <Compass className="h-4 w-4 text-cyan-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-200">
              Biomechanical Equilibrium Hexagon
            </h4>
          </div>
          <div className="flex items-center gap-1 rounded-full border border-cyan-500/30 bg-cyan-950/20 px-2.5 py-0.5 text-xs font-semibold text-cyan-300">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>EQ Index: {averageIndex}%</span>
          </div>
        </div>

        {/* SVG Spider Radar */}
        <div className="relative flex items-center justify-center py-2">
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
            {/* Background Rings */}
            {[0.25, 0.5, 0.75, 1.0].map((level) => {
              const ringPoints = Array.from({ length: totalAxes }, (_, i) => {
                const angle = i * angleStep - Math.PI / 2;
                const r = level * radius;
                return `${(center + r * Math.cos(angle)).toFixed(1)},${(center + r * Math.sin(angle)).toFixed(1)}`;
              }).join(" ");
              return (
                <polygon
                  key={level}
                  points={ringPoints}
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.08)"
                  strokeWidth="1"
                  strokeDasharray={level === 1 ? "none" : "2 3"}
                />
              );
            })}

            {/* Axis Spoke Lines */}
            {metrics.map((_, i) => {
              const angle = i * angleStep - Math.PI / 2;
              const x2 = center + radius * Math.cos(angle);
              const y2 = center + radius * Math.sin(angle);
              return (
                <line
                  key={i}
                  x1={center}
                  y1={center}
                  x2={x2}
                  y2={y2}
                  stroke="rgba(255, 255, 255, 0.12)"
                  strokeWidth="1"
                />
              );
            })}

            {/* Active Filled Area Polygon */}
            <polygon
              points={polygonPoints}
              fill="rgba(6, 182, 212, 0.18)"
              stroke="#06b6d4"
              strokeWidth="2"
              className="transition-all duration-500 ease-out"
            />

            {/* Active Metric Nodes */}
            {metrics.map((m, i) => {
              const angle = i * angleStep - Math.PI / 2;
              const r = (m.score / 100) * radius;
              const cx = center + r * Math.cos(angle);
              const cy = center + r * Math.sin(angle);

              // Label placement
              const labelR = radius + 22;
              const lx = center + labelR * Math.cos(angle);
              const ly = center + labelR * Math.sin(angle);

              return (
                <g key={m.key}>
                  {/* Point circle */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r="4"
                    fill="#06b6d4"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                    className="transition-all duration-500 ease-out"
                  />
                  {/* Axis Label */}
                  <text
                    x={lx}
                    y={ly}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="9.5"
                    fontWeight="600"
                    fill="#94a3b8"
                    className="font-mono tracking-tight select-none"
                  >
                    {m.label} ({m.score})
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Metrics Grid Cards */}
        <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-white/[0.08]">
          {metrics.map((m) => (
            <div key={m.key} className="rounded-lg border border-white/[0.06] bg-black/40 p-2 text-center">
              <span className="text-[10px] uppercase font-mono text-zinc-400 block truncate">{m.label}</span>
              <span className="font-mono text-xs font-bold text-cyan-300">
                {m.score}%
              </span>
              <span className="block text-[9px] text-zinc-500 truncate">{m.benchmark}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3 text-[10px] text-zinc-400 leading-tight">
        Synchronized real-time with baseline assessments, joint symmetry, and metabolic outputs.
      </div>
    </SpotlightCard>
  );
};

export default BiomechanicalRadarChart;
