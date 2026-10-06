"use client";

import React, { useEffect, useState } from "react";
import { WizardShell } from "@/components/wizard/WizardShell";

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-[#07080a]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative flex h-10 w-10 items-center justify-center">
            <div className="absolute inset-0 animate-ping rounded-full bg-cyan-500/20" />
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
          </div>
          <div className="flex flex-col items-center gap-1 text-center">
            <span className="font-mono text-xs font-bold tracking-widest text-cyan-300 uppercase">
              INITIALIZING ADS KINESIOLOGY ENGINE
            </span>
            <span className="font-mono text-[10px] text-zinc-500">
              100% Deterministic • Air-Gapped Biomechanics
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="w-full">
      <WizardShell />
    </main>
  );
}
