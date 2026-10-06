"use client";

import React, { useState, useEffect } from "react";
import { sound } from "@/lib/audio/soundEffects";
import {
  X,
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  ShieldCheck,
  Zap,
  Target,
  ArrowRight,
} from "lucide-react";

export interface ExerciseDetailModalProps {
  exerciseName: string;
  onClose: () => void;
}

interface ExerciseLibraryItem {
  name: string;
  vector: string;
  targetMuscles: string[];
  cues: string[];
  tempo: string;
  restDefaultSec: number;
  progression: string;
  regression: string;
}

const EXERCISE_DATABASE: Record<string, ExerciseLibraryItem> = {
  "Push-ups": {
    name: "Push-ups (Strict Military Cadence)",
    vector: "Horizontal Press (Anterior Chain)",
    targetMuscles: ["Pectoralis Major", "Anterior Deltoid", "Triceps Brachii", "Serratus Anterior"],
    cues: [
      "Corkscrew hands into the floor to externalize torque in glenohumeral joints",
      "Lock pelvis in posterior tilt (hollow body), preventing lumbar hyper-extension",
      "Descend to full chest touch; lock out elbows at apex with scapular protraction",
    ],
    tempo: "3-0-1-0 (3s eccentric, explosive press)",
    restDefaultSec: 90,
    progression: "Decline Push-ups or Ring Push-ups",
    regression: "Incline Push-ups (Hands elevated on bench/box)",
  },
  "Pull-ups": {
    name: "Strict Dead-Hang Pull-ups",
    vector: "Vertical Pull (Posterior Kinetic Chain)",
    targetMuscles: ["Latissimus Dorsi", "Biceps Brachii", "Lower/Mid Trapezius", "Rhomboids"],
    cues: [
      "Initiate from a dead hang by depressing and retracting scapulae before elbow flexion",
      "Drive elbows downward into ribcage, pulling chest to bar rather than chin reaching",
      "Avoid kipping or cervical hyperextension; control 2-3s negative on every repetition",
    ],
    tempo: "2-1-1-1 (1s top scapular squeeze, 2s eccentric descent)",
    restDefaultSec: 120,
    progression: "Chest-to-Bar Pull-ups or Weighted Pull-ups",
    regression: "Horizontal Inverted Rows or Band-Assisted Pull-ups",
  },
  "Air Squats": {
    name: "Deep Calisthenic Bodyweight Squats",
    vector: "Bilateral Knee & Hip Extension",
    targetMuscles: ["Quadriceps Femoris", "Gluteus Maximus", "Adductor Magnus", "Soleus"],
    cues: [
      "Distribute weight tripod style across heel, 1st metatarsal, and 5th metatarsal",
      "Track patellae directly in line with 2nd/3rd toes, avoiding knee valgus collapse",
      "Break parallel depth with hips below knees while maintaining neutral spinal curve",
    ],
    tempo: "3-1-1-0 (3s controlled descent, 1s pause in the hole)",
    restDefaultSec: 75,
    progression: "Pistol Squats or Bulgarian Split Squats",
    regression: "Box Squats to bench height",
  },
  "Plank": {
    name: "RKC Hardstyle Isometric Plank",
    vector: "Anti-Extension Core Stabilization",
    targetMuscles: ["Rectus Abdominis", "Transverse Abdominis", "Gluteals", "External Obliques"],
    cues: [
      "Actively pull elbows towards toes and toes towards elbows creating intense irradiation",
      "Squeeze glutes maximally to lock pelvis into neutral posterior tilt",
      "Breathe rhythmically into diaphragm without collapsing thoracic spine",
    ],
    tempo: "Static Isometric Hold (Maximum muscular tension)",
    restDefaultSec: 60,
    progression: "Long-lever Plank or Ab Wheel Rollouts",
    regression: "Incline Forearm Plank",
  },
  "Inverted Rows": {
    name: "Horizontal Inverted Bodyweight Rows",
    vector: "Horizontal Pull (Scapular Retraction)",
    targetMuscles: ["Rhomboids", "Middle Trapezius", "Posterior Deltoids", "Brachialis"],
    cues: [
      "Maintain rigid plank posture from heels to shoulders throughout the movement",
      "Pull sternum to bar, fully retracting and pinching shoulder blades together",
      "Keep elbows at approximately 45 degrees relative to torso to protect rotator cuff",
    ],
    tempo: "2-1-1-0 (1s chest touch pause)",
    restDefaultSec: 90,
    progression: "Elevated Feet Rows or Single-Arm Rows",
    regression: "High-angle Incline Rows",
  },
};

