/**
 * Biomechanical Analysis Engine
 * Deterministic, pure sports science algorithms for kinetic profiling,
 * structural balance assessment, and injury mitigation.
 */

// =========================================================================
// 1. PUSH-TO-PULL STRUCTURAL BALANCE EVALUATION
// =========================================================================

export interface PushPullAnalysis {
  pushups: number;
  pullups: number;
  ratio: number;
  ratioFormatted: string;
  classification:
    | "Balanced (Optimal Kinetic Health)"
    | "Mild Anterior Dominance"
    | "Severe Anterior Dominance (High Impingement Risk)"
    | "Posterior Dominant (Push Deficit)"
    | "Zero Pull Baseline (Critical Pulling Deficit)";
  status: "optimal" | "warning" | "danger";
  riskFactor: string;
  recommendation: string;
  targetPullupsToBalance: number;
}

/**
 * Evaluates the upper body muscular equilibrium between horizontal pressing
 * (Pectoralis major, Anterior Deltoid, Triceps) and vertical pulling
 * (Latissimus dorsi, Rhomboids, Lower Trapezius, Biceps).
 *
 * Biomechanical context: Standard strict push-ups involve ~64% of bodyweight,
 * whereas dead-hang pull-ups involve ~95-100% of bodyweight. An ideal bodyweight
 * rep ratio ranges from 1.5:1 to 2.5:1.
 */
export function calculatePushPullRatio(
  pushups: number,
  pullups: number
): PushPullAnalysis {
  const p = Math.max(0, Number(pushups) || 0);
  const pu = Math.max(0, Number(pullups) || 0);

  if (pu === 0) {
    return {
      pushups: p,
      pullups: pu,
      ratio: p > 0 ? 10 : 0,
      ratioFormatted: p > 0 ? "Critical Deficit (0 Pull-ups)" : "0:0 (Untested)",
      classification: "Zero Pull Baseline (Critical Pulling Deficit)",
      status: "danger",
      riskFactor:
        "High risk of protracted scapulae, internal rotation, and glenohumeral anterior glide syndrome.",
      recommendation:
        "Immediately prioritize horizontal inverted rows, eccentric pull-up negatives (3x5s), and scapular pull-ups before advancing push volume.",
      targetPullupsToBalance: Math.max(3, Math.round(p / 3)),
    };
  }

  const rawRatio = pu > 0 ? p / pu : 0;
  const clampedRawRatio = Number.isFinite(rawRatio) ? Math.min(rawRatio, 10) : 10;
  const ratio = Math.round(clampedRawRatio * 100) / 100;
  const ratioFormatted = `${ratio.toFixed(1)}:1`;

  // Optimal range: 1.5:1 to 2.5:1
  if (ratio >= 1.4 && ratio <= 2.5) {
    return {
      pushups: p,
      pullups: pu,
      ratio,
      ratioFormatted,
      classification: "Balanced (Optimal Kinetic Health)",
      status: "optimal",
      riskFactor: "Minimal risk of scapular dyskinesis or posture imbalance.",
      recommendation:
        "Maintain current push/pull volume equilibrium (1:1 set volume). Progress both vectors concurrently.",
      targetPullupsToBalance: pu,
    };
  }

  if (ratio > 2.5 && ratio <= 3.5) {
    return {
      pushups: p,
      pullups: pu,
      ratio,
      ratioFormatted,
      classification: "Mild Anterior Dominance",
      status: "warning",
      riskFactor:
        "Anterior delt and pec minor tightness beginning to outpace mid-back retractor strength.",
      recommendation:
        "Add 1 extra horizontal pulling set per session (inverted rows/face pulls). Deliberately pause 1s at top of pull-ups.",
      targetPullupsToBalance: Math.ceil(p / 2.2),
    };
  }

  if (ratio > 3.5) {
    return {
      pushups: p,
      pullups: pu,
      ratio,
      ratioFormatted,
      classification: "Severe Anterior Dominance (High Impingement Risk)",
      status: "danger",
      riskFactor:
        "Severe muscular imbalance. High probability of shoulder impingement, anterior rotator cuff wear, and forward head posture.",
      recommendation:
        "Cap push-up volume temporarily at maintenance. Double your vertical and horizontal pulling volume (2:1 pull-to-push set ratio).",
      targetPullupsToBalance: Math.ceil(p / 2.0),
    };
  }

  // Under 1.4:1
  return {
    pushups: p,
    pullups: pu,
    ratio,
    ratioFormatted,
    classification: "Posterior Dominant (Push Deficit)",
    status: "optimal",
    riskFactor:
      "Very low injury risk. Pulling chain is exceptionally conditioned relative to pressing capacity.",
    recommendation:
      "Opportunity for rapid chest/triceps hypertrophy by incorporating progressive incline/deficit push-ups.",
    targetPullupsToBalance: pu,
  };
}

