# Athletic Diagnostic System (ADS)

> **Deterministic Biomechanical Evaluation & 6-Week Periodized Calisthenics & Running Programmer**  
> *100% Client-Side • Air-Gapped (`output: 'export'`) • Zero Remote Telemetry • Zero AI Hallucinations*

---

## ⚡ Overview

**Athletic Diagnostic System (ADS)** is a sports-science evaluation engine designed to assess biomechanical baselines, analyze push-to-pull structural balances, identify injury contraindications, and synthesize an adaptive, 6-week periodized calisthenics and running protocol.

Unlike modern AI-based fitness apps that hallucinate generic routines, ADS runs on a **pure mathematical and sports-science engine** written in deterministic TypeScript. Everything computes locally in browser memory and `localStorage` with zero external dependencies, zero backend servers, and a strict Content Security Policy (`connect-src 'none'`).

---

## ✨ Key Features

### 1. 11-Stage Comprehensive Biomechanical Assessment
- **Stage 1 — Baselines & Pain Screen:** Push-ups, pull-ups, squats, plank, 1.5-mile run time, acute pain screening.
- **Stage 2 — Push-Up Mechanics & Variations:** Form depth, cadence, diamond, archer, pseudo-planche variations.
- **Stage 3 — Pull-Up Mechanics & Variations:** Dead-hang endurance, chin-ups, L-sits, muscle-up prerequisites.
- **Stage 4 — Squats & Mobility Screen:** Ankle dorsiflexion, deep squat mobility, shoulder overhead flexion, bilateral asymmetries.
- **Stage 5 — Running & Impact Mechanics:** Foot strike, weekly mileage, running surfaces, shin splint screening.
- **Stage 6 — Nutrition & Protein Intake:** Daily protein targets, meal cadence, hydration.
- **Stage 7 — Sleep & Recovery:** Circadian regularity, sleep duration, subjective recovery index.
- **Stage 8 — Time Budget & Scheduling:** Session length limits, weekly training frequency.
- **Stage 9 — Equipment & Environment:** Pull-up bar, dip bars, rings, resistance bands, parallettes.
- **Stage 10 — Primary Focus & Skill Goals:** Hypertrophy, calisthenics skills (Front Lever, Muscle-Up, Planche), endurance.
- **Stage 11 — Sustainability & Diagnostics:** Long-term frequency adherence, rest day acceptance, and automated program synthesis.

### 2. Deterministic Sports-Science Engine
- **Push:Pull Ratio Balancing:** Automatically detects postural and structural imbalances (e.g., upper-cross syndrome risk) and clamps zero-division edge cases.
- **Prilepin Volume Sets:** Calculates volume-optimal rep brackets based on maximal repetitions and fatigue thresholds.
- **Injury Contraindication Matrix:** Dynamically audits exercise pools against acute pain markers (e.g., excludes dips on shoulder pain; substitutes high-impact running with low-impact intervals on joint pain).
- **Work Capacity Index:** Combines isometric endurance, anaerobic thresholds, and aerobic stamina into a single objective fitness metric.
- **6-Week Periodized Schedule:** Generates undulating calisthenics splits and cardiovascular progressions aligned with the user's specific time budget and sustainable training frequency.

### 3. Next-Gen Biomechanical 3D & Sensory Experience
- **Interactive 3D WebGL Avatar (`BiomechanicalAvatar3D`):** Real-time Three.js articulated kinesiology wireframe with biotensegrity struts, joint node raycasting, and dynamic motor-unit highlighting aligned with active stages and user pain markers.
- **Continuous Telemetry Scroll Stream (`TelemetryScrollView`):** Fluid dual-experience mode enabling users to switch between the stage-by-stage Guided Wizard HUD and a panoramic, continuous vertical scroll experience with a sticky 3D avatar companion and kinetic depth indicators.
- **Biomechanical Radar Hexagon (`BiomechanicalRadarChart`):** Real-time 6-axis athletic equilibrium diagram (Push Power, Pull Capacity, Core Isometric, Squat Power, Aerobic VO2, Kinetic Mobility).
- **Interactive Exercise Cues & Rest Timer (`ExerciseDetailModal`):** Clickable exercise library modal featuring biomechanical execution checkpoints, agonist/stabilizer muscle recruitment tags, and built-in procedural audio rest interval countdown.
- **Air-Gapped Web Audio Synthesizer (`soundEffects`):** 100% procedural Web Audio synthesizer providing tactile mechanical clicks and frequency feedback without loading external audio assets.
- **`DotField` & `SpotlightCard`:** Ambient interactive canvas particle background with proximity glow and GPU-accelerated cursor spotlight.
- **`DecryptedText` & `ShinyText`:** Terminal-style scrambling animations and metallic sheen highlights.

