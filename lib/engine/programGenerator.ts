import { AssessmentData } from "../schemas/assessment";

export interface ExercisePrescription {
  name: string;
  sets: number;
  reps: string;
  rest: string;
  tempo: string;
  notes?: string;
}

export interface DayWorkoutPlan {
  dayName: string;
  dayNumber: number; // 1 (Mon) - 7 (Sun)
  focus: string;
  isRestDay: boolean;
  warmup: string[];
  exercises: ExercisePrescription[];
  cardioProtocol?: string;
  estimatedDurationMins: number;
}

export interface WeeklyBlock {
  weekNumber: number;
  phaseName: string;
  intensityPercent: number;
  volumeMultiplier: number;
  description: string;
  days: DayWorkoutPlan[];
}

export interface GeneratedTrainingProgram {
  programTitle: string;
  splitModel: string;
  weeklyFrequencyDays: number;
  baselineMaxes: {
    pushups: number;
    pullups: number;
    squats: number;
    dips: string;
  };
  workingReps: {
    pushups: number;
    pullups: number;
    squats: number;
  };
  weeks: WeeklyBlock[];
  activeRecoveryProtocol: string[];
}

/**
 * Deterministic 6-Week Periodization Engine
 * Synthesizes kinetic baselines, available equipment, schedule bandwidth,
 * and running fatigue into an optimized athletic calendar.
 */
