# REMOTION PROJECT — CLAUDE CODE RULES

> **Primary code-generation instructions live in `.github/copilot-instructions.md`.**
> This file (`CLAUDE.md`) contains Claude Code-specific context, project overview, and fixes
> that supplement the Copilot instructions. When generating video code, consult BOTH files.

---

## QUICK DAILY TRIGGER

```
ACCEPTED COMMANDS:
  "Generate Day 28 from AI series"
  "Generate Days 28 through 31 from AI series"
  "Generate Days 28, 29, 30 from Java series"
  "Generate Day 12 from HiddenWorld series"
```

**On receiving any command → execute immediately. Zero questions. Zero confirmations.**
All ambiguity resolved using PART 17 AMBIGUITY TABLE in `.github/copilot-instructions.md`.
Every file is chunk-based (PART 18). Every chunk starts with a full instruction re-read.

### Execution sequence
1. PART 17 → autonomy rules + ambiguity table
2. PART 18 → chunk execution map (re-read before every chunk)
3. PART 19 → multi-day batch protocol (if multiple days)
4. Generate all days in command completely without stopping
5. Update `src/Root.tsx` once at the very end

---

## PROJECT IDENTITY

| Property | Value |
|---|---|
| Framework | Remotion 4.0 + React 19 + TypeScript |
| Canvas | 1080 × 1920 px portrait, 30 fps |
| Background | `#F5F0E8` warm paper — EVERY scene |
| Audio | Must be in `public/` for `staticFile()` |
| Package manager | npm |

---

## BOTTLENECK FIXES (previously caused generation failures)

### FIX 1 — Audio must be in public/

`staticFile('audio/ai27.wav')` resolves to `public/audio/ai27.wav`.
It does **NOT** resolve to `src/Instructions/audio/ai27.wav`.

**Before generating any scene, run:**
```bash
# Check if audio exists in public:
ls public/audio/ai{N}.wav

# If not found, copy from Instructions:
cp "src/Instructions/audio/ai{N}.wav" "public/audio/ai{N}.wav"
```

**In Scene.tsx, ALWAYS reference as:**
```tsx
<Audio src={staticFile('audio/ai{N}.wav')} startFrom={0} />
// ↑ staticFile('audio/X') → public/audio/X — this is the rule
```

### FIX 2 — Audio import source

```tsx
// ✅ CORRECT — Audio from 'remotion' (this is what existing Day23–27 use)
import { AbsoluteFill, Audio, Sequence, staticFile } from 'remotion';

// ❌ WRONG — do not use @remotion/media for Audio
import { Audio } from '@remotion/media';
```

### FIX 3 — Audio Sequence delay (audio starts at frame 150, NOT frame 0)

```tsx
// ✅ CORRECT — audio delayed by 150 frames (Scene01 scroll runs silently first)
<Sequence from={150} durationInFrames={AUDIO_FRAMES}>
  <Audio src={staticFile('audio/ai{N}.wav')} startFrom={0} />
</Sequence>

// ❌ WRONG — audio starting at composition frame 0
<Audio src={staticFile('audio/ai{N}.wav')} startFrom={0} />
// (global Audio with no Sequence wrapper plays during the silent scroll)
```

### FIX 4 — Frame calculation formula (unambiguous)

```typescript
// Given: audioSeconds = last row's "End Time (s)" from CSV
const SCROLL_FRAMES  = 150;
const AUDIO_FRAMES   = Math.ceil(audioSeconds * 30);
const AUDIO_END      = SCROLL_FRAMES + AUDIO_FRAMES;
const TAKEAWAY_FROM  = AUDIO_END + 30;           // 1s gap after audio ends
const TAKEAWAY_DUR   = 120;
const OUTRO_FROM     = TAKEAWAY_FROM + TAKEAWAY_DUR;
const OUTRO_DUR      = 362;
const TOTAL_FRAMES   = OUTRO_FROM + OUTRO_DUR;

// Content scene from values:
// scene_from = 150 + Math.round(csv_start_seconds * 30)
// scene_duration = Math.max(60, Math.round((csv_end - csv_start) * 30) + 18)
```

### FIX 5 — premountFor on every Sequence

