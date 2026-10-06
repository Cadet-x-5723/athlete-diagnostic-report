import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  AssessmentData,
  stageSchemas,
} from "../schemas/assessment";

export type AssessmentFieldKey = keyof AssessmentData;

export interface AssessmentStoreState {
  currentStage: number;
  direction: 1 | -1;
  data: Partial<AssessmentData>;
  isCompleted: boolean;
  errors: Record<string, string>;

  // Actions
  setFieldValue: <K extends AssessmentFieldKey>(
    field: K,
    value: AssessmentData[K]
  ) => void;
  toggleMultiSelect: (
    field: AssessmentFieldKey,
    option: string,
    exclusiveOption?: string
  ) => void;
  nextStage: () => boolean;
  prevStage: () => void;
  goToStage: (targetStage: number) => void;
  validateStage: (stageNum?: number) => boolean;
  clearErrors: () => void;
  resetForm: () => void;
  clearData: () => void;
  setCompleted: (completed: boolean) => void;
}

const INITIAL_DATA: Partial<AssessmentData> = {
  s1_pain: [],
  s1_goal: [],
  s2_pushup_vars: [],
  s5_surface: [],
  s6_proteins: [],
  s9_equipment: [],
  s10_focus_muscles: [],
  s10_skills: [],
};

export const useAssessment = create<AssessmentStoreState>()(
  persist(
    (set, get) => ({
      currentStage: 1,
      direction: 1,
      data: INITIAL_DATA,
      isCompleted: false,
      errors: {},

      setFieldValue: (field, value) => {
        set((state) => {
          const nextData = { ...state.data, [field]: value };
          // Clear field error if it exists
          const nextErrors = { ...state.errors };
          delete nextErrors[field as string];

          return {
            data: nextData,
            errors: nextErrors,
          };
        });
      },

      toggleMultiSelect: (field, option, exclusiveOption) => {
        set((state) => {
          const currentArray = (state.data[field] as string[] | undefined) || [];
          let updatedArray: string[];

          if (exclusiveOption && option === exclusiveOption) {
            // Selecting the exclusive option clears all other selections
            updatedArray = currentArray.includes(option) ? [] : [option];
          } else {
            // If selecting a regular option, remove any active exclusive option
            const cleaned = exclusiveOption
              ? currentArray.filter((item) => item !== exclusiveOption)
              : currentArray;

            if (cleaned.includes(option)) {
              updatedArray = cleaned.filter((item) => item !== option);
            } else {
              updatedArray = [...cleaned, option];
            }
          }

          const nextData = { ...state.data, [field]: updatedArray };
          const nextErrors = { ...state.errors };
          delete nextErrors[field as string];

          return {
            data: nextData,
            errors: nextErrors,
          };
        });
      },

      validateStage: (stageNum) => {
        const stage = stageNum ?? get().currentStage;
        const schema = stageSchemas[stage as keyof typeof stageSchemas];
        if (!schema) return true;

        const result = schema.safeParse(get().data);
        if (result.success) {
          set({ errors: {} });
          return true;
        }

        const fieldErrors: Record<string, string> = {};
        for (const issue of result.error.issues) {
          const fieldPath = issue.path[0];
          if (fieldPath && typeof fieldPath === "string") {
            fieldErrors[fieldPath] = issue.message;
          }
        }

        set({ errors: fieldErrors });
        return false;
      },

      clearErrors: () => set({ errors: {} }),

      nextStage: () => {
        const isValid = get().validateStage();
        if (!isValid) return false;

        const current = get().currentStage;
        if (current < 11) {
          set({
            direction: 1,
            currentStage: current + 1,
            errors: {},
          });
          return true;
        } else if (current === 11) {
          set({ isCompleted: true });
          return true;
        }
        return false;
      },

      prevStage: () => {
        const current = get().currentStage;
        if (current > 1) {
          set({
            direction: -1,
            currentStage: current - 1,
            errors: {},
          });
        }
      },

      goToStage: (targetStage) => {
        const current = get().currentStage;
        if (targetStage < 1 || targetStage > 11 || targetStage === current) return;

        set({
          direction: targetStage > current ? 1 : -1,
          currentStage: targetStage,
          errors: {},
        });
      },

      resetForm: () => {
        get().clearData();
      },

      clearData: () => {
        set({
          currentStage: 1,
          direction: 1,
          data: INITIAL_DATA,
          isCompleted: false,
          errors: {},
        });
        if (typeof window !== "undefined") {
          localStorage.removeItem("athlete_diagnostic_draft");
          localStorage.clear();
        }
      },

      setCompleted: (completed) => set({ isCompleted: completed }),
    }),
    {
      name: "athlete_diagnostic_draft",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        currentStage: state.currentStage,
        data: state.data,
        isCompleted: state.isCompleted,
      }),
    }
  )
);
