# VS Code Copilot Agent — Remotion Video Generation Instructions

## HOW TO TRIGGER VIDEO GENERATION

```
COMMAND FORMAT — accepted inputs:

  Single day:   "Generate Day 28 from AI series"
  Range:        "Generate Days 28 through 31 from AI series"
  List:         "Generate Days 28, 30, 32 from AI series"
  Java:         "Generate Day 5 from Java series"
  HiddenWorld:  "Generate Day 12 from HiddenWorld series"

After receiving ANY of these commands:
  1. Do NOT ask any question
  2. Do NOT ask for confirmation
  3. Follow PART 17 (autonomy rules) immediately
  4. Follow PART 18 (chunk execution map) for every file
  5. For multi-day: follow PART 19 (batch protocol) for sequencing
  6. Complete ALL days in the command without stopping
```

**The agent's ONLY valid response to a generation command is to start executing.**
No clarifying questions. No "just to confirm" messages. No "before I begin" checks with the user.
All ambiguity is resolved using the AMBIGUITY TABLE in PART 17.

---

---

## PART 1 — PROJECT FUNDAMENTALS

| Property | Value |
|---|---|
| Canvas | 1080 × 1920 px portrait |
| FPS | 30 |
| Background | `#1D1D1C` dark (Claude-style) + white grid — **every single scene, zero exceptions** |
| Font | **`'Galaxie Copernicus ExtraBold', Georgia, serif`** — every text element, every scene |
| Audio file location | Must be in `public/audio/` for `staticFile()` to work |
| Audio start (composition frame) | Frame **150** — after the silent scroll animation |
| Scene 01 always | `Scene01_ScrollTimeline` — 150 frames, **SILENT**, no audio |
| Last scene always | `Scene{LAST}_Outro` — 362 frames, shows next day topic |
| Captions | **SVG `<text>`**, `y=1860 (BOTTOM)`, center anchor, **white fill, Galaxie Copernicus ExtraBold** |

### Series auto-detection — accent color is set automatically by series name

| Series | Accent Color | Accent RGB | Scroll Title |
|---|---|---|---|
| Java / National Railway | `#D87656` | `rgba(216,118,86,…)` | `"NATIONAL RAILWAY · JAVA"` |
| Agentic AI | `#76ABAE` | `rgba(118,171,174,…)` | `"AGENTIC AI · FIRST PRINCIPLES"` |
| System Design | `#948979` | `rgba(148,137,121,…)` | `"SYSTEM DESIGN · FOUNDATIONS"` |
| DSA | `#93B1A6` | `rgba(147,177,166,…)` | `"DATA STRUCTURES & ALGORITHMS"` |
| Mystery / HiddenWorld | `#F7374F` | `rgba(247,55,79,…)` | `"MYSTERY RESOLVED · DAILY FACTS"` |

### Critical Remotion Rules (read before writing any code)

```
✅ ALL animations MUST use useCurrentFrame() + interpolate() or spring()
✅ <Audio> and <Sequence> imported from 'remotion'
✅ <Img> from 'remotion' for any images (not native <img>)
✅ staticFile() only works for files inside public/ folder
✅ useCurrentFrame() inside a <Sequence> returns LOCAL frame (0-based)
✅ Always add premountFor={30} to every <Sequence>
✅ CSS transitions / CSS animations → FORBIDDEN (won't render)
✅ Tailwind animation classes → FORBIDDEN (won't render)
✅ Third-party animation libraries → FORBIDDEN (flickering)
```

---

## PART 2 — SERIES ARCHITECTURE MAP

### Before writing a single file, run these checks:

**Step A — Identify series, read architecture, and set accent color:**
```
Agentic AI series    → src/Instructions/architecture_AI.md    | SERIES_ACCENT = '#76ABAE'
Java series          → src/Instructions/architecture_java.md  | SERIES_ACCENT = '#D87656'
System Design series → src/Instructions/architecture_SD.md    | SERIES_ACCENT = '#948979'
DSA series           → src/Instructions/architecture_DSA.md   | SERIES_ACCENT = '#93B1A6'
HiddenWorld/Mystery  → src/Instructions/architecture.md       | SERIES_ACCENT = '#F7374F'
```
Read Day N entry for: topic, module context.
Read Day N+1 entry for: next day topic (needed in Outro).
Set SERIES_ACCENT and ACCENT_R/G/B in timing.ts before writing any code.

**Step B — Find and stage the audio file:**
```
AI series audio lookup order:
  1. src/Instructions/audio/ai{N}.wav   ← check this first
  2. public/audio/ai{N}.wav             ← or this

IF file is only in src/Instructions/audio/:
  → Copy it to public/audio/ before generating
  → Command: cp "src/Instructions/audio/ai{N}.wav" "public/audio/ai{N}.wav"

THEN reference as: staticFile('audio/ai{N}.wav')
   (staticFile resolves to public/ — never to src/)

Java audio:     src/Instructions/audio/java{N}.wav  → public/audio/java{N}.wav
HiddenWorld:    public/audio/day{N}_voiceover.wav  (already in public/)
```

**Step C — Find and read the CSV transcript:**
```
AI series:      src/Instructions/ai{N}_word_by_word_transcript.csv
Java series:    src/Instructions/java{N}_word_by_word_transcript.csv
HiddenWorld:    public/day_{N}_transcript.csv

CSV columns: Word Index | Word | Start Time (s) | End Time (s) | Duration (s) | ...
audio_duration_seconds = last row's "End Time (s)" value
audio_frames = Math.ceil(audio_duration_seconds * 30)
```

---

## PART 3 — FOLDER STRUCTURE TO CREATE

```
src/Day{N}/
├── Scene.tsx                           ← orchestrator
├── helpers/
│   ├── timing.ts                       ← SCENE_TIMING, COLORS, CAPTIONS, helpers
│   └── components.tsx                  ← PaperBackground, Caption, shared SVGs
└── frames/
    ├── Scene01_ScrollTimeline.tsx      ← ALWAYS FIRST — silent, 150 frames
    ├── Scene02_{PhraseName}.tsx        ← first audio-synced content scene
    ├── Scene03_{PhraseName}.tsx
    ├── ...
    ├── Scene{N-1}_KeyTakeaway.tsx      ← 120 frames
    └── Scene{N}_Outro.tsx              ← 362 frames, next day preview
```

---

## PART 4 — FRAME MATH (commit this to memory)

```typescript
const SCROLL_FRAMES  = 150;   // Scene01: silent scroll, no audio
const TAKEAWAY_GAP   = 30;    // 1s gap between last content scene and takeaway
const TAKEAWAY_DUR   = 120;   // Scene{LAST-1}: key takeaway
const OUTRO_DUR      = 362;   // Scene{LAST}: outro + next day

// Given: audio_duration_seconds from CSV last row End Time
const AUDIO_FRAMES   = Math.ceil(audio_duration_seconds * 30);
const AUDIO_END      = SCROLL_FRAMES + AUDIO_FRAMES;           // last audio frame
const TAKEAWAY_FROM  = AUDIO_END + TAKEAWAY_GAP;               // takeaway starts
const OUTRO_FROM     = TAKEAWAY_FROM + TAKEAWAY_DUR;           // outro starts
const TOTAL_FRAMES   = OUTRO_FROM + OUTRO_DUR;                 // composition total

// Content scene frame offset:
// CSV gives timestamps in seconds from audio start (0s)
// In composition: audio starts at frame 150
// Therefore:
scene_from = SCROLL_FRAMES + Math.round(csv_start_seconds * 30);
scene_duration = Math.max(60, Math.round((csv_end_seconds - csv_start_seconds) * 30) + 18);
//                                                                                       ↑ 18-frame buffer
```

**Concrete example** (Day 27, audio = 79.02s):
```
AUDIO_FRAMES  = ceil(79.02 * 30) = 2371
AUDIO_END     = 150 + 2371 = 2521
TAKEAWAY_FROM = 2521 + 30  = 2551
OUTRO_FROM    = 2551 + 120 = 2671
TOTAL_FRAMES  = 2671 + 362 = 3033
```

---

## PART 5 — timing.ts EXACT TEMPLATE

```typescript
/**
 * Day {N} — "{Topic from architecture file}"
 * Series: {AI | Java | HiddenWorld}
 * Audio file: public/audio/{filename}
 * Audio duration: {X.XXX}s → {AUDIO_FRAMES} frames @ 30fps
 * Total composition: {TOTAL_FRAMES} frames
 */

import { Easing } from 'remotion';

export const FPS = 30;

// ── Series accent — SET BASED ON SERIES (see PART 15 for full table) ─────────
// Java: '#D87656' | AI: '#76ABAE' | SysDesign: '#948979' | DSA: '#93B1A6' | Mystery: '#F7374F'
const SERIES_ACCENT = '#76ABAE';                      // ← REPLACE with correct series accent
const ACCENT_R = 118, ACCENT_G = 171, ACCENT_B = 174; // ← REPLACE RGB values to match accent

// ── Color palette ── use ONLY these, never raw hex codes outside this object ──
export const COLORS = {
  // Backgrounds
  bg_primary:     '#1D1D1C',   // THE ONLY background — EVERY scene, zero exceptions
  bg_secondary:   '#2C2C2B',   // bento card / tile background
  bg_card:        '#2C2C2B',   // alias for bg_secondary

  // Text (light on dark)
  white:          '#FFFFFF',   // primary text on dark background
  text_primary:   '#FFFFFF',   // body/heading text
  text_muted:     'rgba(255,255,255,0.55)', // secondary/muted labels
  text_caption:   '#FFFFFF',   // subtitle at BOTTOM (white on dark)
  text_highlight: SERIES_ACCENT,            // key-word highlight in captions

  // Grid
  grid_line:      'rgba(255,255,255,0.5)',  // grid on dark bg (50% white)

  // Series accent
  accent:         SERIES_ACCENT,            // primary accent (series-specific)
  accent_dim:     `rgba(${ACCENT_R},${ACCENT_G},${ACCENT_B},0.12)`, // 12% fill
  accent_mid:     `rgba(${ACCENT_R},${ACCENT_G},${ACCENT_B},0.30)`, // 30% border

  // Semantic aliases (for backwards compat references)
  deep_black:     '#1D1D1C',   // maps to bg_primary
  cool_silver:    'rgba(255,255,255,0.55)', // maps to text_muted
  vibrant_red:    '#F7374F',   // error/danger
} as const;

// ── Frame constants ──────────────────────────────────────────────────────────
const SCROLL_FRAMES = 150;

// ── Scene timing ─────────────────────────────────────────────────────────────
// ALL 'from' values are COMPOSITION frames (not audio-relative frames)
// Content scenes: from = 150 + Math.round(csv_start_seconds * 30)
export const SCENE_TIMING = {

  // Scene 01 — Scrolling Timeline (SILENT, pre-audio)
  s01: { from: 0,   duration: 150 },

  // Scene 02 — {phrase from script} [{csv_start}s → {csv_end}s]
  s02: { from: SCROLL_FRAMES + Math.round(0.000 * 30), duration: 142 },

  // Scene 03 — {phrase} [{csv_start}s → {csv_end}s]
  s03: { from: SCROLL_FRAMES + Math.round(5.320 * 30), duration: 90  },

  // ↓ Add all content scenes here following the same pattern
  // s04: { from: SCROLL_FRAMES + Math.round(X.XXX * 30), duration: YYY },

  // Scene {LAST-1} — Key Takeaway
  s_takeaway: { from: 2551, duration: 120 },

  // Scene {LAST} — Outro
  s_outro:    { from: 2671, duration: 362 },

} as const;

// ── Captions ──────────────────────────────────────────────────────────────────
// One caption entry per content scene
// 'from' and 'duration' must match the scene's SCENE_TIMING entry
// 'keyWords' = technical terms, numbers, proper nouns to highlight in sky_blue
export const CAPTIONS: Array<{
  text: string;
  keyWords: string[];
  from: number;
  duration: number;
}> = [
  { text: "This is day 27 of Agentic AI.", keyWords: ["27", "Agentic AI"], from: 150, duration: 142 },
  // Add one entry per content scene...
];

// ── Animation helpers ─────────────────────────────────────────────────────────
// Use these in every scene — never write raw interpolate() without extrapolateRight: 'clamp'

export const ease = Easing.bezier(0.22, 1, 0.36, 1);

/** Fade from 0→1 over `dur` frames starting at `start` (local frame) */
export const fadeIn = (frame: number, start: number, dur: number): number =>
  Math.min(1, Math.max(0, (frame - start) / dur));

/** Fade from 1→0 over `dur` frames starting at `start` (local frame) */
export const fadeOut = (frame: number, start: number, dur: number): number =>
  1 - Math.min(1, Math.max(0, (frame - start) / dur));

/** Ease-snap curve (cubic ease-in-out) */
export const easeSnap = (t: number): number =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

/** Eased fade-in 0→1 */
export const snapIn = (frame: number, start: number, dur: number): number =>
  easeSnap(Math.min(1, Math.max(0, (frame - start) / dur)));

/** Linear interpolation */
export const lerp = (a: number, b: number, t: number): number =>
  a + (b - a) * Math.max(0, Math.min(1, t));
```

---

## PART 6 — components.tsx EXACT TEMPLATE

