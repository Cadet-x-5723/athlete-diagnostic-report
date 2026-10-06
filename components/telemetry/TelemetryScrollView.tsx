"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAssessment } from "@/lib/store/useAssessment";
import { sound } from "@/lib/audio/soundEffects";
import { BiomechanicalAvatar3D } from "@/components/3d/BiomechanicalAvatar3D";
import { BiomechanicalRadarChart } from "@/components/diagnostic/BiomechanicalRadarChart";

// All 11 Stage Views
import { Stage1View } from "@/components/wizard/stages/Stage1View";
import { Stage2View } from "@/components/wizard/stages/Stage2View";
import { Stage3View } from "@/components/wizard/stages/Stage3View";
import { Stage4View } from "@/components/wizard/stages/Stage4View";
import { Stage5View } from "@/components/wizard/stages/Stage5View";
import { Stage6View } from "@/components/wizard/stages/Stage6View";
import { Stage7View } from "@/components/wizard/stages/Stage7View";
import { Stage8View } from "@/components/wizard/stages/Stage8View";
import { Stage9View } from "@/components/wizard/stages/Stage9View";
import { Stage10View } from "@/components/wizard/stages/Stage10View";
import { Stage11View } from "@/components/wizard/stages/Stage11View";

import {
  Compass,
  ChevronUp,
  Layers,
  Sparkles,
  Activity,
  CheckCircle,
  Eye,
  SlidersHorizontal,
} from "lucide-react";

const STAGE_META: { stage: number; title: string; subtitle: string; component: React.FC }[] = [
  { stage: 1, title: "Biometric Baselines & Acute Pain Screen", subtitle: "Rep maximums, isometric tolerances, pain mapping", component: Stage1View },
  { stage: 2, title: "Push-Up Kinematics & Vector Form", subtitle: "Cadence, chest depth, horizontal press leverage", component: Stage2View },
  { stage: 3, title: "Pull-Up Mechanics & Dead-Hang Tolerance", subtitle: "Scapular depression, vertical pulling capacity", component: Stage3View },
  { stage: 4, title: "Squat Mechanics & Joint Asymmetries", subtitle: "Dorsiflexion depth, pelvic shift, mobility audit", component: Stage4View },
  { stage: 5, title: "Running & Impact Kinetics", subtitle: "Weekly mileage, foot strike, surface contraindications", component: Stage5View },
  { stage: 6, title: "Nutrition, Hydration & Protein Density", subtitle: "Metabolic intake, amino acid threshold, fluid retention", component: Stage6View },
  { stage: 7, title: "Circadian Architecture & Sleep Recovery", subtitle: "REM duration, subjective fatigue, nervous system tone", component: Stage7View },
  { stage: 8, title: "Time Budget & Weekly Logistics", subtitle: "Session length caps, sustainable time slots", component: Stage8View },
  { stage: 9, title: "Equipment Pool & Physical Environment", subtitle: "Rings, dip bars, pull-up bar, resistance bands", component: Stage9View },
  { stage: 10, title: "Athletic Priorities & Calisthenic Skills", subtitle: "Hypertrophy, Front Lever, Muscle-Up, Planche goals", component: Stage10View },
  { stage: 11, title: "Biomechanical Diagnostic & 6-Week Periodization", subtitle: "Prilepin volume tables, equilibrium gauges, calendar export", component: Stage11View },
];

