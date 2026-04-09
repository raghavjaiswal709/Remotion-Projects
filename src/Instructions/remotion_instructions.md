# REMOTION PRODUCTION INSTRUCTIONS
# Global Daily — Hidden World Secrets Series
# Video Generation System V1 — Remotion Edition

---

## WHAT THIS FILE IS

This file is the complete production specification for generating full-length episodes of the Hidden World Secrets series using **Remotion** — the React-based programmatic video framework. Every episode is a TypeScript/React Remotion composition rendered to a 1080×1920 vertical video (9:16, YouTube Shorts / Reels format) at **30 fps**.

This file defines:
1. How to break down the script into precise timestamped word-level cues
2. How to map 60 Remotion scenes across the exact duration of the script
3. The design system (colors, typography, motion tokens) derived from each style file
4. The Remotion component architecture every episode must follow
5. Scene-by-scene animation specifications
6. The active style for each episode (read from the style file in `/styles/`)

All style files live in `motion_instructions/styles/`. The active style is declared per episode at the top of each episode's scene-data file.

---

## PART 1 — VIDEO SPECIFICATIONS

```
Format:          Vertical 9:16
Resolution:      1080 × 1920 px
Frame rate:      30 fps
Duration:        55 – 65 seconds = 1650 – 1950 frames
Audio:           Voiceover MP3 synchronized word-by-word via captions JSON
Codec:           H.264 (Remotion default)
Output:          outputs/Day [N]/Day_[N]_video.mp4
Composition ID:  HiddenWorldDay[N]
```

---

## PART 2 — SCRIPT TIMESTAMP BREAKDOWN SYSTEM

### How to Time-Code the Script

Every episode script (from `outputs/Day [N]/Day_[N]_output.md`) must be broken into **word-level timestamp cues** before any scene can be built. This is the timestamping process:

**STEP 1 — MEASURE TOTAL WORD COUNT**
Count every word in the script (excluding the series anchor line which is spoken but brief). A natural Indian teacher reading pace is **2.4 to 2.8 words per second**. Use **2.6 wps** as the calibration baseline.

**STEP 2 — ASSIGN SENTENCE-LEVEL TIMESTAMPS**
Split the script into individual sentences. For each sentence, calculate:
- `startTime` = cumulative elapsed seconds at sentence start
- `endTime` = startTime + (wordCount ÷ 2.6)
- Add **0.15s natural pause** after each sentence end before the next sentence starts

**STEP 3 — CONVERT TO FRAMES**
`frameIn = Math.round(startTime × 30)`
`frameOut = Math.round(endTime × 30)`

**STEP 4 — OUTPUT THE CUE MAP**
The result is a `scriptCues` array in the episode's scene-data file:

```typescript
// scriptCues — one entry per sentence
export const scriptCues: ScriptCue[] = [
  {
    id: 1,
    text: "Every AI you have ever used — every chatbot, every image generator, every autocomplete — is not an agent.",
    frameIn: 90,       // Scene 1 day card = frames 0–89
    frameOut: 207,
    wordCount: 19,
    durationSec: 7.3,
  },
  // ... continue for every sentence
];
```

---

## PART 3 — THE 60-SCENE SYSTEM

### Scene Density Rule

Every episode has **exactly 60 Remotion scenes**. Scenes are not one-per-sentence — they are micro-beats of the visual story, firing at precise frame offsets. Each scene is a self-contained Remotion `<AbsoluteFill>` component that mounts, animates, and unmounts within its window.

### Scene Duration Categories

| Category | Duration | Frame Count | When to Use |
|---|---|---|---|
| FLASH | 0.5s | 15 frames | Single-word emphasis, hard cuts |
| BEAT | 1.0s | 30 frames | Quick visual beats between major scenes |
| SHORT | 1.5s | 45 frames | Simple single-object reveals |
| MEDIUM | 2.5s | 75 frames | Standard explanatory scenes |
| LONG | 4.0s | 120 frames | Complex diagram builds, key reveals |
| HOLD | 6.0s | 180 frames | Anchor beats, critical definition moments |

### Scene Pacing Structure — 60 Scenes Across 60 Seconds

```
FRAMES 0 – 89       (3.0s)   SCENES 01–02  — Day Card + Snap Zoom
FRAMES 90 – 269     (6.0s)   SCENES 03–07  — Opening Shocking Fact
FRAMES 270 – 539    (9.0s)   SCENES 08–14  — The Real Mechanism (how model works)
FRAMES 540 – 809    (9.0s)   SCENES 15–21  — The Contrast (what agent is)
FRAMES 810 – 1139   (11.0s)  SCENES 22–32  — The Hidden Truth (loop definition)
FRAMES 1140 – 1409  (9.0s)   SCENES 33–41  — Deeper Hidden Truth (no memory, no self)
FRAMES 1410 – 1649  (8.0s)   SCENES 42–50  — The Mechanism (tight loop, autonomy)
FRAMES 1650 – 1799  (5.0s)   SCENES 51–56  — The Implication (gap between tool and agent)
FRAMES 1800 – 1949  (5.0s)   SCENES 57–60  — Final Statement + Outro Hold
```

---

## PART 4 — DESIGN SYSTEM

All design tokens are derived from the active style file. The system below is pre-compiled for **style_pencil_art_AI** (the default AI episode style). Override tokens when using a different style.

### 4.1 — Color Tokens

```typescript
// design-tokens/colors.ts  (style_pencil_art_AI)
export const colors = {
  // Backgrounds
  bg_paper:          '#F5F0E8',   // warm off-white paper — all illustration scenes
  bg_black:          '#000000',   // pure black — day card + explanation override scenes
  bg_paper_grain:    'url(#paperGrain)',  // SVG noise filter reference

  // Primary palette
  electric_cyan:     '#00E5FF',   // all AI data flows, loop arrows, active connections
  deep_black:        '#0D0D0D',   // all structural outlines, robot chassis lines
  warm_blue:         '#3B82F6',   // AI robot core fills, agent central panels
  cool_silver:       '#C8D0D4',   // passive processor chassis, secondary outlines
  light_gray:        '#B0B8BD',   // hatching fills, dormant unit fills, support lines
  soft_white:        '#F9FAFB',   // inner fills, clean zones inside diagrams

  // State colors
  vibrant_red:       '#EF4444',   // rejection, error, stop states
  vibrant_green:     '#22C55E',   // success, connected, healthy states

  // Text
  text_day_number:   '#C8D0D4',   // "DAY 23" on black background
  text_title:        '#3B82F6',   // episode title on black background
  text_series:       '#6B7280',   // "HIDDEN WORLD SECRETS" on black background
  text_caption:      '#0D0D0D',   // in-scene labels on paper background
  text_override:     '#C8D0D4',   // labels on explanation override (black bg) scenes
};
```

### 4.2 — Typography Tokens

```typescript
// design-tokens/typography.ts
export const typography = {
  // Day card
  day_number: {
    fontFamily:  '"Inter", "SF Pro Display", sans-serif',
    fontWeight:  900,
    fontSize:    180,        // px at 1080w
    letterSpacing: '-0.04em',
    lineHeight:  1.0,
    color:       colors.text_day_number,
  },
  episode_title: {
    fontFamily:  '"Inter", "SF Pro Display", sans-serif',
    fontWeight:  700,
    fontSize:    64,
    letterSpacing: '-0.02em',
    lineHeight:  1.1,
    color:       colors.text_title,
    textTransform: 'uppercase' as const,
  },
  series_label: {
    fontFamily:  '"Inter", sans-serif',
    fontWeight:  400,
    fontSize:    28,
    letterSpacing: '0.12em',
    textTransform: 'uppercase' as const,
    color:       colors.text_series,
  },

  // In-scene pencil labels (rendered as SVG text inside scene components)
  scene_label: {
    fontFamily:  '"Caveat", "Patrick Hand", cursive',  // pencil handwritten feel
    fontWeight:  600,
    fontSize:    36,
    color:       colors.text_caption,
    letterSpacing: '0.01em',
  },

  // Voiceover caption bar
  caption: {
    fontFamily:  '"Inter", sans-serif',
    fontWeight:  600,
    fontSize:    40,
    lineHeight:  1.4,
    color:       '#FFFFFF',
    background:  'rgba(0,0,0,0.72)',
    borderRadius: 12,
    paddingX:    24,
    paddingY:    12,
  },

  // Explanation override scenes
  override_label: {
    fontFamily:  '"Inter", sans-serif',
    fontWeight:  300,
    fontSize:    44,
    letterSpacing: '0.08em',
    color:       colors.text_override,
  },
};
```

### 4.3 — Motion Tokens

```typescript
// design-tokens/motion.ts
export const motion = {
  // Easing curves
  ease_snap:      [0.22, 1, 0.36, 1] as const,   // fast-in, hard settle — for snap zooms
  ease_smooth:    [0.4, 0, 0.2, 1] as const,     // standard smooth in/out
  ease_draw:      [0.0, 0.0, 0.4, 1] as const,   // line draw: slow start, accelerates
  ease_drift:     [0.25, 0.46, 0.45, 0.94] as const, // gentle environmental drift

  // Standard durations (in frames at 30fps)
  snap_duration:      8,    // snap zoom punch
  fade_in:           12,    // element fade in
  fade_out:           8,    // element fade out
  draw_speed:        20,    // SVG path stroke-dashoffset animation per 100px
  slide_in:          18,    // element sliding into frame
  scale_reveal:      15,    // scale from 0.85 → 1.0

  // Scene transitions
  cut:                0,    // hard cut — no frames
  dissolve:          10,    // opacity cross-fade
  wipe_right:        12,    // translateX reveal

  // Paper grain animation (subtle, always on)
  grain_fps:         12,    // grain texture cycles at 12fps for natural feel
};
```

### 4.4 — Paper Grain SVG Filter

Every illustration scene uses this SVG `<defs>` filter applied to the scene root:

```tsx
// components/PaperGrain.tsx
export const PaperGrain = () => (
  <svg style={{ position: 'absolute', width: 0, height: 0 }}>
    <defs>
      <filter id="paperGrain" x="0%" y="0%" width="100%" height="100%"
              colorInterpolationFilters="sRGB">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.68"
          numOctaves="4"
          stitchTiles="stitch"
          result="noise"
        />
        <feColorMatrix
          type="saturate"
          values="0"
          in="noise"
          result="grayNoise"
        />
        <feBlend
          in="SourceGraphic"
          in2="grayNoise"
          mode="multiply"
          result="blended"
        />
        <feComponentTransfer in="blended">
          <feFuncA type="linear" slope="0.06" />
        </feComponentTransfer>
        <feComposite in="SourceGraphic" in2="blended" operator="over" />
      </filter>
    </defs>
  </svg>
);
```

---

## PART 5 — REMOTION PROJECT ARCHITECTURE

```
src/
├── Root.tsx                        ← registers all compositions
├── compositions/
│   └── HiddenWorldDay[N]/
│       ├── index.tsx               ← master composition, stitches all 60 scenes
│       ├── sceneData.ts            ← scriptCues[], sceneList[], episode config
│       └── scenes/
│           ├── Scene01_DayCard.tsx
│           ├── Scene02_SnapZoom.tsx
│           ├── Scene03_Opening.tsx
│           ├── ...
│           └── Scene60_FadeOut.tsx
├── components/
│   ├── PaperBackground.tsx         ← off-white paper with grain filter
│   ├── BlackBackground.tsx         ← pure black for override + day card
│   ├── PaperGrain.tsx              ← SVG grain filter definition
│   ├── AIRobot.tsx                 ← reusable SVG robot component
│   ├── ProcessorUnit.tsx           ← reusable AI model box (input→output)
│   ├── LoopArrow.tsx               ← reusable closed-cycle SVG arc
│   ├── DrawPath.tsx                ← animated SVG path stroke-dashoffset
│   ├── FadeIn.tsx                  ← opacity interpolation wrapper
│   ├── SlideIn.tsx                 ← translateX/Y interpolation wrapper
│   ├── SnapZoom.tsx                ← scale snap punch wrapper
│   ├── CaptionBar.tsx              ← voiceover caption overlay
│   ├── SplitPanel.tsx              ← two-column layout with divider
│   └── SceneWrapper.tsx            ← AbsoluteFill + transition + paper bg
├── design-tokens/
│   ├── colors.ts
│   ├── typography.ts
│   └── motion.ts
├── hooks/
│   ├── useDrawPath.ts              ← stroke-dashoffset animation hook
│   └── useScriptCue.ts             ← returns active cue at current frame
└── public/
    ├── audio/
    │   └── day[N]_voiceover.mp3
    └── fonts/
        ├── Inter-Variable.woff2
        └── Caveat-Variable.woff2
```

---

## PART 6 — MASTER COMPOSITION STRUCTURE

```tsx
// compositions/HiddenWorldDay23/index.tsx
import { AbsoluteFill, Audio, Sequence, useCurrentFrame } from 'remotion';
import { sceneList } from './sceneData';

export const HiddenWorldDay23: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    // ⚠️ Do NOT set backgroundColor on AbsoluteFill — paper scenes render their own bg
    <AbsoluteFill>

      {/* Voiceover audio — starts at frame 0 (beginning of composition) */}
      {/* The audio file itself is trimmed so it starts at the right moment */}
      <Audio src={staticFile('audio/day23_voiceover.mp3')} startFrom={0} />

      {/* All scenes rendered as timed Sequences */}
      {sceneList.map((scene) => (
        <Sequence
          key={scene.id}
          from={scene.frameIn}
          durationInFrames={scene.frameOut - scene.frameIn}
          name={scene.name}
        >
          <scene.Component />
        </Sequence>
      ))}

      {/* ── GLOBAL subtitle overlay — centralized here, NOT in individual scene components */}
      {/* Covers the full composition duration. WordByWordSubtitle handles its own fade-in/out. */}
      <Sequence durationInFrames={TOTAL_FRAMES}>
        <WordByWordSubtitle
          transcriptPath={TRANSCRIPT_CSV}
          audioOffsetFrames={AUDIO_OFFSET_FRAMES}
          keywords={GLOBAL_KEYWORDS}
        />
      </Sequence>

    </AbsoluteFill>
  );
};
```