// =========================================================================
// 2. KINETIC WORK CAPACITY ENGINE
// =========================================================================

export interface WorkCapacityAnalysis {
  totalScore: number; // 0 - 100
  tier: "Elite Hybrid" | "Conditioned Athlete" | "Developing Base" | "Under-Conditioned";
  badgeColor: string;
  plankScore: number;    // max 25
  squatsScore: number;   // max 35
  runningScore: number;  // max 40
  parsedRunMinutes: number | null;
  physiologicalSummary: string;
}

/**
 * Parses user input for running time into decimal minutes.
 * Handles diverse formats: "18 min 45 sec", "18:45", "18.5", "20 mins", "approx 21", etc.
 */
export function parseRunningTimeToMinutes(input: string): number | null {
  if (!input) return null;
  const clean = input.trim().toLowerCase();

  // Pattern 1: mm:ss (e.g. "18:45", "18:30")
  const colonMatch = clean.match(/^(\d{1,2}):(\d{2})$/);
  if (colonMatch && colonMatch[1] && colonMatch[2]) {
    const mins = parseInt(colonMatch[1], 10);
    const secs = parseInt(colonMatch[2], 10);
    return mins + secs / 60;
  }

  // Pattern 2: "18 min 45 sec" or "18m 45s"
  const minSecMatch = clean.match(/(\d+)\s*(?:min|m)(?:\w*)\s*(?:and\s*)?(\d+)?\s*(?:sec|s)?/);
  if (minSecMatch && minSecMatch[1]) {
    const mins = parseInt(minSecMatch[1], 10);
    const secs = minSecMatch[2] ? parseInt(minSecMatch[2], 10) : 0;
    return mins + secs / 60;
  }

  // Pattern 3: Simple decimal or integer (e.g. "19", "18.5")
  const numMatch = clean.match(/(\d+(?:\.\d+)?)/);
  if (numMatch && numMatch[1]) {
    const val = parseFloat(numMatch[1]);
    if (val >= 8 && val <= 60) return val; // reasonable 3.5k minute range
  }

  return null;
}

/**
 * Computes an overall kinetic endurance score (0–100) based on core stiffness (plank),
 * lower-body lactate threshold (squats), and aerobic output (3.5km run pace).
 */
