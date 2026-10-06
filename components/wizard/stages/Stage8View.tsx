"use client";

import React from "react";
import { useAssessment } from "@/lib/store/useAssessment";
import {
  STAGE_8_TIME_BUDGET_OPTIONS,
  STAGE_8_TIMING_OPTIONS,
  STAGE_8_STEPS_OPTIONS,
} from "@/lib/schemas/assessment";
import { OptionCardSingle } from "../controls/OptionCardSingle";
import { QuestionHeader } from "../controls/FormFields";

export const Stage8View: React.FC = () => {
  const { data, setFieldValue, errors } = useAssessment();

  return (
    <div className="space-y-7">
      <div className="border-b border-zinc-800 pb-3">
        <h3 className="text-lg font-bold text-sky-400">🏫 STAGE 8 — College Schedule & Lifestyle Logistics</h3>
        <p className="text-xs text-zinc-400 mt-0.5">
          Building around class routines and daily energy peaks.
        </p>
      </div>

      {/* 1. Time Budget */}
      <div>
        <QuestionHeader
          number="1"
          title="Total Daily Time You Can Commit to Fitness (Running + Strength)"
          badge="single"
          error={errors.s8_time_budget}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {STAGE_8_TIME_BUDGET_OPTIONS.map((opt) => (
            <OptionCardSingle
              key={opt}
              label={opt}
              value={opt}
              selectedValue={data.s8_time_budget}
              onSelect={(val) => setFieldValue("s8_time_budget", val as typeof STAGE_8_TIME_BUDGET_OPTIONS[number])}
            />
          ))}
        </div>
      </div>

      {/* 2. Preferred Timing */}
      <div>
        <QuestionHeader
          number="2"
          title="Preferred Time of Day for Training"
          badge="single"
          error={errors.s8_timing}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {STAGE_8_TIMING_OPTIONS.map((opt) => (
            <OptionCardSingle
              key={opt}
              label={opt}
              value={opt}
              selectedValue={data.s8_timing}
              onSelect={(val) => setFieldValue("s8_timing", val as typeof STAGE_8_TIMING_OPTIONS[number])}
            />
          ))}
        </div>
      </div>

      {/* 3. Steps / Physical Activity */}
      <div>
        <QuestionHeader
          number="3"
          title="Daily Campus Steps / Physical Activity (Excluding Run)"
          badge="single"
          error={errors.s8_steps}
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {STAGE_8_STEPS_OPTIONS.map((opt) => (
            <OptionCardSingle
              key={opt}
              label={opt}
              value={opt}
              selectedValue={data.s8_steps}
              onSelect={(val) => setFieldValue("s8_steps", val as typeof STAGE_8_STEPS_OPTIONS[number])}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Stage8View;
