"use client";

import React from "react";
import { useAssessment } from "@/lib/store/useAssessment";
import {
  STAGE_4_ECCENTRIC_OPTIONS,
  STAGE_4_SQUAT_MOB_OPTIONS,
  STAGE_4_SHOULDER_MOB_OPTIONS,
  STAGE_4_ASYMMETRY_OPTIONS,
} from "@/lib/schemas/assessment";
import { OptionCardSingle } from "../controls/OptionCardSingle";
import { QuestionHeader } from "../controls/FormFields";

export const Stage4View: React.FC = () => {
  const { data, setFieldValue, errors } = useAssessment();

  return (
    <div className="space-y-7">
      <div className="border-b border-zinc-800 pb-3">
        <h3 className="text-lg font-bold text-sky-400">🦵 STAGE 4 — Movement Mechanics & Mobility</h3>
        <p className="text-xs text-zinc-400 mt-0.5">
          Identifying technical leaks, range of motion, and asymmetries.
        </p>
      </div>

      {/* 1. Eccentric Control */}
      <div>
        <QuestionHeader
          number="1"
          title="Eccentric (Lowering) Control"
          badge="single"
          error={errors.s4_eccentric}
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {STAGE_4_ECCENTRIC_OPTIONS.map((opt) => (
            <OptionCardSingle
              key={opt}
              label={opt}
              value={opt}
              selectedValue={data.s4_eccentric}
              onSelect={(val) => setFieldValue("s4_eccentric", val as typeof STAGE_4_ECCENTRIC_OPTIONS[number])}
            />
          ))}
        </div>
      </div>

      {/* 2. Deep Squat Mobility */}
      <div>
        <QuestionHeader
          number="2"
          title="Deep Squat Mobility (Third-world / Asian squat flat-heeled)"
          badge="single"
          error={errors.s4_squat_mob}
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {STAGE_4_SQUAT_MOB_OPTIONS.map((opt) => (
            <OptionCardSingle
              key={opt}
              label={opt}
              value={opt}
              selectedValue={data.s4_squat_mob}
              onSelect={(val) => setFieldValue("s4_squat_mob", val as typeof STAGE_4_SQUAT_MOB_OPTIONS[number])}
            />
          ))}
        </div>
      </div>

      {/* 3. Shoulder Mobility */}
      <div>
        <QuestionHeader
          number="3"
          title="Scapular & Shoulder Range of Motion"
          badge="single"
          error={errors.s4_shoulder_mob}
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {STAGE_4_SHOULDER_MOB_OPTIONS.map((opt) => (
            <OptionCardSingle
              key={opt}
              label={opt}
              value={opt}
              selectedValue={data.s4_shoulder_mob}
              onSelect={(val) => setFieldValue("s4_shoulder_mob", val as typeof STAGE_4_SHOULDER_MOB_OPTIONS[number])}
            />
          ))}
        </div>
      </div>

      {/* 4. Asymmetry */}
      <div>
        <QuestionHeader
          number="4"
          title="Visible Left vs Right Strength Asymmetry"
          badge="single"
          error={errors.s4_asymmetry}
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {STAGE_4_ASYMMETRY_OPTIONS.map((opt) => (
            <OptionCardSingle
              key={opt}
              label={opt}
              value={opt}
              selectedValue={data.s4_asymmetry}
              onSelect={(val) => setFieldValue("s4_asymmetry", val as typeof STAGE_4_ASYMMETRY_OPTIONS[number])}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Stage4View;
