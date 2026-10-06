"use client";

import React from "react";
import { useAssessment } from "@/lib/store/useAssessment";
import {
  STAGE_6_DIET_OPTIONS,
  STAGE_6_PROTEINS_OPTIONS,
  STAGE_6_PREP_OPTIONS,
  STAGE_6_WATER_OPTIONS,
  STAGE_6_APPETITE_OPTIONS,
} from "@/lib/schemas/assessment";
import { OptionCardSingle } from "../controls/OptionCardSingle";
import { OptionCardMulti } from "../controls/OptionCardMulti";
import { QuestionHeader } from "../controls/FormFields";

export const Stage6View: React.FC = () => {
  const { data, setFieldValue, toggleMultiSelect, errors } = useAssessment();

  return (
    <div className="space-y-7">
      <div className="border-b border-zinc-800 pb-3">
        <h3 className="text-lg font-bold text-sky-400">🍛 STAGE 6 — Nutrition & Protein Intake</h3>
        <p className="text-xs text-zinc-400 mt-0.5">
          Aligning hostel/home nutrition to trigger a genuine anabolic state.
        </p>
      </div>

      {/* 1. Dietary Classification */}
      <div>
        <QuestionHeader
          number="1"
          title="Dietary Classification"
          badge="single"
          error={errors.s6_diet}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {STAGE_6_DIET_OPTIONS.map((opt) => (
            <OptionCardSingle
              key={opt}
              label={opt}
              value={opt}
              selectedValue={data.s6_diet}
              onSelect={(val) => setFieldValue("s6_diet", val as typeof STAGE_6_DIET_OPTIONS[number])}
            />
          ))}
        </div>
      </div>

      {/* 2. Protein Sources */}
      <div>
        <QuestionHeader
          number="2"
          title="Protein Sources You Eat Regularly (At least 3-4x/week)"
          badge="multi"
          error={errors.s6_proteins}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
          {STAGE_6_PROTEINS_OPTIONS.map((opt) => (
            <OptionCardMulti
              key={opt}
              label={opt}
              value={opt}
              selectedValues={data.s6_proteins}
              onToggle={(val) => toggleMultiSelect("s6_proteins", val)}
            />
          ))}
        </div>
      </div>

      {/* 3. Meal Preparation Context */}
      <div>
        <QuestionHeader
          number="3"
          title="Meal Preparation & Food Sourcing"
          badge="single"
          error={errors.s6_prep}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {STAGE_6_PREP_OPTIONS.map((opt) => (
            <OptionCardSingle
              key={opt}
              label={opt}
              value={opt}
              selectedValue={data.s6_prep}
              onSelect={(val) => setFieldValue("s6_prep", val as typeof STAGE_6_PREP_OPTIONS[number])}
            />
          ))}
        </div>
      </div>

      {/* 4. Water Intake */}
      <div>
        <QuestionHeader
          number="4"
          title="Daily Liquid Water Intake"
          badge="single"
          error={errors.s6_water}
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {STAGE_6_WATER_OPTIONS.map((opt) => (
            <OptionCardSingle
              key={opt}
              label={opt}
              value={opt}
              selectedValue={data.s6_water}
              onSelect={(val) => setFieldValue("s6_water", val as typeof STAGE_6_WATER_OPTIONS[number])}
            />
          ))}
        </div>
      </div>

      {/* 5. Appetite */}
      <div>
        <QuestionHeader
          number="5"
          title="Appetite & Caloric Surplus Tolerance"
          badge="single"
          error={errors.s6_appetite}
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {STAGE_6_APPETITE_OPTIONS.map((opt) => (
            <OptionCardSingle
              key={opt}
              label={opt}
              value={opt}
              selectedValue={data.s6_appetite}
              onSelect={(val) => setFieldValue("s6_appetite", val as typeof STAGE_6_APPETITE_OPTIONS[number])}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Stage6View;
