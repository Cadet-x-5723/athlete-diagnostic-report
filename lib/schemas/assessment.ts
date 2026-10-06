import { z } from "zod";

// ==========================================
// STAGE 1: Body & Baseline Fitness
// ==========================================
export const STAGE_1_PLANK_OPTIONS = [
  "Under 30s",
  "30-60s",
  "60-120s",
  "2+ minutes",
] as const;

export const STAGE_1_PHYSIQUE_OPTIONS = [
  "Lean/Slim",
  "Skinny-Fat",
  "Athletic",
  "Overweight",
] as const;

export const STAGE_1_PAIN_OPTIONS = [
  "None",
  "Shin Splints",
  "Knees",
  "Ankles/Feet",
  "Shoulders",
  "Wrists/Elbows",
  "Lower Back",
] as const;

export const STAGE_1_GOAL_OPTIONS = [
  "Upper Body Muscle",
  "Calisthenics Mastery",
  "Hybrid Athlete",
  "Body Recomp",
] as const;

export const stage1Schema = z.object({
  s1_age: z.coerce.number().min(12, "Age must be at least 12").max(100, "Please enter a valid age"),
  s1_sex: z.enum(["Male", "Female"], { message: "Biological sex is required" }),
  s1_height: z.string().min(1, "Height is required"),
  s1_weight: z.string().min(1, "Weight is required"),
  s1_waist: z.string().default(""),
  s1_pushups: z.coerce.number().min(0, "Push-ups cannot be negative"),
  s1_pullups: z.coerce.number().min(0, "Pull-ups cannot be negative"),
  s1_dips: z.string().min(1, "Dips capacity or 'No dip bars' is required"),
  s1_squats: z.coerce.number().min(0, "Squats cannot be negative"),
  s1_run_time: z.string().min(1, "Running time or baseline pace is required"),
  s1_plank: z.enum(STAGE_1_PLANK_OPTIONS, { message: "Plank duration is required" }),
  s1_physique: z.enum(STAGE_1_PHYSIQUE_OPTIONS, { message: "Physique selection is required" }),
  s1_pain: z.array(z.string()).min(1, "Select at least one option (choose 'None' if pain-free)"),
  s1_goal: z.array(z.string()).min(1, "Select at least one primary transformation goal"),
});

// ==========================================
// STAGE 2: Current Training Structure
// ==========================================
export const STAGE_2_FREQ_OPTIONS = [
  "7 days/week",
  "5-6 days/week",
  "3-4 days/week",
] as const;

export const STAGE_2_STRUCTURE_OPTIONS = [
  "Full Body Circuit",
  "Straight Sets",
  "Random/Intuitive",
] as const;

export const STAGE_2_REST_OPTIONS = [
  "Under 30s",
  "45-60s",
  "90-120s",
  "2-3 mins",
] as const;

export const STAGE_2_FAILURE_OPTIONS = [
  "0 RIR (Absolute Failure)",
  "1-2 RIR",
  "3+ RIR",
] as const;

export const STAGE_2_PUSHUP_VARS_OPTIONS = [
  "Standard Flat",
  "Wide Grip",
  "Diamond/Close",
  "Decline (feet elevated)",
  "Pike/Handstand",
  "Archer/Explosive",
] as const;

export const STAGE_2_TRACKING_OPTIONS = [
  "Yes, strictly tracked",
  "In my head",
  "No tracking",
] as const;

export const STAGE_2_PROGRESS_OPTIONS = [
  "Plateaued/Stalled",
  "Slowly increasing",
  "Decreasing / Overfatigued",
] as const;

export const stage2Schema = z.object({
  s2_freq: z.enum(STAGE_2_FREQ_OPTIONS, { message: "Frequency selection is required" }),
  s2_duration: z.string().min(1, "Average session duration is required"),
  s2_structure: z.enum(STAGE_2_STRUCTURE_OPTIONS, { message: "Routine structure is required" }),
  s2_rest: z.enum(STAGE_2_REST_OPTIONS, { message: "Rest interval is required" }),
  s2_failure: z.enum(STAGE_2_FAILURE_OPTIONS, { message: "Proximity to failure is required" }),
  s2_pushup_vars: z.array(z.string()).min(1, "Select at least one push-up variation currently performed"),
  s2_tracking: z.enum(STAGE_2_TRACKING_OPTIONS, { message: "Tracking method is required" }),
  s2_progress: z.enum(STAGE_2_PROGRESS_OPTIONS, { message: "Progression status is required" }),
});