export function evaluateWorkCapacity(
  plank: string = "",
  squats: number = 0,
  runTime: string = ""
): WorkCapacityAnalysis {
  // 1. Core Stiffness (Plank): 25 Points Max
  let plankScore = 8;
  if (plank === "2+ minutes") plankScore = 25;
  else if (plank === "60-120s") plankScore = 20;
  else if (plank === "30-60s") plankScore = 14;
  else if (plank === "Under 30s") plankScore = 7;

  // 2. Lower Body Unbroken Volume (Squats): 35 Points Max
  const sq = Math.max(0, Number(squats) || 0);
  let squatsScore = 0;
  if (sq >= 60) squatsScore = 35;
  else if (sq >= 45) squatsScore = 30;
  else if (sq >= 30) squatsScore = 24;
  else if (sq >= 20) squatsScore = 18;
  else if (sq >= 10) squatsScore = 12;
  else squatsScore = Math.min(10, sq);

  // 3. Aerobic 3.5 km Running Capacity: 40 Points Max
  const runMinutes = parseRunningTimeToMinutes(runTime);
  let runningScore = 20; // Default median if unparsed

  if (runMinutes !== null) {
    if (runMinutes <= 14.5) runningScore = 40;       // < 4:08/km (Elite hybrid)
    else if (runMinutes <= 16.0) runningScore = 36;  // < 4:34/km (Very fast)
    else if (runMinutes <= 18.0) runningScore = 31;  // < 5:08/km (High athletic standard)
    else if (runMinutes <= 20.5) runningScore = 25;  // < 5:51/km (Decent aerobic engine)
    else if (runMinutes <= 24.0) runningScore = 18;  // < 6:51/km (Moderate pace)
    else if (runMinutes <= 28.0) runningScore = 12;  // < 8:00/km (Base aerobic building)
    else runningScore = 6;
  }

  const totalScore = Math.min(100, Math.max(0, plankScore + squatsScore + runningScore));

  let tier: WorkCapacityAnalysis["tier"] = "Under-Conditioned";
  let badgeColor = "text-rose-400 border-rose-500/30 bg-rose-950/20";
  let physiologicalSummary = "";

  if (totalScore >= 85) {
    tier = "Elite Hybrid";
    badgeColor = "text-emerald-400 border-emerald-500/30 bg-emerald-950/20";
    physiologicalSummary =
      "Exceptional dual-vector adaptation. Highly efficient oxidative phosphorylation paired with high muscle glycogen buffering capacity.";
  } else if (totalScore >= 68) {
    tier = "Conditioned Athlete";
    badgeColor = "text-sky-400 border-sky-500/30 bg-sky-950/20";
    physiologicalSummary =
      "Solid mitochondrial baseline with balanced muscular endurance. Responds well to progressive overload and tempo running.";
  } else if (totalScore >= 48) {
    tier = "Developing Base";
    badgeColor = "text-amber-400 border-amber-500/30 bg-amber-950/20";
    physiologicalSummary =
      "Developing aerobic base and local muscular endurance. Needs systematic pacing to prevent excessive central nervous system fatigue.";
  } else {
    physiologicalSummary =
      "Aerobic and local endurance deficit. Prioritize Zone 2 base building and strict calisthenic form foundations.";
  }

  return {
    totalScore,
    tier,
    badgeColor,
    plankScore,
    squatsScore,
    runningScore,
    parsedRunMinutes: runMinutes,
    physiologicalSummary,
  };
}

// =========================================================================
// 3. KINETIC INJURY & MOBILITY RISK DETECTOR
// =========================================================================

export interface InjuryRiskFlag {
  id: string;
  area: string;
  severity: "critical" | "warning" | "advisory";
  title: string;
  contraindications: string[];
  correctiveProtocol: string[];
  biomechanicalInsight: string;
}

export interface MobilityInputs {
  squatMob?: string;
  shoulderMob?: string;
  asymmetry?: string;
  eccentric?: string;
  runningSurface?: string[];
  doms?: string;
}

/**
 * Evaluates self-reported recurring pain areas against movement mechanics,
 * surfaces, and asymmetries to generate proactive pre-hab prescriptions.
 */