export function generatePeriodizedProgram(
  data: Partial<AssessmentData>
): GeneratedTrainingProgram {
  const maxPush = Math.max(5, Number(data.s1_pushups) || 15);
  const maxPull = Math.max(0, Number(data.s1_pullups) || 0);
  const maxSquat = Math.max(10, Number(data.s1_squats) || 25);
  const hasDipBars =
    data.s1_dips &&
    !data.s1_dips.toLowerCase().includes("no") &&
    !data.s1_dips.toLowerCase().includes("none");

  // Equipment flags
  const eq = data.s9_equipment || [];
  const hasPullupBar = eq.some((item) => item.includes("Pull-up") || item.includes("Rings") || item.includes("Gym"));
  const hasBands = eq.some((item) => item.includes("Bands"));

  // Injury contraindication detection
  const painSet = new Set(data.s1_pain || []);
  const hasShoulderPain = painSet.has("Shoulders");
  const hasShinSplints = painSet.has("Shin Splints");
  const hasKneePain = painSet.has("Knees");
  const hasWristElbowPain = painSet.has("Wrists/Elbows");
  const hasLowerBackPain = painSet.has("Lower Back");

  // Running surfaces
  const runsOnConcrete = (data.s5_surface || []).some(
    (s) => s.includes("Asphalt") || s.includes("Concrete")
  );

  // Time budget scaling
  const timeBudget = data.s8_time_budget || "45-60 mins total";
  let pushDuration = 45;
  let pullDuration = 45;
  let legsDuration = 40;
  let cardioDuration = 35;
  let timeSetScale = 1.0;

  if (timeBudget.includes("30-40")) {
    pushDuration = 35;
    pullDuration = 35;
    legsDuration = 35;
    cardioDuration = 30;
    timeSetScale = 0.85;
  } else if (timeBudget.includes("45-60")) {
    pushDuration = 45;
    pullDuration = 45;
    legsDuration = 45;
    cardioDuration = 40;
    timeSetScale = 1.0;
  } else if (timeBudget.includes("60-75")) {
    pushDuration = 60;
    pullDuration = 60;
    legsDuration = 55;
    cardioDuration = 50;
    timeSetScale = 1.15;
  } else if (timeBudget.includes("90")) {
    pushDuration = 75;
    pullDuration = 75;
    legsDuration = 70;
    cardioDuration = 60;
    timeSetScale = 1.25;
  }

  // Target working set reps at 70-75% single-set max
  const workingPushups = Math.max(4, Math.round(maxPush * 0.72));
  const workingPullups = maxPull > 0 ? Math.max(1, Math.round(maxPull * 0.70)) : 0;
  const workingSquats = Math.max(8, Math.round(maxSquat * 0.72));

  // Determine split frequency based on Stage 11 / Stage 2
  const freqPref = data.s11_sustainable_freq || "5 days/week";
  const frequencyDays = freqPref.startsWith("4") ? 4 : freqPref.startsWith("6") ? 6 : freqPref.startsWith("7") ? 7 : 5;

  const splitModel =
    frequencyDays === 4
      ? "Upper / Lower / Upper / Aerobic Power"
      : frequencyDays === 6
      ? "Push / Pull / Legs (Repeated 2x)"
      : frequencyDays === 7
      ? "Push / Pull / Legs / Hybrid Run / Active Mobility 7-Day Cycle"
      : "Push / Pull / Legs / Hybrid Run / Kinetic Recovery";

  // Build standard Day templates with dynamic injury adjustments
  const buildUpperPushDay = (weekMult: number): ExercisePrescription[] => {
    const pushupNotes = hasWristElbowPain
      ? "Perform on parallettes, push-up handles, or fists to eliminate wrist hyperextension"
      : "Chest 1 inch off floor, locked core hollow body";

    const dipExerciseName = hasShoulderPain
      ? "Diamond Push-ups (Hands Narrow, Neutral Angle)"
      : hasDipBars
      ? "Parallel Bar Dips"
      : "Diamond Push-ups";

    const dipNotes = hasShoulderPain
      ? "Shoulder contraindication active: Dips excluded to prevent subacromial impingement; elbows tucked 45°"
      : "Do not flare elbows wider than 45°";

    const hollowBodyNotes = hasLowerBackPain
      ? "Lower back glued to floor via posterior pelvic tilt; bend knees slightly if lumbar arches"
      : "Posterior pelvic tilt, lower back glued to floor";

    return [
      {
        name: "Dynamic Pike Push-ups (Shoulders/Triceps)",
        sets: Math.max(2, Math.round(3 * weekMult * timeSetScale)),
        reps: `${Math.max(4, Math.round(workingPushups * 0.6))} reps`,
        rest: "90s",
        tempo: "3-0-1-0",
        notes: hasShoulderPain
          ? "Keep neck neutral; limit range of motion to pain-free arc"
          : "Elevate feet on chair if seeking advanced shoulder load",
      },
      {
        name: "Standard Flat / Slight Deficit Push-ups",
        sets: Math.max(3, Math.round(4 * weekMult * timeSetScale)),
        reps: `${Math.round(workingPushups * weekMult)} reps`,
        rest: "60-90s",
        tempo: "2-1-1-0",
        notes: pushupNotes,
      },
      {
        name: dipExerciseName,
        sets: Math.max(2, Math.round(3 * timeSetScale)),
        reps: hasShoulderPain
          ? `${Math.max(4, Math.round(workingPushups * 0.5))} reps`
          : hasDipBars
          ? "6-10 reps"
          : `${Math.max(4, Math.round(workingPushups * 0.5))} reps`,
        rest: "90s",
        tempo: "2-0-1-0",
        notes: dipNotes,
      },
      {
        name: "Hollow Body Hold",
        sets: Math.max(2, Math.round(3 * timeSetScale)),
        reps: "35-45s",
        rest: "60s",
        tempo: "Static",
        notes: hollowBodyNotes,
      },
    ];
  };

  const buildUpperPullDay = (weekMult: number): ExercisePrescription[] => [
    {
      name: hasPullupBar && maxPull > 0 ? "Strict Dead-Hang Pull-ups" : "Inverted Horizontal Rows (Table/Bar)",
      sets: Math.max(3, Math.round(4 * weekMult * timeSetScale)),
      reps: hasPullupBar && maxPull > 0 ? `${Math.round(workingPullups * weekMult)} reps` : "8-12 reps",
      rest: "90-120s",
      tempo: "2-1-1-1",
      notes: "Pause 1s with chest touching bar / table",
    },
    {
      name: hasPullupBar ? "Scapular Pull-up Depressions" : "Doorframe Rows / Towel Rows",
      sets: Math.max(2, Math.round(3 * timeSetScale)),
      reps: "10-12 reps",
      rest: "60s",
      tempo: "2-2-1-1",
      notes: "Isolate lower traps and rhomboids without bending elbows",
    },
    {
      name: hasBands ? "Band Face Pulls" : "Prone Floor Y-T-W Raises",
      sets: Math.max(2, Math.round(3 * timeSetScale)),
      reps: "15 reps",
      rest: "60s",
      tempo: "2-1-1-0",
      notes: "Corrective rotator cuff & posterior delt recruitment",
    },
  ];

  const buildLegsDay = (weekMult: number): ExercisePrescription[] => {
    const squatExerciseName = hasKneePain
      ? "Poliquin Step-Ups / Isometric Spanish Squat"
      : "Bulgarian Split Squats (Single Leg)";

    const squatNotes = hasKneePain
      ? "Knee contraindication active: Smooth 3s eccentric descent, zero knee valgus, focus on vastus medialis"
      : "Eliminates bilateral asymmetries and builds knee stability";

    return [
      {
        name: squatExerciseName,
        sets: Math.max(2, Math.round(3 * timeSetScale)),
        reps: hasKneePain ? "10 reps / leg (controlled)" : "10-12 reps / leg",
        rest: "75s",
        tempo: "3-1-1-0",
        notes: squatNotes,
      },
      {
        name: "Tempo Bodyweight Squats",
        sets: Math.max(3, Math.round(4 * weekMult * timeSetScale)),
        reps: `${Math.round(workingSquats * weekMult)} reps`,
        rest: "90s",
        tempo: "3-0-1-0",
        notes: hasKneePain
          ? "Descend only to parallel; stop before patellar pinch point"
          : "Hip crease fully below knee crease",
      },
      {
        name: "Single-Leg Hip Thrusts (Glute / Hamstring)",
        sets: Math.max(2, Math.round(3 * timeSetScale)),
        reps: "12 reps / leg",
        rest: "60s",
        tempo: "2-1-1-1",
        notes: "Drive through heels, squeeze glute at peak contraction",
      },
      {
        name: "Tibialis Anterior Wall Raises",
        sets: 3,
        reps: hasShinSplints ? "30 reps" : "25 reps",
        rest: "45s",
        tempo: "1-1-1-0",
        notes: hasShinSplints
          ? "Critical pre-hab: High-volume dorsiflexion raises to relieve MTSS periosteal strain"
          : "Essential pre-hab for shin splints and running impact",
      },
    ];
  };

  // Dynamic cardio protocols based on shin splints & surfaces
  const getTuesdayCardio = (): string => {
    if (hasShinSplints) {
      return runsOnConcrete
        ? "MTSS Alert: Switch from road to grass/dirt track or treadmill. 20 min easy Zone 2 + 3x25 tibialis raises"
        : "Zone 2 Low-Impact: 20-25 min conversational pace on grass/dirt surface";
    }
    return "Zone 2 Steady State: 3.5 km run at easy conversational pace";
  };

  const getThursdayCardio = (): string => {
    if (hasShinSplints) {
      return "Low-Impact Aerobic Base: 25-30 min brisk incline campus walk or gentle grass stride intervals";
    }
    return "3.5 km Tempo Run: 1 km easy warmup, 2 km brisk tempo, 500m cool-down";
  };

  const getSaturdayCardio = (isTestWeek: boolean): string => {
    if (hasShinSplints) {
      return "Shin Splints Recovery: Low-impact grass aerobic flush (30 min) + foot arch & tibialis mobility flow";
    }
    return isTestWeek
      ? "Benchmark 3.5 km Time Trial: Run for your personal best record!"
      : "Aerobic Capacity: 3.5 km run + 4 x 60m hill or flat sprints with 90s recovery";
  };

  // 6 Progressive Weeks definitions
  const weekDefinitions = [
    {
      weekNumber: 1,
      phaseName: "Structural Foundation & Mechanical Calibration",
      intensityPercent: 70,
      volumeMultiplier: 1.0,
      description: "Establishing strict neurological patterns, joint prep, and consistent rest intervals.",
    },
    {
      weekNumber: 2,
      phaseName: "Volume Accumulation Phase",
      intensityPercent: 72,
      volumeMultiplier: 1.08,
      description: "Incrementing working set density by +1 rep per set while locking in eccentric tempo.",
    },
    {
      weekNumber: 3,
      phaseName: "Aerobic Threshold & Density Loading",
      intensityPercent: 75,
      volumeMultiplier: 1.15,
      description: "Compressing rest periods by 15s and integrating tempo running to enhance lactate clearance.",
    },
    {
      weekNumber: 4,
      phaseName: "Functional Overload & Peak Volume",
      intensityPercent: 78,
      volumeMultiplier: 1.22,
      description: "Highest weekly set volume of the block. Demands rigorous sleep and protein replenishment.",
    },
    {
      weekNumber: 5,
      phaseName: "Intensity Peaking & Power Output",
      intensityPercent: 82,
      volumeMultiplier: 1.1,
      description: "Explosive concentric intent with maximum pause holds. Prepares central nervous system for testing.",
    },
    {
      weekNumber: 6,
      phaseName: "Active Deload & Retest Benchmark",
      intensityPercent: 65,
      volumeMultiplier: 0.7,
      description: "Deliberate 40% reduction in volume to trigger supercompensation, ending with max unbroken re-tests.",
    },
  ];

  const weeks: WeeklyBlock[] = weekDefinitions.map((w) => {
    const days: DayWorkoutPlan[] = [
      {
        dayName: "Monday",
        dayNumber: 1,
        focus: "Upper Push Hypertrophy & Scapular Control",
        isRestDay: false,
        warmup: [
          "Wrist rotations: 60s",
          "Shoulder dislocates with towel/band: 15 reps",
          "Scapular push-ups: 2 x 10",
        ],
        exercises: buildUpperPushDay(w.volumeMultiplier),
        cardioProtocol: "Optional 10 min light cool-down walk",
        estimatedDurationMins: pushDuration,
      },
      {
        dayName: "Tuesday",
        dayNumber: 2,
        focus: "Upper Pulling & Kinetic Chain Posture",
        isRestDay: false,
        warmup: [
          "Arm circles: 30s each way",
          "Dead hang decompression: 2 x 30s",
          "Band pull-aparts: 20 reps",
        ],
        exercises: buildUpperPullDay(w.volumeMultiplier),
        cardioProtocol: getTuesdayCardio(),
        estimatedDurationMins: pullDuration,
      },
      {
        dayName: "Wednesday",
        dayNumber: 3,
        focus: frequencyDays >= 5 ? "Unilateral Lower Body & Core" : "Active Kinetic Recovery",
        isRestDay: frequencyDays < 5,
        warmup: ["Deep squat hold: 2 mins", "Ankle dorsiflexion rocks: 15 / side", "Glute bridges: 20 reps"],
        exercises: frequencyDays >= 5 ? buildLegsDay(w.volumeMultiplier) : [],
        cardioProtocol:
          frequencyDays < 5
            ? "45 min brisk campus walk + 10 min hamstring/quad stretching"
            : undefined,
        estimatedDurationMins: frequencyDays >= 5 ? legsDuration : 30,
      },
      {
        dayName: "Thursday",
        dayNumber: 4,
        focus: "Upper Body Balance & Core Flexion",
        isRestDay: false,
        warmup: ["Cat-Cow spinal mobility: 10 reps", "Plank-to-downward dog: 10 reps"],
        exercises: buildUpperPushDay(w.volumeMultiplier * 0.9),
        cardioProtocol: getThursdayCardio(),
        estimatedDurationMins: pushDuration,
      },
      {
        dayName: "Friday",
        dayNumber: 5,
        focus: "Posterior Chain, Squat Endurance & Pre-hab",
        isRestDay: false,
        warmup: ["Leg swings forward/back: 15 / leg", "Couch stretch: 90s / side"],
        exercises: buildLegsDay(w.volumeMultiplier),
        estimatedDurationMins: legsDuration,
      },
      {
        dayName: "Saturday",
        dayNumber: 6,
        focus: frequencyDays >= 6 ? "Calisthenics Skill & Conditioning" : "Active Kinetic Recovery & Strides",
        isRestDay: frequencyDays < 6,
        warmup: frequencyDays >= 6 ? ["Dynamic leg swings", "High knees & butt kicks: 30s each"] : [],
        exercises: [],
        cardioProtocol: frequencyDays >= 6 ? getSaturdayCardio(w.weekNumber === 6) : "Active walking, hydration & full foam rolling",
        estimatedDurationMins: frequencyDays >= 6 ? cardioDuration : 20,
      },
      {
        dayName: "Sunday",
        dayNumber: 7,
        focus: frequencyDays === 7 ? "Active Mobility & Kinetic Tissue Repair" : "Complete Nervous System Reset & Tissue Repair",
        isRestDay: frequencyDays < 7,
        warmup: [],
        exercises: [],
        cardioProtocol:
          frequencyDays === 7
            ? "30 min gentle campus walk + 20 min full body stretching flow"
            : "Zero running. Hydrate with 3.5L water, 8+ hours sleep, full body foam rolling.",
        estimatedDurationMins: frequencyDays === 7 ? 30 : 0,
      },
    ];

    return {
      weekNumber: w.weekNumber,
      phaseName: w.phaseName,
      intensityPercent: w.intensityPercent,
      volumeMultiplier: w.volumeMultiplier,
      description: w.description,
      days,
    };
  });

  return {
    programTitle: "6-Week Athletic Calisthenics & Hybrid Conditioning Protocol",
    splitModel,
    weeklyFrequencyDays: frequencyDays,
    baselineMaxes: {
      pushups: maxPush,
      pullups: maxPull,
      squats: maxSquat,
      dips: data.s1_dips || "N/A",
    },
    workingReps: {
      pushups: workingPushups,
      pullups: workingPullups,
      squats: workingSquats,
    },
    weeks,
    activeRecoveryProtocol: [
      "10-15 minute daily mobility flow (Couch stretch, 90/90 hip stretch, dead hangs)",
      "Hydration benchmark: minimum 3.0 to 3.5 Litres of water daily",
      "Prioritize 7.5 to 8.5 hours of uninterrupted sleep for peak testosterone and tissue synthesis",
    ],
  };
}