```tsx
// ✅ CORRECT — all Sequences must have premountFor={30}
<Sequence from={s02.from} durationInFrames={s02.duration} premountFor={30}>
  <Scene02_Name />
</Sequence>

// ❌ WRONG — missing premountFor causes loading hiccups
<Sequence from={s02.from} durationInFrames={s02.duration}>
  <Scene02_Name />
</Sequence>
```

### FIX 6 — CSS transitions / animations are FORBIDDEN

```tsx
// ✅ CORRECT — animate with useCurrentFrame() + interpolate()
const opacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });
<div style={{ opacity }}>...</div>

// ❌ WRONG — CSS transitions don't render in Remotion
<div style={{ transition: 'opacity 0.5s' }}>...</div>
<div className="animate-fade-in">...</div>   // Tailwind animation = FORBIDDEN
```

### FIX 7 — useCurrentFrame() is LOCAL inside Sequence

```tsx
// Inside <Sequence from={150} ...>, useCurrentFrame() returns 0 at composition frame 150
// So: local frame 0 = composition frame 150

// ✅ CORRECT — scene animations start from local frame 0
const enter = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });

// ❌ WRONG — don't add SCENE_TIMING.from offset inside the scene
const enter = interpolate(frame - SCENE_TIMING.s02.from, [0, 20], [0, 1], ...);
// frame is already local — subtracting from is double-counting
```

### FIX 8 — Caption uses SVG text, not HTML div

```tsx
// ✅ CORRECT — caption is SVG <text> element inside the SVG
<text x={540} y={1780} textAnchor="middle"
  fontFamily="'Inter', system-ui, sans-serif"
  fontSize={38} fontWeight={700}
  fill={COLORS.text_caption}
  opacity={captionOpacity}>
  Caption text here
</text>

// ❌ WRONG — HTML div caption breaks layout on paper background
<div style={{ position: 'absolute', bottom: 140, ... }}>Caption</div>
```

### FIX 9 — No gradient anywhere

```tsx
// ✅ CORRECT — solid flat fill
<rect fill={COLORS.sky_blue} />
<rect fill={COLORS.bg_paper} />

// ❌ WRONG — gradients are FORBIDDEN
<defs><linearGradient id="g">...</linearGradient></defs>
<rect fill="url(#g)" />
<div style={{ background: 'linear-gradient(...)' }} />
```

### FIX 10 — staticFile path rules

```
public/audio/ai27.wav      → staticFile('audio/ai27.wav')   ✅
public/day_23_audio.wav    → staticFile('day_23_audio.wav')  ✅
src/Instructions/audio/    → NOT accessible via staticFile   ❌
```

### FIX 11 — Caption text must always be near-black (NEVER white)

The paper background is `#F5F0E8` (warm off-white). Any white or light caption text
becomes **invisible**. This is the most common subtitle visibility failure.

```tsx
// ✅ CORRECT — explicit dark fill on parent text element
<text
  x={540} y={1780} textAnchor="middle"
  fontFamily="'Inter', system-ui, sans-serif"
  fontSize={38} fontWeight={700}
  fill={COLORS.text_caption}   // ← #1A1A1A — REQUIRED, always explicit
>
  <tspan fill={COLORS.text_caption}>Normal word </tspan>
  <tspan fill={COLORS.text_highlight}>highlighted</tspan>  // ← #2563EB
</text>

// ❌ WRONG — white or missing fill (invisible on off-white background)
<text fill="white">...</text>
<text fill="#FFFFFF">...</text>
<text fill={COLORS.bg_paper}>...</text>   // same as white
<text>...</text>  // no fill = inherits white in some renderers
```

Always use the `Caption` component from `helpers/components.tsx`. Never write raw caption
SVG text inside a scene file — the component enforces the correct colors automatically.

### FIX 12 — Every scene must contain a thematic SVG illustration

Scenes with only text blocks and colored rectangles are **rejected**. Every content scene
must draw at least ONE topic-relevant illustration using inline SVG primitives.

```
Java/Train series → draw trains, tracks, stations, tickets, signals, switches
AI series        → draw agent nodes, neural connections, memory banks, loop arrows
HiddenWorld      → draw the specific subject (planets, cars, cells, circuits, etc.)
```

See PART 14B of `.github/copilot-instructions.md` for the full vocabulary with SVG shapes.

