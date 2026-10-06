"use client";

import React from "react";
import { useAssessment } from "@/lib/store/useAssessment";
import {
  STAGE_1_PLANK_OPTIONS,
  STAGE_1_PHYSIQUE_OPTIONS,
  STAGE_1_PAIN_OPTIONS,
  STAGE_1_GOAL_OPTIONS,
} from "@/lib/schemas/assessment";
import { OptionCardSingle } from "../controls/OptionCardSingle";
import { OptionCardMulti } from "../controls/OptionCardMulti";
import {
  QuestionHeader,
  FormInput,
  FormSelect,
} from "../controls/FormFields";

export const Stage1View: React.FC = () => {
  const { data, setFieldValue, toggleMultiSelect, errors } = useAssessment();

  return (
    <div className="space-y-7">
      <div className="border-b border-zinc-800 pb-3">
        <h3 className="text-lg font-bold text-sky-400">🧬 STAGE 1 — Body & Baseline Fitness</h3>
        <p className="text-xs text-zinc-400 mt-0.5">
          Accurate biometrics and immediate max execution capacity.
        </p>
      </div>

      {/* 1. Age, Sex, Height, Weight */}
      <div>
        <QuestionHeader number="1" title="Age, Biological Sex, Height, Current Bodyweight" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          <FormInput
            type="number"
            placeholder="Age (e.g. 21)"
            value={data.s1_age || ""}
            onChange={(e) => setFieldValue("s1_age", e.target.value ? Number(e.target.value) : (undefined as unknown as number))}
            error={errors.s1_age}
          />
          <FormSelect
            value={data.s1_sex || ""}
            onChange={(e) => setFieldValue("s1_sex", e.target.value as "Male" | "Female")}
            error={errors.s1_sex}
          >
            <option value="">Select Biological Sex</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </FormSelect>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FormInput
            type="text"
            placeholder="Height (e.g. 178 cm or 5'10)"
            value={data.s1_height || ""}
            onChange={(e) => setFieldValue("s1_height", e.target.value)}
            error={errors.s1_height}
          />
          <FormInput
            type="text"
            placeholder="Bodyweight (e.g. 72 kg or 158 lbs)"
            value={data.s1_weight || ""}
            onChange={(e) => setFieldValue("s1_weight", e.target.value)}
            error={errors.s1_weight}
          />
        </div>
      </div>

      {/* 2. Waist Circumference */}
      <div>
        <QuestionHeader
          number="2"
          title="Waist Circumference (at narrowest point or navel)"
          error={errors.s1_waist}
        />
        <FormInput
          type="text"
          placeholder="e.g. 31 inches / 79 cm / Unknown"
          value={data.s1_waist || ""}
          onChange={(e) => setFieldValue("s1_waist", e.target.value)}
        />
      </div>

      {/* 3. Push-ups */}
      <div>
        <QuestionHeader
          number="3"
          title="Strict Push-ups in a Single Unbroken Set"
          error={errors.s1_pushups}
        />
        <FormInput
          type="number"
          placeholder="Total reps (chest 1 inch from floor, locked elbows)"
          value={data.s1_pushups !== undefined ? data.s1_pushups : ""}
          onChange={(e) => setFieldValue("s1_pushups", e.target.value !== "" ? Number(e.target.value) : (undefined as unknown as number))}
        />
      </div>

      {/* 4. Pull-ups */}
      <div>
        <QuestionHeader
          number="4"
          title="Strict Pull-ups in a Single Unbroken Set"
          error={errors.s1_pullups}
        />
        <FormInput
          type="number"
          placeholder="Total reps (dead-hang to chin over bar)"
          value={data.s1_pullups !== undefined ? data.s1_pullups : ""}
          onChange={(e) => setFieldValue("s1_pullups", e.target.value !== "" ? Number(e.target.value) : (undefined as unknown as number))}
        />
      </div>

      {/* 5. Dips */}
      <div>
        <QuestionHeader
          number="5"
          title="Parallel Bar / Sturdy Bench Dips"
          error={errors.s1_dips}
        />
        <FormInput
          type="text"
          placeholder="Total reps (or write 'No dip bars')"
          value={data.s1_dips || ""}
          onChange={(e) => setFieldValue("s1_dips", e.target.value)}
        />
      </div>

      {/* 6. Squats */}
      <div>
        <QuestionHeader
          number="6"
          title="Strict Bodyweight Squats in a Single Unbroken Set"
          error={errors.s1_squats}
        />
        <FormInput
          type="number"
          placeholder="Total reps (hip crease strictly below knees)"
          value={data.s1_squats !== undefined ? data.s1_squats : ""}
          onChange={(e) => setFieldValue("s1_squats", e.target.value !== "" ? Number(e.target.value) : (undefined as unknown as number))}
        />
      </div>

      {/* 7. Run Time */}
      <div>
        <QuestionHeader
          number="7"
          title="Typical or Best 3.5 km Running Time"
          error={errors.s1_run_time}
        />
        <FormInput
          type="text"
          placeholder="e.g. 18 min 45 sec / approximate"
          value={data.s1_run_time || ""}
          onChange={(e) => setFieldValue("s1_run_time", e.target.value)}
        />
      </div>

      {/* 8. Plank */}
      <div>
        <QuestionHeader
          number="8"
          title="Maximum Plank Duration (Flat back, strict hollow)"
          badge="single"
          error={errors.s1_plank}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {STAGE_1_PLANK_OPTIONS.map((opt) => (
            <OptionCardSingle
              key={opt}
              label={opt}
              value={opt}
              selectedValue={data.s1_plank}
              onSelect={(val) => setFieldValue("s1_plank", val as typeof STAGE_1_PLANK_OPTIONS[number])}
            />
          ))}
        </div>
      </div>

      {/* 9. Physique */}
      <div>
        <QuestionHeader
          number="9"
          title="How would you categorize your current physique?"
          badge="single"
          error={errors.s1_physique}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {STAGE_1_PHYSIQUE_OPTIONS.map((opt) => (
            <OptionCardSingle
              key={opt}
              label={opt}
              value={opt}
              selectedValue={data.s1_physique}
              onSelect={(val) => setFieldValue("s1_physique", val as typeof STAGE_1_PHYSIQUE_OPTIONS[number])}
            />
          ))}
        </div>
      </div>

      {/* 10. Pain Areas */}
      <div>
        <QuestionHeader
          number="10"
          title="Where do you currently experience recurring pain/tightness?"
          badge="multi"
          error={errors.s1_pain}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
          {STAGE_1_PAIN_OPTIONS.map((opt) => (
            <OptionCardMulti
              key={opt}
              label={opt}
              value={opt}
              selectedValues={data.s1_pain}
              onToggle={(val) => toggleMultiSelect("s1_pain", val, "None")}
            />
          ))}
        </div>
      </div>

      {/* 11. Primary Physical Transformation Goal */}
      <div>
        <QuestionHeader
          number="11"
          title="Primary Physical Transformation Goal"
          badge="multi"
          error={errors.s1_goal}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {STAGE_1_GOAL_OPTIONS.map((opt) => (
            <OptionCardMulti
              key={opt}
              label={opt}
              value={opt}
              selectedValues={data.s1_goal}
              onToggle={(val) => toggleMultiSelect("s1_goal", val)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Stage1View;
