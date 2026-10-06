import { AssessmentData } from "../schemas/assessment";

/**
 * Pure TypeScript aggregator that generates the exact diagnostic Markdown profile
 * from abs.html with 100% structural fidelity.
 */
export function generateDiagnosticMarkdown(data: Partial<AssessmentData>): string {
  const val = (value: unknown): string => {
    if (value === undefined || value === null || value === "") {
      return "Not specified";
    }
    if (Array.isArray(value)) {
      return value.length > 0 ? value.join(", ") : "Not specified";
    }
    return String(value).trim();
  };

  return `### COMPREHENSIVE FITNESS & BIOMETRIC PROFILE

**STAGE 1: Body & Baselines**
- Age: ${val(data.s1_age)} | Sex: ${val(data.s1_sex)} | Height: ${val(data.s1_height)} | Weight: ${val(data.s1_weight)}
- Waist Circumference: ${val(data.s1_waist)}
- Push-ups Max: ${val(data.s1_pushups)}
- Pull-ups Max: ${val(data.s1_pullups)}
- Dips Capacity: ${val(data.s1_dips)}
- Squats Max: ${val(data.s1_squats)}
- 3.5 km Run Pace/Time: ${val(data.s1_run_time)}
- Plank Capacity: ${val(data.s1_plank)}
- Current Physique: ${val(data.s1_physique)}
- Recurring Pain / Injuries: ${val(data.s1_pain)}
- Primary Goal: ${val(data.s1_goal)}

**STAGE 2: Current Training Routine**
- Frequency: ${val(data.s2_freq)} | Session Duration: ${val(data.s2_duration)}
- Routine Structure: ${val(data.s2_structure)}
- Rest Intervals: ${val(data.s2_rest)}
- Intensity / Failure Proximity: ${val(data.s2_failure)}
- Push-up Variations Used: ${val(data.s2_pushup_vars)}
- Tracking Method: ${val(data.s2_tracking)}
- Progression Status: ${val(data.s2_progress)}

**STAGE 3: Strength & Movement Capacity**
- Pull-up Technique: ${val(data.s3_pullup_form)}
- Horizontal Rows Status: ${val(data.s3_rows)}
- Single-leg / Unilateral: ${val(data.s3_unilateral)}
- Hamstring / Posterior Chain: ${val(data.s3_posterior)}
- Core Flexion / Hanging Work: ${val(data.s3_core)}

**STAGE 4: Mobility & Mechanics**
- Eccentric Control: ${val(data.s4_eccentric)}
- Deep Squat Mobility: ${val(data.s4_squat_mob)}
- Shoulder Overhead Mobility: ${val(data.s4_shoulder_mob)}
- Strength Asymmetries: ${val(data.s4_asymmetry)}

**STAGE 5: Running Integration**
- 3.5 km Perceived Exertion (RPE): ${val(data.s5_rpe)}
- Running Surfaces: ${val(data.s5_surface)}
- Fatigue Interaction: ${val(data.s5_interference)}
- Periodization Openness: ${val(data.s5_openness)}

**STAGE 6: Nutrition & Dietary Setup**
- Diet Type: ${val(data.s6_diet)}
- Common Protein Sources: ${val(data.s6_proteins)}
- Meal Sourcing: ${val(data.s6_prep)}
- Daily Water: ${val(data.s6_water)}
- Appetite: ${val(data.s6_appetite)}

**STAGE 7: Recovery & Sleep**
- Sleep Duration: ${val(data.s7_sleep_hrs)}
- Sleep Quality/Consistency: ${val(data.s7_sleep_quality)}
- Muscle Soreness State: ${val(data.s7_doms)}
- Stress Level: ${val(data.s7_stress)}

**STAGE 8: College Lifestyle & Logistics**
- Daily Time Budget: ${val(data.s8_time_budget)}
- Preferred Training Window: ${val(data.s8_timing)}
- Campus Steps / Non-exercise Activity: ${val(data.s8_steps)}

**STAGE 9: Equipment & Training Environment**
- Available Equipment: ${val(data.s9_equipment)}
- Training Environment: ${val(data.s9_location)}

**STAGE 10: Target Priorities & Calisthenics Skills**
- Muscle Groups to Prioritize: ${val(data.s10_focus_muscles)}
- Calisthenics Skills Desired: ${val(data.s10_skills)}

**STAGE 11: Sustainability & Extra Notes**
- Realistic Long-term Frequency: ${val(data.s11_sustainable_freq)}
- Rest Day Acceptance: ${val(data.s11_rest_days)}
- Specific Notes / Constraints: ${val(data.s11_notes)}`;
}