```tsx
// ✅ CORRECT — scene about a train station draws the station
<g transform="translate(60, 600)" opacity={card1.opacity}>
  {/* Station building */}
  <rect x={0} y={0} width={960} height={200} rx={8} fill={COLORS.bg_paper}
    stroke={COLORS.orange} strokeWidth={2.5} />
  {/* Roof triangle */}
  <polygon points="480,0 0,160 960,160" fill={COLORS.orange} fillOpacity={0.12} />
  {/* Platform */}
  <rect x={-20} y={200} width={1000} height={24} fill={COLORS.deep_black} fillOpacity={0.08} />
  {/* Rails */}
  <line x1={100} y1={224} x2={860} y2={224} stroke={COLORS.cool_silver} strokeWidth={3} />
  <line x1={100} y1={240} x2={860} y2={240} stroke={COLORS.cool_silver} strokeWidth={3} />
  {/* Label */}
  <text x={480} y={110} textAnchor="middle" fontSize={48} fontWeight={800}
    fill={COLORS.deep_black} fontFamily="'Inter', sans-serif">CENTRAL STATION</text>
</g>

// ❌ WRONG — just a colored box with text
<rect x={60} y={600} width={960} height={200} fill={COLORS.orange} fillOpacity={0.1} />
<text x={80} y={700} fontSize={36} fill={COLORS.deep_black}>Train Station</text>
```

### FIX 13 — Scene count must exactly match CSV phrase groups

Do NOT add content scenes that have no corresponding CSV phrase. The only "structural"
scenes allowed without a CSV phrase are: Scene01_ScrollTimeline, Scene{LAST-1}_KeyTakeaway,
and Scene{LAST}_Outro.

```
CSV produces 14 phrase groups → generate exactly 14 content scenes (Scene02–Scene15)
Total files: Scene01 + Scene02…Scene15 + Scene16_KeyTakeaway + Scene17_Outro = 17 files

❌ Do NOT add a "SceneIntro" or "SceneOverview" before Scene02
❌ Do NOT add a "SceneSummary" or extra recap after Scene15
❌ Do NOT split one CSV phrase into two scenes to inflate scene count
```

### FIX 14 — Rebuild the app after every video generation

After writing all files for a day (including `Scene.tsx`), run the TypeScript build.
A day is **NOT complete** until `npm run build` exits with zero errors.

```bash
# Run after every single day's files are written
npm run build

# If errors appear: fix them immediately, then re-run
# Common errors: wrong import paths, missing SCENE_TIMING keys,
#   incorrect TOTAL_FRAMES, wrong component name casing
# In batch mode: rebuild after EACH day before moving to the next
```

```
✅ DAY N COMPLETE — only valid after npm run build exits clean
❌ Never skip the build step to save time — it catches errors before render
```

---

## SERIES ARCHITECTURE FILES

```
AI series:         src/Instructions/architecture_AI.md      (120 parts)
Java series:       src/Instructions/architecture_java.md    (105 parts)
HiddenWorld:       src/Instructions/architecture.md         (120 days)
```

**Read BEFORE generating:**
- Day N: get topic, module name, subtitle
- Day N+1: get next-day topic for Outro scene
- Always extract the exact topic text — do not paraphrase

---

## CSV TRANSCRIPT FORMAT

```
Word Index | Word | Start Time (s) | End Time (s) | Duration (s) | Start Timestamp | End Timestamp | Character Count
```

**Key fields used:**
- `Word` → script text (may include punctuation like `"moon,"` or `"completely,"`)
- `Start Time (s)` → when this word begins (seconds from audio start)
- `End Time (s)` → when this word ends
- Last row's `End Time (s)` = total audio duration

**Scene boundary detection triggers (in priority order):**
1. Word ends with `.`, `!`, `?` → HARD BREAK (new scene)
2. Word ends with `,` AND gap to next word > 0.4s → SOFT BREAK
3. Gap between consecutive words > 0.6s → PAUSE BREAK
4. Phrase duration > 8s → LENGTH BREAK (split at nearest punctuation)
5. Merge groups with ≤ 3 words AND < 2s duration into adjacent group

---

## FOLDER STRUCTURE QUICK REFERENCE

