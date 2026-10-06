"use client";

import React from "react";
import { ShinyText } from "@/components/react-bits";
import { AlertCircle } from "lucide-react";

export interface QuestionHeaderProps {
  number?: string | number;
  title: string;
  badge?: "single" | "multi" | "required" | "optional";
  error?: string;
}

export const QuestionHeader: React.FC<QuestionHeaderProps> = ({
  number,
  title,
  badge,
  error,
}) => {
  return (
    <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        {number && (
          <span className="flex h-5 w-5 items-center justify-center rounded-lg bg-zinc-800/80 border border-white/[0.06] font-mono text-[10px] font-bold text-zinc-300">
            {number}
          </span>
        )}
        <label className="text-sm font-semibold tracking-wide text-zinc-100">
          {title}
        </label>
      </div>

      <div className="flex items-center gap-2">
        {badge === "single" && (
          <span className="rounded-md border border-cyan-500/20 bg-cyan-950/30 px-2 py-0.5 font-mono text-[10px] font-semibold text-cyan-300">
            Single Select
          </span>
        )}
        {badge === "multi" && (
          <span className="rounded-md border border-emerald-500/20 bg-emerald-950/30 px-2 py-0.5 font-mono text-[10px] font-semibold text-emerald-300">
            <ShinyText text="Multi-Select" speed={2.5} />
          </span>
        )}
        {error && (
          <span className="flex items-center gap-1 text-[11px] font-medium text-rose-400 animate-pulse">
            <AlertCircle className="h-3 w-3" />
            {error}
          </span>
        )}
      </div>
    </div>
  );
};

export interface FormInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const FormInput: React.FC<FormInputProps> = ({
  className = "",
  error,
  ...props
}) => {
  return (
    <div>
      <input
        className={`w-full rounded-xl border bg-black/50 px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 outline-none transition-all duration-150 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/40 ${
          error ? "border-rose-500/70 ring-1 ring-rose-500/30" : "border-white/[0.08]"
        } ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-rose-400">{error}</p>}
    </div>
  );
};

export interface FormSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
}

export const FormSelect: React.FC<FormSelectProps> = ({
  children,
  className = "",
  error,
  ...props
}) => {
  return (
    <div>
      <select
        className={`w-full rounded-xl border bg-[#0d0f17] px-3.5 py-2.5 text-sm text-zinc-100 outline-none transition-all duration-150 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/40 ${
          error ? "border-rose-500/70 ring-1 ring-rose-500/30" : "border-white/[0.08]"
        } ${className}`}
        {...props}
      >
        {children}
      </select>
      {error && <p className="mt-1 text-xs text-rose-400">{error}</p>}
    </div>
  );
};

export interface FormTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

export const FormTextarea: React.FC<FormTextareaProps> = ({
  className = "",
  error,
  ...props
}) => {
  return (
    <div>
      <textarea
        className={`w-full rounded-xl border bg-black/50 px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 outline-none transition-all duration-150 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/40 ${
          error ? "border-rose-500/70 ring-1 ring-rose-500/30" : "border-white/[0.08]"
        } ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-rose-400">{error}</p>}
    </div>
  );
};

export default FormInput;