---

## PART 7 — SCENE DATA FILE FORMAT

Every episode has a `sceneData.ts` that declares all 60 scenes with exact frame windows. This is the single source of truth for timing.

```typescript
// compositions/HiddenWorldDay23/sceneData.ts

import { Scene01_DayCard } from './scenes/Scene01_DayCard';
import { Scene02_SnapZoom } from './scenes/Scene02_SnapZoom';
// ... import all 60 scene components

export interface ScriptCue {
  id: number;
  text: string;
  frameIn: number;
  frameOut: number;
  wordCount: number;
  durationSec: number;
}

export interface SceneEntry {
  id: number;
  name: string;
  frameIn: number;
  frameOut: number;
  durationFrames: number;
  category: 'FLASH' | 'BEAT' | 'SHORT' | 'MEDIUM' | 'LONG' | 'HOLD';
  speechRef: number[];       // which scriptCue IDs this scene covers
  layoutType: string;        // from style file layout_types
  Component: React.FC;
}
```

---

## PART 8 — DAY 23 COMPLETE SCRIPT TIMESTAMP BREAKDOWN

### Episode Config

```
Episode:         Day 23 — A Model Is Not an Agent
Style:           style_pencil_art_AI
Total words:     ~160
Duration target: 60 seconds = 1800 frames
FPS:             30
WPS calibration: 2.6 words/second
Audio starts:    Frame 90 (after 3s day card)
```

### Full Script with Sentence-Level Timestamps

```
SCRIPT SENTENCE BREAKDOWN — Day 23
All times relative to audio start (t=0 = frame 90)

──────────────────────────────────────────────────────────────────
 #   SENTENCE                                           WORDS  SEC   FRAME_IN  FRAME_OUT
──────────────────────────────────────────────────────────────────
 S1  "Every AI you have ever used — every chatbot,
      every image generator, every autocomplete —
      is not an agent."                                  19    7.3s    90        309
     + 0.15s pause                                              ──     309       314

 S2  "It never has been."                                4     1.5s   314        359
     + 0.15s pause                                              ──     359        364

 S3  "This is Day 23 of 120."                            6     2.3s   364        433
     + 0.15s pause                                              ──     433        437

 S4  "A model takes one input and produces one output."  9     3.5s   437        541
     + 0.15s pause                                              ──     541        545

 S5  "One step."                                         2     0.8s   545        568
     + 0.15s pause                                              ──     568        572

 S6  "That is the complete transaction."                 6     2.3s   572        641
     + 0.15s pause                                              ──     641        645

 S7  "It does not remember what it just said."           8     3.1s   645        737
     + 0.15s pause                                              ──     737        741

 S8  "It does not know what happened after it spoke."    9     3.5s   741        845
     + 0.15s pause                                              ──     845        850

 S9  "It processes, outputs, and stops."                 5     1.9s   850        907
     + 0.15s pause                                              ──     907        911

 S10 "An agent does something the model cannot."         8     3.1s   911       1003
     + 0.15s pause                                              ──    1003       1007

 S11 "It observes what its output caused in the world."  9     3.5s  1007       1111
     + 0.15s pause                                              ──    1111       1115

 S12 "It takes that observation and feeds it back
      as the next input."                                12    4.6s  1115       1253
     + 0.15s pause                                              ──    1253       1257

 S13 "It loops."                                         2     0.8s  1257       1280
     + 0.15s pause                                              ──    1280       1284

 S14 "The loop is not a feature."                        6     2.3s  1284       1353
     + 0.25s dramatic pause                                     ──    1353       1360

 S15 "The loop is the definition."                       5     1.9s  1360       1417
     + 0.3s dramatic pause                                      ──    1417       1426

 S16 "Without the loop, you have a very sophisticated
      calculator."                                       10    3.8s  1426       1540
     + 0.15s pause                                              ──    1540       1544

 S17 "With the loop, you have something that can
      pursue a goal across time."                        13    5.0s  1544       1694
     + 0.2s pause                                               ──    1694       1700

 S18 "Most people believe the AI they talk to is
      thinking, watching, deciding."                     13    5.0s  1700       1850
     + 0.15s pause                                              ──    1850       1854

 S19 "It is not."                                        3     1.2s  1854       1889
     + 0.2s pause                                               ──    1889       1895

 S20 "It produces a response and disappears."            7     2.7s  1895       1975
     + 0.15s pause                                              ──    1975       1979

 S21 "The next time you type, it is rebuilt entirely
      from scratch."                                     11    4.2s  1979       2105
     + 0.15s pause                                              ──    2105       2109

 S22 "There is no continuity."                           4     1.5s  2109       2154
     + 0.15s pause                                              ──    2154       2158

 S23 "There is no self that persisted between
      your messages."                                    10    3.8s  2158       2272
     + 0.25s pause                                              ──    2272       2279

 S24 "What makes an agent dangerous — and powerful —
      is not intelligence."                              11    4.2s  2279       2405
     + 0.15s pause                                              ──    2405       2409

 S25 "It is the loop."                                   4     1.5s  2409       2454
     + 0.3s pause                                               ──    2454       2463

 S26 "A sufficiently tight loop means the system
      can correct itself, adapt its strategy, and
      escalate its behaviour without a human
      in the chain."                                     25    9.6s  2463       2751
     + 0.15s pause                                              ──    2751       2755

 S27 "You are not worried about models."                 7     2.7s  2755       2835
     + 0.15s pause                                              ──    2835       2840

 S28 "You are not even interacting with agents
      most of the time."                                 10    3.8s  2840       2954
     + 0.15s pause                                              ──    2954       2958

 S29 "But the gap between them is exactly the gap
      between a tool and something that acts."           16    6.2s  2958       3143
     + 0.5s final hold                                          ──    3143       3158

──────────────────────────────────────────────────────────────────
TOTAL AUDIO DURATION: (3143 - 90) / 30 = ~101s
NOTE: Adjust WPS to 2.8 to target 60s ≈ 1800 total frames.
Recalibrated frame map at 2.8 wps provided in the 60-scene table below.
──────────────────────────────────────────────────────────────────
```

### Recalibrated at 2.8 wps — 60-Second Target

```
At 2.8 wps, 160 words ≈ 57.1s audio. Add ~3s day card. Total ≈ 60s = 1800 frames.

RECALIBRATED CUES (frames — audio at frame 90):
  S1:  f90  → f272   (≈6.1s, 17 wds)
  S2:  f277 → f320   (≈1.4s,  4 wds)
  S3:  f325 → f389   (≈2.1s,  6 wds)   ← EXPLANATION OVERRIDE
  S4:  f395 → f491   (≈3.2s,  9 wds)
  S5:  f496 → f517   (≈0.7s,  2 wds)   ← FLASH
  S6:  f522 → f586   (≈2.1s,  6 wds)
  S7:  f592 → f678   (≈2.9s,  8 wds)
  S8:  f683 → f780   (≈3.2s,  9 wds)
  S9:  f786 → f840   (≈1.8s,  5 wds)
  S10: f846 → f932   (≈2.9s,  8 wds)
  S11: f937 → f033   (≈3.2s,  9 wds)
  S12: f1038→ f1167  (≈4.3s, 12 wds)
  S13: f1172→ f1194  (≈0.7s,  2 wds)   ← FLASH
  S14: f1200→ f1264  (≈2.1s,  6 wds)
  S15: f1275→ f1328  (≈1.8s,  5 wds)
  S16: f1338→ f1445  (≈3.6s, 10 wds)
  S17: f1451→ f1590  (≈4.6s, 13 wds)
  S18: f1596→ f1735  (≈4.6s, 13 wds)
  S19: f1741→ f1775  (≈1.1s,  3 wds)   ← FLASH
  S20: f1781→ f1856  (≈2.5s,  7 wds)
  S21: f1862→ f1974  (≈3.7s, 11 wds)
  S22: f1980→ f2023  (≈1.4s,  4 wds)
  S23: f2028→ f2135  (≈3.6s, 10 wds)
  S24: f2141→ f2259  (≈3.9s, 11 wds)
  S25: f2265→ f2308  (≈1.4s,  4 wds)   ← FLASH
  S26: f2318→ f2585  (≈8.9s, 25 wds)
  S27: f2591→ f2666  (≈2.5s,  7 wds)
  S28: f2672→ f2778  (≈3.6s, 10 wds)
  S29: f2784→ f2974  (≈6.3s, 16 wds + hold)
```

---

## PART 9 — ALL 60 SCENES — COMPLETE SPECIFICATION

Each scene entry specifies: frame window, duration category, speech reference, layout type, visual subject, primary animation, and Remotion component structure.

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCENE 01 — DAY CARD STATIC
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
frameIn:       0
frameOut:      60
duration:      2.0s  (SHORT)
speechRef:     none — pre-audio
layout:        BlackBackground — typographic card
background:    colors.bg_black
primary:       Three-line text block centered vertically
               Line 1: "DAY 23"        — typography.day_number
               Line 2: "A MODEL IS NOT AN AGENT" — typography.episode_title
               Line 3: "HIDDEN WORLD SECRETS"    — typography.series_label
animation:     All three lines fade in together at frameIn.
               interpolate(frame, [0, 12], [0, 1]) on opacity.
               Full static hold frames 12–60.
component:     Scene01_DayCard
notes:         No paper texture. Pure black bg only.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCENE 02 — DAY CARD SNAP ZOOM PUNCH
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
frameIn:       60
frameOut:      90
duration:      1.0s  (BEAT)
speechRef:     none — pre-audio
layout:        BlackBackground — same card
background:    colors.bg_black
primary:       Identical text block from Scene 01
animation:     Snap zoom punch: scale interpolated from 1.0 → 1.08 over 8 frames
               using ease_snap cubic bezier.
               Sound cue: mechanical click at frameIn (handled in audio track).
               Frame 60–67: scale 1.0 → 1.08 (snap in)
               Frame 68–90: scale holds at 1.08, full static.
component:     Scene02_SnapZoom
notes:         Uses same rendered card as Scene 01 — only scale changes.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCENE 03 — AI ECOSYSTEM OVERVIEW (ALL MODELS)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
frameIn:       90
frameOut:      165
duration:      2.5s  (MEDIUM)
speechRef:     S1 partial — "Every AI you have ever used —"
layout:        single_hero — PaperBackground
background:    colors.bg_paper + paperGrain filter
primary:       Five small AI model icons arranged in a loose arc on paper:
               chatbot icon, image-gen icon, autocomplete icon, search icon, code icon.
               Each icon: a flat processor box in deep_black outline + cool_silver fill.
               All five mounted and visible at scene start.
animation:     Each icon slides in from slightly below its final position
               with a SHORT stagger (icon 1: f0, icon 2: f4, icon 3: f8, etc.)
               translateY: +20px → 0px over 18 frames, opacity 0→1 over 12 frames.
               All settle and hold by frame 40.
               Full static hold frames 40–75.
component:     Scene03_AIEcosystem
notes:         No arrows. No labels. Pure icon field establishing "all AIs".

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCENE 04 — NOT AN AGENT — X MARK REVEAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
frameIn:       165
frameOut:      240
duration:      2.5s  (MEDIUM)
speechRef:     S1 partial — "is not an agent"
layout:        single_hero — PaperBackground
background:    colors.bg_paper + paperGrain
primary:       The five icons from Scene 03, reduced to silhouettes.
               A single bold deep_black diagonal slash line draws across the center
               of the icon group — the rejection mark.
animation:     Icons fade to 30% opacity over 10 frames.
               SVG path of the slash line: stroke-dashoffset animates from full
               length to 0 over 20 frames (draw effect left→right).
               DrawPath component handles this.
               Full static hold.
component:     Scene04_NotAnAgent
notes:         No red X shape — use the clean slash-line rejection per style rules.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCENE 05 — "IT NEVER HAS BEEN" — STATEMENT FLASH
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
frameIn:       240
frameOut:      270
duration:      1.0s  (BEAT)
speechRef:     S2 — "It never has been."
layout:        BlackBackground — explanation override
background:    colors.bg_black
primary:       Single minimal processor box in cool_silver on black, centered.
               Clean disconnected output arrow in cool_silver pointing nowhere — broken.
animation:     Fade in over 8 frames. Static hold. Fade out last 6 frames.
component:     Scene05_NeverHasBeen
notes:         Explanation override style — black bg, silver minimal icon only.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCENE 06 — DAY 23 OF 120 — SERIES ANCHOR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
frameIn:       270
frameOut:      330
duration:      2.0s  (SHORT)
speechRef:     S3 — "This is Day 23 of 120."
layout:        BlackBackground — explanation override
background:    colors.bg_black
primary:       Minimal progress arc: a thin circle arc in cool_silver.
               Arc covers 23/120 = 19.2% of the circle.
               "23 / 120" rendered in typography.override_label at center.
animation:     Arc draws itself from 0° clockwise to 19.2% over 20 frames.
               Number fades in at frame 10.