```
src/Day{N}/
├── Scene.tsx                     (orchestrator — imports all scenes)
├── helpers/
│   ├── timing.ts                 (SCENE_TIMING, COLORS, CAPTIONS, helpers)
│   └── components.tsx            (PaperBackground, Caption, GlobalDefs, etc.)
└── frames/
    ├── Scene01_ScrollTimeline.tsx (150 frames, SILENT, shows day list)
    ├── Scene02_{Name}.tsx         (first audio scene, frame 150+)
    ├── Scene03_{Name}.tsx
    ├── ...
    ├── Scene{N-1}_KeyTakeaway.tsx (120 frames)
    └── Scene{N}_Outro.tsx         (362 frames, next day preview)

public/audio/
    ai{N}.wav       (AI series — must be here for staticFile to work)
    java{N}.wav     (Java series)
    day{N}_*.wav    (HiddenWorld)
```

---

## COLOR PALETTE (use ONLY these)

```typescript
export const COLORS = {
  bg_paper:       '#F5F0E8',   // background — EVERY scene
  deep_black:     '#1A1A1A',   // text, outlines
  sky_blue:       '#2563EB',   // primary accent
  green:          '#16A34A',   // success, secondary
  orange:         '#EA580C',   // energy, speed
  brown:          '#92400E',   // structural warmth
  amber:          '#D97706',   // engineering
  cool_silver:    '#94A3B8',   // secondary text
  vibrant_red:    '#DC2626',   // errors only
  purple:         '#7C3AED',   // AI/neural
  text_caption:   '#1A1A1A',   // caption normal
  text_highlight: '#2563EB',   // caption key words
} as const;
```

---

## CAPTION FIXED SPECIFICATION (TOP POSITION)

```
x:             540 (center anchor)
y:             140 (TOP — single line)  |  116 / 164 (TOP — two lines, 48px gap)
textAnchor:    "middle"
fontSize:      38
fontWeight:    700
fontFamily:    'Inter', system-ui, sans-serif
Background:    NONE — zero rect, zero box, zero outline
Key words:     fill={COLORS.text_highlight} (#2563EB)
Normal words:  fill={COLORS.text_caption} (#1A1A1A)
Max chars/ln:  52
Position:      TOP of canvas — NOT bottom

Caption zone:  y=50–200 (TOP STRIP — reserved, no content elements here)
Content zone:  y=220–1880 (below caption strip, before bottom edge)
```

---

## NON-NEGOTIABLE STYLE RULES

