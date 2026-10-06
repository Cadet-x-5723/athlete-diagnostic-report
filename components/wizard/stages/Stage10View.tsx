"use client";

import React from "react";
import { useAssessment } from "@/lib/store/useAssessment";
import {
  STAGE_10_FOCUS_MUSCLES_OPTIONS,
  STAGE_10_SKILLS_OPTIONS,
} from "@/lib/schemas/assessment";
import { OptionCardMulti } from "../controls/OptionCardMulti";
import { QuestionHeader } from "../controls/FormFields";

export const Stage10View: React.FC = () => {
  const { data, toggleMultiSelect, errors } = useAssessment();

  return (
    <div className="space-y-7">
      <div className="border-b border-zinc-800 pb-3">
        <h3 className="text-lg font-bold text-sky-400">🎯 STAGE 10 — Target Priorities & Calisthenics Skills</h3>
        <p className="text-xs text-zinc-400 mt-0.5">
          Targeting specific musculature and movement mechanics.
        </p>
      </div>

      {/* 1. Target Muscle Groups */}
      <div>
        <QuestionHeader
          number="1"
          title="Target Muscle Groups to Prioritize First"
          badge="multi"
          error={errors.s10_focus_muscles}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
          {STAGE_10_FOCUS_MUSCLES_OPTIONS.map((opt) => (
            <OptionCardMulti
              key={opt}
              label={opt}
              value={opt}
              selectedValues={data.s10_focus_muscles}
              onToggle={(val) => toggleMultiSelect("s10_focus_muscles", val)}
            />
          ))}
        </div>
      </div>

      {/* 2. Calisthenics Skills */}
      <div>
        <QuestionHeader
          number="2"
          title="Calisthenics Skills You Want to Unlock Long-Term"
          badge="multi"
          error={errors.s10_skills}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
          {STAGE_10_SKILLS_OPTIONS.map((opt) => (
            <OptionCardMulti
              key={opt}
              label={opt}
              value={opt}
              selectedValues={data.s10_skills}
              onToggle={(val) => toggleMultiSelect("s10_skills", val, "None - Just Physique")}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Stage10View;