// ==========================================
// STAGE 3: Strength & Movement Capacity
// ==========================================
export const STAGE_3_PULLUP_FORM_OPTIONS = [
  "Chest-to-bar strict",
  "Chin over bar with chin tucked",
  "Some kip/swing",
  "Cannot do pull-ups yet",
] as const;

export const STAGE_3_ROWS_OPTIONS = [
  "Regularly do 12+ clean rows",
  "Rarely do rows",
  "Never / No setup",
] as const;

export const STAGE_3_UNILATERAL_OPTIONS = [
  "Pistol Squats master",
  "Strong Bulgarians (15+ clean)",
  "Wobbly/Unstable",
] as const;

export const STAGE_3_POSTERIOR_OPTIONS = [
  "Single leg hip thrusts easy",
  "Only standard squats",
  "Hamstrings feel weak/tight",
] as const;

export const STAGE_3_CORE_OPTIONS = [
  "Toes to bar clean",
  "Hanging knee raises",
  "Floor sit-ups only",
] as const;

export const stage3Schema = z.object({
  s3_pullup_form: z.enum(STAGE_3_PULLUP_FORM_OPTIONS, { message: "Pull-up form is required" }),
  s3_rows: z.enum(STAGE_3_ROWS_OPTIONS, { message: "Horizontal row status is required" }),
  s3_unilateral: z.enum(STAGE_3_UNILATERAL_OPTIONS, { message: "Unilateral leg capacity is required" }),
  s3_posterior: z.enum(STAGE_3_POSTERIOR_OPTIONS, { message: "Posterior chain status is required" }),
  s3_core: z.enum(STAGE_3_CORE_OPTIONS, { message: "Core strength status is required" }),
});

// ==========================================
// STAGE 4: Movement Mechanics & Mobility
// ==========================================
export const STAGE_4_ECCENTRIC_OPTIONS = [
  "Strict 2-3s controlled eccentric",
  "Drop fast, push hard",
  "Varies with fatigue",
] as const;

export const STAGE_4_SQUAT_MOB_OPTIONS = [
  "Effortless deep squat",
  "Heels come up",
  "Lower back rounds heavily",
] as const;

export const STAGE_4_SHOULDER_MOB_OPTIONS = [
  "Full overhead extension",
  "Shoulder stiffness/clicking",
  "Forward rolled shoulders",
] as const;

export const STAGE_4_ASYMMETRY_OPTIONS = [
  "Balanced",
  "Right side noticeably stronger",
  "Left side noticeably stronger",
] as const;

export const stage4Schema = z.object({
  s4_eccentric: z.enum(STAGE_4_ECCENTRIC_OPTIONS, { message: "Eccentric tempo is required" }),
  s4_squat_mob: z.enum(STAGE_4_SQUAT_MOB_OPTIONS, { message: "Squat mobility status is required" }),
  s4_shoulder_mob: z.enum(STAGE_4_SHOULDER_MOB_OPTIONS, { message: "Shoulder mobility status is required" }),
  s4_asymmetry: z.enum(STAGE_4_ASYMMETRY_OPTIONS, { message: "Strength asymmetry status is required" }),
});

// ==========================================
// STAGE 5: Running & Cardio Architecture
// ==========================================
export const STAGE_5_RPE_OPTIONS = [
  "🟢 Easy Zone 2 (Conversational)",
  "🟡 Moderate Tempo (Breathing through mouth)",
  "🔴 Hard (Near race-pace every day)",
] as const;

export const STAGE_5_SURFACE_OPTIONS = [
  "Hard Asphalt/Concrete Road",
  "Clay/Dirt Track",
  "Grass Field",
  "Treadmill",
] as const;

export const STAGE_5_INTERFERENCE_OPTIONS = [
  "Legs feel heavy during workouts",
  "No impact, plenty of energy",
  "I run right before workouts",
  "I run after workouts",
] as const;

export const STAGE_5_OPENNESS_OPTIONS = [
  "100% Yes, prioritize muscle",
  "Keep 5-6 days of running",
  "Must run every single day",
] as const;

export const stage5Schema = z.object({
  s5_rpe: z.enum(STAGE_5_RPE_OPTIONS, { message: "RPE selection is required" }),
  s5_surface: z.array(z.string()).min(1, "Select at least one running surface"),
  s5_interference: z.enum(STAGE_5_INTERFERENCE_OPTIONS, { message: "Fatigue interaction is required" }),
  s5_openness: z.enum(STAGE_5_OPENNESS_OPTIONS, { message: "Running periodization preference is required" }),
});

