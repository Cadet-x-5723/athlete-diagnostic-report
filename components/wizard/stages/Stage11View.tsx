"use client";

import React from "react";
import { useAssessment } from "@/lib/store/useAssessment";
import {
  STAGE_11_SUSTAINABLE_FREQ_OPTIONS,
  STAGE_11_REST_DAYS_OPTIONS,
} from "@/lib/schemas/assessment";
import { OptionCardSingle } from "../controls/OptionCardSingle";
import { QuestionHeader, FormTextarea } from "../controls/FormFields";
import { DiagnosticBentoGrid } from "@/components/diagnostic/DiagnosticBentoGrid";

export const Stage11View: React.FC = () => {
  const { data, setFieldValue, errors } = useAssessment();

  return (
    <div className="space-y-7">
      <div className="border-b border-zinc-800 pb-3">
        <h3 className="text-lg font-bold text-sky-400">🔥 STAGE 11 — Sustainability & Diagnostics</h3>
        <p className="text-xs text-zinc-400 mt-0.5">
          Realistic boundaries, automated biomechanics analysis, and deterministic 6-week periodization.
        </p>
      </div>

      {/* 1. Realistic Long-Term Frequency */}
      <div>
        <QuestionHeader
          number="1"
          title="Realistic Long-Term Training Frequency (That you won't drop after 2 weeks)"
          badge="single"
          error={errors.s11_sustainable_freq}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {STAGE_11_SUSTAINABLE_FREQ_OPTIONS.map((opt) => (
            <OptionCardSingle
              key={opt}
              label={opt}
              value={opt}
              selectedValue={data.s11_sustainable_freq}
              onSelect={(val) => setFieldValue("s11_sustainable_freq", val as typeof STAGE_11_SUSTAINABLE_FREQ_OPTIONS[number])}
            />
          ))}
        </div>
      </div>

      {/* 2. Rest Day Acceptance */}
      <div>
        <QuestionHeader
          number="2"
          title="Are you willing to take 1–2 complete rest days per week if it demonstrably increases your pull-ups, push-ups, and muscle growth?"
          badge="single"
          error={errors.s11_rest_days}
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {STAGE_11_REST_DAYS_OPTIONS.map((opt) => (
            <OptionCardSingle
              key={opt}
              label={opt}
              value={opt}
              selectedValue={data.s11_rest_days}
              onSelect={(val) => setFieldValue("s11_rest_days", val as typeof STAGE_11_REST_DAYS_OPTIONS[number])}
            />
          ))}
        </div>
      </div>

      {/* 3. Additional Specific Notes */}
      <div>
        <QuestionHeader
          number="3"
          title="Anything else specific about your body, schedule, or diet?"
          badge="optional"
          error={errors.s11_notes}
        />
        <FormTextarea
          rows={3}
          placeholder="e.g. Exam periods coming up, hate doing burpees, left shoulder pops on dips, etc."
          value={data.s11_notes || ""}
          onChange={(e) => setFieldValue("s11_notes", e.target.value)}
        />
      </div>

      {/* Master Interactive Bento Grid Diagnostic & Periodized Strategy */}
      <div className="mt-8 pt-8 border-t border-zinc-800/80">
        <DiagnosticBentoGrid />
      </div>
    </div>
  );
};

export default Stage11View;
