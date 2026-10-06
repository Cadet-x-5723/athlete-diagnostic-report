"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { useAssessment } from "@/lib/store/useAssessment";
import { DotField } from "@/components/react-bits";
import { sound } from "@/lib/audio/soundEffects";
import { WizardHUD } from "./WizardHUD";
import { BiomechanicalAvatar3D } from "@/components/3d/BiomechanicalAvatar3D";
import { TelemetryScrollView } from "@/components/telemetry/TelemetryScrollView";

// Stage Views
import { Stage1View } from "./stages/Stage1View";
import { Stage2View } from "./stages/Stage2View";
import { Stage3View } from "./stages/Stage3View";
import { Stage4View } from "./stages/Stage4View";
import { Stage5View } from "./stages/Stage5View";
import { Stage6View } from "./stages/Stage6View";
import { Stage7View } from "./stages/Stage7View";
import { Stage8View } from "./stages/Stage8View";
import { Stage9View } from "./stages/Stage9View";
import { Stage10View } from "./stages/Stage10View";
import { Stage11View } from "./stages/Stage11View";

import {
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Eye,
  SlidersHorizontal,
  Command,
} from "lucide-react";

const slideVariants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 40 : -40,
    opacity: 0,
    scale: 0.99,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.28,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -40 : 40,
    opacity: 0,
    scale: 0.99,
    transition: {
      duration: 0.18,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  }),
};

export const WizardShell: React.FC = () => {
  const { currentStage, direction, nextStage, prevStage, goToStage, errors } = useAssessment();
  const [isScrollView, setIsScrollView] = useState(false);
  const [showAvatarCompanion, setShowAvatarCompanion] = useState(true);

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept when user is typing in inputs or textareas
      const activeTag = document.activeElement?.tagName.toLowerCase();
      if (activeTag === "input" || activeTag === "textarea" || activeTag === "select") {
        return;
      }

      if (e.key === "ArrowRight" && currentStage < 11 && !isScrollView) {
        e.preventDefault();
        handleNext();
      } else if (e.key === "ArrowLeft" && currentStage > 1 && !isScrollView) {
        e.preventDefault();
        handlePrev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentStage, isScrollView]);

  const renderActiveStage = () => {
    switch (currentStage) {
      case 1:
        return <Stage1View />;
      case 2:
        return <Stage2View />;
      case 3:
        return <Stage3View />;
      case 4:
        return <Stage4View />;
      case 5:
        return <Stage5View />;
      case 6:
        return <Stage6View />;
      case 7:
        return <Stage7View />;
      case 8:
        return <Stage8View />;
      case 9:
        return <Stage9View />;
      case 10:
        return <Stage10View />;
      case 11:
        return <Stage11View />;
      default:
        return <Stage1View />;
    }
  };

  const handleNext = () => {
    const success = nextStage();
    if (!success) {
      sound.playBeep(320, 0.08, "sawtooth");
      window.scrollTo({ top: 80, behavior: "smooth" });
    } else {
      sound.playStageTransition();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrev = () => {
    sound.playClick();
    prevStage();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const errorCount = Object.keys(errors).length;

  // If in Continuous Scroll Stream mode, render TelemetryScrollView
  if (isScrollView) {
    return (
      <div className="relative min-h-screen w-full bg-[#07080a] text-zinc-100">
        <DotField className="fixed inset-0 pointer-events-none opacity-40" />
        <TelemetryScrollView onSwitchToWizard={() => setIsScrollView(false)} />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full bg-[#07080a] px-4 py-8 sm:px-6 flex flex-col items-center selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Background Interactive DotField */}
      <DotField className="fixed inset-0 pointer-events-none opacity-50" />

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-5xl flex flex-col items-center">
        {/* Floating Glass Telemetry HUD */}
        <WizardHUD
          onToggleViewMode={() => setIsScrollView(true)}
          isScrollView={false}
        />

        {/* Validation Error Banner */}
        {errorCount > 0 && (
          <div className="mb-4 w-full max-w-4xl flex items-center gap-2.5 rounded-xl border border-rose-500/30 bg-rose-950/20 px-4 py-3 text-xs text-rose-300 backdrop-blur-md animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
            <span>
              Please review required questions ({errorCount} unresolved) before advancing to the next stage.
            </span>
          </div>
        )}

        {/* Dual-Pane Cockpit: Form on Left/Center + 3D Biomechanical Avatar Companion on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full max-w-5xl items-start">
          {/* Main Stage Card Shell */}
          <div
            className={`w-full transition-all duration-300 ${
              currentStage < 11 && showAvatarCompanion
                ? "lg:col-span-8"
                : "lg:col-span-12"
            }`}
          >
            <div className="relative w-full rounded-3xl border border-white/[0.08] bg-[#0c0e14]/90 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl overflow-hidden min-h-[540px]">
              <AnimatePresence custom={direction} mode="wait">
                <motion.div
                  key={currentStage}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="w-full"
                >
                  {renderActiveStage()}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Bottom Navigation Buttons */}
            <div className="mt-6 flex w-full items-center justify-between gap-4">
              {currentStage > 1 ? (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="flex items-center gap-2 rounded-2xl border border-white/[0.08] bg-zinc-900/80 px-6 py-3.5 text-sm font-semibold text-zinc-200 transition-all hover:border-white/[0.2] hover:bg-zinc-800 active:scale-[0.99]"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Back</span>
                </button>
              ) : (
                <div />
              )}

              {currentStage < 11 && (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex items-center gap-2 rounded-2xl border border-cyan-400/40 bg-gradient-to-r from-cyan-400 to-sky-500 px-7 py-3.5 text-sm font-bold text-zinc-950 shadow-lg shadow-cyan-950/40 transition-all hover:opacity-95 active:scale-[0.99]"
                >
                  <span>Next Stage</span>
                  <ChevronRight className="h-4 w-4 stroke-[3]" />
                </button>
              )}
            </div>
          </div>

          {/* Right Companion Pane (3D Biomechanical Avatar on Desktop for Stages 1-10) */}
          {currentStage < 11 && showAvatarCompanion && (
            <div className="hidden lg:flex lg:col-span-4 sticky top-28 flex-col gap-4">
              <div className="h-[460px] w-full">
                <BiomechanicalAvatar3D
                  className="h-full w-full"
                  focusStage={currentStage}
                />
              </div>

              {/* Companion Micro Legend */}
              <div className="rounded-2xl border border-white/[0.08] bg-[#0c0e14]/70 p-3.5 backdrop-blur-xl text-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[10px] uppercase font-bold text-zinc-400">
                    STAGE {currentStage} KINETIC CHAIN
                  </span>
                  <span className="font-mono text-[9px] text-cyan-400">
                    DRAG TO ORBIT 360°
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-snug">
                  Cyan nodes indicate active motor units for Stage {currentStage}. Flagged joint pain triggers cautionary crimson warning halos.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Keyboard navigation micro-pill footer */}
        <div className="mt-8 flex items-center gap-4 text-[11px] font-mono text-zinc-400 select-none">
          <span className="flex items-center gap-1.5">
            <kbd className="rounded border border-white/[0.08] bg-black/40 px-1.5 py-0.5 text-zinc-400">←</kbd>
            <kbd className="rounded border border-white/[0.08] bg-black/40 px-1.5 py-0.5 text-zinc-400">→</kbd>
            <span>Navigate</span>
          </span>
          <span>•</span>
          <span>100% Client-Side Air-Gapped Engine</span>
        </div>
      </div>
    </div>
  );
};

export default WizardShell;