// ==========================================
// STAGE 6: Nutrition & Dietary Setup
// ==========================================
export const STAGE_6_DIET_OPTIONS = [
  "Non-Vegetarian",
  "Eggetarian",
  "Lacto-Vegetarian",
  "Vegan",
] as const;

export const STAGE_6_PROTEINS_OPTIONS = [
  "Whole Eggs",
  "Chicken Breast/Curry",
  "Paneer",
  "Milk / Curd",
  "Soya Chunks",
  "Dal / Lentils",
  "Whey Protein Powder",
  "Peanuts / Peanut Butter",
] as const;

export const STAGE_6_PREP_OPTIONS = [
  "College Hostel / Mess",
  "Cook in PG / Flat",
  "Home cooked with family",
  "Eat outside / Canteen often",
] as const;

export const STAGE_6_WATER_OPTIONS = [
  "Under 2 Litres",
  "2 to 3 Litres",
  "3.5+ Litres",
] as const;

export const STAGE_6_APPETITE_OPTIONS = [
  "Small appetite (hard to eat enough)",
  "Moderate/Healthy appetite",
  "Huge appetite (always hungry)",
] as const;

export const stage6Schema = z.object({
  s6_diet: z.enum(STAGE_6_DIET_OPTIONS, { message: "Dietary classification is required" }),
  s6_proteins: z.array(z.string()).min(1, "Select at least one common protein source"),
  s6_prep: z.enum(STAGE_6_PREP_OPTIONS, { message: "Food preparation context is required" }),
  s6_water: z.enum(STAGE_6_WATER_OPTIONS, { message: "Water intake is required" }),
  s6_appetite: z.enum(STAGE_6_APPETITE_OPTIONS, { message: "Appetite level is required" }),
});

// ==========================================
// STAGE 7: Recovery & Sleep Architecture
// ==========================================
export const STAGE_7_SLEEP_HRS_OPTIONS = [
  "Under 6 hours",
  "6 to 7 hours",
  "7 to 8 hours",
  "8+ hours",
] as const;

export const STAGE_7_SLEEP_QUALITY_OPTIONS = [
  "Deep, undisturbed",
  "Frequent awakenings / restless",
  "Erratic sleep timings",
] as const;

export const STAGE_7_DOMS_OPTIONS = [
  "Constant persistent soreness",
  "Mild normal soreness",
  "Rarely ever sore",
] as const;

export const STAGE_7_STRESS_OPTIONS = [
  "Low stress",
  "Moderate manageable stress",
  "High chronic stress",
] as const;

export const stage7Schema = z.object({
  s7_sleep_hrs: z.enum(STAGE_7_SLEEP_HRS_OPTIONS, { message: "Sleep duration is required" }),
  s7_sleep_quality: z.enum(STAGE_7_SLEEP_QUALITY_OPTIONS, { message: "Sleep quality is required" }),
  s7_doms: z.enum(STAGE_7_DOMS_OPTIONS, { message: "DOMS status is required" }),
  s7_stress: z.enum(STAGE_7_STRESS_OPTIONS, { message: "Stress level is required" }),
});

// ==========================================
// STAGE 8: College Lifestyle & Logistics
// ==========================================
export const STAGE_8_TIME_BUDGET_OPTIONS = [
  "30-40 mins total",
  "45-60 mins total",
  "60-75 mins total",
  "90 mins (or two 45m blocks)",
] as const;

export const STAGE_8_TIMING_OPTIONS = [
  "Early Morning (6 AM - 8 AM)",
  "Late Afternoon (4 PM - 6 PM)",
  "Night (7 PM - 9 PM)",
  "Split (Morning run, evening strength)",
] as const;

export const STAGE_8_STEPS_OPTIONS = [
  "Mostly sedentary (sit in lectures/dorm)",
  "Moderate campus walking (5k-8k steps)",
  "Very active on feet (10k+ steps)",
] as const;

export const stage8Schema = z.object({
  s8_time_budget: z.enum(STAGE_8_TIME_BUDGET_OPTIONS, { message: "Daily time budget is required" }),
  s8_timing: z.enum(STAGE_8_TIMING_OPTIONS, { message: "Preferred training window is required" }),
  s8_steps: z.enum(STAGE_8_STEPS_OPTIONS, { message: "Daily activity level is required" }),
});

