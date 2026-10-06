"use client";

import React from "react";
import { useAssessment } from "@/lib/store/useAssessment";
import {
  STAGE_5_RPE_OPTIONS,
  STAGE_5_SURFACE_OPTIONS,
  STAGE_5_INTERFERENCE_OPTIONS,
  STAGE_5_OPENNESS_OPTIONS,
} from "@/lib/schemas/assessment";
import { OptionCardSingle } from "../controls/OptionCardSingle";
import { OptionCardMulti } from "../controls/OptionCardMulti";
import { QuestionHeader } from "../controls/FormFields";

export const Stage5View: React.FC = () => {
  const { data, setFieldValue, toggleMultiSelect, errors } = useAssessment();

  return (
    <div className="space-y-7">
      <div className="border-b border-zinc-800 pb-3">
        <h3 className="text-lg font-bold text-sky-400">🏃 STAGE 5 — Running & Cardio Architecture</h3>
        <p className="text-xs text-zinc-400 mt-0.5">
          Harmonizing aerobic base with myofibrillar protein synthesis.
        </p>
      </div>

      {/* 1. RPE */}
      <div>
        <QuestionHeader
          number="1"
          title="Current 3.5 km Perceived Exertion (RPE)"
          badge="single"
          error={errors.s5_rpe}
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {STAGE_5_RPE_OPTIONS.map((opt) => (
            <OptionCardSingle
              key={opt}
              label={opt}
              value={opt}
              selectedValue={data.s5_rpe}
              onSelect={(val) => setFieldValue("s5_rpe", val as typeof STAGE_5_RPE_OPTIONS[number])}
            />
          ))}
        </div>
      </div>

      {/* 2. Running Surface */}
      <div>
        <QuestionHeader
          number="2"
          title="Running Surface"
          badge="multi"
          error={errors.s5_surface}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
          {STAGE_5_SURFACE_OPTIONS.map((opt) => (
            <OptionCardMulti
              key={opt}
              label={opt}
              value={opt}
              selectedValues={data.s5_surface}
              onToggle={(val) => toggleMultiSelect("s5_surface", val)}
            />
          ))}
        </div>
      </div>

      {/* 3. Post-Run Fatigue Impact */}
      <div>
        <QuestionHeader
          number="3"
          title="Post-Run Fatigue Impact on Calisthenics"
          badge="single"
          error={errors.s5_interference}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {STAGE_5_INTERFERENCE_OPTIONS.map((opt) => (
            <OptionCardSingle
              key={opt}
              label={opt}
              value={opt}
              selectedValue={data.s5_interference}
              onSelect={(val) => setFieldValue("s5_interference", val as typeof STAGE_5_INTERFERENCE_OPTIONS[number])}
            />
          ))}
        </div>
      </div>

      {/* 4. Openness to Structured Periodization */}
      <div>
        <QuestionHeader
          number="4"
          title="Are you open to replacing 2 daily runs with structured sprint intervals or targeted recovery runs if it accelerates muscle hypertrophy?"
          badge="single"
          error={errors.s5_openness}
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {STAGE_5_OPENNESS_OPTIONS.map((opt) => (
            <OptionCardSingle
              key={opt}
              label={opt}
              value={opt}
              selectedValue={data.s5_openness}
              onSelect={(val) => setFieldValue("s5_openness", val as typeof STAGE_5_OPENNESS_OPTIONS[number])}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Stage5View;