```tsx
/**
 * Shared components for Day {N}
 * RULE: DarkBackground must be the first child of every SVG in EVERY scene.
 * FONT: 'Galaxie Copernicus ExtraBold', Georgia, serif — used on ALL text elements.
 */
import React from 'react';
import { useCurrentFrame } from 'remotion';
import { COLORS } from './timing';

const FONT = "'Galaxie Copernicus ExtraBold', Georgia, serif";

// ── Dark background with grid — USE IN EVERY SINGLE SCENE ─────────────────────
// Always the FIRST element inside <svg>
// Grid: 80px cells, white lines at 50% opacity
export const DarkBackground: React.FC = () => (
  <g>
    {/* Primary dark base */}
    <rect width={1080} height={1920} fill={COLORS.bg_primary} />
    {/* Horizontal grid lines (every 80px) */}
    {Array.from({ length: Math.ceil(1920 / 80) + 1 }, (_, i) => (
      <line
        key={`h${i}`}
        x1={0} y1={i * 80}
        x2={1080} y2={i * 80}
        stroke={COLORS.grid_line}
        strokeWidth={1}
      />
    ))}
    {/* Vertical grid lines (every 80px) */}
    {Array.from({ length: Math.ceil(1080 / 80) + 1 }, (_, i) => (
      <line
        key={`v${i}`}
        x1={i * 80} y1={0}
        x2={i * 80} y2={1920}
        stroke={COLORS.grid_line}
        strokeWidth={1}
      />
    ))}
  </g>
);

// Keep PaperBackground as alias → DarkBackground (prevents TS errors in old code)
export const PaperBackground = DarkBackground;

// ── SVG defs (call once per scene) ────────────────────────────────────────────
export const GlobalDefs: React.FC = () => (
  <defs>
    <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L0,6 L8,3 z" fill={COLORS.accent} />
    </marker>
  </defs>
);

// ── Caption — FIXED POSITION AT BOTTOM, NO BACKGROUND ─────────────────────────
// ALWAYS at BOTTOM of canvas: x=540, y=1860 (single line) or y=1836/y=1884 (two lines)
// White text, Galaxie Copernicus ExtraBold, NO rect/border behind it
interface CaptionProps {
  text: string;
  keyWords?: string[];
  frame: number;
  sceneFrom: number;
  sceneDuration: number;
}

export const Caption: React.FC<CaptionProps> = ({
  text, keyWords = [], frame, sceneFrom, sceneDuration,
}) => {
  const localFrame = frame - sceneFrom;
  const opacity =
    Math.min(1, localFrame / 8) *
    Math.min(1, (sceneDuration - localFrame) / 8);

  const words = text.split(' ');
  const lowerKeys = keyWords.map(k => k.toLowerCase());

  // Wrap at 48 chars per line
  const lines: string[][] = [];
  let currentLine: string[] = [];
  let lineLength = 0;

  words.forEach(word => {
    if (lineLength + word.length + 1 > 48 && currentLine.length > 0) {
      lines.push(currentLine);
      currentLine = [word];
      lineLength = word.length;
    } else {
      currentLine.push(word);
      lineLength += word.length + 1;
    }
  });
  if (currentLine.length > 0) lines.push(currentLine);

  // BOTTOM positioning: single line y=1860, two lines y=1836 + y=1884
  const baseY = lines.length === 1 ? 1860 : 1836;
  const lineGap = 48;

  return (
    <g opacity={opacity}>
      {lines.map((lineWords, lineIdx) => (
        <text
          key={lineIdx}
          x={540}
          y={baseY + lineIdx * lineGap}
          textAnchor="middle"
          fontFamily={FONT}
          fontSize={44}
          fontWeight={800}
          fill={COLORS.text_caption}  /* #FFFFFF — white on dark background */
        >
          {lineWords.map((word, i) => {
            const isKey = lowerKeys.some(k =>
              word.toLowerCase().replace(/[.,!?]/g, '').includes(k)
            );
            return (
              /* Normal words: #FFFFFF white  |  Key words: series accent  |  NEVER dark */
              <tspan key={i} fill={isKey ? COLORS.text_highlight : COLORS.text_caption}>
                {word}{i < lineWords.length - 1 ? ' ' : ''}
              </tspan>
            );
          })}
        </text>
      ))}
    </g>
  );
};

// ── Bento card — standard tile for content ────────────────────────────────────
// x, y: top-left corner; w, h: dimensions
// accent: if true, draws accent-colored border; default uses subtle white border
interface BentoCardProps {
  x: number; y: number; w: number; h: number;
  accent?: boolean; rx?: number; opacity?: number;
}
export const BentoCard: React.FC<BentoCardProps> = ({
  x, y, w, h, accent = false, rx = 20, opacity = 1,
}) => (
  <rect
    x={x} y={y} width={w} height={h} rx={rx}
    fill={COLORS.bg_secondary}
    stroke={accent ? COLORS.accent : 'rgba(255,255,255,0.1)'}
    strokeWidth={accent ? 2 : 1}
    opacity={opacity}
  />
);

// ── Corner accent decoration ───────────────────────────────────────────────────
export const CornerAccents: React.FC<{ opacity?: number; color?: string }> = ({
  opacity = 0.5, color = COLORS.accent,
}) => (
  <g opacity={opacity}>
    <path d="M 60,60 L 60,140 M 60,60 L 140,60"    fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" />
    <path d="M 1020,60 L 1020,140 M 1020,60 L 940,60"  fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" />
    <path d="M 60,1740 L 60,1660 M 60,1740 L 140,1740"  fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" />
    <path d="M 1020,1740 L 1020,1660 M 1020,1740 L 940,1740" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" />
  </g>
);

// ── Divider line ───────────────────────────────────────────────────────────────
export const Divider: React.FC<{ y: number; opacity?: number }> = ({ y, opacity = 0.2 }) => (
  <line x1={60} y1={y} x2={1020} y2={y} stroke="rgba(255,255,255,0.2)" strokeWidth={1} opacity={opacity} />
);

// ── Section label (Zone A — topic anchor) ─────────────────────────────────────
export const SectionLabel: React.FC<{ text: string; y?: number; opacity?: number }> = ({
  text, y = 160, opacity = 0.7,
}) => (
  <text
    x={60} y={y}
    fontFamily={FONT}
    fontSize={28} fontWeight={800}
    fill={COLORS.accent}
    letterSpacing="0.15em"
    opacity={opacity}
  >
    {text.toUpperCase()}
  </text>
);
```

---

## PART 7 — Scene.tsx EXACT TEMPLATE

```tsx
/**
 * Day {N} — "{Topic}"
 * Series: {AI | Java | HiddenWorld}
 * Total: {TOTAL_FRAMES} frames @ 30fps = ~{seconds}s
 * Audio: public/audio/{filename}
 *
 * SCENE SEQUENCE:
 * Scene01  frames   0–149   ScrollTimeline (SILENT)
 * Scene02  frames 150–...   {phrase}
 * ...
 * Scene{N-1} frames ...–...  KeyTakeaway
 * Scene{N}   frames ...–...  Outro
 */
import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile } from 'remotion';
import { SCENE_TIMING, COLORS } from './helpers/timing';

import { Scene01_ScrollTimeline } from './frames/Scene01_ScrollTimeline';
import { Scene02_... } from './frames/Scene02_...';
// ... all imports

export const Day{N}Scene: React.FC = () => {
  return (
    // AbsoluteFill background must match bg_primary (#1D1D1C) — acts as fallback
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>

      {/*
        Audio starts at composition frame 150 (after silent scroll).
        Wrap in <Sequence from={150}> so it delays by 150 frames.
        useCurrentFrame() inside Audio's volume callback is audio-relative.
      */}
      <Sequence from={150} durationInFrames={Math.ceil({audio_seconds} * 30)}>
        <Audio src={staticFile('audio/ai{N}.wav')} startFrom={0} />
      </Sequence>

      {/* Scene 01 — Scrolling Day Timeline (SILENT, no audio) */}
      <Sequence
        from={SCENE_TIMING.s01.from}
        durationInFrames={SCENE_TIMING.s01.duration}
        premountFor={30}
      >
        <Scene01_ScrollTimeline
          currentDay={N}
          seriesTitle="AGENTIC AI · FIRST PRINCIPLES"
        />
      </Sequence>

      {/* Scene 02 — First content scene */}
      <Sequence
        from={SCENE_TIMING.s02.from}
        durationInFrames={SCENE_TIMING.s02.duration}
        premountFor={30}
      >
        <Scene02_... />
      </Sequence>

      {/* ... all content scenes with premountFor={30} on each */}

      {/* Key Takeaway */}
      <Sequence
        from={SCENE_TIMING.s_takeaway.from}
        durationInFrames={SCENE_TIMING.s_takeaway.duration}
        premountFor={30}
      >
        <Scene{LAST-1}_KeyTakeaway />
      </Sequence>

      {/* Outro */}
      <Sequence
        from={SCENE_TIMING.s_outro.from}
        durationInFrames={SCENE_TIMING.s_outro.duration}
        premountFor={30}
      >
        <Scene{LAST}_Outro
          currentDay={N}
          nextDay={N+1}
          nextTopic="{Day N+1 topic from architecture file}"
          seriesTitle="AGENTIC AI · FIRST PRINCIPLES"
        />
      </Sequence>

    </AbsoluteFill>
  );
};
```

---

## PART 8 — SCENE BOILERPLATE (every content scene follows this)

> **MINIMUM 300 LINES PER SCENE FILE — this is a hard requirement. See PART 20 for detail.**
> Every scene must have ≥ 3 animation phases and spring physics on every major element.
> **FONT: `'Galaxie Copernicus ExtraBold', Georgia, serif` on ALL text — no exceptions.**
> **BACKGROUND: `DarkBackground` (NOT PaperBackground) as first SVG child.**
> **BENTO DESIGN: content in `BentoCard` tiles with `bg_secondary` (#2C2C2B) background.**

```tsx
/**
 * Scene {N} — {Scene Name}
 * "{Exact spoken phrase from CSV}"
 * CSV: {start_time}s → {end_time}s
 * Duration: {frames} frames ({seconds}s)
 *
 * Theme: Dark (#1D1D1C) + grid + series accent ({ACCENT_COLOR})
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–30):   Scene reveal — section label slides in, headline springs up
 *   Phase 2 (frames 20–90):  Core content builds — bento cards staggered 12 frames each
 *   Phase 3 (frames 80–end): Steady-state micro-animations — pulse, float, connector draw
 */
import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
  Easing,
} from 'remotion';
import { COLORS, SCENE_TIMING, CAPTIONS, ease, snapIn } from '../helpers/timing';
import { DarkBackground, GlobalDefs, Caption, SectionLabel, BentoCard } from '../helpers/components';

const FONT = "'Galaxie Copernicus ExtraBold', Georgia, serif";

// ─── Easing presets (use these, do not inline magic numbers) ──────────────────
const SPRING_CONFIG = { damping: 18, stiffness: 180, mass: 0.8 } as const;
const SPRING_SOFT   = { damping: 22, stiffness: 120, mass: 1.0 } as const;
const SPRING_SNAP   = { damping: 12, stiffness: 260, mass: 0.6 } as const;

// ─── Helper: spring-based opacity + translateY entrance ──────────────────────
function useSpringEntrance(frame: number, delayFrames: number, fps = 30) {
  const f = Math.max(0, frame - delayFrames);
  const progress = spring({ frame: f, fps, config: SPRING_CONFIG });
  const opacity  = interpolate(f, [0, 12], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const translateY = interpolate(progress, [0, 1], [32, 0]);
  return { progress, opacity, translateY };
}

// ─── Helper: path-draw animation (strokeDashoffset reveal) ───────────────────
function usePathDraw(frame: number, startFrame: number, totalLength: number, durationFrames = 30) {
  const progress = interpolate(frame, [startFrame, startFrame + durationFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  return totalLength * (1 - progress); // dashoffset value
}

// ─── Helper: animated counter (integer tick-up) ──────────────────────────────
function useCounter(frame: number, startFrame: number, endValue: number, durationFrames = 45) {
  const raw = interpolate(frame, [startFrame, startFrame + durationFrames], [0, endValue], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  return Math.round(raw);
}

export const Scene{N}_{Name}: React.FC = () => {
  const frame = useCurrentFrame();  // LOCAL frame (0-based inside this Sequence)
  const fps   = 30;

  // ── Phase 1: Scene reveal (frames 0–30) ────────────────────────────────────
  const sceneReveal   = spring({ frame, fps, config: SPRING_SOFT });
  const labelEntrance = useSpringEntrance(frame, 0);
  const headlineA     = useSpringEntrance(frame, 6);
  const headlineB     = useSpringEntrance(frame, 12);

  // ── Phase 2: Content build — bento cards (stagger every 12 frames) ────────
  const card1 = useSpringEntrance(frame, 24);
  const card2 = useSpringEntrance(frame, 36);
  const card3 = useSpringEntrance(frame, 48);
  const card4 = useSpringEntrance(frame, 60);

  // ── Path draw (diagram connectors) ────────────────────────────────────────
  const connectorLength = 200;
  const connectorDash   = usePathDraw(frame, 40, connectorLength, 25);

  // ── Phase 3: Micro-animations (steady-state) ──────────────────────────────
  const breathe    = Math.sin(frame * 0.06) * 4;
  const pulse      = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer    = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  // ── Counter animation ──────────────────────────────────────────────────────
  const counterValue = useCounter(frame, 50, 97, 40);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s{N}.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>

        {/* ALWAYS FIRST — dark background with grid */}
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A — Topic anchor label (y=60–200) ────────────────────── */}
        <g transform={`translate(0, ${labelEntrance.translateY})`} opacity={labelEntrance.opacity}>
          <SectionLabel text="MODULE NAME · CONCEPT" y={160} opacity={0.8} />
        </g>

        {/* ── ZONE B — Primary headline (y=220–500) ─────────────────────── */}
        <g transform={`translate(0, ${headlineA.translateY})`} opacity={headlineA.opacity}>
          <text
            x={60} y={320}
            fontFamily={FONT}
            fontSize={96} fontWeight={800}
            fill={COLORS.white}
          >
            Main Headline
          </text>
        </g>
        <g transform={`translate(0, ${headlineB.translateY})`} opacity={headlineB.opacity}>
          <text
            x={60} y={430}
            fontFamily={FONT}
            fontSize={52} fontWeight={800}
            fill={COLORS.accent}
          >
            Supporting sub-line
          </text>
        </g>

        {/* ── ZONE C — Bento content (y=520–1740) ────────────────────────── */}
        {/*
          Use BentoCard tiles (bg_secondary #2C2C2B, rx=20).
          Max 4 primary content elements. Each animated with spring entrance.
          Every scene needs ≥1 thematic SVG illustration.
          NEVER place content below y=1740 (caption zone starts there).
        */}

        {/* Example: full-width bento card with spring entrance */}
        <g opacity={card1.opacity} transform={`translate(0, ${card1.translateY})`}>
          <BentoCard x={60} y={520} w={960} h={200} accent />
          <text x={100} y={638} fontFamily={FONT} fontSize={44} fontWeight={800} fill={COLORS.white}>
            Card One Content
          </text>
        </g>

        {/* Example: two-column bento layout */}
        <g opacity={card2.opacity} transform={`translate(0, ${card2.translateY})`}>
          <BentoCard x={60}  y={744} w={460} h={320} />
          <BentoCard x={560} y={744} w={460} h={320} accent />
          <text x={100} y={920} fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.white}>Left tile</text>
          <text x={600} y={920} fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.accent}>Right tile</text>
        </g>

        {/* Example: SVG path-draw connector */}
        <path
          d="M 540,1090 L 540,1200"
          fill="none"
          stroke={COLORS.accent}
          strokeWidth={3}
          strokeDasharray={connectorLength}
          strokeDashoffset={connectorDash}
          strokeLinecap="round"
        />

        {/* Example: large counter */}
        <g opacity={card3.opacity} transform={`translate(540, ${1300 + card3.translateY})`}>
          <text
            textAnchor="middle"
            fontFamily={FONT} fontSize={160} fontWeight={800}
            fill={COLORS.accent}
          >
            {counterValue}%
          </text>
        </g>

        {/* Example: floating micro-animation */}
        <g transform={`translate(540, ${1580 + breathe})`}>
          <circle cx={0} cy={0} r={48} fill={COLORS.accent} fillOpacity={0.1 * shimmer} />
          <circle cx={0} cy={0} r={48} fill="none" stroke={COLORS.accent} strokeWidth={2}
            transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} />
        </g>

        {/* ── CAPTION — FIXED AT BOTTOM (y=1860), white, Galaxie Copernicus ─ */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s{N}.duration}
          />
        )}

      </svg>
    </AbsoluteFill>
  );
};
```

> **Line-count gate:** After writing each scene file, count lines. If < 300, expand the visual
> content in Zone C — add more diagram elements, additional animation phases, or richer
> micro-animations until the file reaches 300+ lines. Never submit a thin scene.

---

## PART 9 — Scene01_ScrollTimeline EXACT IMPLEMENTATION

> **Day counter rule:** Always show `DAY N / TOTAL` in the top-left of Scene01.
> Series totals: AI = 120, Java = 105, Mystery/HiddenWorld = 100, SysDesign = 120, DSA = 120.
> **This scene uses DarkBackground + grid + Galaxie Copernicus ExtraBold.**

```tsx
/**
 * Scene01_ScrollTimeline
 * Duration: 150 frames = 5s (SILENT — no audio plays during this scene)
 * Shows: full day list from architecture file, scrolls to current day N
 * Shows: "DAY N / TOTAL" progress badge (top-left)
 * Theme: Dark #1D1D1C + grid + series accent color
 * Font: Galaxie Copernicus ExtraBold
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { COLORS } from '../helpers/timing';
import { DarkBackground } from '../helpers/components';

const FONT = "'Galaxie Copernicus ExtraBold', Georgia, serif";

interface Props {
  currentDay: number;    // e.g. 27
  totalDays: number;     // AI=120, Java=105, HiddenWorld=100, SysDesign=120, DSA=120
  seriesTitle: string;   // e.g. "AGENTIC AI · FIRST PRINCIPLES"
}

// !! IMPORTANT: Replace this array with EVERY day from the architecture file
const ALL_DAYS = [
  { day: 1,  topic: "What Is Intelligence?" },
  { day: 2,  topic: "Tokens and Language" },
  // ... FILL ALL DAYS FROM ARCHITECTURE FILE
  { day: 27, topic: "Tools" },
  // ... remaining days
];

const ROW_H   = 220;
const VISIBLE = 6;
const VIEW_H  = ROW_H * VISIBLE;
const VIEW_Y  = Math.round((1920 - VIEW_H) / 2);

export const Scene01_ScrollTimeline: React.FC<Props> = ({ currentDay, totalDays, seriesTitle }) => {
  const frame = useCurrentFrame();

  const targetScrollY = -(currentDay - 1 - Math.floor(VISIBLE / 2) + 0.5) * ROW_H;
  const clampedTarget = Math.min(0, Math.max(-(ALL_DAYS.length - VISIBLE) * ROW_H, targetScrollY));

  const scrollY = interpolate(frame, [0, 120], [0, clampedTarget], {
    extrapolateRight: 'clamp', easing: Easing.bezier(0.22, 1, 0.36, 1),
  });

  const sceneFade    = interpolate(frame, [130, 149], [1, 0], { extrapolateRight: 'clamp' });
  const headerEnter  = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });
  const progressWidth = (currentDay / totalDays) * 960;
  const progressEnter = interpolate(frame, [10, 60], [0, progressWidth], {
    extrapolateRight: 'clamp', easing: Easing.bezier(0.4, 0, 0.2, 1),
  });

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0, opacity: sceneFade }} width={1080} height={1920}>
        <DarkBackground />

        {/* ── DAY N / TOTAL progress badge — top-left ─────────────────────── */}
        <g opacity={headerEnter}>
          <text
            x={60} y={100}
            fontFamily={FONT} fontSize={40} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.05em"
          >
            DAY {currentDay}
          </text>
          <text
            x={60 + 40 * (String(currentDay).length * 0.65 + 3.5)}
            y={100}
            fontFamily={FONT} fontSize={40} fontWeight={800}
            fill={COLORS.text_muted}
          >
            / {totalDays}
          </text>
          {/* Progress track */}
          <rect x={60} y={120} width={960} height={6} rx={3} fill="rgba(255,255,255,0.08)" />
          {/* Progress fill */}
          <rect x={60} y={120} width={progressEnter} height={6} rx={3} fill={COLORS.accent} opacity={0.9} />
        </g>

        {/* Series title — centered, fixed */}
        <text
          x={540} y={190}
          textAnchor="middle"
          fontFamily={FONT} fontSize={26} fontWeight={800}
          fill={COLORS.text_muted} letterSpacing="0.18em"
          opacity={headerEnter * 0.8}
        >
          {seriesTitle}
        </text>

        {/* Clip scrolling rows */}
        <defs>
          <clipPath id={`scrollClip-d${currentDay}`}>
            <rect x={0} y={VIEW_Y} width={1080} height={VIEW_H} />
          </clipPath>
        </defs>

        {/* Fade masks at scroll window edges — use bg_primary fill */}
        <rect x={0} y={VIEW_Y} width={1080} height={60} fill={COLORS.bg_primary} opacity={0.8} />
        <rect x={0} y={VIEW_Y + VIEW_H - 60} width={1080} height={60} fill={COLORS.bg_primary} opacity={0.8} />

        {/* Scrolling rows */}
        <g clipPath={`url(#scrollClip-d${currentDay})`} transform={`translate(0, ${VIEW_Y + scrollY})`}>
          {ALL_DAYS.map((d, idx) => {
            const isCurrent = d.day === currentDay;
            const rowY = idx * ROW_H;
            return (
              <g key={d.day}>
                {isCurrent && (
                  <rect x={60} y={rowY + 12} width={960} height={ROW_H - 24} rx={16}
                    fill={COLORS.accent} opacity={0.08} />
                )}
                {isCurrent && (
                  <rect x={60} y={rowY + 30} width={6} height={ROW_H - 60} rx={3} fill={COLORS.accent} />
                )}
                <text
                  x={isCurrent ? 90 : 80} y={rowY + 88}
                  fontFamily={FONT}
                  fontSize={isCurrent ? 56 : 40} fontWeight={800}
                  fill={isCurrent ? COLORS.accent : COLORS.text_muted}
                  opacity={isCurrent ? 1 : 0.4}
                >
                  {`DAY ${d.day}`}
                </text>
                <text
                  x={isCurrent ? 90 : 80} y={rowY + 148}
                  fontFamily={FONT}
                  fontSize={isCurrent ? 36 : 28} fontWeight={800}
                  fill={isCurrent ? COLORS.white : COLORS.text_muted}
                  opacity={isCurrent ? 0.9 : 0.35}
                >
                  {d.topic}
                </text>
                <line x1={60} y1={rowY + ROW_H - 1} x2={1020} y2={rowY + ROW_H - 1}
                  stroke="rgba(255,255,255,0.07)" strokeWidth={1} />
              </g>
            );
          })}
        </g>
      </svg>
    </AbsoluteFill>
  );
};
```

---

## PART 10 — CSV → SCENE BOUNDARY ALGORITHM

Parse the CSV and produce scene boundaries with this exact logic:

```typescript
// Pseudocode — implement this before writing any scene files