component:     Scene06_SeriesAnchor
notes:         Explanation override. No paper texture. Black bg only.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCENE 07 — MODEL UNIT FIRST APPEARANCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
frameIn:       330
frameOut:      420
duration:      3.0s  (MEDIUM+)
speechRef:     S4 partial — "A model takes one input"
layout:        single_hero — PaperBackground
background:    colors.bg_paper + paperGrain
primary:       ProcessorUnit component — centered.
               Tall rectangular chassis: deep_black outline, warm_blue core fill.
               Gear-and-circuit emblem in light_gray pencil hatching on front face.
               Input block in electric_cyan visible on left side.
animation:     ProcessorUnit fades in and scales from 0.9 → 1.0 over 15 frames.
               Input block slides in from left edge: translateX -60px → 0 over 18 frames.
               Single electric_cyan arrow draws from input block to unit left face.
               Full static hold remainder.
component:     Scene07_ModelUnit
notes:         The ProcessorUnit SVG component is reused across many scenes.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCENE 08 — ONE INPUT ONE OUTPUT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
frameIn:       420
frameOut:      510
duration:      3.0s  (MEDIUM+)
speechRef:     S4 — "and produces one output"
layout:        single_hero — PaperBackground
background:    colors.bg_paper + paperGrain
primary:       ProcessorUnit centered. Input block already settled left.
               Output block in cool_silver emerges from right face.
               Stop mark (bold deep_black vertical bar) at output terminus.
animation:     Output block slides out from unit right face: translateX 0 → +80px
               over 18 frames. Arrow draws behind it.
               Stop bar snaps in at frame 40 with scale 0 → 1 over 6 frames.
               Full static hold.
component:     Scene08_OneOutput
notes:         Hard stop mark is the visual anchor — must be crisp and visible.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCENE 09 — ONE STEP LABEL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
frameIn:       510
frameOut:      540
duration:      1.0s  (BEAT)
speechRef:     S5 — "One step."
layout:        single_hero — PaperBackground
background:    colors.bg_paper + paperGrain
primary:       Same unit + I/O blocks from Scene 08. Static.
               SVG text label "ONE STEP" in scene_label typography appears
               below the arrow sequence.
animation:     Label fades in over 8 frames. Full static hold.
               Scale: 0.95 → 1.0 over 8 frames for subtle reveal.
component:     Scene09_OneStep
notes:         FLASH duration — emphasis beat for the spoken "One step."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCENE 10 — COMPLETE TRANSACTION — STOP MARK HOLD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
frameIn:       540
frameOut:      630
duration:      3.0s  (MEDIUM+)
speechRef:     S6 — "That is the complete transaction."
layout:        single_hero — PaperBackground
background:    colors.bg_paper + paperGrain
primary:       Full I/O diagram from Scene 08 — all elements fully visible.
               Large bold bracket pair around stop mark pulses once.
animation:     Bracket pair briefly scales 1.0 → 1.06 → 1.0 over 10 frames
               at scene start (single emphasis pulse, not repeat).
               Full static hold remainder.
component:     Scene10_CompleteTransaction
notes:         The pulse is one-shot. Do not loop it.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCENE 11 — NO MEMORY — DORMANT LIGHTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
frameIn:       630
frameOut:      720
duration:      3.0s  (MEDIUM+)
speechRef:     S7 — "It does not remember what it just said."
layout:        single_hero — PaperBackground
background:    colors.bg_paper + paperGrain
primary:       ProcessorUnit centered. Front face lights drawn as X marks in light_gray.
               Output block departed to the right, trailing a sparse dashed line
               in light_gray that fades toward the right edge.
animation:     Output block drifts slowly rightward: translateX 0 → +40px over 60 frames,
               very slow ease_drift.
               Dashed line connection between unit and output block:
               SVG strokeDasharray animates to become sparser (dasharray 8,8 → 4,16 → 2,24).
component:     Scene11_NoMemory
notes:         The drifting separation is the core visual argument.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCENE 12 — NO KNOWLEDGE OF AFTERMATH
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
frameIn:       720
frameOut:      810
duration:      3.0s  (MEDIUM+)
speechRef:     S8 — "It does not know what happened after it spoke."
layout:        single_hero — PaperBackground
background:    colors.bg_paper + paperGrain
primary:       ProcessorUnit left-centered, dormant (X lights on face).
               Right portion of canvas: a minimal "world" square in cool_silver
               at the far right — representing the outside world.
               Between unit and world square: wide empty paper space, no connection.
animation:     ProcessorUnit holds completely still.
               World square fades in at right side over 12 frames.
               No arrow is drawn between them — the absence of connection is the statement.
               Full static hold.
component:     Scene12_NoKnowledge
notes:         Zero arrows in this scene — absence of connection is intentional.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCENE 13 — PROCESSES OUTPUTS STOPS — THREE-BEAT LABEL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
frameIn:       810
frameOut:      870
duration:      2.0s  (SHORT)
speechRef:     S9 — "It processes, outputs, and stops."
layout:        single_hero — PaperBackground
background:    colors.bg_paper + paperGrain
primary:       Three minimal icons in a horizontal row — center of canvas:
               1. Gear icon (process) — warm_blue fill
               2. Arrow-right icon (output) — electric_cyan
               3. Stop bar icon (stops) — deep_black
animation:     Three icons appear with a stagger: icon 1 at f0, icon 2 at f8, icon 3 at f16.
               Each: opacity 0→1 over 10 frames + translateY +12px→0.
               All three settle and hold.
component:     Scene13_ProcessOutputStop
notes:         Minimal and fast — the speech is short.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCENE 14 — AGENT INTRODUCTION — ROBOT APPEARS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
frameIn:       870
frameOut:      960
duration:      3.0s  (MEDIUM+)
speechRef:     S10 — "An agent does something the model cannot."
layout:        split_panel — PaperBackground
background:    colors.bg_paper + paperGrain
primary:       Left panel: dormant ProcessorUnit (cool_silver fill, X lights) — small.
               Right panel: AIRobot component — tall, deep_black outline, warm_blue core.
               Bold deep_black vertical divider line at center.
animation:     Left panel: processor fades in at f0.
               Divider line draws downward from top to bottom over 12 frames.
               Right panel: AIRobot scales in from 0.85 → 1.0 over 18 frames at f12.
component:     Scene14_AgentIntro
notes:         SplitPanel component handles the divider and two-column layout.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCENE 15 — AGENT OBSERVES OUTPUT IN WORLD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
frameIn:       960
frameOut:      1080
duration:      4.0s  (LONG)
speechRef:     S11 — "It observes what its output caused in the world."
layout:        single_hero — PaperBackground
background:    colors.bg_paper + paperGrain
primary:       AIRobot center-left. Output arrow extends right to "world" square.
               electric_cyan output arrow.
               World square in cool_silver at right.
animation:     Robot renders fully at f0.
               Output arrow draws stroke-dashoffset left→right over 20 frames.
               World square scales in 0.8→1.0 over 12 frames when arrow arrives.
               Brief hold showing observation moment.
component:     Scene15_AgentObserves
notes:         The arrow must visibly connect robot to world square — key diagram.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCENE 16 — OBSERVATION FEEDS BACK AS INPUT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
frameIn:       1080
frameOut:      1200
duration:      4.0s  (LONG)
speechRef:     S12 — "It takes that observation and feeds it back as the next input."
layout:        single_hero — PaperBackground
background:    colors.bg_paper + paperGrain
primary:       Continuation of Scene 15: robot + world square.
               Feedback arc: electric_cyan curved arrow from world square
               sweeping back to robot's left input port.
animation:     World square holds from previous.
               Feedback arc draws itself from world square, curving down and left
               back to robot input port over 30 frames (DrawPath, ease_draw).
               When arc completes into robot, robot warm_blue core briefly
               brightens: opacity 0.7 → 1.0 → 0.7 over 12 frames, single pulse.
component:     Scene16_FeedbackLoop
notes:         The arc must follow a smooth bezier curve — not a straight line.
               Arc path: control points above/below for natural curve.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCENE 17 — IT LOOPS — FLASH MOMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
frameIn:       1200
frameOut:      1230
duration:      1.0s  (BEAT)
speechRef:     S13 — "It loops."
layout:        single_hero — PaperBackground
background:    colors.bg_paper + paperGrain
primary:       Full loop diagram from Scene 16 — robot + world + both arrows.
               All elements hold still.
animation:     At frameIn, a single brief flash: all electric_cyan elements
               briefly increase stroke-width 2px → 4px → 2px over 10 frames.
               This is a single-shot emphasis flash on the word "loops."
component:     Scene17_ItLoops
notes:         Do not make this a pulse loop. Single flash only.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCENE 18 — THE LOOP IS NOT A FEATURE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
frameIn:       1230
frameOut:      1320
duration:      3.0s  (MEDIUM+)
speechRef:     S14 — "The loop is not a feature."
layout:        single_hero — PaperBackground
background:    colors.bg_paper + paperGrain
primary:       LoopArrow component: large closed electric_cyan circular arc.
               The arc occupies the center half of the canvas.
               No robot inside the loop for this scene — the loop stands alone.
               A small minimal "feature tag" icon (like a product tag shape)
               in light_gray appears outside the loop — separated from it.
animation:     Loop draws itself clockwise from bottom-left over 25 frames.
               Feature tag icon fades in outside loop at f20.
               Clean deep_black disconnection dash between loop and tag at f28.
               Full static hold.
component:     Scene18_NotAFeature
notes:         The loop stands independent of the feature concept.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCENE 19 — THE LOOP IS THE DEFINITION — MAXIMUM EMPHASIS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
frameIn:       1320
frameOut:      1440
duration:      4.0s  (LONG)
speechRef:     S15 — "The loop is the definition."
layout:        single_hero — PaperBackground
background:    colors.bg_paper + paperGrain
primary:       LoopArrow — the largest, boldest version in the entire episode.
               Stroke width thicker than all other loop instances.
               Perfectly centered on the canvas.
               Maximum negative space around it.
animation:     Loop draws itself clockwise with a deliberate, slow, confident pace
               over 40 frames (slower than any other draw in the episode).
               When the arrowhead snaps closed: a single sharp scale pulse
               1.0 → 1.04 → 1.0 over 8 frames.
               Full static hold for 72 frames after close.
component:     Scene19_LoopIsDefinition
notes:         This is the single most visually important scene in the episode.
               The deliberate slow draw pace creates gravitas.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCENE 20 — WITHOUT THE LOOP: CALCULATOR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
frameIn:       1440
frameOut:      1530
duration:      3.0s  (MEDIUM+)
speechRef:     S16 — "Without the loop, you have a very sophisticated calculator."
layout:        split_panel — PaperBackground
background:    colors.bg_paper + paperGrain
primary:       Left panel: ProcessorUnit (cool_silver) with output → stop mark.
               Below it: minimal calculator icon in light_gray hatching.
               Right panel: empty — only open paper space.
               Bold divider down center.
animation:     Left panel fades in at f0. Calculator icon slides up from below over 15 frames.
               Right panel intentionally holds empty — the absence = no loop.
component:     Scene20_NoLoop
notes:         The emptiness of the right panel is the visual argument.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCENE 21 — WITH THE LOOP: GOAL ACROSS TIME
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
frameIn:       1530
frameOut:      1650
duration:      4.0s  (LONG)
speechRef:     S17 — "With the loop, you have something that can pursue a goal across time."
layout:        split_panel — PaperBackground
background:    colors.bg_paper + paperGrain
primary:       Left panel: ProcessorUnit + calculator (from Scene 20).
               Right panel: AIRobot with LoopArrow around it.
               Below robot, a horizontal timeline line in light_gray with
               5 sequential electric_cyan step marks advancing right.
animation:     Left panel holds from Scene 20 (crossfade).
               Right panel: robot fades in at f0, loop arc draws clockwise over 20 frames.
               Timeline line draws left→right over 25 frames.
               Step marks appear one by one every 6 frames.
component:     Scene21_WithLoop
notes:         The timeline below the robot encodes "across time."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCENE 22 — MOST PEOPLE BELIEVE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
frameIn:       1650
frameOut:      1730
duration:      2.7s  (MEDIUM)
speechRef:     S18 partial — "Most people believe the AI they talk to is thinking, watching, deciding."
layout:        single_hero — PaperBackground
background:    colors.bg_paper + paperGrain
primary:       ProcessorUnit centered. Around it: three orbit icons in light_gray —
               a thought bubble (thinking), an eye (watching), a pointer (deciding).
               All three orbit icons arranged clockwise around the unit.
animation:     ProcessorUnit appears at f0.
               Three orbit icons each draw in sequentially: f5, f14, f23.
               Each: opacity 0→1 over 10 frames + scale 0.8→1.0.
component:     Scene22_PeopleBelieve
notes:         The three orbit icons represent the misconception being set up to be dispelled.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCENE 23 — IT IS NOT — DISPEL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
frameIn:       1730
frameOut:      1760
duration:      1.0s  (BEAT)
speechRef:     S19 — "It is not."
layout:        single_hero — PaperBackground
background:    colors.bg_paper + paperGrain
primary:       Same scene as 22 but orbit icons fade out.
               ProcessorUnit goes to dormant X-lights state.
animation:     Three orbit icons fade to opacity 0 over 10 frames simultaneously.
               Unit front face lights switch to X marks (path morph or opacity swap).
               Bold deep_black slash line draws across orbit area over 12 frames.
component:     Scene23_ItIsNot
notes:         Fast dispel — matches the terse speech "It is not."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCENE 24 — RESPONSE AND DISAPPEARS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
frameIn:       1760
frameOut:      1860
duration:      3.3s  (MEDIUM+)
speechRef:     S20 — "It produces a response and disappears."
layout:        single_hero — PaperBackground
background:    colors.bg_paper + paperGrain
primary:       ProcessorUnit centered. Output block exits right.
               The unit itself begins to dissolve — its SVG border segments
               become dashed and progressively more sparse.
