"use client";

import React from "react";
import { useAssessment } from "@/lib/store/useAssessment";
import {
  STAGE_3_PULLUP_FORM_OPTIONS,
  STAGE_3_ROWS_OPTIONS,
  STAGE_3_UNILATERAL_OPTIONS,
  STAGE_3_POSTERIOR_OPTIONS,
  STAGE_3_CORE_OPTIONS,
} from "@/lib/schemas/assessment";
import { OptionCardSingle } from "../controls/OptionCardSingle";
import { QuestionHeader } from "../controls/FormFields";

export const Stage3View: React.FC = () => {
  const { data, setFieldValue, errors } = useAssessment();

  return (
    <div className="space-y-7">
      <div className="border-b border-zinc-800 pb-3">
        <h3 className="text-lg font-bold text-sky-400">💪 STAGE 3 — Strength & Movement Capacities</h3>
        <p className="text-xs text-zinc-400 mt-0.5">
          Evaluating true multi-planar strength balance.
        </p>
      </div>

      {/* 1. Pull-up Form */}
      <div>
        <QuestionHeader
          number="1"
          title="Vertical Pulling Form (Pull-ups)"
          badge="single"
          error={errors.s3_pullup_form}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {STAGE_3_PULLUP_FORM_OPTIONS.map((opt) => (
            <OptionCardSingle
              key={opt}
              label={opt}
              value={opt}
              selectedValue={data.s3_pullup_form}
              onSelect={(val) => setFieldValue("s3_pullup_form", val as typeof STAGE_3_PULLUP_FORM_OPTIONS[number])}
            />
          ))}
        </div>
      </div>

      {/* 2. Inverted Rows */}
      <div>
        <QuestionHeader
          number="2"
          title="Horizontal Pulling (Inverted Bodyweight Rows)"
          badge="single"
          error={errors.s3_rows}
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {STAGE_3_ROWS_OPTIONS.map((opt) => (
            <OptionCardSingle
              key={opt}
              label={opt}
              value={opt}
              selectedValue={data.s3_rows}
              onSelect={(val) => setFieldValue("s3_rows", val as typeof STAGE_3_ROWS_OPTIONS[number])}
            />
          ))}
        </div>
      </div>

      {/* 3. Unilateral Leg Strength */}
      <div>
        <QuestionHeader
          number="3"
          title="Unilateral Leg Strength (Bulgarian Split Squats / Lunges)"
          badge="single"
          error={errors.s3_unilateral}
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {STAGE_3_UNILATERAL_OPTIONS.map((opt) => (
            <OptionCardSingle
              key={opt}
              label={opt}
              value={opt}
              selectedValue={data.s3_unilateral}
              onSelect={(val) => setFieldValue("s3_unilateral", val as typeof STAGE_3_UNILATERAL_OPTIONS[number])}
            />
          ))}
        </div>
      </div>

      {/* 4. Posterior Chain */}
      <div>
        <QuestionHeader
          number="4"
          title="Posterior Chain (Hamstrings / Glutes)"
          badge="single"
          error={errors.s3_posterior}
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {STAGE_3_POSTERIOR_OPTIONS.map((opt) => (
            <OptionCardSingle
              key={opt}
              label={opt}
              value={opt}
              selectedValue={data.s3_posterior}
              onSelect={(val) => setFieldValue("s3_posterior", val as typeof STAGE_3_POSTERIOR_OPTIONS[number])}
            />
          ))}
        </div>
      </div>

      {/* 5. Core Strength */}
      <div>
        <QuestionHeader
          number="5"
          title="Core Strength: Hanging Leg Raises / Hollow Body"
          badge="single"
          error={errors.s3_core}
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {STAGE_3_CORE_OPTIONS.map((opt) => (
            <OptionCardSingle
              key={opt}
              label={opt}
              value={opt}
              selectedValue={data.s3_core}
              onSelect={(val) => setFieldValue("s3_core", val as typeof STAGE_3_CORE_OPTIONS[number])}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Stage3View;
