# VS Code Copilot Agent — Remotion Video Generation Instructions

## HOW TO TRIGGER VIDEO GENERATION

### Single day
Say: **"Generate Day [N] from [AI | Java | HiddenWorld] series"**

### Multiple days (batch)
Say: **"Generate Days [N1] through [N2] from [AI | Java | HiddenWorld] series"**
Or: **"Generate Days [N1], [N2], [N3] from [AI | Java | HiddenWorld] series"**

When generating multiple days → follow **PART 17 — MULTI-DAY BATCH PROTOCOL** first.
It defines the mandatory planning phase and the per-day re-read loop.

### Single day workflow
Copilot will:
1. Read the architecture file for Day N context + Day N+1 topic
2. Locate the correct audio file and copy it to `public/audio/` if needed
3. Read the CSV transcript completely
4. Generate all files for `src/Day{N}/`
5. Update `src/Root.tsx`

---

## PART 1 — PROJECT FUNDAMENTALS

| Property | Value |
|---|---|
| Canvas | 1080 × 1920 px portrait |
| FPS | 30 |
| Background | `#F5F0E8` warm paper — **every single scene, zero exceptions** |
| Audio file location | Must be in `public/audio/` for `staticFile()` to work |
| Audio start (composition frame) | Frame **150** — after the silent scroll animation |
| Scene 01 always | `Scene01_ScrollTimeline` — 150 frames, **SILENT**, no audio |
| Last scene always | `Scene{LAST}_Outro` — 362 frames, shows next day topic |
| Captions | **SVG `<text>`**, `y=1780`, center anchor, **no background rect** |

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

**Step A — Identify series and read architecture:**
```
AI series       → src/Instructions/architecture_AI.md
Java series     → src/Instructions/architecture_java.md
HiddenWorld     → src/Instructions/architecture.md
```
Read Day N entry for: topic, module context.
Read Day N+1 entry for: next day topic (needed in Outro).

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