animation:     Output block slides right at ease_smooth over 20 frames.
               Simultaneously: unit border strokes animate from solid (strokeDasharray none)
               to dashed (strokeDasharray 8,8) to sparser (4,16) over 50 frames.
               Unit opacity fades from 1.0 → 0.3 by scene end.
component:     Scene24_Disappears
notes:         The dissolution is not explosive — quiet and architectural.
               strokeDasharray animation is the key visual technique here.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCENE 25 — REBUILT FROM SCRATCH
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
frameIn:       1860
frameOut:      1980
duration:      4.0s  (LONG)
speechRef:     S21 — "The next time you type, it is rebuilt entirely from scratch."
layout:        single_hero — PaperBackground
background:    colors.bg_paper + paperGrain
primary:       Left: ghost of dissolved unit (barely visible, 15% opacity, dashed).
               Right: fresh ProcessorUnit (full opacity, solid outlines, warm_blue core).
               Bold deep_black vertical slash between them — no connection.
animation:     Ghost unit holds at low opacity from Scene 24 (crossfade).
               Fresh unit draws itself in from scratch: SVG paths animate
               stroke-dashoffset from 0 → full length (reverse draw), creating
               a "being drawn" construction effect over 30 frames.
               Slash mark snaps in at f28, scale 0→1 over 6 frames.
component:     Scene25_RebuiltFromScratch
notes:         The reverse draw (construction from scratch) is the key animation here.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCENE 26 — NO CONTINUITY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
frameIn:       1980
frameOut:      2040
duration:      2.0s  (SHORT)
speechRef:     S22 — "There is no continuity."
layout:        single_hero — PaperBackground
background:    colors.bg_paper + paperGrain
primary:       Three ProcessorUnit instances in a horizontal row —
               ghost (far left), separator slash, fresh unit (center),
               separator slash, fresh unit (right).
               All three units with no connecting thread between them.
animation:     Three units snap in simultaneously at f0.
               Both slash marks snap in at f4.
               Full static hold. No connecting motion between units.
component:     Scene26_NoContinuity
notes:         The static isolation of three units with no connection = no continuity.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCENE 27 — NO SELF PERSISTED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
frameIn:       2040
frameOut:      2160
duration:      4.0s  (LONG)
speechRef:     S23 — "There is no self that persisted between your messages."
layout:        single_hero — PaperBackground
background:    colors.bg_paper + paperGrain
primary:       ProcessorUnit centered. Below it, a minimal "identity token" —
               a small deep_black circle outline representing a persistent self.
               The token is struck through with a clean slash line.
               Between the unit and the token, no connection line.
animation:     Unit holds from previous.
               Identity token fades in at f10, scale 0.8→1.0 over 12 frames.
               Slash through token draws at f20 over 15 frames.
               Full static hold.
component:     Scene27_NoSelf
notes:         The token is small — deliberately modest — representing the absence of self.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCENE 28 — AGENT DANGEROUS AND POWERFUL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
frameIn:       2160
frameOut:      2280
duration:      4.0s  (LONG)
speechRef:     S24 — "What makes an agent dangerous — and powerful — is not intelligence."
layout:        single_hero — PaperBackground
background:    colors.bg_paper + paperGrain
primary:       AIRobot centered, larger than previous scenes — hero size.
               Two labels float near the robot: "DANGEROUS" faded in light_gray
               and "POWERFUL" in the same light treatment — pencil lettering style.
               A small "INTELLIGENCE" label in light_gray appears to the side
               with a clean disconnection bar separating it from the robot.
animation:     Robot fades in at f0, scale 0.9→1.0 over 15 frames.
               "DANGEROUS" label slides in from left at f12 over 10 frames.
               "POWERFUL" slides in from right at f18 over 10 frames.
               "INTELLIGENCE" fades in at f28 with disconnection bar at f35.
component:     Scene28_DangerousPowerful
notes:         Labels are pencil-style (typography.scene_label), small and tasteful.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCENE 29 — IT IS THE LOOP — FLASH REVEAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
frameIn:       2280
frameOut:      2310
duration:      1.0s  (BEAT)
speechRef:     S25 — "It is the loop."
layout:        single_hero — PaperBackground
background:    colors.bg_paper + paperGrain
primary:       AIRobot centered. LoopArrow draws around it.
               "INTELLIGENCE" label from Scene 28 fully fades out.
animation:     LoopArrow draws clockwise around robot at fast pace over 15 frames.
               Arrowhead snaps closed.
               Robot warm_blue core: single brightness flash at arc close.
component:     Scene29_ItIsTheLoop
notes:         Fast and declarative — matches the rhythm of "It is the loop."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCENE 30 — TIGHT LOOP: SYSTEM CORRECTS ITSELF
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
frameIn:       2310
frameOut:      2460
duration:      5.0s  (LONG)
speechRef:     S26 partial — "A sufficiently tight loop means the system can correct itself,"
layout:        infographic — PaperBackground
background:    colors.bg_paper + paperGrain
primary:       Three-step loop sequence: Loop Iteration 1 (left), Iteration 2 (center),
               Iteration 3 (right). Each is a small robot + loop arc.
               Between iterations: forward electric_cyan arrows.
               In iteration 2: loop arc takes a slightly different path = correction.
               In iteration 3: loop arc path differs again = further adaptation.
animation:     Iteration 1 snaps in at f0.
               Forward arrow 1 draws at f15 over 10 frames.
               Iteration 2 snaps in at f25.
               Forward arrow 2 draws at f40 over 10 frames.
               Iteration 3 snaps in at f50.
               Full static hold.
component:     Scene30_SelfCorrect
notes:         Three distinct loop arc shapes encode self-correction visually.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCENE 31 — ADAPT STRATEGY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
frameIn:       2460
frameOut:      2550
duration:      3.0s  (MEDIUM+)
speechRef:     S26 partial — "adapt its strategy,"
layout:        single_hero — PaperBackground
background:    colors.bg_paper + paperGrain
primary:       Single AIRobot centered. Its loop arc on the first iteration path.
               A clean electric_cyan deviation arc branches off below the main loop
               arc, representing a strategy change — a new path.
animation:     Main loop arc holds from previous.
               Deviation arc draws in from the branch point, curving downward
               and completing a new loop path over 25 frames.
               Branch point pulses once at the junction.
component:     Scene31_AdaptStrategy
notes:         Branch point is a small filled circle in electric_cyan.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCENE 32 — ESCALATE WITHOUT HUMAN IN CHAIN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
frameIn:       2550
frameOut:      2670
duration:      4.0s  (LONG)
speechRef:     S26 partial — "and escalate its behaviour without a human in the chain."
layout:        single_hero — PaperBackground
background:    colors.bg_paper + paperGrain
primary:       AIRobot centered with LoopArrow — loop closed, self-contained.
               Far upper right: minimal human silhouette in light_gray, tiny.
               Between robot loop and human: bold deep_black disconnection bar.
animation:     Robot + loop hold from previous scenes.
               Human silhouette fades in at f12 to upper right, opacity 0→0.6 over 10 frames.
               Disconnection bar snaps in at f22, scale 0→1 over 8 frames (ease_snap).
               Full static hold.
component:     Scene32_NoHuman
notes:         Human silhouette at 60% opacity — present but clearly excluded.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCENE 33 — FIELD OF MODELS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
frameIn:       2670
frameOut:      2760
duration:      3.0s  (MEDIUM+)
speechRef:     S27 — "You are not worried about models."
layout:        single_hero — PaperBackground
background:    colors.bg_paper + paperGrain
primary:       Sparse grid of 9 small ProcessorUnit icons across left three-quarters
               of the canvas. All in cool_silver, small, passive, dormant.
               All in a loose 3×3 arrangement.
animation:     All 9 units fade in together over 12 frames. Full static hold.
               No animation on the units after reveal — they are passive.
component:     Scene33_FieldOfModels
notes:         Sparse grid — do not cluster. Paper negative space between units.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCENE 34 — NOT INTERACTING WITH AGENTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
frameIn:       2760
frameOut:      2850
duration:      3.0s  (MEDIUM+)
speechRef:     S28 — "You are not even interacting with agents most of the time."
layout:        single_hero — PaperBackground
background:    colors.bg_paper + paperGrain
primary:       Field of 9 processor units from Scene 33 (left).
               On the right, separated by open paper space:
               one AIRobot with a small LoopArrow — clearly distinct.
animation:     Units hold from Scene 33.
               AIRobot fades in on right at f0 over 12 frames.
               LoopArrow draws around robot at f10 over 15 frames.
               No arrows connecting units to robot.
component:     Scene34_NotAgents
notes:         The separation between the passive field and the single active agent is key.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCENE 35 — THE GAP — MEASURED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
frameIn:       2850
frameOut:      2990
duration:      4.7s  (LONG)
speechRef:     S29 partial — "But the gap between them is exactly the gap"
layout:        split_panel — PaperBackground
background:    colors.bg_paper + paperGrain
primary:       Left panel: dormant ProcessorUnit (tool).
               Right panel: AIRobot with LoopArrow (agent).
               Bold divider at center.
               Above divider: double-headed deep_black bracket pointing left and right,
               emphasizing the gap distance.
animation:     Both panels fade in simultaneously at f0.
               Divider line draws top→bottom over 12 frames.
               Bracket extends from center leftward over 12 frames,
               then extends rightward over 12 frames (two-phase extension).
               Full static hold.
component:     Scene35_TheGap
notes:         The gap bracket is the visual anchor of this scene.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCENE 36 — TOOL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
frameIn:       2990
frameOut:      3050
duration:      2.0s  (SHORT)
speechRef:     S29 partial — "between a tool"
layout:        single_hero — PaperBackground
background:    colors.bg_paper + paperGrain
primary:       ProcessorUnit centered — larger, dominant, labeled.
               Under unit: pencil lettering "TOOL" in scene_label typography.
               Sealed output port cap: a flat deep_black semicircle sealing the right face.
animation:     Unit scales in 0.9→1.0 over 12 frames.
               "TOOL" label fades in at f15 over 8 frames.
               Sealed port cap draws in at f20 over 8 frames.
component:     Scene36_Tool
notes:         The sealed port is the definitive visual mark of a tool — it does not act.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCENE 37 — SOMETHING THAT ACTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
frameIn:       3050
frameOut:      3150
duration:      3.3s  (MEDIUM+)
speechRef:     S29 — "and something that acts."
layout:        single_hero — PaperBackground
background:    colors.bg_paper + paperGrain
primary:       AIRobot centered — largest instance in the episode.
               LoopArrow in boldest electric_cyan stroke.
               No label — the robot and loop speak for themselves.
animation:     Robot fades in at f0, scale 0.88→1.0 over 18 frames (ease_snap).
               Loop arc draws clockwise over 22 frames.
               Arrowhead snaps closed.
               Robot warm_blue core: brief single brightness flash at close.
               Extended static hold — 60 frames of stillness.
component:     Scene37_SomethingThatActs
notes:         The long static hold after the loop closes is the visual punctuation.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCENES 38 – 55 — ATMOSPHERE AND REINFORCEMENT BEATS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
These scenes are distributed across the existing speech windows to add
visual rhythm, micro-beat punctuation, and visual breath between major scenes.
Each is a SHORT or BEAT duration scene (15–45 frames) that reinforces
the nearest speech line without introducing new visual concepts.

SCENE 38 — MICRO: Input block close-up — electric_cyan block detail
frameIn: 395 / duration: BEAT — fills gap between S4 onset and Scene 07

SCENE 39 — MICRO: Output arrow tip close-up — arrowhead detail on paper
frameIn: 480 / duration: FLASH — fills beat between S4 and S5

SCENE 40 — MICRO: Stop mark close-up — bold vertical bar isolated
frameIn: 530 / duration: FLASH — punches "stops" in S9

SCENE 41 — MICRO: X-lights on ProcessorUnit face — dormancy mark
frameIn: 650 / duration: BEAT — reinforces S7 "does not remember"

SCENE 42 — MICRO: Dashed fading connection line isolated on paper
frameIn: 740 / duration: BEAT — reinforces S8 "does not know"

SCENE 43 — MICRO: Loop arc isolated — partial arc not yet closed
frameIn: 1255 / duration: FLASH — precursor to "It loops" S13

SCENE 44 — MICRO: Loop arrowhead close-up — the closure point
frameIn: 1200 / duration: FLASH — matches "The loop" S14 onset

SCENE 45 — MICRO: Loop arc vs. straight-line comparison — two paths on paper
frameIn: 1428 / duration: BEAT — reinforces S16 "without/with" contrast

SCENE 46 — MICRO: Timeline step marks advancing — 5 marks left to right
frameIn: 1590 / duration: BEAT — reinforces S17 "across time"

SCENE 47 — MICRO: Three orbit icons fading simultaneously
frameIn: 1750 / duration: FLASH — reinforces S19 "It is not"

SCENE 48 — MICRO: Unit dissolve — chassis lines going dashed
frameIn: 1855 / duration: BEAT — reinforces S20 "disappears"

SCENE 49 — MICRO: Two units side by side with hard slash, no connection
frameIn: 2025 / duration: FLASH — reinforces S22 "no continuity"

SCENE 50 — MICRO: Identity token with slash — self-concept erased
frameIn: 2100 / duration: BEAT — reinforces S23 "no self"

SCENE 51 — MICRO: Loop arc drawing itself — seen from path perspective
frameIn: 2270 / duration: FLASH — reinforces S24 "dangerous/powerful"

SCENE 52 — MICRO: Three consecutive loop shapes — correction visualized
frameIn: 2400 / duration: BEAT — reinforces S26 "correct itself"