// ==========================================
// STAGE 9: Equipment & Training Environment
// ==========================================
export const STAGE_9_EQUIPMENT_OPTIONS = [
  "No equipment (Floor only)",
  "Pull-up Bar (Door/Park)",
  "Parallel Dip Bars",
  "Resistance Loop Bands",
  "Gymnastic Rings",
  "Dumbbells (Fixed or Adjustable)",
  "Weight Vest / Heavy Backpack",
  "Full Commercial Gym Access",
] as const;

export const STAGE_9_LOCATION_OPTIONS = [
  "Hostel Room / Bedroom",
  "Campus Ground / Outdoor Park",
  "Hostel Terrace / Rooftop",
  "College Gym",
] as const;

export const stage9Schema = z.object({
  s9_equipment: z.array(z.string()).min(1, "Select available equipment (choose 'No equipment' if none)"),
  s9_location: z.enum(STAGE_9_LOCATION_OPTIONS, { message: "Primary training location is required" }),
});

// ==========================================
// STAGE 10: Target Priorities & Calisthenics Skills
// ==========================================
export const STAGE_10_FOCUS_MUSCLES_OPTIONS = [
  "Upper Chest & Shoulders",
  "Lats & Upper Back (V-Taper)",
  "Arms (Biceps & Triceps)",
  "Core & Visible Abs",
  "Hamstrings & Glutes",
  "Quadriceps & Calves",
] as const;

export const STAGE_10_SKILLS_OPTIONS = [
  "Clean Muscle-Up",
  "Handstand Push-ups",
  "Pistol Squats",
  "L-Sit / Front Lever",
  "None - Just Physique",
] as const;

export const stage10Schema = z.object({
  s10_focus_muscles: z.array(z.string()).min(1, "Select at least one muscle group priority"),
  s10_skills: z.array(z.string()).min(1, "Select target skills or choose 'None - Just Physique'"),
});

// ==========================================
// STAGE 11: Sustainability & Extra Notes
// ==========================================
export const STAGE_11_SUSTAINABLE_FREQ_OPTIONS = [
  "4 days/week",
  "5 days/week",
  "6 days/week",
  "7 days/week",
] as const;

export const STAGE_11_REST_DAYS_OPTIONS = [
  "Yes, totally open to rest days",
  "Prefer active recovery only",
  "No rest days",
] as const;

export const stage11Schema = z.object({
  s11_sustainable_freq: z.enum(STAGE_11_SUSTAINABLE_FREQ_OPTIONS, { message: "Realistic frequency is required" }),
  s11_rest_days: z.enum(STAGE_11_REST_DAYS_OPTIONS, { message: "Rest day acceptance is required" }),
  s11_notes: z.string().optional().default(""),
});

// ==========================================
// COMPLETE ASSESSMENT SCHEMA & TYPE DEFS
// ==========================================
export const stageSchemas = {
  1: stage1Schema,
  2: stage2Schema,
  3: stage3Schema,
  4: stage4Schema,
  5: stage5Schema,
  6: stage6Schema,
  7: stage7Schema,
  8: stage8Schema,
  9: stage9Schema,
  10: stage10Schema,
  11: stage11Schema,
} as const;

export const assessmentSchema = stage1Schema
  .merge(stage2Schema)
  .merge(stage3Schema)
  .merge(stage4Schema)
  .merge(stage5Schema)
  .merge(stage6Schema)
  .merge(stage7Schema)
  .merge(stage8Schema)
  .merge(stage9Schema)
  .merge(stage10Schema)
  .merge(stage11Schema);

export type AssessmentData = z.infer<typeof assessmentSchema>;
export type Stage1Data = z.infer<typeof stage1Schema>;
export type Stage2Data = z.infer<typeof stage2Schema>;
export type Stage3Data = z.infer<typeof stage3Schema>;
export type Stage4Data = z.infer<typeof stage4Schema>;
export type Stage5Data = z.infer<typeof stage5Schema>;
export type Stage6Data = z.infer<typeof stage6Schema>;
export type Stage7Data = z.infer<typeof stage7Schema>;
export type Stage8Data = z.infer<typeof stage8Schema>;
export type Stage9Data = z.infer<typeof stage9Schema>;
export type Stage10Data = z.infer<typeof stage10Schema>;
export type Stage11Data = z.infer<typeof stage11Schema>;