### 4. Zero-Cost, Air-Gapped Export Pipeline
- **Markdown Diagnostic Summary:** Instant export containing full baseline evaluations, contraindicated exercise lists, and 6-week schedules (complete parity with the original `abs.html`).
- **RFC 5545 iCalendar (`.ics`):** Client-side calendar file generation with proper `UID`, `DTSTAMP`, and recurring workout schedules, downloaded via native browser `Blob`.
- **Clipboard One-Click Copy:** Seamless clipboard sharing with fallback handling for restricted iframe/permission contexts.
- **Hard Privacy Purge (`clearData()`):** Dedicated purge control that scrubs all assessment data and drafts from `localStorage` on demand.

---

## 🔒 Security & Privacy Model

ADS is engineered from the ground up for zero data leakage:
- **No Remote Endpoints:** No analytics, error trackers (Sentry/LogRocket), Google Fonts, or AI/LLM SDKs.
- **Strict Content Security Policy (CSP):** Production static export enforces `<meta http-equiv="Content-Security-Policy" content="connect-src 'none';">`. Outbound network requests are blocked at the browser engine level.
- **Static Export:** Builds into pure HTML, CSS, and JS (`output: 'export'`) that can be hosted on GitHub Pages, Cloudflare Pages, S3, or run offline locally.

---

## 🛠 Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | Next.js 16 (App Router, Turbopack, Static Export) |
| **Language** | TypeScript 5 (Strict Mode) |
| **UI Library** | React 19 |
| **Styling** | Tailwind CSS 3.4 & PostCSS |
| **Animation** | Framer Motion 12 |
| **State Management** | Zustand 5 (with hydration guard) |
| **Schema Validation** | Zod 3 |
| **Icons** | Lucide React |

---

## 📂 Project Structure

```
├── app/
│   ├── globals.css              # Cyberpunk dark theme & custom animations
│   ├── layout.tsx               # Root layout & air-gapped CSP configuration
│   └── page.tsx                 # Entry client page with hydration mount guard
├── components/
│   ├── diagnostic/              # Diagnostic Bento Grid & analytics cards
│   │   ├── DiagnosticBentoGrid.tsx
│   │   ├── InjuryMatrixCard.tsx
│   │   ├── PeriodizedProgramCard.tsx
│   │   ├── PushPullGaugeCard.tsx
│   │   └── WorkCapacityCard.tsx
│   ├── react-bits/              # High-performance animation components
│   │   ├── DecryptedText.tsx
│   │   ├── DotField.tsx
│   │   ├── ShinyText.tsx
│   │   └── SpotlightCard.tsx
│   └── wizard/                  # 11-Stage Assessment Wizard
│       ├── WizardHUD.tsx
│       ├── WizardShell.tsx
│       ├── controls/            # Reusable single/multi select cards & inputs
│       └── stages/              # Stages 1 through 11 view components
├── lib/
│   ├── engine/                  # Deterministic sports-science calculations
│   │   ├── analytics.ts         # Push:Pull ratio, Work capacity, Injury analysis
│   │   └── programGenerator.ts  # 6-week periodized program synthesis
│   ├── export/                  # Air-gapped client exports
│   │   ├── ical.ts              # RFC 5545 .ics generator & Blob downloader
│   │   └── markdown.ts          # Parity Markdown report exporter
│   ├── schemas/                 # Zod validation schemas & question options
│   └── store/                   # Zustand assessment store with localStorage persistence
├── next.config.ts               # Static export configuration & import optimizations
├── tailwind.config.ts           # Custom Tailwind theme & color palettes
└── tsconfig.json                # Strict TypeScript configuration
```

---

---
### Observability
[athlete-diagnostic-report.vercel.app](https://athlete-diagnostic-report.vercel.app/)

## 📄 License

MIT License. Free to use, adapt, and build upon.