export function detectInjuryFlags(
  painAreas: string[] = [],
  mobility: MobilityInputs = {}
): InjuryRiskFlag[] {
  const flags: InjuryRiskFlag[] = [];
  const pains = new Set(painAreas);

  // If user selected "None" or array is empty
  if (pains.has("None") || pains.size === 0) {
    // Check if mobility mechanics still suggest hidden risks
    if (mobility.shoulderMob === "Forward rolled shoulders" || mobility.shoulderMob === "Shoulder stiffness/clicking") {
      flags.push({
        id: "shoulder_mechanic_alert",
        area: "Shoulder Capsule",
        severity: "advisory",
        title: "Subacromial Impingement Susceptibility",
        contraindications: ["Aggressive deep dips past 90°", "Behind-the-neck pull-downs"],
        correctiveProtocol: [
          "Dead hangs: 3 x 30-45s passive decompressions daily",
          "Band pull-aparts / Face pulls: 3 x 20 reps",
          "Thoracic spine foam rolling / extension over bench",
        ],
        biomechanicalInsight:
          "Reported desk slouch or overhead stiffness indicates limited thoracic extension and tight pectoralis minor, limiting humeral clearance.",
      });
    }

    if (mobility.squatMob === "Heels come up" || mobility.squatMob === "Lower back rounds heavily") {
      flags.push({
        id: "ankle_hip_mobility_alert",
        area: "Talocrural & Lumbar Spine",
        severity: "advisory",
        title: "Restricted Ankle Dorsiflexion & Posterior Pelvic Tilt",
        contraindications: ["Weighted deep squats with flat shoes", "Rapid jump landings on toes"],
        correctiveProtocol: [
          "Calf & soleus wall stretches: 2 mins per side",
          "Slant board / elevated-heel bodyweight deep squats (ATG pause)",
          "Tibialis anterior raises: 3 x 20 reps against wall",
        ],
        biomechanicalInsight:
          "Heels lifting in deep knee flexion indicates talocrural joint restriction, forcing the lumbar spine to compensate into flexion (butt wink).",
      });
    }

    return flags;
  }

  // 1. Shin Splints
  if (pains.has("Shin Splints")) {
    const isAsphalt = mobility.runningSurface?.some((s) => s.includes("Asphalt") || s.includes("Concrete"));
    flags.push({
      id: "shin_splints",
      area: "Lower Extremity (Tibial Periosteum)",
      severity: isAsphalt ? "critical" : "warning",
      title: "Medial Tibial Stress Syndrome (MTSS)",
      contraindications: [
        "Daily hard-surface road sprinting",
        "High-volume plyometrics / burpees on concrete",
        "Overstriding with heavy heel strikes",
      ],
      correctiveProtocol: [
        "Immediate surface shift: Move 100% of running to grass, dirt, or treadmill for 14 days",
        "Tibialis Anterior Raises: 3 sets of 25 reps daily against a wall",
        "Straight-knee (Gastrocnemius) and Bent-knee (Soleus) eccentric heel drops: 3 x 15 reps",
        "Foot arch towel curls & barefoot mobility",
      ],
      biomechanicalInsight:
        "Ground reaction forces on hard asphalt overpower the eccentric shock-absorbing capacity of the anterior and posterior tibialis, producing periosteal micro-trauma.",
    });
  }

  // 2. Knee Joints / Patellar Tendon
  if (pains.has("Knees")) {
    flags.push({
      id: "patellar_tendon",
      area: "Knee / Patellofemoral Complex",
      severity: "warning",
      title: "Patellar Tendinopathy & Tracking Stress",
      contraindications: [
        "Rapid ballistic squats without warm-up",
        "Aggressive downhill running",
        "Letting knees collapse inward (valgus collapse)",
      ],
      correctiveProtocol: [
        "Spanish squats or isometric wall-sits (45° - 60° knee flexion): 5 x 45s holds",
        "Poliquin / Petersen step-ups with 2s eccentric control",
        "Foam rolling quadriceps & IT band lateral sweep",
      ],
      biomechanicalInsight:
        "Excessive shear forces at the patellar tendon insertion, frequently aggravated by tight quadriceps and weak hip abductors (gluteus medius).",
    });
  }

  // 3. Shoulders
  if (pains.has("Shoulders")) {
    flags.push({
      id: "rotator_cuff",
      area: "Glenohumeral Joint / Rotator Cuff",
      severity: "critical",
      title: "Anterior Shoulder Impingement & Rotator Cuff Strain",
      contraindications: [
        "Deep dips past 90 degrees",
        "Flaring elbows wide (90°) during push-ups",
        "Ballistic kipping pull-ups",
      ],
      correctiveProtocol: [
        "Tuck elbows to 45 degrees on all push-up variations",
        "Band external rotations (3 x 15 reps with towel tucked under elbow)",
        "Daily 60s passive dead hang to open subacromial space",
        "Prone Y-T-W raises on floor: 2 x 10 reps each",
      ],
      biomechanicalInsight:
        "Internal humeral rotation under load pinches the supraspinatus tendon beneath the acromion process.",
    });
  }

  // 4. Lower Back
  if (pains.has("Lower Back")) {
    flags.push({
      id: "lumbar_shear",
      area: "Lumbar Spine & Sacroiliac Joint",
      severity: "warning",
      title: "Lumbar Shear & Pelvic Tilt Instability",
      contraindications: [
        "Excessive spinal hyperextension during planks or push-ups",
        "Standing leg raises with arched lower back",
        "Running with an exaggerated anterior pelvic tilt",
      ],
      correctiveProtocol: [
        "McGill Big 3: Bird-Dogs, Side Planks, and Modified Curl-ups",
        "Posterior pelvic tilt cueing: Squeeze glutes and engage lower abdominals during all planks",
        "Kneeling hip flexor couch stretch: 2 mins per side to release psoas tension",
      ],
      biomechanicalInsight:
        "Weak transverse abdominis allows the pelvis to tilt anteriorly, increasing compressive shear load on L4-S1 vertebrae during running foot-strikes.",
    });
  }

  // 5. Wrists / Elbows
  if (pains.has("Wrists/Elbows")) {
    flags.push({
      id: "wrist_elbow_tendon",
      area: "Forearm Flexors / Medial & Lateral Epicondyle",
      severity: "warning",
      title: "Medial/Lateral Epicondylitis & Wrist Compression",
      contraindications: [
        "Excessive flat-palm push-ups on hard floors",
        "Heavy straight-bar pull-ups if wrists lack supination",
      ],
      correctiveProtocol: [
        "Perform push-ups on push-up handles, parallettes, or clean fists to maintain a neutral wrist joint",
        "Forearm flexor and extensor stretches: 3 x 30s holds before every session",
        "Switch to neutral-grip pull-ups or gymnastic rings if available",
      ],
      biomechanicalInsight:
        "90-degree wrist hyperextension under direct bodyweight compresses the carpal tunnel and strains common flexor tendons.",
    });
  }

  // 6. Ankles / Feet / Plantar Fascia
  if (pains.has("Ankles/Feet")) {
    flags.push({
      id: "plantar_fascia",
      area: "Plantar Fascia & Achilles Complex",
      severity: "warning",
      title: "Plantar Fasciopathy & Achilles Traction",
      contraindications: ["Running barefoot on hard tile/asphalt without progressive adaptation"],
      correctiveProtocol: [
        "Frozen water bottle or lacrosse ball foot-arch rolling: 3 mins per foot",
        "Toe yoga (lifting big toe independently of smaller toes)",
        "Calf raises with a pause at maximum stretch",
      ],
      biomechanicalInsight:
        "Excessive plantar aponeurosis tension caused by gastrocnemius stiffness and lack of intrinsic foot muscle activation.",
    });
  }

  return flags;
}