// ── Color palette ── use ONLY these, never raw hex codes outside this object ──
export const COLORS = {
  bg_paper:       '#F5F0E8',   // warm off-white — THE ONLY background color
  deep_black:     '#1A1A1A',   // body text, outlines, structural
  sky_blue:       '#2563EB',   // primary accent: headlines, key labels, active state
  green:          '#16A34A',   // success, positive, secondary accent
  orange:         '#EA580C',   // energy, speed, heat, warnings
  brown:          '#92400E',   // earth, structural warmth
  amber:          '#D97706',   // engineering, technical highlight
  cool_silver:    '#94A3B8',   // secondary text, passive labels
  vibrant_red:    '#DC2626',   // errors only — use sparingly
  purple:         '#7C3AED',   // AI/neural/digital concepts
  text_caption:   '#1A1A1A',   // ALL caption normal words
  text_highlight: '#2563EB',   // caption key-word highlight
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
 * RULE: PaperBackground must be the first child of AbsoluteFill in EVERY scene.
 */
import React from 'react';
import { useCurrentFrame } from 'remotion';
import { COLORS } from './timing';

// ── Paper background — USE IN EVERY SINGLE SCENE ─────────────────────────────
// Always the FIRST element inside AbsoluteFill
export const PaperBackground: React.FC = () => (
  <g>
    {/* Warm paper base */}
    <rect width={1080} height={1920} fill={COLORS.bg_paper} />
    {/* Paper grain — subtle dot grid */}
    {Array.from({ length: 12 * 22 }, (_, i) => (
      <circle
        key={i}
        cx={(i % 12) * 90 + 45}
        cy={Math.floor(i / 12) * 88 + 44}
        r={1.4}
        fill={COLORS.deep_black}
        opacity={0.032}
      />
    ))}
  </g>
);

// ── SVG defs (call once per scene) ───────────────────────────────────────────
export const GlobalDefs: React.FC = () => (
  <defs>
    <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L0,6 L8,3 z" fill={COLORS.sky_blue} />
    </marker>
  </defs>
);

// ── Caption — FIXED POSITION, NO BACKGROUND ──────────────────────────────────
// ALWAYS at y=1780, center x=540, no rect/background behind it
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
    Math.min(1, localFrame / 8) *              // fade in over 8 frames
    Math.min(1, (sceneDuration - localFrame) / 8); // fade out over 8 frames

  // Split into words, flag key words for highlight
  const words = text.split(' ');
  const lowerKeys = keyWords.map(k => k.toLowerCase());

  // Handle long captions: wrap at 52 chars
  const lines: string[][] = [];
  let currentLine: string[] = [];
  let lineLength = 0;

  words.forEach(word => {
    if (lineLength + word.length + 1 > 52 && currentLine.length > 0) {
      lines.push(currentLine);
      currentLine = [word];
      lineLength = word.length;
    } else {
      currentLine.push(word);
      lineLength += word.length + 1;
    }
  });
  if (currentLine.length > 0) lines.push(currentLine);

  const baseY = lines.length === 1 ? 1780 : 1762;
  const lineGap = 48;

  return (
    <g opacity={opacity}>
      {lines.map((lineWords, lineIdx) => (
        <text
          key={lineIdx}
          x={540}
          y={baseY + lineIdx * lineGap}
          textAnchor="middle"
          fontFamily="'Inter', system-ui, sans-serif"
          fontSize={38}
          fontWeight={700}
        >
          {lineWords.map((word, i) => {
            const isKey = lowerKeys.some(k =>
              word.toLowerCase().replace(/[.,!?]/g, '').includes(k)
            );
            return (
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

// ── Corner accent decoration ──────────────────────────────────────────────────
export const CornerAccents: React.FC<{ opacity?: number; color?: string }> = ({
  opacity = 0.4, color = COLORS.sky_blue,
}) => (
  <g opacity={opacity}>
    <path d="M 60,70 L 60,150 M 60,70 L 140,70"   fill="none" stroke={color} strokeWidth={3} strokeLinecap="round" />
    <path d="M 1020,70 L 1020,150 M 1020,70 L 940,70" fill="none" stroke={color} strokeWidth={3} strokeLinecap="round" />
    <path d="M 60,1850 L 60,1770 M 60,1850 L 140,1850"   fill="none" stroke={color} strokeWidth={3} strokeLinecap="round" />
    <path d="M 1020,1850 L 1020,1770 M 1020,1850 L 940,1850" fill="none" stroke={color} strokeWidth={3} strokeLinecap="round" />
  </g>
);

// ── Divider line ──────────────────────────────────────────────────────────────
export const Divider: React.FC<{ y: number; opacity?: number }> = ({ y, opacity = 0.15 }) => (
  <line x1={60} y1={y} x2={1020} y2={y} stroke={COLORS.deep_black} strokeWidth={1} opacity={opacity} />
);

// ── Section label (zone A — topic anchor) ────────────────────────────────────
export const SectionLabel: React.FC<{ text: string; y?: number; opacity?: number }> = ({
  text, y = 120, opacity = 0.6,
}) => (
  <text
    x={60} y={y}
    fontFamily="'Inter', system-ui, sans-serif"
    fontSize={24} fontWeight={500}
    fill={COLORS.cool_silver}
    letterSpacing="0.18em"
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
    // AbsoluteFill background must match bg_paper — acts as fallback
    <AbsoluteFill style={{ background: COLORS.bg_paper }}>

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

```tsx
/**
 * Scene {N} — {Scene Name}
 * "{Exact spoken phrase from CSV}"
 * CSV: {start_time}s → {end_time}s
 * Duration: {frames} frames ({seconds}s)
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { COLORS, SCENE_TIMING, CAPTIONS, ease, snapIn } from '../helpers/timing';
import { PaperBackground, GlobalDefs, Caption, SectionLabel } from '../helpers/components';

export const Scene{N}_{Name}: React.FC = () => {
  const frame = useCurrentFrame();  // LOCAL frame (0-based inside this Sequence)

  // Entrance animations — always use extrapolateRight: 'clamp'
  const enter = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: 'clamp',
    easing: ease,
  });

  // For staggered elements (offset each by 8 frames):
  // const item1 = interpolate(frame, [0, 18],  [0, 1], { extrapolateRight: 'clamp', easing: ease });
  // const item2 = interpolate(frame, [8, 26],  [0, 1], { extrapolateRight: 'clamp', easing: ease });
  // const item3 = interpolate(frame, [16, 34], [0, 1], { extrapolateRight: 'clamp', easing: ease });

  // Slide-up for titles:
  // const slideY = interpolate(frame, [0, 22], [28, 0], { extrapolateRight: 'clamp', easing: ease });

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s{N}.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_paper }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>

        {/* ALWAYS FIRST — paper background */}
        <PaperBackground />
        <GlobalDefs />

        {/* ZONE A — Topic anchor label (y=80–180) */}
        <SectionLabel text="MODULE NAME · CONCEPT" y={120} opacity={enter * 0.55} />

        {/* ZONE B — Primary statement (y=190–440) */}
        <text
          x={60} y={260}
          fontFamily="'Inter', system-ui, sans-serif"
          fontSize={72} fontWeight={800}
          fill={COLORS.deep_black}
          opacity={enter}
        >
          Main Headline
        </text>
        {/* For long headlines, break into multiple <text> at y=260, y=348, y=436 */}

        {/* ZONE C — Main visual content (y=460–1700) */}
        {/* Use SVG shapes, paths, text elements */}
        {/* NEVER use position: absolute on child elements inside SVG */}
        {/* VERIFY bounding boxes don't overlap */}

        {/* CAPTION ZONE — FIXED POSITION, NO BACKGROUND */}
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

---

## PART 9 — Scene01_ScrollTimeline EXACT IMPLEMENTATION

```tsx
/**
 * Scene01_ScrollTimeline
 * Duration: 150 frames = 5s (SILENT — no audio plays during this scene)
 * Shows: full day list from architecture file, scrolls to current day N
 * Row height: 220px — exactly 6 rows visible at a time
 */
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { COLORS } from '../helpers/timing';
import { PaperBackground } from '../helpers/components';

interface Props {
  currentDay: number;    // e.g. 27
  seriesTitle: string;   // e.g. "AGENTIC AI · FIRST PRINCIPLES"
}

// !! IMPORTANT: Replace this array with EVERY day from the architecture file
// For AI series: 120 entries from architecture_AI.md
// For Java series: 105 entries from architecture_java.md
// For HiddenWorld: 120 entries from architecture.md
const ALL_DAYS = [
  { day: 1,  topic: "What Is Intelligence?" },
  { day: 2,  topic: "Tokens and Language" },
  // ... FILL ALL DAYS FROM ARCHITECTURE FILE
  { day: 27, topic: "Tools" },  // ← current day
  // ... remaining days
];

const ROW_H   = 220;   // px per row
const VISIBLE = 6;     // rows visible at once
const VIEW_H  = ROW_H * VISIBLE;                   // 1320px
const VIEW_Y  = Math.round((1920 - VIEW_H) / 2);   // 300px — top of visible window

export const Scene01_ScrollTimeline: React.FC<Props> = ({ currentDay, seriesTitle }) => {
  const frame = useCurrentFrame();

  // Scroll from Day 1 at top → current day centered
  // Target: current day row is at index (currentDay - 1)
  // Center means: scroll so that (currentDay - 1 - 2.5) rows are above viewport top
  const targetScrollY = -(currentDay - 1 - Math.floor(VISIBLE / 2) + 0.5) * ROW_H;
  const clampedTarget = Math.min(0, Math.max(
    -(ALL_DAYS.length - VISIBLE) * ROW_H,
    targetScrollY,
  ));

  const scrollY = interpolate(
    frame,
    [0, 120],
    [0, clampedTarget],
    { extrapolateRight: 'clamp', easing: Easing.bezier(0.22, 1, 0.36, 1) },
  );

  // Overall scene fade-out at end (frames 130–149)
  const sceneFade = interpolate(frame, [130, 149], [1, 0], { extrapolateRight: 'clamp' });

  // Header fade-in
  const headerEnter = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ background: COLORS.bg_paper }}>
      <svg
        style={{ position: 'absolute', inset: 0, opacity: sceneFade }}
        width={1080}
        height={1920}
      >
        <PaperBackground />

        {/* Header — series title — FIXED, does NOT scroll */}
        <text
          x={540} y={190}
          textAnchor="middle"
          fontFamily="'Inter', system-ui, sans-serif"
          fontSize={26} fontWeight={500}
          fill={COLORS.cool_silver}
          letterSpacing="0.22em"
          opacity={headerEnter * 0.7}
        >
          {seriesTitle}
        </text>

        {/* Clip scrolling rows to visible window */}
        <defs>
          <clipPath id={`scrollClip-d${currentDay}`}>
            <rect x={0} y={VIEW_Y} width={1080} height={VIEW_H} />
          </clipPath>
        </defs>

        {/* Top & bottom fade gradients for scroll window — use opacity mask, not gradient fill */}
        <rect x={0} y={VIEW_Y}         width={1080} height={48}  fill={COLORS.bg_paper} opacity={0.85} />
        <rect x={0} y={VIEW_Y + VIEW_H - 48} width={1080} height={48}  fill={COLORS.bg_paper} opacity={0.85} />

        {/* Scrolling rows group */}
        <g
          clipPath={`url(#scrollClip-d${currentDay})`}
          transform={`translate(0, ${VIEW_Y + scrollY})`}
        >
          {ALL_DAYS.map((d, idx) => {
            const isCurrent = d.day === currentDay;
            const rowY = idx * ROW_H;

            return (
              <g key={d.day}>
                {/* Current day background tint */}
                {isCurrent && (
                  <rect
                    x={60} y={rowY + 10}
                    width={960} height={ROW_H - 20}
                    rx={8}
                    fill={COLORS.sky_blue}
                    opacity={0.06}
                  />
                )}

                {/* Left accent bar — current day only */}
                {isCurrent && (
                  <rect x={60} y={rowY + 30} width={6} height={160} rx={3} fill={COLORS.sky_blue} />
                )}

                {/* Day number */}
                <text
                  x={isCurrent ? 90 : 80}
                  y={rowY + 85}
                  fontFamily="'Inter', system-ui, sans-serif"
                  fontSize={isCurrent ? 52 : 40}
                  fontWeight={isCurrent ? 900 : 600}
                  fill={isCurrent ? COLORS.sky_blue : COLORS.deep_black}
                  opacity={isCurrent ? 1 : 0.45}
                >
                  {`DAY ${d.day}`}
                </text>

                {/* Topic title */}
                <text
                  x={isCurrent ? 90 : 80}
                  y={rowY + 142}
                  fontFamily="'Inter', system-ui, sans-serif"
                  fontSize={isCurrent ? 34 : 28}
                  fontWeight={isCurrent ? 700 : 400}
                  fill={isCurrent ? COLORS.deep_black : COLORS.cool_silver}
                  opacity={isCurrent ? 0.9 : 0.4}
                >
                  {d.topic}
                </text>

                {/* Row divider */}
                <line
                  x1={60} y1={rowY + ROW_H - 1}
                  x2={1020} y2={rowY + ROW_H - 1}
                  stroke={COLORS.deep_black}
                  strokeWidth={1}
                  opacity={0.07}
                />
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
EVERY scene: <PaperBackground /> as first SVG child
EVERY AbsoluteFill: style={{ background: COLORS.bg_paper }}
ZERO pure white (#FFFFFF) backgrounds
ZERO pure black (#000000) backgrounds  
ZERO colored background panels
```

### Colors — ONLY FROM COLORS OBJECT
```
✅ fill={COLORS.sky_blue}
❌ fill="#2563EB"    ← raw hex not allowed outside COLORS definition
❌ fill="blue"      ← CSS color names not allowed
❌ fill={`rgba(...)`} ← rgba not allowed for background fills
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
```

### Typography minimum sizes
```
Display/hero number:  240–360px, weight 900
Scene headline:       64–96px,   weight 800
Section title:        52–72px,   weight 700
Key term label:       44–56px,   weight 700
Body text:            36–44px,   weight 500
Supporting label:     28–34px,   weight 400
Caption:              38px,      weight 700  ← FIXED
Absolute minimum:     28px — never go below this
```

### Layout safe zones
```
Top padding:    y ≥ 80px    (nothing above)
Bottom content: y ≤ 1740px  (leave room for captions)
Caption zone:   y = 1760–1860 (reserved for captions ONLY)
Left margin:    x = 60px
Right margin:   x = 1020px
Usable width:   960px
```

### Anti-overlap rule
```
Before placing any element, calculate its bounding box:
  text bounding box  = (x, y - fontSize, x + estimatedWidth, y)
  rect bounding box  = (x, y, x + width, y + height)

Minimum clearance:
  text-to-text:    24px vertical
  SVG element-to-text: 20px
  Element-to-edge: 60px left/right, 80px top, 40px above caption zone
```

### Captions — FIXED SPECIFICATION (never change these values)
```
Position:     x=540, y=1780, textAnchor="middle"
Font:         Inter, 38px, weight 700
Lines:        max 52 chars/line; 2nd line at y=1808 if needed
Background:   NONE — zero rect behind captions
Border:       NONE
Highlight:    key words in COLORS.text_highlight (#2563EB)
Fade:         8 frames in / 8 frames out
```

---

## PART 12 — LAYOUT PATTERNS FOR ZONE C

Choose ONE per scene. Do not mix patterns.

### Pattern A — Statement + Bullet List
```tsx
// Title statement at y=240, then bullet rows starting y=460
// Each bullet row: accent bar (6×52px) at x=60, text at x=90
// Row height: 100px, so rows at y=460, 560, 660, 760
// Max 4 bullets. If more needed → split into 2 scenes
{['Point one text', 'Point two text', 'Point three text'].map((item, i) => (
  <g key={i} opacity={itemEnters[i]}>
    <rect x={60} y={460 + i * 100} width={6} height={52} rx={3} fill={COLORS.sky_blue} />
    <text x={90} y={496 + i * 100}
      fontFamily="'Inter', system-ui, sans-serif"
      fontSize={40} fontWeight={600} fill={COLORS.deep_black}>
      {item}
    </text>
  </g>
))}
```

### Pattern B — Two-Column Comparison
```tsx
// Vertical divider at x=540
// Left panel x=60–500, Right panel x=580–1020
// Panel header at y=300, content at y=400+

<line x1={540} y1={260} x2={540} y2={1680} stroke={COLORS.deep_black} strokeWidth={1} opacity={0.15} />

{/* Left panel */}
<text x={280} y={320} textAnchor="middle" fontSize={36} fontWeight={700} fill={COLORS.cool_silver}>
  BEFORE
</text>

{/* Right panel */}
<text x={800} y={320} textAnchor="middle" fontSize={36} fontWeight={700} fill={COLORS.sky_blue}>
  AFTER
</text>
```

### Pattern C — Flow Diagram (max 4 nodes, max 5 arrows)
```tsx
// Nodes: rounded rects, stroke = accent, fill = accent at opacity 0.1
// Labels: inside nodes, fontSize=36, fontWeight=700
// Arrows: path with marker-end="url(#arrow)" from GlobalDefs

const NODE_W = 280, NODE_H = 80;
// Node positions — choose: horizontal row, vertical stack, or L-shape

<rect x={100} y={500} width={NODE_W} height={NODE_H} rx={12}
  fill={COLORS.sky_blue} fillOpacity={0.1}
  stroke={COLORS.sky_blue} strokeWidth={2} />
<text x={100 + NODE_W/2} y={548} textAnchor="middle"
  fontSize={36} fontWeight={700} fill={COLORS.deep_black}>
  NODE LABEL
</text>

{/* Arrow connecting nodes */}
<line x1={380} y1={540} x2={480} y2={540}
  stroke={COLORS.sky_blue} strokeWidth={2.5}
  markerEnd="url(#arrow)" />
```

### Pattern D — Large Number / Statistic
```tsx
// For dramatic single facts: "45 minutes", "385,000 km", "2 seconds"
<text x={540} y={900} textAnchor="middle"
  fontFamily="'Inter', system-ui, sans-serif"
  fontSize={320} fontWeight={900}
  fill={COLORS.sky_blue}
  opacity={enter * 0.15}>  {/* ghost layer */}
  45
</text>
<text x={540} y={900} textAnchor="middle"
  fontFamily="'Inter', system-ui, sans-serif"
  fontSize={280} fontWeight={900}
  fill={COLORS.deep_black}
  opacity={enter}>
  45
</text>
<text x={540} y={980} textAnchor="middle"
  fontSize={52} fontWeight={500} fill={COLORS.cool_silver} opacity={enter}>
  MINUTES
</text>
```

### Pattern E — Code Block (Java series or technical concepts)
```tsx
// Monospace font block with left border
<rect x={60} y={400} width={960} height={600} rx={8}
  fill={COLORS.deep_black} fillOpacity={0.04}
  stroke={COLORS.sky_blue} strokeWidth={0} />
<rect x={60} y={400} width={6} height={600} rx={3} fill={COLORS.sky_blue} />

{codeLines.map((line, i) => (
  <text key={i} x={90} y={448 + i * 52}
    fontFamily="'Fira Code', 'Courier New', monospace"
    fontSize={32} fontWeight={400}
    fill={line.isKeyword ? COLORS.sky_blue : COLORS.deep_black}>
    {line.text}
  </text>
))}
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

### Visual explanation mandate
- Each scene must explain its concept WITHOUT audio (muted viewer test)
- Use SVG diagrams, number callouts, comparison layouts, flow arrows
- Text-only scenes are acceptable but must use large typographic hierarchy

### One concept per scene
- Exactly ONE main idea per scene
- Max 4 supporting elements (bullets, nodes, diagram pieces)
- If you need 5+ elements → split into 2 scenes
- Generous negative space is correct design

---

## PART 15 — SERIES-SPECIFIC ACCENT COLORS

| Series | Primary accent | Secondary | Scroll series title |
|---|---|---|---|
| AI | `sky_blue` (#2563EB) | `purple` (#7C3AED) | `"AGENTIC AI · FIRST PRINCIPLES"` |
| Java | `orange` (#EA580C) | `sky_blue` (#2563EB) | `"NATIONAL RAILWAY · JAVA"` |
| HiddenWorld 🎮 Gaming | `purple` (#7C3AED) | `sky_blue` | `"HIDDEN WORLD SECRETS"` |
| HiddenWorld 🚀 Space | `sky_blue` (#2563EB) | `cool_silver` | `"HIDDEN WORLD SECRETS"` |
| HiddenWorld 🏎️ Auto | `orange` (#EA580C) | `amber` | `"HIDDEN WORLD SECRETS"` |
| HiddenWorld 🔭 Science | `green` (#16A34A) | `sky_blue` | `"HIDDEN WORLD SECRETS"` |

---

## PART 16 — PRE-PUBLISH CHECKLIST

Before considering a day complete, verify every file:

**timing.ts**
- [ ] TOTAL_FRAMES calculated correctly: 150 + audio_frames + 30 + 120 + 362
- [ ] Every scene has both `from` and `duration`
- [ ] No `from` values overlap for adjacent scenes (gaps allowed, overlaps not)
- [ ] CAPTIONS array has one entry per content scene
- [ ] All COLORS entries present

**components.tsx**
- [ ] PaperBackground renders `#F5F0E8` rect + dot grain
- [ ] Caption fixed at y=1780, center anchor x=540, no background rect
- [ ] No gradient in any component

**Scene01_ScrollTimeline.tsx**
- [ ] ALL_DAYS array contains every day from the architecture file
- [ ] currentDay entry highlighted in sky_blue
- [ ] ROW_H=220, VISIBLE=6, VIEW_Y=300
- [ ] Clip path applied to scrolling rows
- [ ] Scene fades out at frames 130–149

**Every content scene**
- [ ] `<PaperBackground />` is first SVG child
- [ ] `<GlobalDefs />` is second SVG child (if using arrows)
- [ ] No element above y=80 (except PaperBackground)
- [ ] No content element below y=1740
- [ ] Caption is present and uses CAPTIONS array
- [ ] All colors from COLORS object
- [ ] No gradient, no blur filter, no emoji
- [ ] All font sizes ≥ 28px
- [ ] All `interpolate()` calls have `extrapolateRight: 'clamp'`
- [ ] No overlapping bounding boxes

**Scene.tsx**
- [ ] Audio `<Sequence from={150}>` (not from={0})
- [ ] All scenes have `premountFor={30}`
- [ ] AbsoluteFill has `style={{ background: COLORS.bg_paper }}`

**Root.tsx**
- [ ] New composition registered with correct TOTAL_FRAMES
- [ ] Composition inside appropriate `<Folder>`

---

## PART 17 — MULTI-DAY BATCH GENERATION PROTOCOL

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
║    - SCENE_TIMING with all calculated from/duration values   ║
║    - COLORS object (complete, all keys)                      ║
║    - CAPTIONS array (one per content scene)                  ║
║    - All animation helpers (fadeIn, fadeOut, easeSnap, etc.) ║
║    ✓ Verify: TOTAL_FRAMES = OUTRO_FROM + 362                 ║
║    ✓ Verify: all scene 'from' values are non-overlapping     ║
║    ✓ Verify: CAPTIONS length = number of content scenes      ║
║                                                              ║
║  STEP 4.2 — WRITE helpers/components.tsx                     ║
║    - PaperBackground (bg_paper rect + dot grain)             ║
║    - GlobalDefs (arrow marker)                               ║
║    - Caption (y=1780, no background, key-word highlighting)  ║
║    - CornerAccents, Divider, SectionLabel                    ║
║    ✓ Verify: PaperBackground uses #F5F0E8                    ║
║    ✓ Verify: Caption has NO background rect                  ║
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
║    - PaperBackground FIRST in SVG                            ║
║    - GlobalDefs SECOND                                       ║
║    - Zone A: SectionLabel (module name)                      ║
║    - Zone B: headline (matches spoken phrase exactly)        ║
║    - Zone C: visual diagram/layout                           ║
║    - Caption at y=1780 with correct keyWords                 ║
║    ✓ Verify: NO element above y=80 or below y=1740           ║
║    ✓ Verify: NO overlapping bounding boxes                   ║
║    ✓ Verify: NO gradient, glow, emoji                        ║
║    ✓ Verify: ALL colors from COLORS object                   ║
║    ✓ Verify: Scene content matches CSV phrase exactly        ║
║    ✓ Verify: All font sizes ≥ 28px                           ║
║                                                              ║
║  STEP 4.5 — WRITE frames/Scene{LAST-1}_KeyTakeaway.tsx       ║
║    - Paper background                                        ║
║    - Typographic summary of the day's core concept           ║
║    - Main concept in sky_blue, large (72–96px)               ║
║    - Supporting line in deep_black (44px)                    ║
║    - Duration: 120 frames                                    ║
║                                                              ║
║  STEP 4.6 — WRITE frames/Scene{LAST}_Outro.tsx               ║
║    - Paper background                                        ║
║    - Current day summary section                             ║
║    - "TOMORROW" → Day N+1 topic (from architecture file)     ║
║    - 3 key concepts from today                               ║
║    - CTA text (no emoji, SVG arrow only)                     ║
║    - Duration: 362 frames                                    ║
║    ✓ Verify: next day topic is CORRECT (re-check arch file)  ║
║                                                              ║
║  STEP 4.7 — WRITE Scene.tsx (orchestrator)                   ║
║    - AbsoluteFill with background={COLORS.bg_paper}          ║
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
All backgrounds: ✅ #F5F0E8 paper
No gradients:    ✅ verified
No emojis:       ✅ verified
Captions fixed:  ✅ y=1780, no background
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
The #1 most-forgotten rule in batch generation is the paper background.
Every scene file you write: check that PaperBackground is the first SVG child.
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
> *"Re-read .github/copilot-instructions.md now. Pay attention to: PART 1 (fundamentals),
> PART 4 (frame math), PART 5 (timing.ts template), PART 8 (scene boilerplate),
> PART 11 (style rules), PART 16 (checklist). Then continue with Day [N]."*

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
