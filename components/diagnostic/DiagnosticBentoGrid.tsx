"use client";

import React, { useState } from "react";
import { useAssessment } from "@/lib/store/useAssessment";
import { evaluateDiagnostic } from "@/lib/engine/analytics";
import { generatePeriodizedProgram } from "@/lib/engine/programGenerator";
import { generateDiagnosticMarkdown } from "@/lib/export/markdown";
import { generateTrainingProgramICS, downloadICalendarFile } from "@/lib/export/ical";
import { sound } from "@/lib/audio/soundEffects";

import { PushPullGaugeCard } from "./PushPullGaugeCard";
import { WorkCapacityCard } from "./WorkCapacityCard";
import { InjuryMatrixCard } from "./InjuryMatrixCard";
import { PeriodizedProgramCard } from "./PeriodizedProgramCard";
import { BiomechanicalRadarChart } from "./BiomechanicalRadarChart";
import { BiomechanicalAvatar3D } from "@/components/3d/BiomechanicalAvatar3D";

import {
  Copy,
  Check,
  Download,
  Printer,
  Trash2,
  FileText,
  Activity,
  Calendar,
  Layers,
  Sparkles,
} from "lucide-react";

export const DiagnosticBentoGrid: React.FC = () => {
  const { data, resetForm, clearData } = useAssessment();
  const [copied, setCopied] = useState(false);
  const [showMarkdownModal, setShowMarkdownModal] = useState(false);
  const [showPurgeModal, setShowPurgeModal] = useState(false);

  // Pure deterministic sports science calculations
  const diagnostic = evaluateDiagnostic({
    pushups: data.s1_pushups,
    pullups: data.s1_pullups,
    squats: data.s1_squats,
    plank: data.s1_plank,
    runTime: data.s1_run_time,
    pain: data.s1_pain,
    squatMob: data.s4_squat_mob,
    shoulderMob: data.s4_shoulder_mob,
    asymmetry: data.s4_asymmetry,
    eccentric: data.s4_eccentric,
    surface: data.s5_surface,
  });

  const program = generatePeriodizedProgram(data);
  const rawMarkdown = generateDiagnosticMarkdown(data);

  const handleCopyMarkdown = () => {
    sound.playSelect();
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      navigator.clipboard
        .writeText(rawMarkdown)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2500);
        })
        .catch(() => {
          setShowMarkdownModal(true);
        });
    } else {
      setShowMarkdownModal(true);
    }
  };

  const handleDownloadICS = () => {
    sound.playSelect();
    const icsContent = generateTrainingProgramICS(program);
    downloadICalendarFile(icsContent, "athletic_diagnostic_6wk_calendar.ics");
  };

  const handlePrint = () => {
    sound.playClick();
    window.print();
  };

  return (
    <div className="space-y-6 print:m-0 print:p-0">
      {/* Bento Grid Header */}
      <div className="border-b border-white/[0.08] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-cyan-400" />
            <h3 className="text-xl font-extrabold text-white tracking-tight">
              Athletic Diagnostic & Periodized Strategy
            </h3>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Zero-AI, 100% deterministic biomechanics & sports science evaluated locally in-browser.
          </p>
        </div>

        {/* Global Export Bar */}
        <div className="flex items-center flex-wrap gap-2.5">
          <button
            type="button"
            onClick={handleCopyMarkdown}
            className="flex items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-3.5 py-2 text-xs font-bold text-emerald-300 transition-all hover:border-emerald-500 hover:bg-emerald-500/20 active:scale-95"
            title="Copy exact markdown report matching abs.html"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                <span>Copied Profile!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copy Raw Profile</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleDownloadICS}
            className="flex items-center gap-1.5 rounded-xl border border-cyan-400/40 bg-cyan-500/10 px-3.5 py-2 text-xs font-bold text-cyan-300 transition-all hover:border-cyan-400 hover:bg-cyan-500/20 active:scale-95"
            title="Download full 6-week progressive calendar as .ICS"
          >
            <Calendar className="h-3.5 w-3.5" />
            <span>.ICS Calendar</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-1.5 rounded-xl border border-white/[0.08] bg-zinc-900/80 px-3 py-2 text-xs font-semibold text-zinc-300 transition-all hover:border-white/[0.2] hover:text-white active:scale-95"
            title="Print or save as PDF"
          >
            <Printer className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Print</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setShowMarkdownModal(true);
            }}
            className="flex items-center gap-1.5 rounded-xl border border-white/[0.08] bg-zinc-900/80 px-3 py-2 text-xs font-semibold text-zinc-300 transition-all hover:border-white/[0.2] hover:text-white active:scale-95"
            title="View Raw Markdown"
          >
            <FileText className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">View Raw</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setShowPurgeModal(true);
            }}
            className="flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-950/20 px-3 py-2 text-xs font-semibold text-rose-400 transition-all hover:border-rose-500/60 hover:bg-rose-950/40 active:scale-95"
            title="Wipe state & delete localStorage draft"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Purge</span>
          </button>
        </div>
      </div>

      {/* Row 1: 3D Anatomical Inspection & Biomechanical Radar Hexagon */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="h-[360px] w-full">
          <BiomechanicalAvatar3D className="h-full w-full" focusStage={11} />
        </div>
        <div className="w-full">
          <BiomechanicalRadarChart />
        </div>
      </div>

      {/* Row 2: 3-Metric Diagnostic Bento Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <PushPullGaugeCard analysis={diagnostic.pushPull} />
        <WorkCapacityCard capacity={diagnostic.workCapacity} />
        <InjuryMatrixCard flags={diagnostic.injuryFlags} />
      </div>

      {/* Row 3: 6-Week Periodization Engine */}
      <div className="w-full">
        <PeriodizedProgramCard program={program} />
      </div>

      {/* Raw Markdown Modal */}
      {showMarkdownModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-2xl rounded-2xl border border-white/[0.12] bg-[#0c0e14] p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                <FileText className="h-4 w-4 text-cyan-400" />
                Raw Diagnostic Markdown Output (abs.html Compatible)
              </h3>
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setShowMarkdownModal(false);
                }}
                className="text-xs text-zinc-400 hover:text-zinc-200"
              >
                Close
              </button>
            </div>
            <textarea
              readOnly
              rows={14}
              value={rawMarkdown}
              className="w-full rounded-xl border border-white/[0.08] bg-black/70 p-4 font-mono text-xs text-zinc-300 leading-relaxed outline-none"
            />
            <div className="mt-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={handleCopyMarkdown}
                className="rounded-xl border border-emerald-500/40 bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-emerald-950/40 hover:bg-emerald-500"
              >
                {copied ? "Copied!" : "Copy Markdown"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Purge Modal */}
      {showPurgeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-sm rounded-2xl border border-white/[0.12] bg-[#0c0e14] p-6 shadow-2xl">
            <h3 className="text-base font-bold text-zinc-100 mb-2">
              Confirm Complete Data Purge
            </h3>
            <p className="text-xs text-zinc-400 mb-5 leading-relaxed">
              This action executes <code>localStorage.removeItem(&apos;athlete_diagnostic_draft&apos;)</code> and resets all reactive store memory. Confirm?
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setShowPurgeModal(false);
                }}
                className="rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-xs font-semibold text-zinc-300 hover:bg-zinc-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  clearData();
                  setShowPurgeModal(false);
                }}
                className="rounded-lg border border-rose-500/40 bg-rose-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-rose-950/50 hover:bg-rose-500"
              >
                Purge All Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiagnosticBentoGrid;
