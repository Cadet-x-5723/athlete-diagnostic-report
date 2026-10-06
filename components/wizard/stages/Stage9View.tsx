"use client";

import React from "react";
import { useAssessment } from "@/lib/store/useAssessment";
import {
  STAGE_9_EQUIPMENT_OPTIONS,
  STAGE_9_LOCATION_OPTIONS,
} from "@/lib/schemas/assessment";
import { OptionCardSingle } from "../controls/OptionCardSingle";
import { OptionCardMulti } from "../controls/OptionCardMulti";
import { QuestionHeader } from "../controls/FormFields";

export const Stage9View: React.FC = () => {
  const { data, setFieldValue, toggleMultiSelect, errors } = useAssessment();

  return (
    <div className="space-y-7">
      <div className="border-b border-zinc-800 pb-3">
        <h3 className="text-lg font-bold text-sky-400">🏠 STAGE 9 — Equipment & Training Environment</h3>
        <p className="text-xs text-zinc-400 mt-0.5">
          Zero assumptions: strictly what you have access to right now.
        </p>
      </div>

      {/* 1. Equipment Access */}
      <div>
        <QuestionHeader
          number="1"
          title="Equipment You Have Direct Access To"
          badge="multi"
          error={errors.s9_equipment}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {STAGE_9_EQUIPMENT_OPTIONS.map((opt) => (
            <OptionCardMulti
              key={opt}
              label={opt}
              value={opt}
              selectedValues={data.s9_equipment}
              onToggle={(val) => toggleMultiSelect("s9_equipment", val, "No equipment (Floor only)")}
            />
          ))}
        </div>
      </div>

      {/* 2. Primary Location */}
      <div>
        <QuestionHeader
          number="2"
          title="Primary Training Location"
          badge="single"
          error={errors.s9_location}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {STAGE_9_LOCATION_OPTIONS.map((opt) => (
            <OptionCardSingle
              key={opt}
              label={opt}
              value={opt}
              selectedValue={data.s9_location}
              onSelect={(val) => setFieldValue("s9_location", val as typeof STAGE_9_LOCATION_OPTIONS[number])}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Stage9View;
