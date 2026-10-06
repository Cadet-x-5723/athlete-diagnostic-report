"use client";

import React from "react";
import { useAssessment } from "@/lib/store/useAssessment";
import {
  STAGE_2_FREQ_OPTIONS,
  STAGE_2_STRUCTURE_OPTIONS,
  STAGE_2_REST_OPTIONS,
  STAGE_2_FAILURE_OPTIONS,
  STAGE_2_PUSHUP_VARS_OPTIONS,
  STAGE_2_TRACKING_OPTIONS,
  STAGE_2_PROGRESS_OPTIONS,
} from "@/lib/schemas/assessment";
import { OptionCardSingle } from "../controls/OptionCardSingle";
import { OptionCardMulti } from "../controls/OptionCardMulti";
import { QuestionHeader, FormInput } from "../controls/FormFields";

export const Stage2View: React.FC = () => {
  const { data, setFieldValue, toggleMultiSelect, errors } = useAssessment();

  return (
    <div className="space-y-7">
      <div className="border-b border-zinc-800 pb-3">
        <h3 className="text-lg font-bold text-sky-400">🏋️ STAGE 2 — Current Training Structure</h3>
        <p className="text-xs text-zinc-400 mt-0.5">
          Analyzing how you train day in, day out right now.
        </p>
      </div>

      {/* 1. Frequency */}
      <div>
        <QuestionHeader
          number="1"
          title="Workout Frequency for Bodyweight Work"
          badge="single"
          error={errors.s2_freq}
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {STAGE_2_FREQ_OPTIONS.map((opt) => (
            <OptionCardSingle
              key={opt}
              label={opt}
              value={opt}
              selectedValue={data.s2_freq}
              onSelect={(val) => setFieldValue("s2_freq", val as typeof STAGE_2_FREQ_OPTIONS[number])}
            />
          ))}
        </div>
      </div>

      {/* 2. Duration */}
      <div>
        <QuestionHeader
          number="2"
          title="Average Duration of Your Daily Resistance Session"
          error={errors.s2_duration}
        />
        <FormInput
          type="text"
          placeholder="e.g. 30 minutes exact / 45 minutes"
          value={data.s2_duration || ""}
          onChange={(e) => setFieldValue("s2_duration", e.target.value)}
        />
      </div>

      {/* 3. Structure */}
      <div>
        <QuestionHeader
          number="3"
          title="Structure of Your Daily Routine"
          badge="single"
          error={errors.s2_structure}
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {STAGE_2_STRUCTURE_OPTIONS.map((opt) => (
            <OptionCardSingle
              key={opt}
              label={opt}
              value={opt}
              selectedValue={data.s2_structure}
              onSelect={(val) => setFieldValue("s2_structure", val as typeof STAGE_2_STRUCTURE_OPTIONS[number])}
            />
          ))}
        </div>
      </div>

      {/* 4. Rest Intervals */}
      <div>
        <QuestionHeader
          number="4"
          title="Typical Rest Intervals Between Sets"
          badge="single"
          error={errors.s2_rest}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {STAGE_2_REST_OPTIONS.map((opt) => (
            <OptionCardSingle
              key={opt}
              label={opt}
              value={opt}
              selectedValue={data.s2_rest}
              onSelect={(val) => setFieldValue("s2_rest", val as typeof STAGE_2_REST_OPTIONS[number])}
            />
          ))}
        </div>
      </div>

      {/* 5. Proximity to Failure */}
      <div>
        <QuestionHeader
          number="5"
          title="Proximity to Failure on Sets"
          badge="single"
          error={errors.s2_failure}
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {STAGE_2_FAILURE_OPTIONS.map((opt) => (
            <OptionCardSingle
              key={opt}
              label={opt}
              value={opt}
              selectedValue={data.s2_failure}
              onSelect={(val) => setFieldValue("s2_failure", val as typeof STAGE_2_FAILURE_OPTIONS[number])}
            />
          ))}
        </div>
      </div>

      {/* 6. Pushup Variations */}
      <div>
        <QuestionHeader
          number="6"
          title="Which Push-up Variations Do You Currently Do?"
          badge="multi"
          error={errors.s2_pushup_vars}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
          {STAGE_2_PUSHUP_VARS_OPTIONS.map((opt) => (
            <OptionCardMulti
              key={opt}
              label={opt}
              value={opt}
              selectedValues={data.s2_pushup_vars}
              onToggle={(val) => toggleMultiSelect("s2_pushup_vars", val)}
            />
          ))}
        </div>
      </div>

      {/* 7. Tracking Method */}
      <div>
        <QuestionHeader
          number="7"
          title="Do You Currently Track Your Reps & Sets in a Logbook/App?"
          badge="single"
          error={errors.s2_tracking}
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {STAGE_2_TRACKING_OPTIONS.map((opt) => (
            <OptionCardSingle
              key={opt}
              label={opt}
              value={opt}
              selectedValue={data.s2_tracking}
              onSelect={(val) => setFieldValue("s2_tracking", val as typeof STAGE_2_TRACKING_OPTIONS[number])}
            />
          ))}
        </div>
      </div>

      {/* 8. Progression Status */}
      <div>
        <QuestionHeader
          number="8"
          title="Have Your Reps Stalled Recently, or Are They Progressing?"
          badge="single"
          error={errors.s2_progress}
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {STAGE_2_PROGRESS_OPTIONS.map((opt) => (
            <OptionCardSingle
              key={opt}
              label={opt}
              value={opt}
              selectedValue={data.s2_progress}
              onSelect={(val) => setFieldValue("s2_progress", val as typeof STAGE_2_PROGRESS_OPTIONS[number])}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Stage2View;