SCENE 53 — MICRO: Disconnection bar between loop and human silhouette
frameIn: 2520 / duration: FLASH — reinforces S26 "without human"

SCENE 54 — MICRO: Field of 9 units — unified fade to lower opacity
frameIn: 2720 / duration: BEAT — reinforces S27 "not worried"

SCENE 55 — MICRO: Gap bracket alone on paper — measured empty space
frameIn: 2910 / duration: BEAT — reinforces S29 "the gap"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCENE 56 — SPLIT FINAL COMPARISON — TOOL vs AGENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
frameIn:       3050
frameOut:      3170
duration:      4.0s  (LONG)
speechRef:     S29 — final line hold
layout:        split_panel — PaperBackground
background:    colors.bg_paper + paperGrain
primary:       Left panel: ProcessorUnit + sealed port — labeled "TOOL" (pencil).
               Right panel: AIRobot + bold LoopArrow — labeled "ACTS" (pencil).
               Bold divider. Gap bracket above.
animation:     All elements already rendered. Scene holds completely static.
               The final stillness is the closing visual statement.
component:     Scene56_FinalComparison

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCENE 57 — THE LOOP ALONE — FINAL HERO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
frameIn:       3170
frameOut:      3350
duration:      6.0s  (HOLD)
speechRef:     Post-script — final visual
layout:        single_hero — PaperBackground
background:    colors.bg_paper + paperGrain
primary:       The largest, boldest LoopArrow in the entire episode.
               AIRobot inside it — small, centered, upright.
               Nothing else. Maximum paper negative space.
animation:     Crossfade from Scene 56: opacity transition over 10 frames.
               Loop and robot hold completely still for the entire 6-second duration.
               The stillness IS the statement.
component:     Scene57_FinalLoop

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCENE 58 — CAPTION OUTRO HOLD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
frameIn:       3350
frameOut:      3440
duration:      3.0s  (MEDIUM+)
speechRef:     post-audio
layout:        single_hero — PaperBackground
background:    colors.bg_paper + paperGrain
primary:       Loop + robot from Scene 57 fades to 60% opacity.
               Below it, CaptionBar shows episode title in centered typography.
animation:     Loop fades to 60% over 15 frames.
               Episode title text fades in over 15 frames. Static hold.
component:     Scene58_CaptionOutro

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCENE 59 — SERIES CARD RETURN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
frameIn:       3440
frameOut:      3530
duration:      3.0s  (MEDIUM+)
speechRef:     post-audio
layout:        BlackBackground
background:    colors.bg_black
primary:       Three-line day card from Scene 01 — returns at reduced scale.
               "DAY 23 / 120" progress arc in cool_silver below the text.
animation:     Fade in from paper → black transition over 15 frames.
               Text block fades in over 12 frames.
               Progress arc draws in over 20 frames.
component:     Scene59_SeriesCard

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCENE 60 — FADE TO BLACK — END
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
frameIn:       3530
frameOut:      3600
duration:      2.3s  (SHORT)
speechRef:     end
layout:        BlackBackground
background:    colors.bg_black
primary:       Empty black screen.
animation:     Dissolve from Scene 59 to pure black over 30 frames.
               Hold complete black for 40 frames.
component:     Scene60_FadeToBlack
```

---

## PART 10 — CAPTION BAR SYSTEM

> ⚠️ **SUPERSEDED BY PART 19 — WORD-BY-WORD SUBTITLE SYSTEM**
> The legacy sentence-level `CaptionBar` below is kept for reference only.
> All new episode builds MUST use the `WordByWordSubtitle` component from **PART 19**,
> which uses the CSV transcript for precise per-word audio sync.
> Do NOT use the old `CaptionBar` in any new scene files.

The `CaptionBar` component sits in a persistent `<Sequence from={90}>` (starts when audio starts) and shows the active sentence from `scriptCues`.

```tsx
// components/CaptionBar.tsx
import { useCurrentFrame, interpolate } from 'remotion';
import { ScriptCue } from '../compositions/HiddenWorldDay23/sceneData';

interface Props {
  scriptCues: ScriptCue[];
}

export const CaptionBar: React.FC<Props> = ({ scriptCues }) => {
  const frame = useCurrentFrame();

  // Find active cue
  const activeCue = scriptCues.find(
    (cue) => frame >= cue.frameIn && frame < cue.frameOut
  );

  if (!activeCue) return null;

  // Fade in over 4 frames from cue start, fade out over 4 frames before cue end
  const opacity = interpolate(
    frame,
    [activeCue.frameIn, activeCue.frameIn + 4,
     activeCue.frameOut - 4, activeCue.frameOut],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <div style={{
      position: 'absolute',
      bottom: 120,
      left: 60,
      right: 60,
      opacity,
      backgroundColor: 'rgba(0,0,0,0.72)',
      borderRadius: 16,
      padding: '16px 28px',
      fontFamily: '"Inter", sans-serif',
      fontWeight: 600,
      fontSize: 40,
      lineHeight: 1.4,
      color: '#FFFFFF',
      textAlign: 'center',
    }}>
      {activeCue.text}
    </div>
  );
};
```

---

## PART 11 — REUSABLE COMPONENT SPECS

### ProcessorUnit SVG Component

```tsx
// components/ProcessorUnit.tsx
// Props:
//   state: 'active' | 'dormant' | 'ghost' | 'dissolving'
//   size: number (default 200 — unit is square)
//   showInputBlock: boolean
//   showOutputBlock: boolean
//   showStopMark: boolean
// Colors auto-pulled from design-tokens/colors.ts based on state

// SVG structure:
//   - Outer rect: deep_black stroke, state-driven fill (warm_blue=active, cool_silver=dormant)
//   - Inner emblem: gear polygon in light_gray (pencil hatching via SVG pattern)
//   - State lights: small circles (active) or X paths (dormant) at top-center of face
//   - Input block: electric_cyan rect, left side
//   - Output block: cool_silver rect, right side
//   - Stop mark: deep_black vertical rect, far right
//   - Arrows: electric_cyan paths with arrowhead markers
//   - Ghost: same structure at 15% opacity, strokeDasharray animated
```

### AIRobot SVG Component

```tsx
// components/AIRobot.tsx
// Props:
//   size: number (default 240 — height)
//   hasLoop: boolean (shows LoopArrow around robot if true)
//   loopDrawProgress: number 0–1 (for animated draw)
// Colors: deep_black outline, warm_blue core chest panel, cool_silver limbs

// SVG structure:
//   - Head: rounded rect in deep_black stroke, warm_blue fill, gear emblem
//   - Torso: taller rect, warm_blue fill, gear-circuit pattern in light_gray
//   - Arms: cool_silver rects, slight taper
//   - Legs: cool_silver rects
//   - Core light: small circle on torso, electric_cyan (active) or X (dormant)
//   - LoopArrow: rendered as child via LoopArrow component when hasLoop=true
```

### LoopArrow SVG Component

```tsx
// components/LoopArrow.tsx
// Props:
//   radius: number (default 150)
//   drawProgress: number 0–1 (stroke-dashoffset animation)
//   strokeWidth: number (default 3 — increases for emphasis scenes)
//   color: string (default colors.electric_cyan)

// SVG structure:
//   - Single circular arc path (360° - gap for arrowhead)
//   - Arrowhead: small triangle at arc terminus
//   - Stroke-dashoffset driven by drawProgress prop
//   - Arrowhead opacity: 0 until drawProgress > 0.95, then 1 (snaps in)
```

### DrawPath Component

```tsx
// components/DrawPath.tsx
// Props:
//   d: string (SVG path data)
//   totalLength: number (pre-calculated path length)
//   progress: number 0–1
//   stroke: string
//   strokeWidth: number
//   fill: string (default 'none')

// Implements stroke-dashoffset animation:
//   strokeDasharray = totalLength
//   strokeDashoffset = totalLength * (1 - progress)
```

---

## PART 12 — ANIMATION HOOK: useDrawPath

```typescript
// hooks/useDrawPath.ts
import { useCurrentFrame, interpolate } from 'remotion';
import { motion } from '../design-tokens/motion';

interface UseDrawPathOptions {
  startFrame: number;
  durationFrames: number;
  easing?: number[];
}

export const useDrawPath = ({
  startFrame,
  durationFrames,
  easing = motion.ease_draw,
}: UseDrawPathOptions): number => {
  const frame = useCurrentFrame();
  return interpolate(
    frame,
    [startFrame, startFrame + durationFrames],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: (t: number) => {
        // Cubic bezier approximation from easing array
        const [x1, y1, x2, y2] = easing;
        // Standard cubic bezier implementation
        return t; // replace with full cubic bezier solver
      },
    }
  );
};
```

---

## PART 13 — SCENE TRANSITION RULES

| Transition Type | Remotion Implementation | When to Use |
|---|---|---|
| Hard Cut | Two adjacent `<Sequence>` components, no overlap | Between dramatically different scenes |
| Dissolve | Overlapping `<Sequence>` by 10 frames, opacity interpolated | Between thematically connected scenes |
| Wipe Right | translateX from 0 → -108 (off-canvas) on outgoing, 108 → 0 on incoming | Between split-panel changes |
| Stay / Hold | Same component re-used in new Sequence window, no animation | When paper stays and only detail changes |

---

## PART 14 — QUALITY RULES FOR REMOTION SCENES

1. **Every SVG component must define explicit `width` and `height`** — never rely on auto-sizing inside Remotion's fixed canvas.
2. **All `interpolate()` calls must use `extrapolateLeft: 'clamp'` and `extrapolateRight: 'clamp'`** — never allow values to go outside intended bounds.
3. **Paper grain SVG filter ID must be unique per scene component** — prefix with scene ID to avoid filter ID collision across Sequences.
4. **No `position: fixed`** — use `position: absolute` within `AbsoluteFill` only.
5. **Font loading**: All fonts loaded via `@remotion/google-fonts` or bundled in `/public/fonts/`. Never rely on system fonts.
6. **Audio sync**: `scriptCues` frame windows are the single source of truth for timing. Never hard-code frame numbers in component logic that should come from `sceneData.ts`.
7. **Scene isolation**: Each scene component reads only `useCurrentFrame()` relative to its own `<Sequence>` window — Remotion normalizes this automatically. Write components as if frame always starts at 0.
8. **SVG path lengths**: Pre-calculate `getTotalLength()` at build time and store in `sceneData.ts` — never calculate in the render loop.
9. **ZERO inline styles with pixel coordinates** — all positions derived from canvas constants: `const CANVAS_W = 1080; const CANVAS_H = 1920;`
10. **Scene background rule**: Paper scenes render their own `<rect fill={BG_PAPER}>` inside SVG. Black scenes render their own `<rect fill={BG_BLACK}>`. **NEVER** set `backgroundColor` on the root `<AbsoluteFill>` in the master composition — it overrides paper scenes.
11. **Audio starts at frame 0**: The audio file begins at the very first frame of the composition. Pre-audio scenes (day card etc.) must be silent in the audio file itself, or the audio file trimmed accordingly. Do NOT use `<Sequence from={90}>` to delay audio.
12. **Subtitle is global and centralized**: `WordByWordSubtitle` is rendered ONCE in the master `Scene.tsx` as a `<Sequence durationInFrames={TOTAL_FRAMES}>`. Individual scene components must NOT import or render `WordByWordSubtitle`. It will overlap and flicker if rendered twice.

---

## PART 15 — STYLE SWITCHING SYSTEM

When generating a new episode with a **different style** (e.g., `style_gta`, `style_default`), update the episode config in `sceneData.ts`:

```typescript
// sceneData.ts — top of file
export const EPISODE_CONFIG = {
  day: 23,
  title: 'A MODEL IS NOT AN AGENT',
  style: 'style_pencil_art_AI',         // ← change this to switch style
  backgroundColor: '#F5F0E8',           // from style's bg value
  accentColor: '#00E5FF',               // from style's primary accent
  outlineColor: '#0D0D0D',              // from style's outline color
  paperTexture: true,                   // false for dark-bg styles
  fontStack: '"Inter", sans-serif',
  labelFont: '"Caveat", cursive',       // pencil handwriting for AI style
};
```

The `SceneWrapper` component reads `EPISODE_CONFIG` and applies the correct background, font, and grain filter. Changing the style here propagates globally to all 60 scene components through the wrapper.

---

## PART 16 — HOW TO USE THIS FILE (WORKFLOW)

```
STEP 1 — Read the episode script from outputs/Day [N]/Day_[N]_output.md.

STEP 2 — Extract all sentences. Count words per sentence.

STEP 3 — Calculate timestamps using Part 8's WPS calibration (2.8 wps default).
          Build the scriptCues[] array with frameIn/frameOut per sentence.

STEP 4 — Map each sentence to its scene window using the pacing structure in Part 9.
          Assign micro-beat scenes (38–55 range) into the gaps between major scenes.

STEP 5 — Build sceneData.ts with the full 60-scene sceneList[] and scriptCues[].

STEP 6 — Generate all 60 scene components (Scene01_*.tsx through Scene60_*.tsx)
          following the specs in Part 9. Use the reusable components from Part 11.

STEP 7 — Wire everything together in the master composition (index.tsx) per Part 6.

STEP 8 — Run `npx remotion render HiddenWorldDay[N] --codec=h264`
          Output: outputs/Day [N]/Day_[N]_video.mp4

STEP 9 — Verify:
          ✓ All 60 scenes appear and resolve within the 1800-frame window
          ✓ Caption bar is synchronized to scriptCues timestamps
          ✓ No scene is static for more than 180 frames (6s) without a micro-beat
          ✓ Paper grain is visible but subtle — not obtrusive
          ✓ All electric_cyan arrows are crisp and clearly directional
          ✓ AIRobot and ProcessorUnit are clearly distinguishable in every scene
          ✓ No font fallback errors — all fonts loaded from /public/fonts/
          ✓ Audio starts at frame 90 and ends by frame 1890