export const ExerciseDetailModal: React.FC<ExerciseDetailModalProps> = ({
  exerciseName,
  onClose,
}) => {
  // Find matching exercise or fallback to dynamic profile
  const matchedKey = Object.keys(EXERCISE_DATABASE).find((key) =>
    exerciseName.toLowerCase().includes(key.toLowerCase())
  );

  const detail: ExerciseLibraryItem = matchedKey
    ? EXERCISE_DATABASE[matchedKey]
    : {
        name: exerciseName,
        vector: "Dynamic Functional Kinesiology",
        targetMuscles: ["Primary Agonist", "Stabilizers", "Kinetic Chain Transmitters"],
        cues: [
          "Maintain strict joint alignment across full range of motion",
          "Focus on time-under-tension and controlled eccentric tempo",
          "Breathe out through concentric effort; brace intra-abdominal pressure",
        ],
        tempo: "2-0-1-0 Standard Periodized Tempo",
        restDefaultSec: 90,
        progression: "Advance mechanical leverage or increase load density",
        regression: "Elevate leverage or reduce range of motion temporarily",
      };

  // Built-in Rest Interval Timer
  const [timerSeconds, setTimerSeconds] = useState(detail.restDefaultSec);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            sound.playBeep(880, 0.15, "triangle");
            setIsRunning(false);
            return 0;
          }
          if (prev <= 4) {
            sound.playBeep(440, 0.05, "sine");
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, timerSeconds]);

  const toggleTimer = () => {
    sound.playClick();
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    sound.playClick();
    setIsRunning(false);
    setTimerSeconds(detail.restDefaultSec);
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="relative w-full max-w-lg rounded-2xl border border-white/[0.12] bg-[#0c0e14] p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200 text-zinc-100 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="absolute right-4 top-4 rounded-xl border border-white/[0.08] bg-zinc-900/60 p-2 text-zinc-400 hover:border-white/[0.2] hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Modal Header */}
        <div className="mb-4 pr-8">
          <div className="flex items-center gap-2 mb-1">
            <span className="rounded bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 text-[10px] font-mono font-bold text-cyan-300 uppercase">
              {detail.vector}
            </span>
          </div>
          <h3 className="text-xl font-bold tracking-tight text-white">{detail.name}</h3>
        </div>

        {/* Rest Timer Capsule */}
        <div className="mb-5 flex items-center justify-between rounded-xl border border-cyan-500/30 bg-cyan-950/20 px-4 py-3">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 block">
              Set Rest Interval
            </span>
            <span className="font-mono text-2xl font-extrabold text-cyan-200">
              {formatTime(timerSeconds)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleTimer}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                isRunning
                  ? "border border-amber-500/50 bg-amber-500/20 text-amber-300"
                  : "border border-cyan-400/50 bg-cyan-500/20 text-cyan-300"
              }`}
            >
              {isRunning ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
              <span>{isRunning ? "Pause" : "Start Rest"}</span>
            </button>
            <button
              type="button"
              onClick={resetTimer}
              className="rounded-lg border border-white/[0.08] bg-black/40 p-1.5 text-zinc-400 hover:text-white"
              title="Reset Timer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Muscle Targets */}
        <div className="mb-4">
          <div className="flex items-center gap-1.5 mb-2">
            <Target className="h-3.5 w-3.5 text-emerald-400" />
            <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">
              Anatomical Muscle Recruitment
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {detail.targetMuscles.map((m, i) => (
              <span
                key={i}
                className="rounded-lg border border-emerald-500/20 bg-emerald-950/20 px-2.5 py-1 text-xs font-semibold text-emerald-300"
              >
                {m}
              </span>
            ))}
          </div>
        </div>

        {/* Biomechanical Cues */}
        <div className="mb-4">
          <div className="flex items-center gap-1.5 mb-2">
            <ShieldCheck className="h-3.5 w-3.5 text-sky-400" />
            <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">
              Strict Execution Checkpoints
            </span>
          </div>
          <ul className="space-y-2 text-xs text-zinc-300">
            {detail.cues.map((cue, idx) => (
              <li key={idx} className="flex items-start gap-2 rounded-lg border border-white/[0.04] bg-black/30 p-2">
                <CheckCircle className="h-3.5 w-3.5 shrink-0 text-cyan-400 mt-0.5" />
                <span>{cue}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Tempo & Progression Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs border-t border-white/[0.08] pt-4">
          <div className="rounded-xl border border-white/[0.06] bg-black/40 p-2.5">
            <span className="text-[10px] font-mono uppercase text-zinc-400 block mb-0.5">Execution Tempo</span>
            <span className="font-mono font-semibold text-zinc-200">{detail.tempo}</span>
          </div>
          <div className="rounded-xl border border-white/[0.06] bg-black/40 p-2.5">
            <span className="text-[10px] font-mono uppercase text-zinc-400 block mb-0.5">Regression</span>
            <span className="text-zinc-300">{detail.regression}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExerciseDetailModal;
