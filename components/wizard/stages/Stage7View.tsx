"use client";

import React from "react";
import { useAssessment } from "@/lib/store/useAssessment";
import {
  STAGE_7_SLEEP_HRS_OPTIONS,
  STAGE_7_SLEEP_QUALITY_OPTIONS,
  STAGE_7_DOMS_OPTIONS,
  STAGE_7_STRESS_OPTIONS,
} from "@/lib/schemas/assessment";
import { OptionCardSingle } from "../controls/OptionCardSingle";
import { QuestionHeader } from "../controls/FormFields";

export const Stage7View: React.FC = () => {
  const { data, setFieldValue, errors } = useAssessment();

  return (
    <div className="space-y-7">
      <div className="border-b border-zinc-800 pb-3">
        <h3 className="text-lg font-bold text-sky-400">😴 STAGE 7 — Recovery & Sleep Architecture</h3>
        <p className="text-xs text-zinc-400 mt-0.5">
          Evaluating nervous system recovery and tissue rebuilding.
        </p>
      </div>

      {/* 1. Sleep Hours */}
      <div>
        <QuestionHeader
          number="1"
          title="Average Nightly Sleep Duration"
          badge="single"
          error={errors.s7_sleep_hrs}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
          {STAGE_7_SLEEP_HRS_OPTIONS.map((opt) => (
            <OptionCardSingle
              key={opt}
              label={opt}
              value={opt}
              selectedValue={data.s7_sleep_hrs}
              onSelect={(val) => setFieldValue("s7_sleep_hrs", val as typeof STAGE_7_SLEEP_HRS_OPTIONS[number])}
            />
          ))}
        </div>
      </div>

      {/* 2. Sleep Quality */}
      <div>
        <QuestionHeader
          number="2"
          title="Sleep Quality & Consistency"
          badge="single"
          error={errors.s7_sleep_quality}
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {STAGE_7_SLEEP_QUALITY_OPTIONS.map((opt) => (
            <OptionCardSingle
              key={opt}
              label={opt}
              value={opt}
              selectedValue={data.s7_sleep_quality}
              onSelect={(val) => setFieldValue("s7_sleep_quality", val as typeof STAGE_7_SLEEP_QUALITY_OPTIONS[number])}
            />
          ))}
        </div>
      </div>

      {/* 3. DOMS / Soreness */}
      <div>
        <QuestionHeader
          number="3"
          title="Muscle Soreness (DOMS) Sensation"
          badge="single"
          error={errors.s7_doms}
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {STAGE_7_DOMS_OPTIONS.map((opt) => (
            <OptionCardSingle
              key={opt}
              label={opt}
              value={opt}
              selectedValue={data.s7_doms}
              onSelect={(val) => setFieldValue("s7_doms", val as typeof STAGE_7_DOMS_OPTIONS[number])}
            />
          ))}
        </div>
      </div>

      {/* 4. Stress */}
      <div>
        <QuestionHeader
          number="4"
          title="Daily Stress Level (Academic / College / Exams)"
          badge="single"
          error={errors.s7_stress}
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {STAGE_7_STRESS_OPTIONS.map((opt) => (
            <OptionCardSingle
              key={opt}
              label={opt}
              value={opt}
              selectedValue={data.s7_stress}
              onSelect={(val) => setFieldValue("s7_stress", val as typeof STAGE_7_STRESS_OPTIONS[number])}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Stage7View;