```

---

## PART 17 — FILE STRUCTURE RECAP

```
motion_instructions/
├── remotion_instructions.md     ← THIS FILE — complete production spec
└── styles/
    ├── style_pencil_art_AI.md   ← default AI episode style
    ├── style_default.md         ← dark premium editorial style
    ├── style_cars.md            ← F1 race-day photorealistic style
    ├── style_gta.md             ← GTA urban night illustration style
    ├── style_gtaclassic.md      ← GTA 6 Leonida daylight cinematic style
    └── style_pencilart.md       ← deep detail colored pencil style
```

Each style file in `styles/` maps directly to a set of design token overrides in `design-tokens/colors.ts`, `typography.ts`, and `motion.ts`. The mapping is:

| Style File | Background | Accent Color | Outline | Font Style | Paper Grain |
|---|---|---|---|---|---|
| style_pencil_art_AI | `#F5F0E8` off-white | `#00E5FF` cyan | `#0D0D0D` deep black | Caveat cursive | ✓ ON |
| style_default | `#000000` black | `#5EA8E6` steel blue | `#D2D8D9` cool silver | Inter sans | ✗ OFF |
| style_cars | Circuit environment | Ferrari scarlet | PBR natural | Inter sans | ✗ OFF |
| style_gta | `#1A1A1A` near-black | `#FF9B21` amber | `#F0F4F5` ice white | Impact condensed | ✗ OFF |
| style_gtaclassic | Daylight cobalt | `#5EA8E6` steel blue | `#D2D8D9` cool silver | Inter sans | ✗ OFF |
| style_pencilart | `#F5F0E8` off-white | `#00E5FF` cyan | `#0D0D0D` deep black | Caveat cursive | ✓ ON |

---

## PART 18 — SCENE FILE CODE DENSITY RULE (400–600 LINES — STRICTLY ENFORCED)

**MANDATORY:** Every scene file `frames/SceneXX.tsx` MUST be between **400 and 600 lines of TypeScript/TSX code**. This is a hard constraint, not a guideline. No scene file may be shorter than 400 lines. No scene file may exceed 600 lines.

> **Why this rule exists:** Short scene files produce vague, ambiguous, or incomplete animation code that cannot be directly dropped into the Remotion project without extensive rework. Every line of animation intent must be made explicit. The 400-line floor guarantees completeness; the 600-line ceiling forces discipline.

### What Must Be In Every Scene File (non-negotiable)

Every `frames/SceneXX.tsx` file MUST contain ALL of the following, in this order:

```
1.  File header comment block (6–10 lines)
    — Scene number, name, frameIn, frameOut, duration category
    — speechRef sentence(s) this scene covers
    — layout type, background type
    — Primary visual subject
    — Animation summary (one line per animation beat)

2.  All import statements (10–20 lines)
    — React, useCurrentFrame, useVideoConfig, interpolate, spring from remotion
    — All reusable components used (PaperBackground, BlackBackground, PaperGrain,
      ProcessorUnit, AIRobot, LoopArrow, DrawPath, FadeIn, SlideIn, SnapZoom)
    — ⚠️ Do NOT import WordByWordSubtitle in scene files — it lives in Scene.tsx only
    — design-tokens: colors, typography, motion
    — helpers: animations.ts, timing.ts

3.  Canvas constants block (5–8 lines)
    — const CANVAS_W = 1080;
    — const CANVAS_H = 1920;
    — const CX = CANVAS_W / 2;  // horizontal center
    — const CY = CANVAS_H / 2;  // vertical center
    — Any scene-specific layout constants (panel widths, offsets, etc.)

4.  Magic number constants block (10–25 lines)
    — Named const for EVERY numeric value used in the scene:
      animation start frames, duration frames, target positions,
      scale values, opacity values, SVG path control point coords,
      stroke widths, font sizes, element sizes, z-index values
    — NEVER use raw numbers inside JSX or interpolate() calls
    — Example: const INPUT_SLIDE_START = 8; const INPUT_SLIDE_DURATION = 18;

5.  SVG path data constants (5–40 lines, depending on scene)
    — const PATH_FEEDBACK_ARC = 'M 640 960 C 800 1200 200 1400 440 960';
    — const PATH_TOTAL_LENGTH = 620;  // pre-calculated, never computed at runtime
    — One const per SVG path in the scene

6.  ~~Keyword list constant~~ — **REMOVED ANTI-PATTERN**
    — ❌ Do NOT declare `const KEYWORDS` in scene files
    — ❌ Do NOT import or render `WordByWordSubtitle` in scene files
    — ✅ The global `KEYWORDS` array and `WordByWordSubtitle` live in `Scene.tsx` only
    — Adding them in scene files causes double-rendering / overlapping subtitle bars

7.  Sub-component definitions — inline SVG elements (50–150 lines)
    — Every distinct SVG shape, icon, or element defined as a named
      const arrow function before the main component
    — Examples: const StopMark: React.FC<...> = ..., const GearIcon: React.FC = ...
    — Each sub-component has its own JSDoc comment block
    — Props typed with explicit TypeScript interfaces

8.  Main scene component function (150–300 lines)
    — export const SceneXX_Name: React.FC = () => { ... }
    — All animation values computed at the top of the function body
      using useCurrentFrame(), interpolate(), spring()
    — Each animation value on its own named const
    — Comments above each animation const explaining what it drives
    — Return JSX with the scene background wrapper at root
    — All SVG elements with explicit x, y, width, height, transform attributes
    — Every animated value wired via inline style using the named consts

9.  Animation beat comments inside JSX (inline, 10–30 lines)
    — {/* BEAT 1: ProcessorUnit fades in frames 0–12 */}
    — {/* BEAT 2: Input block slides in from left frames 8–26 */}
    — One comment per distinct animation beat in the scene

10. Export statement (1 line)
    — export default SceneXX_Name; (if not already using named export above)
```

### Line Count Verification Checklist

Before submitting any scene file, verify:

- [ ] File has `//` file header block with scene metadata
- [ ] ALL imports are present (missing imports = build error)
- [ ] `CANVAS_W`, `CANVAS_H`, `CX`, `CY` declared as constants
- [ ] EVERY number in the file is a named const (zero raw number literals in JSX)
- [ ] Every SVG path has a pre-calculated `PATH_TOTAL_LENGTH` const
- [ ] **NO** `import { WordByWordSubtitle }` in this file (subtitle is global in Scene.tsx only)
- [ ] **NO** `const KEYWORDS` declared in this file (keywords array belongs in Scene.tsx only)
- [ ] Inline SVG elements are extracted as sub-components, not written inline in JSX
- [ ] Each sub-component has JSDoc comment
- [ ] Animation beat comments appear inside JSX return
- [ ] `extrapolateLeft: 'clamp'` and `extrapolateRight: 'clamp'` on every `interpolate()`
- [ ] Line count is between 400 and 600 — count before finalizing

### Padding Strategy (if a scene falls below 400 lines)

If a scene's visual content is genuinely simple (e.g., a FLASH scene with one element),
use these strategies to reach 400 lines WITHOUT adding fake logic:

1. **Expand sub-components**: Break the SVG into more granular named sub-components
   (e.g., separate `ArrowHead`, `ArrowShaft`, `ArrowLabel` instead of one `Arrow`)
2. **Explicit JSDoc blocks**: Write full `/** @param ... @returns ... */` JSDoc for
   every sub-component and every TypeScript interface
3. **Typed interfaces**: Define a `Props` interface for every sub-component even if
   it has zero props — document what it renders and why
4. **Animation constant documentation**: Add a multi-line comment above each animation
   const block explaining the timing rationale and design intent
5. **Accessibility attributes**: Add `aria-label`, `role`, and `title` elements to
   every SVG group

### Scene File Template (400-Line Skeleton)

```tsx
//─────────────────────────────────────────────────────────────
// Scene[NN]_[Name].tsx
// Scene [NN] — [SCENE NAME]
// frameIn:  [N]  |  frameOut: [N]  |  Duration: [N]s ([CATEGORY])
// speechRef: S[N] — "[first few words of speech covered]"
// Layout:   [single_hero | split_panel | infographic] — [PaperBackground | BlackBackground]
// Subject:  [one-line description of primary visual]
// Beats:
//   BEAT 1 — [animation description]
//   BEAT 2 — [animation description]
//─────────────────────────────────────────────────────────────

import React from 'react';
import { useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';
import { PaperBackground } from '../../components/PaperBackground';
import { BlackBackground } from '../../components/BlackBackground';
import { PaperGrain } from '../../components/PaperGrain';
import { ProcessorUnit } from '../../components/ProcessorUnit';
import { AIRobot } from '../../components/AIRobot';
import { LoopArrow } from '../../components/LoopArrow';
import { DrawPath } from '../../components/DrawPath';
// ⚠️ Do NOT import WordByWordSubtitle here — subtitle is global in Scene.tsx
import { colors } from '../../design-tokens/colors';
import { typography } from '../../design-tokens/typography';
import { motion } from '../../design-tokens/motion';

// ─── Canvas constants ────────────────────────────────────────
const CANVAS_W = 1080;
const CANVAS_H = 1920;
const CX = CANVAS_W / 2;
const CY = CANVAS_H / 2;

// ─── Layout constants ────────────────────────────────────────
// [Add scene-specific layout constants here]
const ELEMENT_SIZE = 200;
const ELEMENT_X = CX - ELEMENT_SIZE / 2;
const ELEMENT_Y = CY - ELEMENT_SIZE / 2;

// ─── Animation timing constants ──────────────────────────────
// BEAT 1: [Element] fades in
const FADE_IN_START = 0;
const FADE_IN_DURATION = 12;
// BEAT 2: [Element] slides in
const SLIDE_START = 8;
const SLIDE_DURATION = 18;
const SLIDE_OFFSET_PX = 40;
// [Continue for every animation beat...]

// ─── SVG path data (pre-calculated lengths) ──────────────────
// const PATH_EXAMPLE = 'M 200 960 C 400 700 680 1200 880 960';
// const PATH_EXAMPLE_LENGTH = 580; // px, from SVGPathElement.getTotalLength()

// ─── Sub-components ──────────────────────────────────────────

interface ExampleElementProps {
  opacity: number;
  translateY: number;
}

/**
 * ExampleElement
 * Renders [description of what this sub-component draws].
 * Used for [which beat / visual purpose].
 */
const ExampleElement: React.FC<ExampleElementProps> = ({ opacity, translateY }) => (
  <g
    style={{ opacity, transform: `translateY(${translateY}px)` }}
    aria-label="[accessible description]"
    role="img"
  >
    <title>[SVG title for screen readers]</title>
    {/* SVG shapes here */}
    <rect
      x={ELEMENT_X}
      y={ELEMENT_Y}
      width={ELEMENT_SIZE}
      height={ELEMENT_SIZE}
      stroke={colors.deep_black}
      strokeWidth={3}
      fill={colors.warm_blue}
      rx={8}
    />
  </g>
);

// ─── Main scene component ─────────────────────────────────────

/**
 * Scene[NN]_[Name]
 *
 * [Full prose description of what this scene shows and why.
 *  Include: visual elements present, the animation sequence,
 *  the speech it accompanies, and the design intent.]
 */
export const Scene_NN_Name: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── BEAT 1 animation values ──────────────────────────────
  // Fades the main element in over FADE_IN_DURATION frames
  const elementOpacity = interpolate(
    frame,
    [FADE_IN_START, FADE_IN_START + FADE_IN_DURATION],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // ── BEAT 2 animation values ──────────────────────────────
  // Slides the element up from below its final position
  const elementTranslateY = interpolate(
    frame,
    [SLIDE_START, SLIDE_START + SLIDE_DURATION],
    [SLIDE_OFFSET_PX, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // [Add all remaining animation values here...]

  return (
    <PaperBackground>
      <PaperGrain sceneId="scene_NN" />

      <svg
        width={CANVAS_W}
        height={CANVAS_H}
        viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`}
        style={{ position: 'absolute', top: 0, left: 0 }}
      >
        {/* BEAT 1: [Element] fades in frames FADE_IN_START–(FADE_IN_START+FADE_IN_DURATION) */}
        <ExampleElement
          opacity={elementOpacity}
          translateY={elementTranslateY}
        />

        {/* [Additional beats...] */}
      </svg>

      {/* ⚠️ Do NOT add WordByWordSubtitle here — it is rendered globally in Scene.tsx */}
      {/* Adding it here causes double rendering and overlapping subtitles */}

    </PaperBackground>
  );
};
```

---

## PART 19 — WORD-BY-WORD SUBTITLE SYSTEM (CSV-DRIVEN) — V2

This system drives the global subtitle overlay in `Scene.tsx`.
It uses the CSV word-by-word transcript to highlight each spoken word in sync with audio.

### Architecture Rules (V2 — critical)

> ❌ **ANTI-PATTERN that causes double subtitles:**
> ```tsx
> // In any scene file — NEVER DO THIS:
> import { WordByWordSubtitle } from '../helpers/WordByWordSubtitle';
> const KEYWORDS = ['fast', 'slow'];
> // ... in JSX:
> <WordByWordSubtitle transcriptPath="..." audioOffsetFrames={90} keywords={KEYWORDS} />
> ```
> This renders a second subtitle bar on top of the global one.

> ✅ **Correct pattern — global singleton in `Scene.tsx` only:**
> ```tsx
> // Scene.tsx — only place WordByWordSubtitle is ever rendered:
> const GLOBAL_KEYWORDS = ['fast', 'slow', 'pointer', 'window'];
> // ...
> <Sequence durationInFrames={TOTAL_FRAMES}>
>   <WordByWordSubtitle
>     transcriptPath="day_23_transcript.csv"
>     audioOffsetFrames={AUDIO_OFFSET_FRAMES}
>     keywords={GLOBAL_KEYWORDS}
>   />
> </Sequence>
> ```

### Visual Design (V2)

| Element | Value |
|---|---|
| Font | `"Caveat", cursive` (pencil-art style, matches series) |
| Window | 2 past + active + 2 upcoming = **5 words** total |
| Active word | 62px, weight 900, electric cyan `#00E5FF`, glow shadow |
| Keywords (upcoming) | warm amber `#F59E0B`, soft glow, weight 800, 50px |
| Past words | `rgba(255,255,255,0.35)`, 50px, weight 600 |
| Upcoming non-keywords | white 90% opacity, 50px, weight 600 |
| Background | frosted `rgba(0,0,0,0.55)` + `backdropFilter: blur(8px)` + border |
| Position | Bottom strip, `bottom: 80px`, full width, centred |

