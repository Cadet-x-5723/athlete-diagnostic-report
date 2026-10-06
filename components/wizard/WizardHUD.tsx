"use client";

import React, { useState, useEffect } from "react";
import { useAssessment } from "@/lib/store/useAssessment";
import { DecryptedText } from "@/components/react-bits";
import { sound } from "@/lib/audio/soundEffects";
import {
  RotateCcw,
  Check,
  Sparkles,
  Volume2,
  VolumeX,
  Layers,
  Activity,
  SlidersHorizontal,
} from "lucide-react";

const STAGE_TITLES: Record<number, string> = {
  1: "Body & Baseline Fitness",
  2: "Push-Up Kinematics & Depth",
  3: "Pull-Up Mechanics & Dead-Hang",
  4: "Squat Mechanics & Mobility",
  5: "Running & Impact Kinetics",
  6: "Nutrition & Protein Intake",
  7: "Sleep & Recovery Architecture",
  8: "Schedule & Time Logistics",
  9: "Equipment & Environment",
  10: "Target Skills & Priorities",
  11: "Diagnostic & 6-Week Protocol",
};

export interface WizardHUDProps {
  onToggleViewMode?: () => void;
  isScrollView?: boolean;
}

export const WizardHUD: React.FC<WizardHUDProps> = ({
  onToggleViewMode,
  isScrollView = false,
}) => {
  const { currentStage, goToStage, clearData, data } = useAssessment();
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    setIsMuted(sound.getMuted());
  }, []);

  const progressPercent = Math.round((currentStage / 11) * 100);

  const handleStageClick = (stage: number) => {
    sound.playClick();
    goToStage(stage);
  };

  const handleToggleSound = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  const handleConfirmReset = () => {
    sound.playClick();
    clearData();
    setShowConfirmReset(false);
  };

  // Quick baseline count
  const hasBaselines = Boolean(data.s1_pushups || data.s1_pullups || data.s1_squats);

  return (
    <>
      <div className="sticky top-4 z-40 mb-6 w-full max-w-4xl rounded-2xl border border-white/[0.08] bg-[#0c0e14]/85 p-4 backdrop-blur-xl shadow-2xl transition-all">
        {/* Top row: Stage Name and Diagnostic Engine Telemetry */}
        <div className="flex items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/20 font-mono text-xs font-bold text-cyan-400">
              {currentStage < 10 ? `0${currentStage}` : currentStage}
            </span>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                  STAGE {currentStage} OF 11
                </span>
                {hasBaselines && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.2 font-mono text-[9px] font-semibold text-cyan-300">
                    <Activity className="h-2.5 w-2.5 text-cyan-400 animate-pulse" />
                    LIVE TELEMETRY
                  </span>
                )}
              </div>
              <h2 className="text-sm font-bold text-zinc-100 tracking-tight">
                <DecryptedText
                  key={currentStage}
                  text={STAGE_TITLES[currentStage] || "Athletic Diagnostic"}
                  speed={20}
                  maxIterations={7}
                />
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Switcher */}
            {onToggleViewMode && (
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  onToggleViewMode();
                }}
                className="flex items-center gap-1.5 rounded-xl border border-white/[0.08] bg-black/40 px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:border-cyan-500/40 hover:text-cyan-300 transition-all"
                title="Switch between Guided Wizard and Continuous Telemetry Scroll"
              >
                <Layers className="h-3.5 w-3.5 text-cyan-400" />
                <span className="hidden sm:inline font-mono text-[11px]">
                  {isScrollView ? "Wizard Mode" : "Scroll Stream"}
                </span>
              </button>
            )}

            {/* Sound Mute/Unmute */}
            <button
              type="button"
              onClick={handleToggleSound}
              title={isMuted ? "Unmute Procedural Audio" : "Mute Procedural Audio"}
              className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/[0.08] bg-black/40 text-zinc-400 transition-colors hover:border-white/[0.2] hover:text-white"
            >
              {isMuted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5 text-cyan-400" />}
            </button>

            {/* Assessment Reset */}
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setShowConfirmReset(true);
              }}
              title="Reset Assessment & Clear Storage"
              className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/[0.08] bg-black/40 text-zinc-400 transition-colors hover:border-rose-500/50 hover:bg-rose-950/20 hover:text-rose-400"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>

            {/* Progress Percentage */}
            <span className="ml-1 font-mono text-xs font-bold text-cyan-400 tabular-nums">
              {progressPercent}%
            </span>
          </div>
        </div>

        {/* Dynamic Glowing Progress Bar */}
        <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-sky-400 to-emerald-400 transition-all duration-300 ease-out shadow-[0_0_12px_rgba(6,182,212,0.6)]"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* 11 Stage Interactive Quick-Jump Pills */}
        <div className="mt-3 flex items-center justify-between gap-1 overflow-x-auto py-1">
          {Array.from({ length: 11 }, (_, i) => i + 1).map((stageNum) => {
            const isActive = stageNum === currentStage;
            const isCompleted = stageNum < currentStage;

            return (
              <button
                key={stageNum}
                type="button"
                onClick={() => handleStageClick(stageNum)}
                className={`group relative flex h-7 min-w-[28px] items-center justify-center rounded-lg font-mono text-xs font-bold transition-all duration-150 ${
                  isActive
                    ? "border border-cyan-400 bg-cyan-500/20 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.3)] ring-1 ring-cyan-400/50"
                    : isCompleted
                    ? "border border-white/[0.1] bg-black/40 text-zinc-300 hover:border-cyan-500/40 hover:text-cyan-200"
                    : "border border-white/[0.04] bg-black/20 text-zinc-600 hover:border-white/[0.1] hover:text-zinc-400"
                }`}
                title={`Jump to Stage ${stageNum}: ${STAGE_TITLES[stageNum]}`}
              >
                {isCompleted ? (
                  <Check className="h-3 w-3 stroke-[3] text-emerald-400" />
                ) : (
                  <span>{stageNum}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Confirmation Dialog for Data Purge */}
      {showConfirmReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-sm rounded-2xl border border-white/[0.12] bg-[#0c0e14] p-6 shadow-2xl">
            <h3 className="text-base font-bold text-zinc-100 mb-2">
              Purge Assessment Draft?
            </h3>
            <p className="text-xs text-zinc-400 mb-5 leading-relaxed">
              This will completely wipe your local state and remove all cached data from <code className="text-cyan-400 font-mono">localStorage</code>. This action is irreversible.
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setShowConfirmReset(false);
                }}
                className="rounded-xl border border-white/[0.08] bg-zinc-900 px-4 py-2 text-xs font-semibold text-zinc-300 hover:bg-zinc-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReset}
                className="rounded-xl border border-rose-500/40 bg-rose-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-rose-950/50 hover:bg-rose-500"
              >
                Confirm Purge
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default WizardHUD;