| Rule | Enforcement |
|---|---|
| Paper background `#F5F0E8` on EVERY scene | ABSOLUTE |
| No gradients | ABSOLUTE |
| No glow / blur filters | ABSOLUTE |
| No emojis | ABSOLUTE |
| No pure white (#FFF) backgrounds | ABSOLUTE |
| All text ≥ 28px | ABSOLUTE |
| **Caption at TOP (y=140), no background — NOT at bottom** | ABSOLUTE |
| **Caption text: always `#1A1A1A`, never white or transparent** | ABSOLUTE |
| **Caption `<text>` must have explicit `fill={COLORS.text_caption}`** | ABSOLUTE |
| **No 3D animations — strictly 2D SVG + spring() only** | ABSOLUTE |
| **No @react-three/fiber, @remotion/three, or three.js** | ABSOLUTE |
| No CSS transitions/animations | ABSOLUTE |
| No overlapping elements | ABSOLUTE |
| SVG icons only (no emoji icons) | ABSOLUTE |
| **Every content scene has ≥ 1 thematic SVG illustration** | ABSOLUTE |
| **Illustrations must match series topic (train/AI/etc.)** | ABSOLUTE |
| Audio in Sequence from={150} | ABSOLUTE |
| premountFor={30} on all Sequences | ABSOLUTE |
| Content y=220–1880 only (caption strip y=50–200 reserved at TOP) | ABSOLUTE |
| Colors only from COLORS object | ABSOLUTE |
| **Scene count = CSV phrase groups exactly (no extras)** | ABSOLUTE |
| **Run `npm run build` after every day — 0 errors required** | ABSOLUTE |

---

## LAYOUT SAFE ZONES

```
y=0    ← canvas top
y=50   ← caption zone begins (TOP STRIP)
y=140  ← caption baseline — single line
y=116  ← caption first line (two-line mode)
y=164  ← caption second line (two-line mode)
y=200  ← caption zone ends
y=220  ← content zone begins (Zone A — section label)
y=220–1880 ← full content zone (1660px usable height)
y=1880 ← bottom content boundary
y=1920 ← canvas bottom

x=0    ← canvas left
x=60   ← content left margin
x=1020 ← content right margin
x=1080 ← canvas right
Usable width: 960px

Scene01 day counter:
  "DAY N / TOTAL" badge at x=60, y=90 (top-left)
  Progress bar:   x=60, y=110, animated left→right
  Totals:         AI=120, Java=105, HiddenWorld=100
```

---

## AUTONOMY RULES (summary — full rules in .github/copilot-instructions.md PART 17 + 18 + 19)

| Rule | Detail |
|---|---|
| Zero questions | Never ask anything — use PART 17 ambiguity table |
| Zero confirmations | Never wait for user input between days or chunks |
| Plan before code | Print full plan (PART 19 Phase 2 template) before any file |
| Chunk-based writing | Max 5 content scenes per chunk (PART 18) |
| Re-read before EVERY chunk | Full instruction re-read, not summary from memory |
| Completion checkpoint | Print `✅ DAY N COMPLETE` marker after each day |
| Root.tsx once | Single update after ALL days — never per-day |
| Final report | Print summary table after Root.tsx update |
| Fix, don't ask | If error/ambiguity — fix using the rules, never pause |

**Anti-drift checklist (enforced before every chunk, not just every day):**
- [ ] Re-read `.github/copilot-instructions.md` (full file, not memory)
- [ ] Re-read `src/Instructions/remotion-best-practices.md`
- [ ] Re-read CSV phrases for the current chunk's scenes
- [ ] Confirm: Audio in `<Sequence from={150}>`, never `from={0}`
- [ ] Confirm: `PaperBackground` is FIRST SVG child in every scene
- [ ] Confirm: Caption at `y=140` TOP (NOT bottom, NOT y=1780), no background rect
- [ ] Confirm: Caption text fill = `#1A1A1A` (NOT white, NOT missing)
- [ ] Confirm: Every content scene has a thematic SVG illustration (see PART 14B)
- [ ] Confirm: Scene count matches CSV phrase groups exactly
- [ ] Confirm: No gradient, no emoji, no CSS animation anywhere
- [ ] Confirm: No 3D — all animation is 2D SVG + spring() only
- [ ] Confirm: Scene01 shows "DAY N / TOTAL" badge with progress bar
- [ ] After CHUNK J: run `npm run build` and fix all errors before ✅

---

## REMOTION BEST PRACTICES REFERENCE

Full Remotion skills are embedded in: `src/Instructions/remotion-best-practices.md`
This covers: animations, audio, sequencing, fonts, captions, transitions, charts, text effects.

---

## COMMON FAILURE PATTERNS (and fixes)

| Symptom | Root cause | Fix |
|---|---|---|
| Audio not playing | File not in `public/` | Copy to `public/audio/` |
| Audio plays during title scroll | Audio not wrapped in `Sequence from={150}` | Add `<Sequence from={150}>` around Audio |
| Animation not rendering | CSS transition used | Replace with `interpolate()` |
| Black flicker frames | Missing `premountFor` | Add `premountFor={30}` to Sequence |
| Scene frame out of sync | Used composition frame inside scene | Use local `frame` from `useCurrentFrame()` only |
| White/wrong background | Missing PaperBackground | Add `<PaperBackground />` as first SVG child |
| Caption overlap with content | Content in caption zone (y=50–200) | Move content to y≥220; caption zone is TOP strip y=50–200 |
| **White subtitle on white background** | Missing or white `fill` on caption `<text>` | Add explicit `fill={COLORS.text_caption}` (#1A1A1A) to `<text>` element; use Caption component |
| Gradient visible | Used linearGradient | Remove gradient, use solid fill |
| Text clipped at edge | Content beyond x=60 or x=1020 | Respect left/right margins |
| Wrong audio duration | Read wrong CSV field | Use `End Time (s)` of LAST row |
| Scenes overlap in timeline | `from` values miscalculated | Verify: each scene.from ≥ prev.from + prev.duration |
| **Only text/boxes, no illustrations** | Missing thematic SVG | Add topic-relevant SVG illustration to Zone C (see FIX 12 + PART 14B) |
| **Extra scenes not in the script** | Created scenes without CSV phrases | Count phrase groups; enforce exact match (see FIX 13 + PART 14) |
| **TypeScript errors after generation** | Build not run | Run `npm run build` after every day; fix all errors (see FIX 14 + PART 18) |
