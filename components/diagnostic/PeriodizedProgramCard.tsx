"use client";

import React, { useState } from "react";
import { GeneratedTrainingProgram } from "@/lib/engine/programGenerator";
import { generateTrainingProgramICS, downloadICalendarFile } from "@/lib/export/ical";
import { SpotlightCard } from "@/components/react-bits";
import { sound } from "@/lib/audio/soundEffects";
import { ExerciseDetailModal } from "./ExerciseDetailModal";
import {
  Calendar,
  Download,
  Dumbbell,
  Timer,
  Flame,
  CheckCircle,
  ExternalLink,
  ChevronRight,
  Sparkles,
} from "lucide-react";

export interface PeriodizedProgramCardProps {
  program: GeneratedTrainingProgram;
}

export const PeriodizedProgramCard: React.FC<PeriodizedProgramCardProps> = ({ program }) => {
  const [selectedWeek, setSelectedWeek] = useState<number>(1);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);

  const activeWeek = program.weeks.find((w) => w.weekNumber === selectedWeek) || program.weeks[0];

  const handleDownloadICS = () => {
    sound.playSelect();
    const icsContent = generateTrainingProgramICS(program);
    downloadICalendarFile(icsContent, "6_week_athletic_periodization.ics");
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  const handleWeekSelect = (weekNum: number) => {
    sound.playClick();
    setSelectedWeek(weekNum);
  };

  return (
    <SpotlightCard className="p-6">
      {/* Header and Download Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="h-4 w-4 text-cyan-400" />
            <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-100">
              Deterministic 6-Week Periodization
            </h4>
          </div>
          <p className="text-xs text-zinc-400">
            {program.splitModel} • {program.weeklyFrequencyDays} Active Days/Week
          </p>
        </div>

        {/* One-Click .ICS Calendar Export */}
        <button
          type="button"
          onClick={handleDownloadICS}
          className="flex items-center justify-center gap-2 rounded-xl border border-cyan-400/40 bg-cyan-500/10 px-4 py-2.5 text-xs font-bold text-cyan-300 shadow-sm transition-all hover:border-cyan-400 hover:bg-cyan-500/20 active:scale-95"
        >
          {downloadSuccess ? (
            <>
              <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
              <span>.ICS Downloaded!</span>
            </>
          ) : (
            <>
              <Download className="h-3.5 w-3.5" />
              <span>Export Full 6-Wk Calendar (.ICS)</span>
            </>
          )}
        </button>
      </div>

      {/* Baseline Working Reps Strip */}
      <div className="my-4 grid grid-cols-3 gap-3 rounded-xl border border-white/[0.06] bg-black/50 p-3">
        <div className="text-center">
          <span className="text-[10px] uppercase font-bold text-zinc-400 block">Working Push-ups (72%)</span>
          <span className="font-mono text-base font-bold text-cyan-400">
            {program.workingReps.pushups} <span className="text-xs text-zinc-500">reps / set</span>
          </span>
        </div>
        <div className="text-center">
          <span className="text-[10px] uppercase font-bold text-zinc-400 block">Working Pull-ups (70%)</span>
          <span className="font-mono text-base font-bold text-cyan-400">
            {program.workingReps.pullups > 0 ? `${program.workingReps.pullups} reps / set` : "Rows 8-12"}
          </span>
        </div>
        <div className="text-center">
          <span className="text-[10px] uppercase font-bold text-zinc-400 block">Working Squats (72%)</span>
          <span className="font-mono text-base font-bold text-cyan-400">
            {program.workingReps.squats} <span className="text-xs text-zinc-500">reps / set</span>
          </span>
        </div>
      </div>

      {/* Week Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-white/[0.08]">
        {program.weeks.map((week) => (
          <button
            key={week.weekNumber}
            type="button"
            onClick={() => handleWeekSelect(week.weekNumber)}
            className={`flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              selectedWeek === week.weekNumber
                ? "border border-cyan-400 bg-cyan-500/20 text-cyan-300 shadow-sm"
                : "border border-white/[0.06] bg-zinc-900/60 text-zinc-400 hover:border-white/[0.15] hover:text-zinc-200"
            }`}
          >
            <span>Week {week.weekNumber}</span>
            <span className="text-[10px] text-zinc-500">({week.intensityPercent}%)</span>
          </button>
        ))}
      </div>

      {/* Active Week Theme Banner */}
      <div className="mt-4 flex items-center justify-between rounded-xl border border-white/[0.08] bg-black/40 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <Flame className="h-4 w-4 text-amber-400" />
          <span className="font-mono text-xs font-bold text-white">
            {activeWeek.phaseName}
          </span>
        </div>
        <span className="font-mono text-xs text-cyan-400 font-bold">
          Target Intensity: {activeWeek.intensityPercent}%
        </span>
      </div>

      {/* Day by Day Cards */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
        {activeWeek.days.map((day, idx) => (
          <div
            key={idx}
            className={`rounded-xl border p-4 transition-all ${
              day.isRestDay
                ? "border-dashed border-white/[0.08] bg-black/20"
                : "border-white/[0.08] bg-black/50 hover:border-cyan-500/30"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-xs font-bold text-zinc-200">
                {day.dayName}
              </span>
              <span
                className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${
                  day.isRestDay
                    ? "bg-zinc-800 text-zinc-400"
                    : "bg-cyan-500/10 text-cyan-300 border border-cyan-500/20"
                }`}
              >
                {day.focus}
              </span>
            </div>

            {day.isRestDay ? (
              <p className="text-xs text-zinc-500 italic mt-2">
                Active recovery: 20-min gentle mobility, myofascial foam rolling, hydration.
              </p>
            ) : (
              <div className="space-y-2 mt-3">
                {day.exercises.map((ex, exIdx) => (
                  <div
                    key={exIdx}
                    onClick={() => {
                      sound.playClick();
                      setSelectedExercise(ex.name);
                    }}
                    className="group flex cursor-pointer items-center justify-between rounded-lg border border-white/[0.04] bg-white/[0.02] p-2 hover:border-cyan-400/30 hover:bg-cyan-950/20 transition-all"
                  >
                    <div className="flex items-center gap-2">
                      <Dumbbell className="h-3.5 w-3.5 text-zinc-500 group-hover:text-cyan-400 transition-colors" />
                      <span className="text-xs font-medium text-zinc-200 group-hover:text-cyan-200">
                        {ex.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-cyan-400 font-bold">
                        {ex.sets} × {ex.reps}
                      </span>
                      <ExternalLink className="h-3 w-3 text-zinc-600 group-hover:text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs text-zinc-500">
        <span>Click any exercise to inspect biomechanical cues & activate rest timer.</span>
        <span className="font-mono text-cyan-400/80">Prilepin Wave Progression</span>
      </div>

      {/* Exercise Cue Modal */}
      {selectedExercise && (
        <ExerciseDetailModal
          exerciseName={selectedExercise}
          onClose={() => setSelectedExercise(null)}
        />
      )}
    </SpotlightCard>
  );
};

export default PeriodizedProgramCard;