// =========================================================================
// 4. COMPREHENSIVE DIAGNOSTIC SUMMARY EVALUATOR
// =========================================================================

export interface ComprehensiveDiagnostic {
  pushPull: PushPullAnalysis;
  workCapacity: WorkCapacityAnalysis;
  injuryFlags: InjuryRiskFlag[];
  overallReadiness: "High Capacity" | "Moderate Adaptation" | "Correction Required";
}

export function evaluateDiagnostic(data: {
  pushups?: number;
  pullups?: number;
  squats?: number;
  plank?: string;
  runTime?: string;
  pain?: string[];
  squatMob?: string;
  shoulderMob?: string;
  asymmetry?: string;
  eccentric?: string;
  surface?: string[];
}): ComprehensiveDiagnostic {
  const pushPull = calculatePushPullRatio(data.pushups || 0, data.pullups || 0);
  const workCapacity = evaluateWorkCapacity(data.plank, data.squats, data.runTime);
  const injuryFlags = detectInjuryFlags(data.pain || [], {
    squatMob: data.squatMob,
    shoulderMob: data.shoulderMob,
    asymmetry: data.asymmetry,
    eccentric: data.eccentric,
    runningSurface: data.surface,
  });

  let overallReadiness: ComprehensiveDiagnostic["overallReadiness"] = "High Capacity";
  if (injuryFlags.some((f) => f.severity === "critical") || pushPull.status === "danger") {
    overallReadiness = "Correction Required";
  } else if (injuryFlags.length > 0 || workCapacity.totalScore < 60) {
    overallReadiness = "Moderate Adaptation";
  }

  return {
    pushPull,
    workCapacity,
    injuryFlags,
    overallReadiness,
  };
}