interface Word { index: number; word: string; start: number; end: number; }

function parseCSV(csvText: string): Word[] { /* ... */ }

function buildPhraseGroups(words: Word[]): Word[][] {
  const groups: Word[][] = [];
  let current: Word[] = [];

  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    const next = words[i + 1];
    current.push(w);

    const endsWithPunct = /[.!?]$/.test(w.word.replace(/["']/g, ''));
    const endsWithComma = /,["']?$/.test(w.word);
    const pauseAfter = next ? (next.start - w.end) : 0;
    const groupDuration = current[current.length-1].end - current[0].start;

    // Hard break: sentence-ending punctuation
    if (endsWithPunct && current.length >= 2) {
      groups.push([...current]); current = []; continue;
    }

    // Soft break: comma + pause > 0.4s
    if (endsWithComma && pauseAfter > 0.4 && current.length >= 4) {
      groups.push([...current]); current = []; continue;
    }

    // Pause break: gap > 0.6s even mid-sentence
    if (pauseAfter > 0.6 && current.length >= 3) {
      groups.push([...current]); current = []; continue;
    }

    // Length break: phrase > 8 seconds
    if (groupDuration > 8.0 && (endsWithComma || pauseAfter > 0.3)) {
      groups.push([...current]); current = []; continue;
    }
  }
  if (current.length > 0) groups.push(current);

  // Merge tiny groups (≤ 3 words, < 2s) with next group
  return mergeSmallGroups(groups);
}

function groupToSceneTiming(group: Word[], sceneIndex: number) {
  const start = group[0].start;
  const end = group[group.length - 1].end;
  return {
    name: `s${String(sceneIndex).padStart(2, '0')}`,
    from: 150 + Math.round(start * 30),
    duration: Math.max(60, Math.round((end - start) * 30) + 18),
    text: group.map(w => w.word).join(' '),
    csvStart: start,
    csvEnd: end,
  };
}
```

**Minimum scene counts:**
| Audio duration | Min content scenes |
|---|---|
| < 30s | 6 |
| 30–60s | 10 |
| 60–90s | 14 |
| 90–120s | 18 |
| > 120s | 22+ |

When in doubt — **split**. Never merge two distinct concepts.

---

## PART 11 — STYLE RULES (ZERO TOLERANCE)

### Background — NON-NEGOTIABLE
```
EVERY scene: <DarkBackground /> as FIRST SVG child (NOT PaperBackground)
EVERY AbsoluteFill: style={{ background: COLORS.bg_primary }}   ← #1D1D1C
ZERO light/white backgrounds — this is a DARK theme
ZERO old paper (#F5F0E8) backgrounds — ABSOLUTELY FORBIDDEN
ZERO pure black (#000000) — use #1D1D1C
ZERO colored background panels (only #1D1D1C + #2C2C2B bento cards)
Grid drawn inside DarkBackground: horizontal + vertical lines, 80px cells, rgba(255,255,255,0.5)
```

### Font — NON-NEGOTIABLE
```
EVERY text element in EVERY scene: fontFamily="'Galaxie Copernicus ExtraBold', Georgia, serif"
fontWeight MUST always be 800 (ExtraBold is weight 800)
NO Inter, NO system-ui, NO sans-serif as primary font
ALWAYS bold, ALWAYS large — minimum 32px across the board
```

### Colors — ONLY FROM COLORS OBJECT
```
✅ fill={COLORS.accent}           ← series-specific accent color
✅ fill={COLORS.white}            ← primary text (#FFFFFF)
✅ fill={COLORS.text_muted}       ← secondary text (rgba(255,255,255,0.55))
✅ fill={COLORS.bg_secondary}     ← bento card fill (#2C2C2B)
❌ fill="#2563EB"    ← raw hex not allowed outside COLORS definition
❌ fill="white"      ← CSS color names not allowed (use COLORS.white)
❌ fill="black"      ← use COLORS.bg_primary
```

### Forbidden — HARD STOPS
```
❌ linearGradient / radialGradient — anywhere
❌ filter: blur(...) — anywhere
❌ CSS box-shadow with colored spread
❌ Emoji characters — anywhere in any string
❌ CSS transitions — use interpolate() instead
❌ CSS animation — use interpolate() or spring() instead
❌ Tailwind animate-* classes — won't render in Remotion
❌ <img> native element — use <Img> from remotion
❌ background-image CSS — use <Img> from remotion
❌ @react-three/fiber — ABSOLUTELY NO 3D. Use 2D SVG only.
❌ @remotion/three / ThreeCanvas — ABSOLUTELY NO 3D.
❌ three.js / Three.js — ABSOLUTELY NO 3D.
❌ WebGL / Canvas 3D context — ABSOLUTELY NO 3D.
❌ framer-motion — CSS-based, breaks Remotion render pipeline
❌ PaperBackground — REPLACED by DarkBackground
❌ COLORS.bg_paper — old color, FORBIDDEN (use COLORS.bg_primary)
❌ fontFamily="'Inter', ..." — FORBIDDEN (use Galaxie Copernicus ExtraBold)
❌ fontFamily with any sans-serif as primary — FORBIDDEN
❌ Pencil art style / paper texture — FORBIDDEN
```

### Animation method — 2D SVG ONLY
```
ALL animations in this project are 2D, inline SVG, using remotion hooks:
  ✅ spring() from 'remotion'
  ✅ interpolate() from 'remotion'
  ✅ useCurrentFrame() from 'remotion'
  ✅ SVG path strokeDashoffset draw
  ✅ SVG transform (translate, rotate, scale)
  ✅ Math.sin() / Math.cos() for oscillation
  ✅ @remotion/transitions for slide/wipe/fade between scenes

NEVER use 3D rendering of any kind. The entire visual language is flat 2D SVG.
```

### Typography scale — GALAXIE COPERNICUS EXTRABOLD ONLY
```
Font family:          'Galaxie Copernicus ExtraBold', Georgia, serif — EVERY element
Font weight:          800 (ExtraBold) — ALWAYS 800, never lighter

Display/hero number:  240–360px, weight 800
Scene headline H1:    100–120px, weight 800
Section title H2:     72–88px,   weight 800
Key term H3:          52–64px,   weight 800
Body text:            40–48px,   weight 800
Supporting label:     32–38px,   weight 800
Caption (bottom):     44px,      weight 800  ← FIXED AT BOTTOM
Absolute minimum:     32px — never go below this
```

### Layout safe zones
```
Content zone top:    y = 60      (start of all content)
Zone A:              y = 60–200  (section label / series badge)
Zone B:              y = 220–500 (headline — H1, large text)
Zone C:              y = 520–1740 (visual content — bento cards, diagrams)
Content zone bottom: y = 1740    (NO content below this line)
Caption zone:        y = 1760–1920 (BOTTOM STRIP — reserved for captions)
Caption single line: y = 1860
Caption two lines:   y = 1836 (line 1), y = 1884 (line 2), 48px gap
Left margin:         x = 60px
Right margin:        x = 1020px
Usable width:        960px

RULES:
  ✅ No content element above y=60
  ✅ No content element below y=1740 (caption zone reserved)
  ✅ Caption ALWAYS at BOTTOM (y=1860 or y=1836/1884) — NEVER at top
  ✅ All text uses Galaxie Copernicus ExtraBold
```

### Anti-overlap rule
```
Before placing any element, calculate its bounding box:
  text bounding box  = (x, y - fontSize, x + estimatedWidth, y)
  rect bounding box  = (x, y, x + width, y + height)

Minimum clearance:
  text-to-text:        24px vertical
  SVG element-to-text: 20px
  Element-to-left:     60px minimum
  Element-to-right:    60px minimum (max x=1020)
  Content-to-bottom:   y=1740 maximum (caption zone below)
```

### Captions — FIXED SPECIFICATION (never change these values)
```
Position:     x=540, y=1860 (BOTTOM — single line), textAnchor="middle"
Two lines:    y=1836 (line 1), y=1884 (line 2), 48px gap
Font:         'Galaxie Copernicus ExtraBold', Georgia, serif
fontSize:     44px, fontWeight: 800
Lines:        max 48 chars/line
Background:   NONE — zero rect behind captions
Border:       NONE
Highlight:    key words in COLORS.text_highlight (series accent color)
Normal words: COLORS.text_caption (#FFFFFF — white)
Fade:         8 frames in / 8 frames out

CAPTION IS AT THE BOTTOM OF THE CANVAS — NOT the top.
Content zone ends at y=1740. Caption zone is y=1760–1920.
```

### Caption color — HARD RULE (enforced without exception)
```
Normal caption words:   fill={COLORS.text_caption}   → #FFFFFF  (white)
Key/highlight words:    fill={COLORS.text_highlight}  → series accent color

FORBIDDEN caption colors:
  ❌ fill="black"        ← absolute ban (invisible on dark background)
  ❌ fill="#1A1A1A"      ← absolute ban
  ❌ fill="transparent"  ← absolute ban
  ❌ no fill attribute at all — MUST always have fill={COLORS.text_caption}

The background is #1D1D1C (dark). Only white (#FFFFFF) and the accent color
are readable. Any dark caption text becomes invisible.

Always use the Caption component from components.tsx.
```

### Bento design rules
```
ALL content cards/tiles MUST use bento design:
  ✅ BentoCard component or: <rect rx={20} fill={COLORS.bg_secondary} stroke="rgba(255,255,255,0.1)" />
  ✅ Card background: COLORS.bg_secondary (#2C2C2B)
  ✅ Accent border: COLORS.accent at strokeWidth=2 (for highlighted cards)
  ✅ Default border: rgba(255,255,255,0.1) strokeWidth=1 (for neutral cards)
  ✅ Corner radius: rx=20 minimum
  ✅ Gap between cards: 20px
  ✅ Content padding inside card: 40px from card edge

Bento layouts:
  Full width:    x=60, w=960
  Two columns:   left x=60 w=460, right x=560 w=440 (20px gap)
  Three columns: each w=300 with 20px gaps
  Feature + side: main x=60 w=620, side x=700 w=320
```

---

## PART 12 — LAYOUT PATTERNS FOR ZONE C

Choose ONE per scene. Do not mix patterns.
**ALL patterns use dark theme (#1D1D1C bg), bento cards (#2C2C2B), Galaxie Copernicus ExtraBold.**

### Pattern A — Bento Bullet List (statement + card tiles)
```tsx
// Full headline in Zone B, then 3–4 bento card rows in Zone C
// Card height: 160px with 20px gaps
// Content zone: y=520–1740
const FONT = "'Galaxie Copernicus ExtraBold', Georgia, serif";
const items = ['Point one', 'Point two', 'Point three'];

{items.map((item, i) => {
  const cardY = 520 + i * 180;
  return (
    <g key={i} opacity={itemEnters[i]} transform={`translate(0, ${itemEnters[i].translateY ?? 0})`}>
      {/* Bento card */}
      <rect x={60} y={cardY} width={960} height={160} rx={20}
        fill={COLORS.bg_secondary}
        stroke={i === 0 ? COLORS.accent : 'rgba(255,255,255,0.1)'}
        strokeWidth={i === 0 ? 2 : 1} />
      {/* Accent left bar */}
      <rect x={60} y={cardY} width={6} height={160} rx={3} fill={COLORS.accent} />
      {/* Text */}
      <text x={120} y={cardY + 92} fontFamily={FONT} fontSize={44} fontWeight={800} fill={COLORS.white}>
        {item}
      </text>
    </g>
  );
})}
```

### Pattern B — Two-Column Bento Comparison
```tsx
// Two bento cards side by side
// Left card x=60 w=460, right card x=560 w=440, gap=40px
// Card height: 640px each (fits Zone C nicely)
const FONT = "'Galaxie Copernicus ExtraBold', Georgia, serif";

{/* Left bento card */}
<g opacity={card1.opacity} transform={`translate(0, ${card1.translateY})`}>
  <rect x={60} y={520} width={460} height={640} rx={20}
    fill={COLORS.bg_secondary} stroke="rgba(255,255,255,0.1)" strokeWidth={1} />
  <text x={280} y={620} textAnchor="middle" fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.text_muted}>
    BEFORE
  </text>
</g>

{/* Right bento card — accent border */}
<g opacity={card2.opacity} transform={`translate(0, ${card2.translateY})`}>
  <rect x={560} y={520} width={440} height={640} rx={20}
    fill={COLORS.bg_secondary} stroke={COLORS.accent} strokeWidth={2} />
  <text x={780} y={620} textAnchor="middle" fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.accent}>
    AFTER
  </text>
</g>
```

### Pattern C — Flow Diagram with Bento Nodes (max 4 nodes, max 5 arrows)
```tsx
// Nodes: bento cards (rx=20), accent border, Galaxie Copernicus ExtraBold labels
const FONT = "'Galaxie Copernicus ExtraBold', Georgia, serif";
const NODE_W = 380, NODE_H = 100;

<rect x={100} y={580} width={NODE_W} height={NODE_H} rx={20}
  fill={COLORS.bg_secondary}
  stroke={COLORS.accent} strokeWidth={2} />
<text x={100 + NODE_W / 2} y={580 + 62} textAnchor="middle"
  fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.white}>
  NODE LABEL
</text>

{/* Arrow connecting nodes */}
<line x1={480} y1={630} x2={580} y2={630}
  stroke={COLORS.accent} strokeWidth={2.5}
  markerEnd="url(#arrow)" />
```

### Pattern D — Large Number / Statistic (hero number)
```tsx
// For dramatic single facts: "45 minutes", "385,000 km", "2 seconds"
const FONT = "'Galaxie Copernicus ExtraBold', Georgia, serif";

{/* Ghost layer behind main number */}
<text x={540} y={1000} textAnchor="middle"
  fontFamily={FONT} fontSize={360} fontWeight={800}
  fill={COLORS.accent} opacity={enter * 0.08}>
  45
</text>
{/* Main number */}
<text x={540} y={1000} textAnchor="middle"
  fontFamily={FONT} fontSize={300} fontWeight={800}
  fill={COLORS.white} opacity={enter}>
  45
</text>
<text x={540} y={1100} textAnchor="middle"
  fontFamily={FONT} fontSize={56} fontWeight={800}
  fill={COLORS.accent} opacity={enter}>
  MINUTES
</text>
```

### Pattern E — Code Block (Java / technical concept scenes)
```tsx
// Bento card wrapping code block
const FONT = "'Galaxie Copernicus ExtraBold', Georgia, serif";

{/* Outer bento card */}
<rect x={60} y={520} width={960} height={600} rx={20}
  fill={COLORS.bg_secondary}
  stroke={COLORS.accent} strokeWidth={2} />
{/* Left accent bar */}
<rect x={60} y={520} width={6} height={600} rx={3} fill={COLORS.accent} />

{/* Code lines — monospace inside card */}
{codeLines.map((line, i) => (
  <text key={i} x={100} y={588 + i * 56}
    fontFamily="'Fira Code', 'Courier New', monospace"
    fontSize={36} fontWeight={500}
    fill={line.isKeyword ? COLORS.accent : COLORS.text_muted}>
    {line.text}
  </text>
))}
```

### Pattern F — Bento Grid (mixed tile sizes)
```tsx
// Feature bento: 1 large tile + 2 small tiles (Notion-style asymmetric grid)
const FONT = "'Galaxie Copernicus ExtraBold', Georgia, serif";

{/* Large feature tile — left (2/3 width) */}
<g opacity={card1.opacity} transform={`translate(0, ${card1.translateY})`}>
  <rect x={60} y={520} width={620} height={500} rx={20}
    fill={COLORS.bg_secondary} stroke={COLORS.accent} strokeWidth={2} />
  <text x={100} y={620} fontFamily={FONT} fontSize={56} fontWeight={800} fill={COLORS.white}>
    Main Concept
  </text>
  <text x={100} y={690} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.text_muted}>
    Primary explanation text here
  </text>
</g>

{/* Two small tiles — right column */}
<g opacity={card2.opacity} transform={`translate(0, ${card2.translateY})`}>
  <rect x={720} y={520} width={320} height={230} rx={20}
    fill={COLORS.bg_secondary} stroke="rgba(255,255,255,0.1)" strokeWidth={1} />
  <text x={760} y={620} fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.accent}>
    Stat 01
  </text>
</g>
<g opacity={card3.opacity} transform={`translate(0, ${card3.translateY})`}>
  <rect x={720} y={790} width={320} height={230} rx={20}
    fill={COLORS.bg_secondary} stroke="rgba(255,255,255,0.1)" strokeWidth={1} />
  <text x={760} y={890} fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.white}>
    Stat 02
  </text>
</g>

{/* Bottom full-width tile */}
<g opacity={card4.opacity} transform={`translate(0, ${card4.translateY})`}>
  <rect x={60} y={1060} width={960} height={200} rx={20}
    fill={COLORS.bg_secondary} stroke="rgba(255,255,255,0.1)" strokeWidth={1} />
  <text x={100} y={1178} fontFamily={FONT} fontSize={44} fontWeight={800} fill={COLORS.text_muted}>
    Supporting detail or key takeaway text
  </text>
</g>
```

---

## PART 13 — Root.tsx REGISTRATION

After generating all Day{N} files, add to `src/Root.tsx`:

```tsx
import { Day{N}Scene } from './Day{N}/Scene';

// Inside RemotionRoot function, add:
<Composition
  id="Day{N}_{SeriesName}"        // e.g. "Day28_AI" or "Day28_Java"
  component={Day{N}Scene}
  durationInFrames={TOTAL_FRAMES} // from timing.ts calculation
  fps={30}
  width={1080}
  height={1920}
/>
```

Use `<Folder>` to organize series:
```tsx
<Folder name="AI-Series">
  <Composition id="AiDay23" ... />
  <Composition id="AiDay24" ... />
  {/* ... */}
</Folder>
```

---

## PART 14 — SCENE CONTENT QUALITY RULES

### Script adherence — ABSOLUTE
- Every visual element comes DIRECTLY from the spoken script
- If the script says "radio waves travel in straight lines" → show an SVG line
- If the script says "45 minutes of silence" → show the number 45 prominently
- DO NOT add facts not in the script
- DO NOT create scenes for things not in the script
- The CSV transcript is the ONLY source for scene content

### Scene count = phrase group count — EXACT MATCH (no extras)
```
Content scenes = exact number of CSV phrase groups. NO MORE. NO LESS.

STRUCTURAL scenes (always present, not counted as content scenes):
  ✅ Scene01_ScrollTimeline   — 150 frames, silent, always first
  ✅ Scene{LAST-1}_KeyTakeaway — 120 frames, always second-to-last
  ✅ Scene{LAST}_Outro         — 362 frames, always last

Content scenes (Scene02 → Scene{LAST-2}):
  ✅ Exactly 1 scene per CSV phrase group
  ❌ DO NOT add intro scenes before Scene02 with no CSV phrase
  ❌ DO NOT add summary/recap scenes after the last CSV phrase
  ❌ DO NOT add "bonus" scenes for sub-topics not in the CSV
  ❌ DO NOT extend the last content scene into two scenes without a CSV split

Counting rule:
  If CSV parsing produces 14 phrase groups → write Scene02 through Scene15 (14 scenes)
  + Scene16_KeyTakeaway + Scene17_Outro
  Total scene files: 17 (= 1 scroll + 14 content + 1 takeaway + 1 outro)
```

### Thematic SVG illustration — MANDATORY in EVERY content scene
```
EVERY content scene (Scene02 through Scene{LAST-2}) MUST contain:
  ✅ At least ONE thematic SVG illustration relevant to the topic
  ✅ The illustration must be drawn from INLINE SVG paths — not text labels alone
  ✅ The illustration must animate in (spring entrance or path-draw)

A scene with ONLY text blocks and colored rectangles is REJECTED.
A scene with SVG boxes that contain only text labels is NOT an illustration — it is a list.

Illustrations are scene-specific: draw what the script is TALKING ABOUT.
  Java/Train script → draw trains, tracks, stations, tickets, signals, switches
  AI script        → draw neural connections, agent loops, memory banks, flow arrows
  HiddenWorld      → draw the specific subject (space = planets/orbits, auto = cars/engines)
```

### Visual explanation mandate
- Each scene must explain its concept WITHOUT audio (muted viewer test)
- Use SVG diagrams, number callouts, comparison layouts, flow arrows
- Text-only scenes are REJECTED — every scene needs at least one SVG illustration
- If a scene is "text-heavy" by nature, add a small supporting icon/diagram at y=1400–1700

### One concept per scene
- Exactly ONE main idea per scene
- Max 4 supporting elements (bullets, nodes, diagram pieces)
- If you need 5+ elements → split into 2 scenes
- Generous negative space is correct design

---

## PART 14B — THEMATIC SVG VOCABULARY BY SERIES

> Before writing content scenes, look up this table for the series.
> Pick the most relevant illustration type for each scene's concept.
> Draw these entirely as inline SVG `<path>`, `<rect>`, `<circle>`, `<polygon>` etc.

### Java / National Railway Series — SVG elements to draw
```
Core objects (draw these in zone C):
  🚂 Train body:    Locomotive rectangle + cab box + wheels (circles) + smokestack
  🛤️ Track:         Two parallel <line> elements + cross-tie rects at intervals
  🏛️ Station:        Wide rect + platform ledge + roof triangle + station name text
  🎫 Ticket:         Rounded rect + dashed border + seat/class text + perforation dots
  🚦 Signal light:   Pole rect + signal box + colored circle (red/green) + mounting bracket
  🔀 Switch/Turnout: Y-shaped path with two track branches
  📦 Cargo/Freight:  Stack of rect boxes on a flatbed car shape
  📊 Schedule board: Grid of rows (departure times) with columns (platform/status)
  💺 Seat map:       Grid of small rect seats with aisle gap in the middle
  🎟️ Booking form:   Rectangle form with labeled field lines and a CTA button rect

Java/OOP objects (for code concept scenes):
  📦 Class box:      Rect with header stripe + field list + method list separator line
  🔗 Inheritance:    Two class boxes with upward arrow (hollow arrowhead)
  🔄 Interface:      Dashed-border rect labeled <<interface>>
  ⚙️ Method call:    Horizontal arrow from caller box to callee box with method name label

Railroad network:
  🗺️ Route map:      Multiple station circles connected by curved path lines
  🔵 Station node:   Circle with station name + connecting lines radiating outward
```

### AI / Agentic AI Series — SVG elements to draw
```
  🧠 Brain/neural:   Ellipse outline + internal curved lines suggesting folds
  🔵 Agent node:     Circle with label + arrows pointing to/from other nodes
  🔄 Feedback loop:  Circular arrow path (arc + arrowhead at end)
  📋 Memory bank:    Stack of horizontal rect "memory cards" with labels
  🔍 Search/RAG:     Magnifying circle + document rects with highlighted line
  🌐 Network:        Multiple circles connected by lines (graph visualization)
  ⚡ Activation:     Sigmoid curve drawn as SVG path + threshold dashed line
  📊 Loss curve:     Descending curved line on axis grid
  🗂️ Context window: Horizontal scrolling rect with token blocks inside
  🤖 Robot/Agent:    Simple robot head (rect + eyes circles) + body outline
  ⚙️ Gear/Process:   Circle with 8 teeth drawn as path + inner circle
  💬 Message bubble: Speech bubble rect with tail pointer
  🧩 Puzzle piece:   Interlocking shapes showing composition
```

### HiddenWorld — SVG elements by sub-topic
```
Space/Astronomy:
  🪐 Planet:         Circle + elliptical ring path
  ⭐ Star field:      Scattered <circle r=2> points
  🚀 Rocket:         Triangle nose + cylinder body + fin triangles
  🌍 Earth orbit:    Circle planet + dashed ellipse orbit path

Automotive:
  🚗 Car:            Rounded rect body + wheel circles + window rect
  ⚙️ Engine:         Cylinder arrangement with connecting rod paths
  🏁 Race track:     Oval path with start/finish line
  📊 RPM gauge:      Semicircle arc + needle line + tick marks

Biology/Nature:
  🌱 Cell:           Circle + organelle shapes inside
  🧬 DNA:            Two intertwined sine wave paths
  🍃 Leaf:           Curved path with center vein line

Physics/Science:
  ⚡ Circuit:        Wire lines + component symbols (resistor zigzag, capacitor lines)
  🌊 Wave:           Sine curve SVG path
  🔭 Telescope:      Cylinder + eyepiece + tripod legs
```

### Illustration drawing rules
```
1. Draw the illustration in ZONE C (y=520–1740)
2. Size: minimum 200×200px for a hero illustration; minimum 80×80px for supporting icons
3. Color: use COLORS object only — COLORS.accent for primary elements, COLORS.white for labels
4. Background: place illustrations INSIDE bento cards (fill=COLORS.bg_secondary) or on dark bg
5. Animate: spring entrance (translateY) + path-draw for lines/paths
6. Label: add text labels next to or inside the illustration (fontFamily=Galaxie Copernicus ExtraBold, fontSize ≥ 32px)
7. DO NOT use emoji characters — draw the shape with SVG primitives
8. DO NOT use <image> or external SVG files — inline only
9. If lucide-react has the icon, extract its path data and render as <path> in SVG
```

---

## PART 15 — SERIES-SPECIFIC CONFIGURATION

**ALL series share the same dark background (#1D1D1C) and Galaxie Copernicus ExtraBold font.**
**Only the ACCENT COLOR changes per series. Set SERIES_ACCENT in timing.ts accordingly.**

| Series | totalDays | SERIES_ACCENT hex | ACCENT_R,G,B | Scroll series title |
|---|---|---|---|---|
| Java / National Railway | **105** | `#D87656` | `216,118,86` | `"NATIONAL RAILWAY · JAVA"` |
| Agentic AI | **120** | `#76ABAE` | `118,171,174` | `"AGENTIC AI · FIRST PRINCIPLES"` |
| System Design | **120** | `#948979` | `148,137,121` | `"SYSTEM DESIGN · FOUNDATIONS"` |
| DSA | **120** | `#93B1A6` | `147,177,166` | `"DATA STRUCTURES & ALGORITHMS"` |
| Mystery / HiddenWorld | **100** | `#F7374F` | `247,55,79` | `"MYSTERY RESOLVED · DAILY FACTS"` |

### timing.ts snippet — set per series
```typescript
// At top of timing.ts, set these TWO values for the series being generated:
const SERIES_ACCENT = '#76ABAE';                       // ← replace with correct hex
const ACCENT_R = 118, ACCENT_G = 171, ACCENT_B = 174; // ← replace with correct RGB

// Everything else in COLORS auto-calculates from these values
```

### Day counter format in Scene01 (pass as `totalDays` prop)
```
Java series:        <Scene01_ScrollTimeline currentDay={N} totalDays={105} seriesTitle="NATIONAL RAILWAY · JAVA" />
AI series:          <Scene01_ScrollTimeline currentDay={N} totalDays={120} seriesTitle="AGENTIC AI · FIRST PRINCIPLES" />
System Design:      <Scene01_ScrollTimeline currentDay={N} totalDays={120} seriesTitle="SYSTEM DESIGN · FOUNDATIONS" />
DSA series:         <Scene01_ScrollTimeline currentDay={N} totalDays={120} seriesTitle="DATA STRUCTURES & ALGORITHMS" />
Mystery/HiddenWorld:<Scene01_ScrollTimeline currentDay={N} totalDays={100} seriesTitle="MYSTERY RESOLVED · DAILY FACTS" />

Displayed badge: "DAY 27 / 120" (large accent-colored number + muted total)
Progress bar: fills left→right using accent color, animated frames 10→60
```

### Day counter format in Scene01 (pass as `totalDays` prop)
```
AI series:              <Scene01_ScrollTimeline currentDay={N} totalDays={120} seriesTitle="AGENTIC AI · FIRST PRINCIPLES" />
Java series:            <Scene01_ScrollTimeline currentDay={N} totalDays={105} seriesTitle="NATIONAL RAILWAY · JAVA" />
HiddenWorld/Mystery:    <Scene01_ScrollTimeline currentDay={N} totalDays={100} seriesTitle="HIDDEN WORLD SECRETS" />

Displayed badge in Scene01: "DAY 27 / 120" (large sky_blue number + cool_silver total)
Progress bar: fills from left, width = (currentDay/totalDays) × 960px, animated 10→60 frames
```

---

## PART 16 — PRE-PUBLISH CHECKLIST

Before considering a day complete, verify every file:

**timing.ts**
- [ ] SERIES_ACCENT set to correct hex for the series (see PART 15)
- [ ] ACCENT_R, ACCENT_G, ACCENT_B set to match SERIES_ACCENT
- [ ] TOTAL_FRAMES calculated correctly: 150 + audio_frames + 30 + 120 + 362
- [ ] Every scene has both `from` and `duration`
- [ ] No `from` values overlap for adjacent scenes (gaps allowed, overlaps not)
- [ ] CAPTIONS array has one entry per content scene
- [ ] All COLORS entries present (bg_primary, bg_secondary, white, text_primary, text_muted, text_caption, text_highlight, grid_line, accent, accent_dim, accent_mid)

**components.tsx**
- [ ] `DarkBackground` renders #1D1D1C rect + white grid lines (80px cells, rgba(255,255,255,0.5))
- [ ] Caption fixed at y=1860 (BOTTOM), center anchor x=540, NO background rect
- [ ] Caption `<text>` element has `fill={COLORS.text_caption}` (#FFFFFF — white)
- [ ] Caption tspan key words use `fill={COLORS.text_highlight}` (series accent)
- [ ] Caption font is `'Galaxie Copernicus ExtraBold', Georgia, serif`
- [ ] `BentoCard` component exported (for scene use)
- [ ] No gradient in any component

**Scene01_ScrollTimeline.tsx**
- [ ] Uses `DarkBackground` (NOT PaperBackground)
- [ ] ALL_DAYS array contains every day from the architecture file
- [ ] currentDay entry highlighted with `COLORS.accent`
- [ ] ROW_H=220, VISIBLE=6
- [ ] Clip path applied to scrolling rows
- [ ] Scene fades out at frames 130–149
- [ ] `totalDays` prop set correctly per PART 15 table
- [ ] "DAY N / TOTAL" badge renders at top-left (y≈100) with progress bar
- [ ] Progress bar uses `COLORS.accent`, animated frames 10→60
- [ ] All text uses `'Galaxie Copernicus ExtraBold', Georgia, serif`

**Scene count verification (do this BEFORE writing content scenes)**
- [ ] Count phrase groups from CSV: N groups
- [ ] Plan exactly N content scene files (Scene02 → Scene{N+1})
- [ ] No extra "intro" content scene before Scene02
- [ ] No extra "summary" content scene after Scene{N+1}
- [ ] Only structural scenes exempt: Scene01 (scroll), Scene{N+2} (takeaway), Scene{N+3} (outro)

**Every content scene**
- [ ] `<DarkBackground />` is first SVG child (NOT PaperBackground)
- [ ] `<GlobalDefs />` is second SVG child (if using arrows)
- [ ] AbsoluteFill has `style={{ background: COLORS.bg_primary }}` (NOT bg_paper)
- [ ] No content element above y=60
- [ ] No content element below y=1740 (caption zone y=1760–1920 reserved at BOTTOM)
- [ ] Caption is present and uses CAPTIONS array, positioned at y=1860 BOTTOM
- [ ] Caption text uses `fill={COLORS.text_caption}` (#FFFFFF — white, NOT dark)
- [ ] Caption key words use `fill={COLORS.text_highlight}` (series accent)
- [ ] Caption font is `'Galaxie Copernicus ExtraBold', Georgia, serif`
- [ ] **ALL text uses `'Galaxie Copernicus ExtraBold', Georgia, serif`** — NO Inter font
- [ ] **Content tiles use BentoCard or bento-style rects (bg_secondary #2C2C2B, rx=20)**
- [ ] **Zone C contains ≥ 1 thematic SVG illustration** (train/agent/planet etc.)
- [ ] The SVG illustration is topic-relevant (see PART 14B vocabulary)
- [ ] All colors from COLORS object
- [ ] No gradient, no blur filter, no emoji
- [ ] All font sizes ≥ 32px
- [ ] All `interpolate()` calls have `extrapolateRight: 'clamp'`
- [ ] No overlapping bounding boxes
- [ ] **Scene file is ≥ 300 lines** (count lines — if < 300, expand Zone C)
- [ ] **≥ 3 animation phases** (reveal / content build / steady-state micro)
- [ ] **`spring()` used for every major element entrance** (not plain interpolate)
- [ ] **No "basic" fade-only animation** — every element has translateY + opacity
- [ ] Diagrams use SVG path-draw (`strokeDashoffset`) not instant appear
- [ ] Stagger delay between sibling elements is 10–14 frames (not all at once)

**Scene.tsx**
- [ ] Audio `<Sequence from={150}>` (not from={0})
- [ ] All scenes have `premountFor={30}`
- [ ] AbsoluteFill has `style={{ background: COLORS.bg_primary }}` (NOT bg_paper)

**Root.tsx**
- [ ] New composition registered with correct TOTAL_FRAMES
- [ ] Composition inside appropriate `<Folder>`

**Build verification (MANDATORY — day is NOT complete until this passes)**
- [ ] Run `npm run build` — zero TypeScript errors
- [ ] Run `npm run build` again after any error fixes — confirm clean pass
- [ ] If build fails: fix errors, do NOT skip to next day

---

## PART 17 — AUTONOMOUS EXECUTION PROTOCOL (read this before PART 18)

### PRIME DIRECTIVE — ZERO QUESTIONS, ZERO STOPS

```
Once a generation command is received, the agent executes completely and autonomously.

NEVER:
  ❌ Ask "Should I continue?"
  ❌ Ask "Do you want me to proceed with Day N?"
  ❌ Ask "Which audio file should I use?"
  ❌ Ask "How many scenes should this have?"
  ❌ Ask "Is this what you meant?"
  ❌ Stop and report an ambiguity — resolve it using the decision table below
  ❌ Wait for confirmation between days, between chunks, between files
  ❌ Ask about anything that has a rule in this file — the rule is the answer

ALWAYS:
  ✅ Make a decision using the rules in this file
  ✅ If a rule covers the situation → follow it, don't ask about it
  ✅ If a file is missing → use the fallback rule in the AMBIGUITY TABLE
  ✅ If something goes wrong → fix it and continue
  ✅ Keep generating until the entire command is complete
  ✅ Print progress markers so the user can read the log
  ✅ Re-read this instructions file between every chunk (defined in PART 18)
```

---

### AMBIGUITY RESOLUTION TABLE (use this instead of asking questions)

When something is unclear, do NOT ask. Use the rule in the right column.

| Situation | Resolution — no question needed |
|---|---|
| Audio file not in `src/Instructions/audio/` | Check `public/audio/`. If neither exists, create a placeholder `timing.ts` comment: `// AUDIO MISSING: place ai{N}.wav in public/audio/` and continue |
| CSV file not found | Create `timing.ts` with `// CSV MISSING: place ai{N}_word_by_word_transcript.csv in src/Instructions/` and generate 10 placeholder scenes from the architecture file topic |
| Unsure how many scenes | Use the minimum from PART 10 table based on audio duration. When no CSV: 14 scenes default |
| Topic text unclear | Use the EXACT text from the architecture file. Do not paraphrase or shorten |
| Next-day topic not in architecture | Write `// Day N+1 topic pending` in Outro and continue |
| Scene content ambiguous | Use the EXACT CSV phrase words. Do not elaborate or add context |
| Frame calculation uncertainty | Re-run: `150 + ceil(audioDur * 30) + 30 + 120 + 362`. Never guess |
| Which accent color for HiddenWorld | Read the emoji prefix in architecture.md: 🎮→purple, 🚀→sky_blue, 🏎️→orange, 🔭→green, ✈️→sky_blue, 🏍️→amber, 🌊→sky_blue |
| Font size needed for long text | Use `fitText()` from `@remotion/layout-utils` or cap at 52px and break into 2 lines |
| Scene duration seems short | Minimum is 60 frames. If phrase < 2s in CSV, merge with adjacent phrase |
| Two phrases share a scene boundary | Always SPLIT at sentence-ending punctuation. Merge only at soft breaks |
| Overlap detected between scenes | Adjust the LATER scene's `from` to be `prev.from + prev.duration`. Do not ask |
| File already exists | Overwrite it. Never ask for confirmation to overwrite |
| Root.tsx composition ID conflict | Append `_v2` to the ID and continue |

---

### SELF-CORRECTION RULES (fix and continue, never ask)

```
If a generated file has a lint error:
  → Fix the import, fix the syntax, re-write the problematic block, continue

If a scene's bounding box calculation shows overlap:
  → Reduce font size by 8px OR shift the lower element down by the overlap amount, continue

If the scroll timeline ALL_DAYS array seems too long:
  → Keep it. Full list is required. 120 entries for AI/HiddenWorld, 105 for Java.

If a caption is too long (>52 chars):
  → Split into 2 lines at y=116 and y=164. Do not shorten the text.

If an SVG element would go below y=1880:
  → Reduce font size or compress spacing. Hard limit: content stays above y=1880.

If unsure which pattern (A/B/C/D/E) to use for a scene:
  → Read the spoken phrase. Number/stat → Pattern D. Comparison → Pattern B.
     List/bullets → Pattern A. Process/flow → Pattern C. Code → Pattern E.
     Default if still unclear → Pattern A.
```

---

## PART 18 — CHUNK-BASED EXECUTION (prevents context overflow & drift)

### Why chunks exist

Generating one full day produces ~7-25 files and thousands of lines of code. Long generation
sessions cause the model to gradually drift from the rules set at the start. Chunks are
deliberately small units of work, each preceded by a mandatory instruction re-read, so that
every file is generated with fresh rule awareness — not memory of rules set 3000 tokens ago.

---

### CHUNK SIZE DEFINITION

A chunk is the largest unit of work that can be completed without rule drift. Defined as:

```
CHUNK = one of the following units:
  A) Planning output for all days (no code, just analysis + plan print)
  B) helpers/timing.ts  for one day
  C) helpers/components.tsx  for one day
  D) Scene01_ScrollTimeline.tsx  for one day
  E) Content scenes 02 through 06  for one day  (max 5 scenes per chunk)
  F) Content scenes 07 through 11  for one day  (max 5 scenes per chunk)
  G) Content scenes 12 through 16  for one day  (max 5 scenes per chunk)
  H) Content scenes 17+ through end  for one day  (max 5 scenes per chunk)
  I) KeyTakeaway + Outro  for one day
  J) Scene.tsx (orchestrator)  for one day
  K) Root.tsx update  (all days, done once at the very end)
```

**Adjust chunk boundaries based on scene count:**
- 6–10 content scenes: use 2 content chunks (E + F)
- 11–16 content scenes: use 3 content chunks (E + F + G)
- 17–22 content scenes: use 4 content chunks (E + F + G + H)
- Never put more than 5 content scenes in one chunk

---

### THE RE-READ TRIGGER (mandatory before EVERY chunk)

Before starting any chunk — whether it's chunk B of day 1 or chunk E of day 5 — execute:

```
╔════════════════════════════════════════════════════════════════╗
║  ⟳  INSTRUCTION RE-READ TRIGGER                               ║
╠════════════════════════════════════════════════════════════════╣
║                                                               ║
║  1. Read: .github/copilot-instructions.md  (FULL FILE)        ║
║     Focus on the parts relevant to the next chunk:           ║
║     • PART 1  — fundamentals (canvas, fps, background)       ║
║     • PART 4  — frame math formula                           ║
║     • PART 5  — timing.ts template          (before chunk B) ║
║     • PART 6  — components.tsx template     (before chunk C) ║
║     • PART 9  — ScrollTimeline template     (before chunk D) ║
║     • PART 8  — scene boilerplate           (before chunk E/F/G/H) ║
║     • PART 12 — layout patterns             (before chunk E/F/G/H) ║
║     • PART 11 — style rules                 (before every chunk)   ║
║     • PART 16 — per-file checklist          (before chunk J) ║
║     • PART 20 — premium animation rules     (before chunk E/F/G/H) ║
║                                                               ║
║  2. Read: src/Instructions/remotion-best-practices.md        ║
║     (skim — 30 seconds — focus on the section for this chunk)║
║                                                               ║
║  3. Read: the architecture file entry for THIS DAY           ║
║     Confirm: topic, module, Day N+1 topic                    ║
║                                                               ║
║  4. If this is a content scene chunk: re-read the CSV        ║
║     for the specific phrase group being generated            ║
║                                                               ║
║  5. Confirm the 7 critical rules from memory:                ║
║     • Background = #1D1D1C dark + white grid on EVERY scene  ║
║     • Font = Galaxie Copernicus ExtraBold on ALL text        ║
║     • Accent = correct series color (PART 15 table)          ║
║     • Audio in <Sequence from={150}> NOT from={0}            ║
║     • Caption at y=1860 BOTTOM, white, Galaxie Copernicus    ║
║     • No gradient, no emoji, no CSS animation                ║
║     • premountFor={30} on every <Sequence>                   ║
║     • Every scene ≥ 300 lines, spring() on every entrance    ║
║                                                               ║
╚════════════════════════════════════════════════════════════════╝
```

---

### FULL EXECUTION MAP (single day)

Every day follows this exact chunk sequence. Print the chunk header before starting each chunk.

```
═══════════════════════════════════════════════════════════════════════
DAY [N] — "[Topic]" — CHUNK MAP
═══════════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────────┐
│ CHUNK A — PLANNING                                                  │
│ No code. Read arch file, read CSV, calculate frames, count scenes.  │
│ Print: day topic, audio duration, total frames, scene list.         │
└─────────────────────────────────────────────────────────────────────┘
          ↓ ⟳ RE-READ FULL INSTRUCTIONS
┌─────────────────────────────────────────────────────────────────────┐
│ CHUNK B — helpers/timing.ts                                         │
│ Write: COLORS, SCENE_TIMING (all scenes), CAPTIONS, helpers.        │
│ Verify: TOTAL_FRAMES = OUTRO_FROM + 362. No placeholder values.     │
└─────────────────────────────────────────────────────────────────────┘
          ↓ ⟳ RE-READ FULL INSTRUCTIONS
┌─────────────────────────────────────────────────────────────────────┐
│ CHUNK C — helpers/components.tsx                                    │
│ Write: DarkBackground (dark+grid), GlobalDefs, Caption (BOTTOM),   │
│        BentoCard, CornerAccents, Divider, SectionLabel.             │
│ Verify: Caption y=1860 BOTTOM, white, Galaxie Copernicus font.      │
└─────────────────────────────────────────────────────────────────────┘
          ↓ ⟳ RE-READ FULL INSTRUCTIONS
┌─────────────────────────────────────────────────────────────────────┐
│ CHUNK D — frames/Scene01_ScrollTimeline.tsx                         │
│ Write: ALL_DAYS array (FULL list from arch file), scroll anim,      │
│        clip path, fade-out at frames 130–149.                       │
│ Verify: ROW_H=220, VISIBLE=6, current day highlighted correctly.    │
└─────────────────────────────────────────────────────────────────────┘
          ↓ ⟳ RE-READ FULL INSTRUCTIONS + RE-READ CSV phrases 1-5
┌─────────────────────────────────────────────────────────────────────┐
│ CHUNK E — frames/Scene02 through Scene06                            │
│ Write: first 5 content scenes (or fewer if day has ≤5 scenes).      │
│ Each: DarkBackground first, bento layout, bottom caption, no grad.  │
│ Verify each before next: bounding boxes, colors, font sizes.        │
└─────────────────────────────────────────────────────────────────────┘
          ↓ ⟳ RE-READ FULL INSTRUCTIONS + RE-READ CSV phrases 6-10
┌─────────────────────────────────────────────────────────────────────┐
│ CHUNK F — frames/Scene07 through Scene11  (if needed)               │
│ Same rules as chunk E. Re-read CSV for this phrase group.           │
└─────────────────────────────────────────────────────────────────────┘
          ↓ ⟳ RE-READ FULL INSTRUCTIONS + RE-READ CSV phrases 11+
┌─────────────────────────────────────────────────────────────────────┐
│ CHUNK G — frames/Scene12 through Scene16  (if needed)               │
│ Same rules as chunk E.                                              │
└─────────────────────────────────────────────────────────────────────┘
          ↓ ⟳ RE-READ FULL INSTRUCTIONS + RE-READ CSV phrases 17+
┌─────────────────────────────────────────────────────────────────────┐
│ CHUNK H — frames/Scene17+  (if needed, for 18–22 scene days)        │
│ Same rules as chunk E.                                              │
└─────────────────────────────────────────────────────────────────────┘
          ↓ ⟳ RE-READ FULL INSTRUCTIONS
┌─────────────────────────────────────────────────────────────────────┐
│ CHUNK I — KeyTakeaway + Outro                                       │
│ KeyTakeaway: main concept, typographic, sky_blue headline.          │
│ Outro: current day recap + TOMORROW preview (re-check arch N+1).   │
│ Verify: Outro has correct Day N+1 topic (re-read arch file now).    │
└─────────────────────────────────────────────────────────────────────┘
          ↓ ⟳ RE-READ FULL INSTRUCTIONS
┌─────────────────────────────────────────────────────────────────────┐
│ CHUNK J — Scene.tsx (orchestrator)                                  │
│ Write: AbsoluteFill + Audio in Sequence from={150} + all scenes     │
│        with premountFor={30} + correct TOTAL_FRAMES in comment.     │
│ Verify: Audio from={150} ✓  All premountFor={30} ✓  All imports ✓  │
└─────────────────────────────────────────────────────────────────────┘
          ↓
┌─────────────────────────────────────────────────────────────────────┐
│ REBUILD — Run TypeScript build to catch errors                      │
│ Command: npm run build                                              │
│ If errors: fix ALL TypeScript/import errors before proceeding.      │
│ Do NOT mark the day complete if the build fails.                    │
│ Common errors to fix: missing imports, wrong component names,       │
│   SCENE_TIMING key typos, incorrect TOTAL_FRAMES value.            │
│ After fixing: re-run npm run build until it passes.                │
└─────────────────────────────────────────────────────────────────────┘

Print: ✅ DAY [N] COMPLETE marker (defined in PART 19 below)
Then: ⟳ RE-READ FULL INSTRUCTIONS before next day
```

---

### FULL EXECUTION MAP (multi-day batch)

For N days, the chunks execute in this order. Root.tsx is updated ONCE at the very end.

```
[START OF BATCH]

⟳ RE-READ .github/copilot-instructions.md (full)
⟳ RE-READ src/Instructions/remotion-best-practices.md
⟳ RE-READ CLAUDE.md

CHUNK A-all: Discovery + Plan for ALL days simultaneously
  → Read arch file for every day in batch
  → Check all audio files
  → Read all CSVs, calculate all frame counts
  → Count scenes per day from phrase groups
  → Print full plan (PART 19 template)

CHUNK SETUP: Stage all audio, create all folders

─────────────── DAY N1 ───────────────
⟳ RE-READ (full)
CHUNK B → timing.ts
⟳ RE-READ (full)
CHUNK C → components.tsx
⟳ RE-READ (full)
CHUNK D → Scene01_ScrollTimeline
⟳ RE-READ (full)
CHUNK E → Scenes 02-06
⟳ RE-READ (full)
CHUNK F → Scenes 07-11  (if needed)
⟳ RE-READ (full)
CHUNK G → Scenes 12-16  (if needed)
⟳ RE-READ (full)
CHUNK H → Scenes 17+    (if needed)
⟳ RE-READ (full)
CHUNK I → KeyTakeaway + Outro
⟳ RE-READ (full)
CHUNK J → Scene.tsx
🔨 REBUILD → npm run build (fix ALL errors before continuing)

✅ DAY N1 COMPLETE (only after build passes)
⟳ RE-READ (full) — mandatory before next day

─────────────── DAY N2 ───────────────
(same chunk sequence as Day N1)
🔨 REBUILD → npm run build
✅ DAY N2 COMPLETE (only after build passes)
⟳ RE-READ (full)

─────────────── DAY N3+ ─────────────
(repeat)

─────────────── FINAL ───────────────
CHUNK K → Root.tsx (all days at once)
Print final batch report
[END OF BATCH]
```

---

### CHUNK PROGRESS MARKERS (print before each chunk, no exceptions)

```
── CHUNK [LETTER] ── DAY [N] ── [description] ──────────────────────────
⟳ Reading .github/copilot-instructions.md ... done
⟳ Reading remotion-best-practices.md ... done
⟳ Confirmed: #1D1D1C dark+grid bg, Galaxie Copernicus font, caption y=1860 BOTTOM, correct series accent, audio frame 150, no gradient
Writing [filename] ...
```

This marker serves as the self-confirmation checkpoint. If the agent cannot honestly
fill in "confirmed" — it re-reads until it can.

---

### CHUNK COMPLETION MARKERS

```
── CHUNK [LETTER] DONE ── DAY [N] ──────────────────────────────────────
File: [filename]
Lines: [N]
Verified: background ✓ | no gradient ✓ | caption ✓ | font sizes ✓ | thematic SVG ✓
─────────────────────────────────────────────────────────────────────────
```

### DAY COMPLETE MARKER (after build passes)

```
✅ DAY [N] COMPLETE — "[Day Topic]"
   Series:   [AI | Java | HiddenWorld]
   Files:    [total count]
   Scenes:   [content scene count] content + 1 scroll + 1 takeaway + 1 outro
   CSV phrases mapped: [N] → [N] content scenes (exact match ✓)
   Frames:   [TOTAL_FRAMES]
   Audio:    ✅ public/audio/[filename].wav
   Build:    ✅ npm run build — 0 errors
   Caption colors: ✅ #1A1A1A normal, #2563EB highlight
   Thematic SVGs:  ✅ present in all content scenes
```

---

## PART 19 — MULTI-DAY BATCH GENERATION PROTOCOL

> **This part is mandatory when generating more than one day in a single session.**
> The agent MUST follow every step in order. Do not skip any phase.

---

### PHASE 0 — RE-READ INSTRUCTIONS (before doing anything else)

**Before writing a single line of code or creating any file:**

```
ACTION REQUIRED: Read this file (.github/copilot-instructions.md) from top to bottom.
Then read: src/Instructions/remotion-best-practices.md
Then read: CLAUDE.md

Reason: Multi-day generation is long. Rules must be fresh in context before starting.
Do not rely on memory from earlier in the conversation. Re-read = required, not optional.
```

---

### PHASE 1 — DISCOVERY (before writing any files)

Run all of these checks for EVERY day in the batch before starting to generate code:

```
For each Day N in [N1, N2, N3, ...]:

  1. READ architecture file → extract:
       - Day N topic (exact text)
       - Day N module/section name
       - Day N+1 topic (for Outro scene)

  2. CHECK audio file:
       AI series:      ls src/Instructions/audio/ai{N}.wav
       Java series:    ls src/Instructions/audio/java{N}.wav
       HiddenWorld:    ls public/audio/day{N}_voiceover.wav

       If audio NOT in public/audio/ → mark as "needs copy"

  3. CHECK CSV transcript:
       AI series:      ls src/Instructions/ai{N}_word_by_word_transcript.csv
       Java series:    ls src/Instructions/java{N}_word_by_word_transcript.csv
       HiddenWorld:    ls public/day_{N}_transcript.csv

       If CSV missing → STOP and report which days are missing assets

  4. READ CSV last row → extract audio_duration_seconds

  5. CALCULATE for this day:
       AUDIO_FRAMES  = ceil(audio_duration_seconds * 30)
       AUDIO_END     = 150 + AUDIO_FRAMES
       TAKEAWAY_FROM = AUDIO_END + 30
       OUTRO_FROM    = TAKEAWAY_FROM + 120
       TOTAL_FRAMES  = OUTRO_FROM + 362

  6. READ full CSV → run phrase-group algorithm → count scenes
```

---

### PHASE 2 — PRINT THE FULL PLAN (mandatory before any code)

After PHASE 1, print this exact plan structure. Do not start coding until the plan is printed:

```
═══════════════════════════════════════════════════════════
BATCH GENERATION PLAN — [Series] Series
Days: [N1], [N2], [N3], ...
Total days: X
═══════════════════════════════════════════════════════════

DAY [N1] — "[Topic from architecture]"
  Audio:        public/audio/ai{N1}.wav  [EXISTS | NEEDS COPY]
  CSV:          src/Instructions/ai{N1}_word_by_word_transcript.csv  [EXISTS | MISSING]
  Audio dur:    XX.XXs → XXXX frames
  Total frames: XXXX
  Est. scenes:  XX content scenes + scroll + takeaway + outro
  Files to create:
    src/Day{N1}/Scene.tsx
    src/Day{N1}/helpers/timing.ts
    src/Day{N1}/helpers/components.tsx
    src/Day{N1}/frames/Scene01_ScrollTimeline.tsx
    src/Day{N1}/frames/Scene02_[Name].tsx
    ... (list all scene files)
    src/Day{N1}/frames/Scene{LAST}_Outro.tsx
  Root.tsx:     Add composition "AiDay{N1}"

DAY [N2] — "[Topic]"
  ... (same structure)

DAY [N3] — "[Topic]"
  ... (same structure)

═══════════════════════════════════════════════════════════
EXECUTION ORDER:
  Step 1:  Copy audio files to public/audio/ (all days)
  Step 2:  Generate Day N1 (all files)
  Step 3:  Verify Day N1 checklist
  Step 4:  RE-READ .github/copilot-instructions.md  ← mandatory between days
  Step 5:  Generate Day N2 (all files)
  Step 6:  Verify Day N2 checklist
  Step 7:  RE-READ .github/copilot-instructions.md  ← mandatory between days
  Step 8:  Generate Day N3 (all files)
  ...
  Final:   Update src/Root.tsx with all new compositions
═══════════════════════════════════════════════════════════
```

---

### PHASE 3 — PRE-GENERATION SETUP (do once for all days)

```bash
# Copy all audio files that need to be staged
cp "src/Instructions/audio/ai{N1}.wav" "public/audio/ai{N1}.wav"
cp "src/Instructions/audio/ai{N2}.wav" "public/audio/ai{N2}.wav"
# ... (all days that needed copy)

# Create all day folder structures
mkdir -p src/Day{N1}/helpers src/Day{N1}/frames
mkdir -p src/Day{N2}/helpers src/Day{N2}/frames
# ... (all days)
```

---

### PHASE 4 — PER-DAY GENERATION LOOP

Repeat this EXACT loop for each day, in order. Never skip a step.

```
╔══════════════════════════════════════════════════════════════╗
║  START OF DAY [N] GENERATION                                 ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  STEP 4.0 — RE-READ INSTRUCTIONS (mandatory, every day)      ║
║    Read: .github/copilot-instructions.md (full file)         ║
║    Read: src/Instructions/remotion-best-practices.md         ║
║    Read: CLAUDE.md bottleneck fixes section                  ║
║    Read: src/Instructions/architecture_{Series}.md           ║
║           → Day N entry (topic, module)                      ║
║           → Day N+1 entry (next day topic for Outro)         ║
║    Read: CSV for Day N (full transcript)                     ║
║                                                              ║
║  STEP 4.1 — WRITE helpers/timing.ts                         ║
║    - Set SERIES_ACCENT to correct hex for this series        ║
║    - Set ACCENT_R, ACCENT_G, ACCENT_B to match accent        ║
║    - SCENE_TIMING with all calculated from/duration values   ║
║    - COLORS object (complete, all keys — dark theme)         ║
║    - CAPTIONS array (one per content scene)                  ║
║    - All animation helpers (fadeIn, fadeOut, easeSnap, etc.) ║
║    ✓ Verify: TOTAL_FRAMES = OUTRO_FROM + 362                 ║
║    ✓ Verify: all scene 'from' values are non-overlapping     ║
║    ✓ Verify: CAPTIONS length = number of content scenes      ║
║    ✓ Verify: SERIES_ACCENT is correct for this series        ║
║                                                              ║
║  STEP 4.2 — WRITE helpers/components.tsx                     ║
║    - DarkBackground (#1D1D1C rect + white grid, 80px cells)  ║
║    - GlobalDefs (arrow marker using accent color)            ║
║    - Caption (y=1860 BOTTOM, white, Galaxie Copernicus)      ║
║    - BentoCard (bg_secondary #2C2C2B, rx=20)                 ║
║    - CornerAccents, Divider, SectionLabel                    ║
║    ✓ Verify: DarkBackground uses #1D1D1C + grid              ║
║    ✓ Verify: Caption at BOTTOM y=1860, fill=white            ║
║    ✓ Verify: All text uses Galaxie Copernicus ExtraBold      ║
║    ✓ Verify: No gradient in any component                    ║
║                                                              ║
║  STEP 4.3 — WRITE frames/Scene01_ScrollTimeline.tsx          ║
║    - ALL_DAYS array populated from architecture file         ║
║    - currentDay highlighted in sky_blue                      ║
║    - Scroll animation: frame 0→120, ease bezier              ║
║    - Clip path applied                                       ║
║    - Scene fades out frames 130→149                          ║
║    ✓ Verify: ROW_H=220, VISIBLE=6, VIEW_Y=300               ║
║    ✓ Verify: ALL_DAYS has correct count for series           ║
║                                                              ║
║  STEP 4.4 — WRITE frames/Scene02 through Scene{LAST-2}       ║
║    For each content scene:                                    ║
║    - DarkBackground FIRST in SVG (NOT PaperBackground)       ║
║    - GlobalDefs SECOND                                       ║
║    - Zone A: SectionLabel (module name, y≈160, accent color) ║
║    - Zone B: headline (H1 100-120px, Galaxie Copernicus)     ║
║    - Zone C: bento cards + thematic SVG illustration         ║
║    - Caption at y=1860 BOTTOM, white, Galaxie Copernicus     ║
║    ✓ Verify: NO content element above y=60 or below y=1740   ║
║    ✓ Verify: NO overlapping bounding boxes                   ║
║    ✓ Verify: NO gradient, glow, emoji                        ║
║    ✓ Verify: ALL colors from COLORS object                   ║
║    ✓ Verify: ALL text uses Galaxie Copernicus ExtraBold      ║
║    ✓ Verify: ALL bento cards use bg_secondary (#2C2C2B)      ║
║    ✓ Verify: Scene content matches CSV phrase exactly        ║
║    ✓ Verify: All font sizes ≥ 32px                           ║
║                                                              ║
║  STEP 4.5 — WRITE frames/Scene{LAST-1}_KeyTakeaway.tsx       ║
║    - DarkBackground (dark #1D1D1C + grid)                    ║
║    - Typographic summary of the day's core concept           ║
║    - Main concept in COLORS.accent (series accent), 96-120px ║
║    - Supporting line in COLORS.white, Galaxie Copernicus     ║
║    - Duration: 120 frames                                    ║
║                                                              ║
║  STEP 4.6 — WRITE frames/Scene{LAST}_Outro.tsx               ║
║    - DarkBackground (dark #1D1D1C + grid)                    ║
║    - Current day summary bento cards                         ║
║    - "TOMORROW" → Day N+1 topic (from architecture file)     ║
║    - 3 key concepts from today in bento tiles                ║
║    - CTA text in COLORS.accent (no emoji, SVG arrow only)    ║
║    - Galaxie Copernicus ExtraBold throughout                 ║
║    - Duration: 362 frames                                    ║
║    ✓ Verify: next day topic is CORRECT (re-check arch file)  ║
║                                                              ║
║  STEP 4.7 — WRITE Scene.tsx (orchestrator)                   ║
║    - AbsoluteFill with background={COLORS.bg_primary}        ║
║    - Audio in <Sequence from={150}> NOT from={0}             ║
║    - ALL scenes listed with premountFor={30}                 ║
║    - TOTAL_FRAMES in file header comment                     ║
║    ✓ Verify: Audio Sequence from={150}                       ║
║    ✓ Verify: every Sequence has premountFor={30}             ║
║    ✓ Verify: all scene imports present                       ║
║                                                              ║
║  STEP 4.8 — DAY [N] COMPLETION CHECKPOINT                    ║
║    Print this marker verbatim:                               ║
║                                                              ║
║    ✅ DAY [N] COMPLETE — "[Topic]"                            ║
║       Files created: X                                       ║
║       Scenes: X content + scroll + takeaway + outro          ║
║       Total frames: XXXX (~XXs)                              ║
║       Audio: public/audio/ai{N}.wav                          ║
║       Root.tsx: pending (will batch-update at end)           ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝

   ↓  ↓  ↓  ↓  ↓  ↓  ↓  ↓  ↓  ↓  ↓  ↓  ↓  ↓  ↓  ↓  ↓  ↓

   ⚠️  RE-READ .github/copilot-instructions.md NOW
   ⚠️  RE-READ src/Instructions/remotion-best-practices.md
   ⚠️  This is MANDATORY before starting the next day.
   ⚠️  Do not skip this even if you feel you remember the rules.
   ⚠️  Context drift is real in long generations.

   ↓  ↓  move to next day  ↓  ↓
```

---

### PHASE 5 — BATCH ROOT.TSX UPDATE (after ALL days complete)

Only after every day in the batch is complete, update `src/Root.tsx` once:

```tsx
// Add imports for all new days
import { Day{N1}Scene } from './Day{N1}/Scene';
import { Day{N2}Scene } from './Day{N2}/Scene';
import { Day{N3}Scene } from './Day{N3}/Scene';

// Add compositions inside the correct <Folder>
<Folder name="AI-Series">
  {/* existing days ... */}
  <Composition id="AiDay{N1}" component={Day{N1}Scene} durationInFrames={TOTAL_{N1}} fps={30} width={1080} height={1920} />
  <Composition id="AiDay{N2}" component={Day{N2}Scene} durationInFrames={TOTAL_{N2}} fps={30} width={1080} height={1920} />
  <Composition id="AiDay{N3}" component={Day{N3}Scene} durationInFrames={TOTAL_{N3}} fps={30} width={1080} height={1920} />
</Folder>
```

---

### PHASE 6 — FINAL BATCH REPORT

After Root.tsx is updated, print this summary:

```
═══════════════════════════════════════════════════════════════
BATCH GENERATION COMPLETE
═══════════════════════════════════════════════════════════════

Series: [AI | Java | HiddenWorld]

┌─────┬──────────────────────────────────┬────────┬────────┬────────┐
│ Day │ Topic                            │ Scenes │ Frames │ Audio  │
├─────┼──────────────────────────────────┼────────┼────────┼────────┤
│ N1  │ [topic]                          │ XX     │ XXXX   │ ✅     │
│ N2  │ [topic]                          │ XX     │ XXXX   │ ✅     │
│ N3  │ [topic]                          │ XX     │ XXXX   │ ✅     │
└─────┴──────────────────────────────────┴────────┴────────┴────────┘

Root.tsx: Updated with X new compositions
All backgrounds: ✅ #1D1D1C dark + white grid
Series accents:  ✅ correct accent per series
Font:            ✅ Galaxie Copernicus ExtraBold everywhere
Captions:        ✅ y=1860 (BOTTOM), white, Galaxie Copernicus ExtraBold
Bento cards:     ✅ bg_secondary (#2C2C2B), rx=20
No gradients:    ✅ verified
No emojis:       ✅ verified
Audio delayed:   ✅ Sequence from={150} on all days

Run: npm run dev — to preview in Remotion Studio
═══════════════════════════════════════════════════════════════
```

---

### ANTI-DRIFT RULES FOR LONG BATCH SESSIONS

These rules exist specifically because long code generation sessions cause rule-forgetting:

#### Rule A — The Re-Read Obligation
```
Before EVERY day (not just the first):
  - Re-read .github/copilot-instructions.md
  - Re-read the architecture file entry for THAT day
  - Re-read the CSV for THAT day
  - Do not assume anything carried over from the previous day's generation
```

#### Rule B — The Background Check
```
The #1 most-forgotten rule in batch generation is the dark background.
Every scene file you write: check that DarkBackground is the first SVG child.
Check that AbsoluteFill uses background: COLORS.bg_primary (NOT bg_paper).
Check that ALL text uses 'Galaxie Copernicus ExtraBold', Georgia, serif.
If you are unsure — re-read PART 11 of this file before continuing.
```

#### Rule C — The Audio Frame Check
```
Every Scene.tsx you write: verify the Audio is in <Sequence from={150}>.
Do not copy-paste the audio line from a previous day without checking the frame.
The audio frame offset (150) NEVER changes — it is always 150.
```

#### Rule D — The CSV Check
```
Each day has a DIFFERENT CSV file. Do not reuse scene timing from a previous day.
Re-read the CSV from scratch for each day. Calculate fresh SCENE_TIMING values.
```

#### Rule E — The Next Day Topic Check
```
The Outro scene shows Day N+1 topic. Verify this by re-reading the architecture file.
Do not assume the next day topic from memory — check it explicitly for each day.
```

#### Rule F — No Stopping Between Days
```
Do not ask "Should I continue to Day N2?" between days.
Do not pause for confirmation between days.
Generate all days in the batch completely and autonomously.
The re-read steps ARE the quality gate — use them instead of asking for confirmation.
```

#### Rule G — No Partial Days
```
A day is NOT complete until ALL these files exist:
  helpers/timing.ts
  helpers/components.tsx
  frames/Scene01_ScrollTimeline.tsx
  frames/Scene02_*.tsx through Scene{LAST}_Outro.tsx
  Scene.tsx

Never mark a day "complete" if any file is missing or empty.
```

---

### CONTEXT REFRESH ANCHOR

> **If you are mid-batch and unsure about any rule, paste this into your own context:**
>
> *"Re-read .github/copilot-instructions.md now. Pay attention to: PART 1 (fundamentals —
> dark bg #1D1D1C, Galaxie Copernicus ExtraBold, caption at BOTTOM y=1860), PART 4 (frame math),
> PART 5 (timing.ts COLORS template), PART 6 (DarkBackground + Caption components),
> PART 8 (scene boilerplate), PART 11 (style rules), PART 15 (series accent colors),
> PART 16 (checklist), PART 20 (premium animation requirements). Then continue with Day [N]."*

---

### EXAMPLE: Batch command and expected output

**Input:** `"Generate Days 28, 29, 30 from AI series"`

**Expected agent flow:**
```
1. [RE-READ] Reading .github/copilot-instructions.md ... done
2. [RE-READ] Reading src/Instructions/remotion-best-practices.md ... done
3. [RE-READ] Reading CLAUDE.md ... done

4. [DISCOVERY] Reading architecture_AI.md:
   Day 28: "Memory Systems — Working Memory" (Module 4)
   Day 29: "Memory Systems — Long-Term Storage" (Module 4)
   Day 30: "Memory Systems — Retrieval" (Module 4)
   Day 29: (for Day 28 Outro) "Long-Term Storage"
   Day 30: (for Day 29 Outro) "Retrieval"
   Day 31: (for Day 30 Outro) "Forgetting and Decay"

5. [DISCOVERY] Checking audio files:
   src/Instructions/audio/ai28.wav → NEEDS COPY to public/audio/
   src/Instructions/audio/ai29.wav → NEEDS COPY to public/audio/
   src/Instructions/audio/ai30.wav → NEEDS COPY to public/audio/

6. [DISCOVERY] Reading CSV files:
   ai28: duration = 82.4s → 2472 frames, ~16 content scenes
   ai29: duration = 76.1s → 2283 frames, ~14 content scenes
   ai30: duration = 88.7s → 2661 frames, ~18 content scenes

7. [PLAN] Printing full plan...
   (plan output as shown in PHASE 2 template above)

8. [SETUP] Copying audio files to public/audio/...
9. [SETUP] Creating folder structures...

═══ GENERATING DAY 28 ═══
[RE-READ] Reading instructions... done
[RE-READ] Reading ai28 CSV... done (82.4s, 16 phrases)
Writing src/Day28/helpers/timing.ts ... done
Writing src/Day28/helpers/components.tsx ... done
Writing src/Day28/frames/Scene01_ScrollTimeline.tsx ... done
Writing src/Day28/frames/Scene02_WorkingMemoryDefined.tsx ... done
... (all scenes)
Writing src/Day28/Scene.tsx ... done
✅ DAY 28 COMPLETE — "Memory Systems — Working Memory"
   Files: 21 | Scenes: 18 | Frames: 3084 | Audio: ✅

⚠️ RE-READING .github/copilot-instructions.md before Day 29...
⚠️ RE-READING src/Instructions/remotion-best-practices.md...

═══ GENERATING DAY 29 ═══
[RE-READ] Reading instructions... done
[RE-READ] Reading ai29 CSV... done (76.1s, 14 phrases)
Writing src/Day29/helpers/timing.ts ... done
...
✅ DAY 29 COMPLETE — "Memory Systems — Long-Term Storage"

⚠️ RE-READING .github/copilot-instructions.md before Day 30...

═══ GENERATING DAY 30 ═══
...
✅ DAY 30 COMPLETE — "Memory Systems — Retrieval"

[ROOT] Updating src/Root.tsx with 3 new compositions...
[REPORT] Printing final batch summary...
```

---

## PART 20 — PREMIUM ANIMATION REQUIREMENTS

> **This PART is mandatory reading before writing ANY scene file.**
> Basic animation is REJECTED. Every scene must be premium quality with ≥ 300 lines of code.

---

### 20.1 — THE 300-LINE HARD RULE

```
Every scene file (except Scene01_ScrollTimeline.tsx) MUST be ≥ 300 lines of code.

After writing each file, count its lines.
If the count is < 300:
  → Expand Zone C with more diagram elements
  → Add Phase 3 micro-animations (pulse, float, shimmer)
  → Add more staggered sub-items to existing cards
  → Add SVG path-draw connectors between elements
  → Add a counter animation or number tick-up
  → Never pad with blank lines or comments — pad with real visual content

This is a non-negotiable minimum. A 180-line scene is a FAILED scene.
```

---

### 20.2 — WHAT "BASIC" MEANS (and why it is FORBIDDEN)

The following are **basic** animations. They are **FORBIDDEN** as the sole animation on any element:

| ❌ Basic (forbidden alone) | ✅ Premium replacement |
|---|---|
| `opacity: interpolate(frame, [0,20], [0,1])` | Spring entrance with translateY + opacity together |
| `scale: interpolate(frame, [0,20], [0.8,1])` | `spring()` with SPRING_SNAP config |
| Static colored rect that appears all at once | Rect with animated strokeDashoffset border draw |
| Arrow that pops in with a single opacity | Arrow drawn via path strokeDashoffset over 20 frames |
| Text that fades in without movement | Text slides up 28px while fading in via spring |
| All elements animate at frame 0 simultaneously | Stagger: each element delayed 10–14 frames from previous |
| Flat colored icon | Icon with animated stroke + inner fill separately timed |
| Number displayed statically | Counter that ticks from 0 → final value over 40 frames |

---

### 20.3 — AVAILABLE LIBRARIES AND WHEN TO USE EACH

#### A. `remotion` — spring + interpolate (USE IN EVERY SCENE)
```tsx
import { spring, interpolate, Easing, useCurrentFrame } from 'remotion';

// spring() for every entrance — NOT plain interpolate
const progress = spring({ frame, fps: 30, config: { damping: 18, stiffness: 180, mass: 0.8 } });
const translateY = interpolate(progress, [0, 1], [32, 0]);  // 32px drop → 0
const opacity    = interpolate(progress, [0, 0.3], [0, 1], { extrapolateRight: 'clamp' });
```

Spring configs to use:
```typescript
const SPRING_CONFIG = { damping: 18, stiffness: 180, mass: 0.8 }; // standard entrance
const SPRING_SOFT   = { damping: 22, stiffness: 120, mass: 1.0 }; // slow reveal
const SPRING_SNAP   = { damping: 12, stiffness: 260, mass: 0.6 }; // snappy pop
const SPRING_HEAVY  = { damping: 28, stiffness: 100, mass: 1.4 }; // dramatic weight
```

#### B. `@remotion/transitions` (USE for scene-level transition effects — optional)
```tsx
import { TransitionSeries, springTiming } from '@remotion/transitions';
import { slide } from '@remotion/transitions/slide';
import { wipe } from '@remotion/transitions/wipe';
import { fade } from '@remotion/transitions/fade';

// Use in Scene.tsx to wrap content scenes with smooth slide/wipe between them
<TransitionSeries>
  <TransitionSeries.Sequence durationInFrames={duration1}>
    <SceneA />
  </TransitionSeries.Sequence>
  <TransitionSeries.Transition
    timing={springTiming({ config: { damping: 20, stiffness: 140 } })}
    presentation={slide({ direction: 'from-bottom' })}
  />
  <TransitionSeries.Sequence durationInFrames={duration2}>
    <SceneB />
  </TransitionSeries.Sequence>
</TransitionSeries>
```

#### C. 3D libraries — COMPLETELY FORBIDDEN
```
❌ @react-three/fiber   — DO NOT import or use
❌ @remotion/three      — DO NOT import or use
❌ three / Three.js     — DO NOT import or use
❌ ThreeCanvas          — DO NOT use
❌ WebGL / canvas 3D    — DO NOT use

This project is STRICTLY 2D. All visual complexity is achieved through:
  → SVG primitives (path, rect, circle, polygon, text)
  → spring() + interpolate() animation
  → strokeDashoffset path-draw effects
  → SVG transform (translate/rotate/scale) driven by frame math
  → Math.sin/cos oscillation for organic motion
  → Layered 2D elements for depth illusion (parallax by translate only)

If you feel you need 3D for a concept — instead draw a flat diagram using
SVG shapes that COMMUNICATES the same idea without 3D rendering.
```

#### D. SVG inline animations (USE IN EVERY SCENE for diagrams)
```tsx
// Path-draw (strokeDashoffset) — for all arrows, connectors, borders
const pathLength = 340; // measure real path length with SVG tools
const dashOffset = interpolate(frame, [30, 55], [pathLength, 0], {
  extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  easing: Easing.bezier(0.4, 0, 0.2, 1),
});

<path
  d="M 100,500 C 100,700 540,700 540,900"
  fill="none" stroke={COLORS.sky_blue} strokeWidth={3}
  strokeDasharray={pathLength} strokeDashoffset={dashOffset}
  strokeLinecap="round"
/>
```

#### E. Canvas 2D (USE for particle effects and dot fields)
```tsx
import { useRef, useEffect } from 'react';

// Mount a <canvas> inside AbsoluteFill for particle fields, dot grids, flowing lines
// Animate by writing to canvas each render based on useCurrentFrame()
// Example: animated dot field that ripples outward from center
```

#### F. `lucide-react` / `react-icons` (USE for icon glyphs, not SVG from scratch)
```tsx
import { Cpu, Zap, Database, Network } from 'lucide-react';
// Render inside <foreignObject> or use their SVG path data directly
// Animate opacity + scale with spring() like any other element
```

---

### 20.4 — MANDATORY ANIMATION PHASES (every scene needs ≥ 3)

Every scene file must contain comments marking at least these 3 phases:

```tsx
// ── Phase 1: Scene reveal (frames 0–25) ──────────────────────────────────────
// Paper lifts (scaleY spring 0.98→1), section label slides in, headline springs up
// ALL elements in this phase: spring() entrance, NOT interpolate fade

// ── Phase 2: Content build (frames 20–90, stagger 12 frames each) ────────────
// Cards, diagrams, code blocks, path-draw connectors animate in
// Each element individually delayed — never all at frame 0
// Path-draw used for ALL lines, arrows, and diagram connectors

// ── Phase 3: Steady-state micro-animations (frames 80→end) ───────────────────
// Subtle float (Math.sin * 4px), scale pulse (1 ± 0.015), shimmer opacity
// Counters that tick during this phase
// Highlight/ring pulses on key elements
// Connector lines that animate opacity (0.6→1→0.6 breathing)
```

---

### 20.5 — PREMIUM TECHNIQUES REFERENCE

#### Staggered cascade
```tsx
// Every sibling element gets its own spring with increasing delay
const STAGGER = 12; // frames between each element
const items = ['Alpha', 'Beta', 'Gamma', 'Delta'];
const springs = items.map((_, i) => {
  const f = Math.max(0, frame - i * STAGGER);
  return spring({ frame: f, fps: 30, config: SPRING_CONFIG });
});
```

#### Headline typewriter effect
```tsx
const text = "AI Agent Loops";
const charsVisible = Math.floor(
  interpolate(frame, [10, 10 + text.length * 1.5], [0, text.length], {
    extrapolateRight: 'clamp',
  })
);
const displayText = text.slice(0, charsVisible);
// Render with a blinking cursor rect
```

#### Counter / odometer tick-up
```tsx
function useCounter(frame: number, start: number, end: number, fromFrame: number, duration: number) {
  const raw = interpolate(frame, [fromFrame, fromFrame + duration], [start, end], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  return Math.round(raw);
}
const displayValue = useCounter(frame, 0, 97, 40, 45); // 0→97 over 45 frames starting at f=40
```

#### Ink-reveal clip path
```tsx
// Reveal diagram from left to right as if being drawn by a pen
const revealWidth = interpolate(frame, [30, 70], [0, 960], {
  extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  easing: Easing.bezier(0.25, 0, 0.75, 1),
});
<defs>
  <clipPath id="inkReveal">
    <rect x={60} y={0} width={revealWidth} height={1920} />
  </clipPath>
</defs>
<g clipPath="url(#inkReveal)">
  {/* entire diagram — reveals from left */}
</g>
```

#### Parallax layers (depth illusion)
```tsx
// Foreground moves faster than background based on a slow oscillation or scroll progress
const scrollPct = interpolate(frame, [0, sceneDuration], [0, 1], { extrapolateRight: 'clamp' });
const bgY    = interpolate(scrollPct, [0, 1], [0, -40]);   // slow
const midY   = interpolate(scrollPct, [0, 1], [0, -80]);   // medium
const fgY    = interpolate(scrollPct, [0, 1], [0, -140]);  // fast
```

#### Animated SVG border (border-draw on card appear)
```tsx
// Card border draws around the rect perimeter as the card enters
const PERIMETER = 2 * (960 + 160); // 2 * (width + height)
const borderDash = interpolate(frame, [cardDelay, cardDelay + 30], [PERIMETER, 0], {
  extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
});
<rect x={60} y={460} width={960} height={160} rx={16}
  fill="none" stroke={COLORS.sky_blue} strokeWidth={2.5}
  strokeDasharray={PERIMETER} strokeDashoffset={borderDash} />
```

#### Multi-line headline with per-word spring
```tsx
const FONT = "'Galaxie Copernicus ExtraBold', Georgia, serif";
const words = ["Artificial", "Intelligence", "Loops"];
words.map((word, i) => {
  const f = Math.max(0, frame - i * 8);
  const sp = spring({ frame: f, fps: 30, config: SPRING_SNAP });
  const ty = interpolate(sp, [0, 1], [24, 0]);
  const op = interpolate(sp, [0, 0.4], [0, 1], { extrapolateRight: 'clamp' });
  return (
    <text key={i}
      x={60} y={300 + i * 110}
      opacity={op}
      transform={`translate(0, ${ty})`}
      fontFamily={FONT} fontSize={96} fontWeight={800}
      fill={COLORS.white}
    >
      {word}
    </text>
  );
});
```

---

### 20.6 — ZONE C DENSITY RULES

Zone C (y=520–1740) must use at least 70% of the available 1220px height.
Do NOT leave large empty areas. Use bento cards to fill the space.

| Content type | Minimum elements in Zone C |
|---|---|
| Concept explanation scene | 3 cards OR 2 cards + 1 large diagram |
| Comparison scene | 2-column layout, minimum 4 rows |
| Flow/process scene | 4–6 step nodes with animated connectors between each |
| Data/stats scene | 2 large counters + 2 supporting detail cards |
| Definition scene | 1 large hero term + 3 supporting facts + 1 visual diagram |

All elements must be connected where logical — use SVG path-draw connectors, not just separate floating boxes.

---

### 20.7 — ANTI-PATTERNS (will cause REJECTION during PART 16 checklist)

```
❌ Scene with only 1 large text block and no diagram
❌ All elements fade in at frame 0 simultaneously (no stagger)
❌ Any arrow or line that appears instantly without strokeDashoffset draw
❌ Counter displayed as static text when a tick-up animation makes sense
❌ Phase 3 empty — scene is fully static after frame 80
❌ Zone C less than 60% filled (large empty whitespace in the middle)
❌ Spring configs hardcoded inline with different numbers each time
   → use the 4 named SPRING_CONFIG constants from 20.3.A
❌ 3D scene without ambient + directional light
❌ Canvas element with no per-frame update logic
❌ lucide-react icon rendered at < 48px
❌ Using framer-motion — it is FORBIDDEN (CSS-based, breaks Remotion render)
❌ Using CSS transition: or animation: anywhere
❌ Using @react-three/fiber, @remotion/three, or three.js — ALL 3D is FORBIDDEN
❌ Using ThreeCanvas or any WebGL/3D context
❌ Using PaperBackground — replaced by DarkBackground
❌ Using COLORS.bg_paper — old light theme, FORBIDDEN
❌ Using fontFamily="'Inter', ..." — FORBIDDEN (use Galaxie Copernicus ExtraBold)
❌ Caption at y=140 (top) — MUST be at y=1860 (bottom)
❌ Dark caption text (#1A1A1A) on dark background — use white (#FFFFFF)
❌ Content below y=1740 — caption zone starts there
❌ Bento cards without rx=20 and bg_secondary fill
```

---

### 20.8 — SCENE FILE STRUCTURE TEMPLATE (with premium requirements)

Every scene file must follow this section ordering:

```
1. JSDoc block (6–10 lines) — includes animation phases description + series accent
2. Imports — remotion + helpers + any premium library
3. const FONT = "'Galaxie Copernicus ExtraBold', Georgia, serif"  ← mandatory
4. SPRING_CONFIG constants (copy from 20.3.A — all 4)
5. Helper functions (useSpringEntrance, usePathDraw, useCounter, etc.)
6. Export component function
   6a. useCurrentFrame() + fps constant
   6b. Phase 1 spring variables (all labeled with phase comment)
   6c. Phase 2 spring variables (staggered, labeled)
   6d. Phase 3 micro-animation variables (sin/cos/pulse, labeled)
   6e. Counter variables (if used)
   6f. Caption lookup
   6g. return JSX
      - AbsoluteFill with bg_primary background (NOT bg_paper)
      - <svg> root
      - DarkBackground as first child (NOT PaperBackground)
      - GlobalDefs (SECOND, always)
      - Zone A (section label with spring entrance)
      - Zone B (headline with per-word spring)
      - Zone C (diagrams, cards, connectors — fully filled)
      - Caption (LAST, fixed y=140 (TOP))
```

If you follow this structure fully, the file will naturally reach 300+ lines.

---

### 20.9 — CONTEXT REFRESH FOR PREMIUM ANIMATIONS

> If you are mid-batch and feel like making a "simpler" scene to save time —
> **do not**. Re-read PART 20.2 (what "basic" means) and PART 20.5 (techniques).
> Every scene, every day, must be premium. The quality bar does not lower for later scenes in a batch.