### CSV Transcript Format

The transcript CSV is located at `public/day_[N]_transcript.csv` (must be in `public/`
for Remotion's `staticFile()` to access it at render time).

**CSV Columns:**
```
Word Index, Word, Start Time (s), End Time (s), Duration (s),
Start Timestamp, End Timestamp, Character Count
```

**Example rows:**
```csv
Word Index,Word,Start Time (s),End Time (s),Duration (s),Start Timestamp,End Timestamp,Character Count
1,Every,0.000,0.600,0.600,00:00.000,00:00.600,5
2,AI,0.600,1.020,0.420,00:00.600,00:01.020,2
3,you,1.020,1.260,0.240,00:01.020,00:01.260,3
```

**File naming convention:**
- Input CSV:  `src/Instructions/day [N] ai_word_by_word_transcript.csv`  (source, human-readable name)
- Runtime CSV: `public/day_[N]_transcript.csv`  (copy here for Remotion static access — use underscore, lowercase)

### WordEntry TypeScript Interface

```typescript
// types/transcript.ts

/** One row from the word-by-word CSV transcript */
export interface WordEntry {
  /** 1-indexed word position in the full script */
  index: number;
  /** The spoken word, may include punctuation */
  word: string;
  /** Absolute start time in seconds from audio start (t=0) */
  startTimeSec: number;
  /** Absolute end time in seconds from audio start (t=0) */
  endTimeSec: number;
  /** Duration this word is spoken, in seconds */
  durationSec: number;
  /** Frame number when this word starts (startTimeSec × fps + audioOffsetFrames) */
  frameIn: number;
  /** Frame number when this word ends (endTimeSec × fps + audioOffsetFrames) */
  frameOut: number;
}
```

### CSV Parser Hook

```typescript
// hooks/useTranscript.ts
import { useEffect, useState } from 'react';
import { staticFile } from 'remotion';
import { WordEntry } from '../types/transcript';

/**
 * useTranscript
 *
 * Loads and parses the word-by-word CSV transcript at build time.
 * Returns an array of WordEntry objects with pre-calculated frame numbers.
 *
 * @param csvFileName - filename only (no path) of the CSV in public/
 * @param fps - frames per second (from useVideoConfig)
 * @param audioOffsetFrames - frame at which audio starts (typically 90)
 */
export const useTranscript = (
  csvFileName: string,
  fps: number,
  audioOffsetFrames: number
): WordEntry[] => {
  const [words, setWords] = useState<WordEntry[]>([]);

  useEffect(() => {
    const load = async () => {
      const url = staticFile(csvFileName);
      const response = await fetch(url);
      const text = await response.text();

      const lines = text.trim().split('\n');
      // Skip header row (index 0)
      const parsed: WordEntry[] = lines.slice(1).map((line) => {
        const cols = line.split(',');
        const startTimeSec = parseFloat(cols[2]);
        const endTimeSec = parseFloat(cols[3]);
        return {
          index: parseInt(cols[0], 10),
          word: cols[1].trim(),
          startTimeSec,
          endTimeSec,
          durationSec: parseFloat(cols[4]),
          frameIn: Math.round(startTimeSec * fps) + audioOffsetFrames,
          frameOut: Math.round(endTimeSec * fps) + audioOffsetFrames,
        };
      });

      setWords(parsed);
    };

    load();
  }, [csvFileName, fps, audioOffsetFrames]);

  return words;
};
```

> **Note for static renders**: Remotion renders in Node.js. If `useEffect` + `fetch`
> does not work in your render pipeline, pre-parse the CSV at build time and import
> the result as a JSON constant instead. Both patterns are acceptable.

### WordByWordSubtitle Component

```tsx
// components/WordByWordSubtitle.tsx
import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { useTranscript } from '../hooks/useTranscript';
import { colors } from '../design-tokens/colors';
import { WordEntry } from '../types/transcript';

// ─── Layout constants ────────────────────────────────────────────────
/** Distance from bottom of 1920px canvas to bottom of subtitle bar */
const SUBTITLE_BOTTOM_PX = 140;
/** Left and right horizontal margin for the subtitle bar */
const SUBTITLE_HORIZONTAL_MARGIN_PX = 60;
/** Vertical padding inside subtitle bar */
const SUBTITLE_PADDING_V_PX = 18;
/** Horizontal padding inside subtitle bar */
const SUBTITLE_PADDING_H_PX = 32;
/** Border radius of subtitle bar */
const SUBTITLE_RADIUS_PX = 18;

// ─── Typography constants ────────────────────────────────────────────
/** Base subtitle font size in px */
const FONT_SIZE_PX = 44;
/** Subtitle line height */
const LINE_HEIGHT = 1.45;
/** Font weight for all subtitle words */
const FONT_WEIGHT_BASE = 700;
/** Extra font weight for the currently active (highlighted) word */
const FONT_WEIGHT_ACTIVE = 900;
/** Font family — bold impact-style for subtitles */
const FONT_FAMILY = '"Inter", "SF Pro Display", sans-serif';

// ─── Color constants ─────────────────────────────────────────────────
/** Background of the subtitle bar */
const SUBTITLE_BG = 'rgba(0, 0, 0, 0.78)';
/** Default word color (non-highlighted) */
const WORD_COLOR_DEFAULT = '#F9FAFB';   // soft white
/** Color for keyword words (pre-defined episode keywords) */
const WORD_COLOR_KEYWORD = '#00E5FF';   // electric cyan
/** Color for the currently active word (being spoken right now) */
const WORD_COLOR_ACTIVE = '#FFFFFF';    // pure white
/** Glow effect for the active word */
const WORD_ACTIVE_TEXT_SHADOW = '0 0 12px rgba(0, 229, 255, 0.6)';
/** Color for already-spoken words */
const WORD_COLOR_PAST = '#9CA3AF';      // muted gray

// ─── Animation constants ─────────────────────────────────────────────
/** Number of frames to fade the bar in when words begin */
const BAR_FADE_IN_FRAMES = 6;
/** Number of frames to fade the bar out after last word */
const BAR_FADE_OUT_FRAMES = 10;
/** How many words to show before the active word (sliding window) */
const WINDOW_BEFORE = 6;
/** How many words to show after the active word (sliding window) */
const WINDOW_AFTER = 6;

// ─── Interfaces ──────────────────────────────────────────────────────

interface WordByWordSubtitleProps {
  /** Filename of the CSV in public/ — e.g. "day_23_transcript.csv" */
  transcriptPath: string;
  /** Frame at which audio begins — typically 90 (3s day card) */
  audioOffsetFrames: number;
  /**
   * Words to highlight in electric_cyan regardless of when they are spoken.
   * Case-insensitive. Strip punctuation before comparing.
   * Example: ['loop', 'agent', 'model', 'observation']
   */
  keywords: string[];
}

// ─── Helper functions ─────────────────────────────────────────────────

/**
 * stripPunctuation
 * Removes leading/trailing punctuation from a word for keyword matching.
 * Example: "agent." → "agent"
 */
const stripPunctuation = (word: string): string =>
  word.replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, '');

/**
 * isKeyword
 * Returns true if the word matches any keyword in the list (case-insensitive).
 */
const isKeyword = (word: string, keywords: string[]): boolean => {
  const clean = stripPunctuation(word).toLowerCase();
  return keywords.map((k) => k.toLowerCase()).includes(clean);
};

/**
 * getWordState
 * Determines the visual state of a word relative to the current frame.
 * Returns: 'past' | 'active' | 'upcoming'
 */
const getWordState = (
  entry: WordEntry,
  frame: number
): 'past' | 'active' | 'upcoming' => {
  if (frame >= entry.frameOut) return 'past';
  if (frame >= entry.frameIn && frame < entry.frameOut) return 'active';
  return 'upcoming';
};

// ─── Sub-component: SingleWord ────────────────────────────────────────

interface SingleWordProps {
  entry: WordEntry;
  frame: number;
  keywords: string[];
}

/**
 * SingleWord
 * Renders one word in the subtitle bar with correct color and weight
 * based on its state (past / active / upcoming) and keyword status.
 */
const SingleWord: React.FC<SingleWordProps> = ({ entry, frame, keywords }) => {
  const state = getWordState(entry, frame);
  const keyword = isKeyword(entry.word, keywords);

  let color = WORD_COLOR_DEFAULT;
  let fontWeight: number = FONT_WEIGHT_BASE;
  let textShadow = 'none';
  let opacity = 1;

  if (state === 'active') {
    color = WORD_COLOR_ACTIVE;
    fontWeight = FONT_WEIGHT_ACTIVE;
    textShadow = WORD_ACTIVE_TEXT_SHADOW;
  } else if (state === 'past') {
    color = WORD_COLOR_PAST;
    opacity = 0.55;
  }

  // Keywords override color (but not if it's also active — active wins)
  if (keyword && state !== 'active') {
    color = WORD_COLOR_KEYWORD;
    opacity = state === 'past' ? 0.7 : 1;
  }

  return (
    <span
      style={{
        display: 'inline-block',
        marginRight: '0.28em',
        color,
        fontWeight,
        textShadow,
        opacity,
        fontSize: `${FONT_SIZE_PX}px`,
        fontFamily: FONT_FAMILY,
        lineHeight: LINE_HEIGHT,
        transition: 'none',   // no CSS transitions — Remotion controls timing
      }}
      aria-label={entry.word}
    >
      {entry.word}
    </span>
  );
};

// ─── Main component ───────────────────────────────────────────────────

/**
 * WordByWordSubtitle
 *
 * A fixed-position subtitle bar that shows a sliding window of words
 * from the CSV transcript, highlighting each word as it is spoken.
 *
 * - Sits at the bottom of the 1920px canvas at a fixed position.
 * - Shows WINDOW_BEFORE words before the active word.
 * - Shows the active word in pure white + cyan glow.
 * - Shows WINDOW_AFTER words after the active word (upcoming).
 * - Keywords always rendered in electric_cyan.
 * - Past words dimmed to gray.
 * - Bar fades in when speech starts, fades out after last word.
 *
 * USAGE in scene files:
 *   <WordByWordSubtitle
 *     transcriptPath="day_23_transcript.csv"
 *     audioOffsetFrames={90}
 *     keywords={KEYWORDS}
 *   />
 *
 * Place this as the LAST element inside the scene background wrapper,
 * so it renders on top of all SVG content.
 */
export const WordByWordSubtitle: React.FC<WordByWordSubtitleProps> = ({
  transcriptPath,
  audioOffsetFrames,
  keywords,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const allWords = useTranscript(transcriptPath, fps, audioOffsetFrames);

  if (allWords.length === 0) return null;

  // Find index of currently active word
  const activeIndex = allWords.findIndex(
    (w) => frame >= w.frameIn && frame < w.frameOut
  );

  // Before speech starts: use 0. After speech ends: use last index.
  const anchorIndex =
    activeIndex === -1
      ? frame < allWords[0].frameIn
        ? -1
        : allWords.length - 1
      : activeIndex;

  // If before first word and bar not yet visible, render nothing
  if (anchorIndex === -1) return null;

  // Sliding window of words to display
  const windowStart = Math.max(0, anchorIndex - WINDOW_BEFORE);
  const windowEnd = Math.min(allWords.length - 1, anchorIndex + WINDOW_AFTER);
  const windowWords = allWords.slice(windowStart, windowEnd + 1);

  // Bar fade in: from when audio starts
  const firstWordFrame = allWords[0].frameIn;
  const lastWordFrame = allWords[allWords.length - 1].frameOut;

  const barOpacity = interpolate(
    frame,
    [
      firstWordFrame,
      firstWordFrame + BAR_FADE_IN_FRAMES,
      lastWordFrame - BAR_FADE_OUT_FRAMES,
      lastWordFrame,
    ],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <div
      style={{
        position: 'absolute',
        bottom: SUBTITLE_BOTTOM_PX,
        left: SUBTITLE_HORIZONTAL_MARGIN_PX,
        right: SUBTITLE_HORIZONTAL_MARGIN_PX,
        opacity: barOpacity,
        backgroundColor: SUBTITLE_BG,
        borderRadius: SUBTITLE_RADIUS_PX,
        padding: `${SUBTITLE_PADDING_V_PX}px ${SUBTITLE_PADDING_H_PX}px`,
        textAlign: 'center',
        lineHeight: LINE_HEIGHT,
        // Never moves — position is always fixed relative to canvas bottom
        pointerEvents: 'none',
      }}
      role="complementary"
      aria-label="Subtitle bar"
    >
      {windowWords.map((entry) => (
        <SingleWord
          key={entry.index}
          entry={entry}
          frame={frame}
          keywords={keywords}
        />
      ))}
    </div>
  );
};
```

### How to Wire WordByWordSubtitle in Every Scene

1. **Place the CSV in `public/`** before rendering:
   ```bash
   cp "src/Instructions/day 23 ai_word_by_word_transcript.csv" \
      "public/day_23_transcript.csv"
   ```

2. **In every scene component**, add as the last element inside the background wrapper:
   ```tsx
   <PaperBackground>
     {/* ... all SVG content ... */}
     <WordByWordSubtitle
       transcriptPath="day_23_transcript.csv"
       audioOffsetFrames={90}
       keywords={KEYWORDS}
     />
   </PaperBackground>
   ```

3. **`KEYWORDS`** must be defined per scene as a `const` at the top of the file.
   Include 2–6 words from the speech line this scene covers. Example:
   ```typescript
   const KEYWORDS: string[] = ['loop', 'definition', 'agent', 'observation'];
   ```

4. **Day Card scenes (01, 02)** — no subtitle bar needed (pre-audio). Omit the component.

5. **Black background explanation scenes** — include the subtitle bar; it renders
   correctly on both paper and black backgrounds.

### Keyword Highlighting Rules

| Priority | Condition | Color | Weight |
|---|---|---|---|
| 1 (highest) | Word is currently being spoken (active) | `#FFFFFF` pure white | 900 |
| 2 | Word is a keyword AND upcoming | `#00E5FF` electric cyan | 700 |
| 3 | Word is a keyword AND past | `#00E5FF` electric cyan, 70% opacity | 700 |
| 4 | Word is upcoming (non-keyword) | `#F9FAFB` soft white | 700 |
| 5 (lowest) | Word is past (non-keyword) | `#9CA3AF` muted gray, 55% opacity | 700 |

### Audio File Path Convention

| Asset | Source Location (for reference) | Runtime Location (for Remotion) |
|---|---|---|
| Audio WAV | `src/Instructions/audio/day [N] ai.wav` | `public/day_[N]_audio.wav` |
| Transcript CSV | `src/Instructions/day [N] ai_word_by_word_transcript.csv` | `public/day_[N]_transcript.csv` |
| Motion spec | `src/Instructions/Day_[N]_motion.md` | Reference only — not runtime |
| Style spec | `src/Instructions/style/style_pencilart.md` | Reference only — not runtime |

Copy audio and CSV to `public/` before running `npx remotion render`.

---

## PART 20 — ACTUAL PROJECT FILE STRUCTURE

The Remotion project for this series uses the following layout.
This overrides the canonical structure in PART 5 for Day 23 specifically.

```
Remotion-Projects/
├── src/
│   ├── Root.tsx                    ← registers all compositions
│   ├── index.ts                    ← Remotion entry point
│   ├── style.css                   ← global CSS (font imports)
│   ├── Day23/
│   │   ├── Scene.tsx               ← master composition, sequences all scenes
│   │   ├── frames/                 ← all SceneXX.tsx files live here (400–600 lines each)
│   │   │   ├── Scene01_DayCard.tsx
│   │   │   ├── Scene02_SnapZoom.tsx
│   │   │   └── ... (all 25 scenes per Day_23_motion.md)
│   │   └── helpers/
│   │       ├── animations.ts       ← reusable interpolate/spring helpers
│   │       ├── timing.ts           ← frame constants, FPS, audio offset
│   │       ├── DrawPath.tsx        ← animated SVG stroke-dashoffset component
│   │       ├── ProcessorUnit.tsx   ← AI model box (input→output)
│   │       └── TypographicCard.tsx ← day card / typographic overlay
│   ├── Instructions/               ← source assets for reference (not runtime)
│   │   ├── Day_23_motion.md        ← scene spec produced by motion_scene_generator.md
│   │   ├── remotion_instructions.md← THIS FILE (production spec)
│   │   ├── audio/
│   │   │   └── day 23 ai.wav      ← original audio (copy to public/ before render)
│   │   └── style/                  ← style spec files for reference
│   │       ├── style_pencilart.md
│   │       └── style_pencil_art_AI.md
│   └── helpers/                    ← shared utilities across all day compositions
│       ├── PaperBackground.tsx
│       ├── BlackBackground.tsx
│       ├── PaperGrain.tsx
│       ├── AIRobot.tsx
│       ├── LoopArrow.tsx
│       ├── WordByWordSubtitle.tsx  ← NEW — CSV-driven subtitle component (see PART 19)
│       └── useTranscript.ts        ← NEW — CSV parser hook (see PART 19)
├── public/                         ← static assets — REQUIRED for Remotion staticFile()
│   ├── day_23_audio.wav            ← copied from src/Instructions/audio/
│   ├── day_23_transcript.csv       ← copied from src/Instructions/ CSV file
│   └── fonts/
│       ├── Inter-Variable.woff2
│       └── Caveat-Variable.woff2
├── package.json
├── remotion.config.ts
└── tsconfig.json
```

### Scene Count for Day 23

Day 23 uses **25 scenes** (not the 60-scene system from PART 3).
The 25-scene structure is defined in `outputs/Day 23/Day_23_motion.md`.
The 60-scene system applies to future episodes built from scratch with this spec.
When implementing Day 23, follow the 25-scene scene list from `Day_23_motion.md` exactly.

---

## PART 21 — MANDATORY VISUAL QUALITY RULES (ALL EPISODES)

These rules apply to **every** scene in every episode. Violating any of these is considered a critical bug. These were introduced after Day 23 production review.

---

### RULE 1 — NO EMOJIS. SVG ONLY. ALWAYS.

**NEVER use emoji characters** in any scene file, component, or helper. This includes but is not limited to:
`🤖 🔄 👁 🎯 ⚡ 🧮 👍 🔔 🌍 💬 ⚙ 🧠 ✓ ✕ ↓ ↩ ≈` (outside SVG text elements)

**ALWAYS use inline SVG** for every icon, symbol, and visual indicator. Examples of correct replacements:

```tsx
// ❌ WRONG — emoji
<span style={{ fontSize: 48 }}>⚡</span>

// ✅ CORRECT — SVG lightning bolt
<svg width={48} height={48} viewBox="0 0 48 48">
  <polygon points="16,4 30,22 20,22 28,44 14,24 24,24" fill="#00E5FF"/>
</svg>

// ❌ WRONG — emoji
<span style={{ fontSize: 48 }}>🤖</span>

// ✅ CORRECT — SVG robot head
<svg width={48} height={48} viewBox="0 0 48 48">
  <rect x={10} y={16} width={28} height={22} rx={5} fill="none" stroke="#00E5FF" strokeWidth={2}/>
  <circle cx={20} cy={26} r={4} fill="#00E5FF"/>
  <circle cx={28} cy={26} r={4} fill="#00E5FF"/>
</svg>

// ❌ WRONG — unicode arrow in JSX
<div>↓</div>

// ✅ CORRECT — SVG down arrow
<svg width={24} height={32} viewBox="0 0 24 32">
  <line x1={12} y1={2} x2={12} y2={24} stroke="#00E5FF" strokeWidth={3} strokeLinecap="round"/>
  <polyline points="4,18 12,28 20,18" fill="none" stroke="#00E5FF" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"/>
</svg>

// ❌ WRONG — checkmark unicode
<div>✓ Parseable</div>

// ✅ CORRECT — SVG checkmark
<svg width={20} height={20} viewBox="0 0 20 20">
  <polyline points="3,10 8,15 17,5" fill="none" stroke="#22C55E" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"/>
</svg>
```

**SVG icons to always have pre-built and ready in `components.tsx`:**
- Lightning/energy bolt → `<LightningIcon color ... />`
- Circular arrow (loop) → `<LoopIcon color ... />`
- Eye (observe) → `<EyeIcon color ... />`
- Target/bullseye → `<TargetIcon color ... />`
- Robot head → `<RobotIcon color ... />` (already exists as `AIRobot`)
- Checkmark → `<CheckIcon color ... />`
- X mark → `<XMarkIcon color ... />`
- Down arrow → `<ArrowDownIcon color ... />`
- Globe → `<GlobeIcon color ... />`
- Thumbs up → `<ThumbsUpIcon color ... />`
- Bell → `<BellIcon color ... />`

---

### RULE 2 — STRICT EDGE SAFETY MARGINS

**No content may appear outside these bounds:**

| Edge | Min margin from edge |
|---|---|
| Left | 80px from `x=0` → content starts at `x ≥ 80` |
| Right | 80px from `x=1080` → content ends at `x ≤ 1000` |
| Top | 80px from `y=0` → content starts at `y ≥ 80` |
| Bottom | 160px from `y=1920` → content ends at `y ≤ 1760` |

**CaptionBar** is exempt — it lives at `y=1730–1800` range by design.

**SVG elements** must have all coordinates checked: never let an SVG path extend beyond these DOM margins. A robot at `cx=540` with `scale=0.65` and radius `r=190` extends `±124px` from center → leftmost `540-124=416`, rightmost `540+124=664` — this is fine. But `cx=100, r=190` would clip the left edge at `100-124=-24` — **NOT FINE**. Always compute.

**Absolute-positioned DOM divs** must be checked: `left + width ≤ 1000`, `top + height ≤ 1760`.

---

### RULE 3 — VERTICAL CENTERING

**The hero visual area of every scene must be centered around the canvas midpoint `y=960`**, not pushed to the top.

**Correct layout zones for 1920px tall canvas:**

```
y: 0   → 80    : Top safe margin (empty)
y: 80  → 260   : Scene title / headline (font size 56–80px, weight 900)
y: 260 → 1640  : Hero content zone — ALL main visuals, diagrams, code, cards
                  Hero visual center should be at y ≈ 950
y: 1640 → 1720 : Lower safe zone (empty buffer before caption)
y: 1720 → 1820 : CaptionBar zone
y: 1820 → 1920 : Bottom safe margin (empty)
```

**Anti-pattern to avoid:**
```tsx
// ❌ WRONG — everything crammed at top, dead space at bottom
title: top: 80
card1: top: 280
card2: top: 440
card3: top: 600
// → y=760 to y=1640 is 880px of dead space
```

**Correct pattern:**
```tsx
// ✅ CORRECT — distribute cards evenly through hero zone
title: top: 100
card1: top: 340  (hero zone starts)
card2: top: 660
card3: top: 980
// → hero center at (340+980)/2 = 660, close to 960 midpoint
```

For scenes with a **large central SVG** (robot, diagram, globe): position the SVG element's center at `cy=800–1000`. Stack text/callout content in the zones above or below the SVG, leaving ≥ 60px gap.

---

### RULE 4 — NO OVERLAPPING ELEMENTS

**Every pair of vertically stacked elements must have a minimum 40px gap.** For horizontally adjacent cards, minimum 20px gap.

**Quick checklist for stacked card layouts:**
- Card height: measure actual rendered height (padding + content)
- Next card top: prevCardTop + prevCardHeight + ≥40px gap
- Last card bottom: ≤ 1640px

**Example for 3 stacked cards, each 180px tall:**
```
Card 1: top=380, bottom=560
Card 2: top=620 (gap=60px), bottom=800
Card 3: top=860 (gap=60px), bottom=1040
```

If cards don't fit with 40px gap, **reduce padding** or **reduce font size** — never reduce the gap.

---

### RULE 5 — CAPTION BAR STYLE (No Background)

The `<CaptionBar>` component must **never** have a background panel. Always:

- **No** `background:` property on the caption container
- **No** border, box-shadow, or backdrop-filter
- Text color: `#0D0D0D` (deep black) for normal words
- Highlighted words: color `#F5A623` (amber/yellow) with subtle `rgba(245,166,35,0.15)` background only on the word span itself
- Font size: 38px, font weight: 600 (normal), 800 (highlighted)
- Use the `highlightWords` prop to specify which key words get highlighted in yellow

```tsx
// ✅ CORRECT
<CaptionBar
  text="The agent acts, watches, and responds."
  highlightWords={['acts', 'watches', 'responds']}
  opacity={enter}
  y={1730}
/>
```

---

### RULE 6 — DO NOT REPEAT THESE PROBLEMS

This is a binding list of issues that appeared in Day 23 and must **never appear** in any future scene:

| Problem | Wrong | Correct |
|---|---|---|
| Emojis in JSX | `<span>🤖</span>` | Inline SVG robot icon |
| Unicode arrows in JSX | `<div>↓</div>` | SVG arrow element |
| Caption with dark background | `background: 'rgba(13,13,13,0.88)'` | No background, dark text |
| White caption text | `color: '#FFFFFF'` | `color: '#0D0D0D'` |
| Content bunched at top | `top: 80, 200, 320...` (all near top) | Distribute across 300–1640px range |
| Hero visual at y=200–400 | Small scene, lots of blank bottom space | Hero center ≈ y=960 |
| Content cut at bottom edge | `top: 1700 + height 200 = 1900` exceeds 1760 safe zone | Ensure bottom ≤ 1760 |
| Card overlap | Two 200px-tall cards at top:400 and top:560 (only 160px gap) | Gap ≥ 40px always |
| Emoji in array icons | `{ icon: '⚡' }` in data arrays | `{ iconSvg: <svg>...</svg> }` |

---

*End of PART 21 — Mandatory Visual Quality Rules*

---

*End of Remotion Production Instructions V2*
*Global Daily — Hidden World Secrets Series*
*Updated: Added PART 18 (400–600 line TSX rule), PART 19 (CSV word-by-word subtitle system), PART 20 (actual project file structure), PART 21 (mandatory visual quality rules — no emojis, edge safety, centering, spacing, caption style)*