export const TelemetryScrollView: React.FC<{ onSwitchToWizard: () => void }> = ({
  onSwitchToWizard,
}) => {
  const { currentStage, goToStage } = useAssessment();
  const [activeScrollStage, setActiveScrollStage] = useState<number>(1);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const stageRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  // Scroll spy effect to update active stage and scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const totalDocHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = totalDocHeight > 0 ? Math.min(100, Math.max(0, (scrollY / totalDocHeight) * 100)) : 0;
      setScrollProgress(Math.round(progress));

      // Find which section is currently centered in viewport
      let closestStage = 1;
      let minDistance = Infinity;
      const viewportCenter = scrollY + window.innerHeight * 0.35;

      stageRefs.current.forEach((el, stageNum) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const elementTop = scrollY + rect.top;
        const dist = Math.abs(viewportCenter - elementTop);
        if (dist < minDistance) {
          minDistance = dist;
          closestStage = stageNum;
        }
      });

      setActiveScrollStage(closestStage);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToStage = (stageNum: number) => {
    sound.playClick();
    const el = stageRefs.current.get(stageNum);
    if (el) {
      const topOffset = el.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: topOffset, behavior: "smooth" });
    }
  };

  const scrollToTop = () => {
    sound.playClick();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Top Telemetry Stream Control Header */}
      <div className="sticky top-4 z-40 mb-8 w-full rounded-2xl border border-white/[0.08] bg-[#0c0e14]/80 p-4 backdrop-blur-xl shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <Layers className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-cyan-400">
                CONTINUOUS SCROLL TELEMETRY STREAM
              </span>
              <span className="rounded-full bg-cyan-500/20 px-2 py-0.2 font-mono text-[9px] font-bold text-cyan-300">
                ACTIVE: STAGE {activeScrollStage} / 11
              </span>
            </div>
            <h2 className="text-sm font-semibold text-zinc-100">
              {STAGE_META[activeScrollStage - 1]?.title}
            </h2>
          </div>
        </div>

        {/* View Switcher & Scroll Progress Pill */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-black/50 px-3 py-1.5 font-mono text-xs text-zinc-300">
            <span className="text-[10px] text-zinc-500 uppercase">DEPTH:</span>
            <span className="font-bold text-cyan-400">{scrollProgress}%</span>
          </div>

          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onSwitchToWizard();
            }}
            className="flex items-center gap-1.5 rounded-xl border border-cyan-400/30 bg-cyan-500/10 px-3.5 py-1.5 text-xs font-bold text-cyan-300 hover:bg-cyan-500/20 transition-all"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>Wizard HUD Mode</span>
          </button>
        </div>
      </div>

      {/* Main Cockpit Layout: 2 Columns on Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (Sticky Biomechanical 3D Telemetry HUD on Desktop) */}
        <div className="hidden lg:block lg:col-span-5 sticky top-28 space-y-5">
          {/* 3D Anatomical Kinetic Hologram */}
          <div className="h-[440px] w-full">
            <BiomechanicalAvatar3D
              focusStage={activeScrollStage}
              className="h-full w-full"
            />
          </div>

          {/* Live Biomechanical Radar Balance Card */}
          <BiomechanicalRadarChart />

          {/* Kinetic Stage Quick Jumper Dock */}
          <div className="rounded-2xl border border-white/[0.08] bg-[#0c0e14]/70 p-4 backdrop-blur-xl">
            <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-zinc-400 block mb-2">
              KINETIC STAGE INDEX // QUICK ANCHORS
            </span>
            <div className="grid grid-cols-6 gap-1.5">
              {STAGE_META.map((meta) => {
                const isActive = meta.stage === activeScrollStage;
                return (
                  <button
                    key={meta.stage}
                    type="button"
                    onClick={() => scrollToStage(meta.stage)}
                    className={`rounded-lg py-1.5 font-mono text-xs font-bold transition-all ${
                      isActive
                        ? "border border-cyan-400 bg-cyan-500/20 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.3)]"
                        : "border border-white/[0.06] bg-black/40 text-zinc-500 hover:text-zinc-200 hover:border-white/[0.15]"
                    }`}
                    title={meta.title}
                  >
                    {meta.stage < 10 ? `0${meta.stage}` : meta.stage}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Continuous Stream of all 11 Diagnostic Modules */}
        <div className="lg:col-span-7 space-y-10">
          {STAGE_META.map((meta) => {
            const Component = meta.component;
            const isCurrent = meta.stage === activeScrollStage;

            return (
              <div
                key={meta.stage}
                ref={(el) => {
                  if (el) stageRefs.current.set(meta.stage, el);
                }}
                className={`group relative rounded-3xl border transition-all duration-300 p-6 sm:p-8 backdrop-blur-xl shadow-2xl ${
                  isCurrent
                    ? "border-cyan-500/40 bg-[#0f121a]/95 shadow-[0_0_30px_rgba(6,182,212,0.06)]"
                    : "border-white/[0.08] bg-[#0c0e14]/85 hover:border-white/[0.14]"
                }`}
              >
                {/* Stage Header Strip */}
                <div className="flex items-center justify-between border-b border-white/[0.08] pb-4 mb-6">
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-xl font-mono text-xs font-extrabold transition-all ${
                        isCurrent
                          ? "border border-cyan-400 bg-cyan-500/20 text-cyan-300"
                          : "border border-white/[0.08] bg-zinc-900 text-zinc-400"
                      }`}
                    >
                      {meta.stage < 10 ? `0${meta.stage}` : meta.stage}
                    </span>
                    <div>
                      <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-cyan-400 block">
                        STAGE {meta.stage} OF 11
                      </span>
                      <h3 className="text-base font-bold text-white tracking-tight">
                        {meta.title}
                      </h3>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        {meta.subtitle}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actual Stage Inputs / Controls */}
                <Component />
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Scroll to Top Button */}
      <button
        type="button"
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 z-50 flex h-11 w-11 items-center justify-center rounded-2xl border border-white/[0.1] bg-black/80 text-zinc-300 shadow-2xl backdrop-blur-xl transition-all hover:border-cyan-400 hover:text-cyan-300 active:scale-95"
        title="Scroll to top of telemetry stream"
      >
        <ChevronUp className="h-5 w-5" />
      </button>
    </div>
  );
};

export default TelemetryScrollView;
