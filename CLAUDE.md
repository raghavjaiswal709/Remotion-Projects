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
| Background | `#1D1D1C` dark (Claude-style) + white grid — EVERY scene |
| Font | **`'Galaxie Copernicus ExtraBold', Georgia, serif`** — EVERY text element, EVERY scene |
| Audio | Must be in `public/` for `staticFile()` |
| Package manager | npm |

### SERIES AUTO-DETECTION — accent color is set automatically by series name

| Series | Accent Color | Scroll Title |
|---|---|---|
| Java / National Railway | `#D87656` | `"NATIONAL RAILWAY · JAVA"` |
| Agentic AI | `#76ABAE` | `"AGENTIC AI · FIRST PRINCIPLES"` |
| System Design | `#948979` | `"SYSTEM DESIGN · FOUNDATIONS"` |
| DSA | `#93B1A6` | `"DATA STRUCTURES & ALGORITHMS"` |
| Mystery / HiddenWorld | `#F7374F` | `"MYSTERY RESOLVED · DAILY FACTS"` |

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

### FIX 8 — Caption uses SVG text at BOTTOM, Galaxie Copernicus ExtraBold, white

```tsx
// ✅ CORRECT — caption at BOTTOM (y=1860), white, Galaxie Copernicus ExtraBold
<text x={540} y={1860} textAnchor="middle"
  fontFamily="'Galaxie Copernicus ExtraBold', Georgia, serif"
  fontSize={44} fontWeight={800}
  fill={COLORS.text_caption}   // #FFFFFF — white on dark bg
  opacity={captionOpacity}>
  Caption text here
</text>

// ❌ WRONG — old top-positioned caption
<text x={540} y={140} ...>Caption</text>

// ❌ WRONG — HTML div caption
<div style={{ position: 'absolute', bottom: 140, ... }}>Caption</div>

// ❌ WRONG — Inter font (always use Galaxie Copernicus ExtraBold)
<text fontFamily="'Inter', system-ui, sans-serif" ...>
```

### FIX 9 — No gradient anywhere

```tsx
// ✅ CORRECT — solid flat fill using COLORS object
<rect fill={COLORS.accent} />
<rect fill={COLORS.bg_primary} />
<rect fill={COLORS.bg_secondary} />

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

### FIX 11 — Caption text must always be WHITE on dark background

The background is `#1D1D1C` (dark). Caption text **must be white** (`#FFFFFF`).
Any dark caption text becomes **invisible**. This is the most common subtitle visibility failure.

```tsx
// ✅ CORRECT — white text at BOTTOM (y=1860), Galaxie Copernicus ExtraBold
<text
  x={540} y={1860} textAnchor="middle"
  fontFamily="'Galaxie Copernicus ExtraBold', Georgia, serif"
  fontSize={44} fontWeight={800}
  fill={COLORS.text_caption}   // ← #FFFFFF — white on dark background
>
  <tspan fill={COLORS.text_caption}>Normal word </tspan>
  <tspan fill={COLORS.text_highlight}>highlighted</tspan>  // ← series accent color
</text>

// ❌ WRONG — dark text (invisible on dark background)
<text fill="#1A1A1A">...</text>
<text fill="black">...</text>
<text fill={COLORS.deep_black}>...</text>   // dark on dark = invisible

// ❌ WRONG — old top position
<text x={540} y={140} ...>...</text>

// ❌ WRONG — Inter font
<text fontFamily="'Inter', system-ui, sans-serif" ...>
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
// ✅ CORRECT — scene about a train station draws the station (inside bento card)
const FONT = "'Galaxie Copernicus ExtraBold', Georgia, serif";
<g transform="translate(60, 600)" opacity={card1.opacity}>
  {/* Bento card wrapping illustration */}
  <rect x={0} y={0} width={960} height={400} rx={20} fill={COLORS.bg_secondary}
    stroke={COLORS.accent} strokeWidth={2} />
  {/* Station building */}
  <rect x={40} y={40} width={880} height={200} rx={8} fill="rgba(255,255,255,0.05)"
    stroke={COLORS.accent} strokeWidth={2} />
  {/* Roof triangle */}
  <polygon points="480,40 40,200 920,200" fill={COLORS.accent} fillOpacity={0.12} />
  {/* Rails */}
  <line x1={100} y1={265} x2={860} y2={265} stroke={COLORS.text_muted} strokeWidth={3} />
  <line x1={100} y1={285} x2={860} y2={285} stroke={COLORS.text_muted} strokeWidth={3} />
  {/* Label */}
  <text x={480} y={150} textAnchor="middle" fontSize={48} fontWeight={800}
    fill={COLORS.white} fontFamily={FONT}>CENTRAL STATION</text>
</g>

// ❌ WRONG — old paper background + Inter font
<rect x={0} y={0} width={960} height={200} fill={COLORS.bg_paper} ... />
<text fontFamily="'Inter', sans-serif" fill={COLORS.deep_black}>CENTRAL STATION</text>
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
│   ├── timing.ts                 (SCENE_TIMING, COLORS with series accent, CAPTIONS, helpers)
│   └── components.tsx            (DarkBackground+grid, Caption@bottom, BentoCard, GlobalDefs, etc.)
└── frames/
    ├── Scene01_ScrollTimeline.tsx (150 frames, SILENT, dark theme, series accent)
    ├── Scene02_{Name}.tsx         (first audio scene, frame 150+, bento design)
    ├── Scene03_{Name}.tsx
    ├── ...
    ├── Scene{N-1}_KeyTakeaway.tsx (120 frames)
    └── Scene{N}_Outro.tsx         (362 frames, next day preview)

public/audio/
    ai{N}.wav       (AI series — must be here for staticFile to work)
    java{N}.wav     (Java series)
    day{N}_*.wav    (HiddenWorld/Mystery)
```

---

## COLOR PALETTE (use ONLY these — dark Claude-style theme)

```typescript
// ── Series accent map — look up by series name ─────────────────────────────────
// Java / National Railway : '#D87656'  (warm coral-orange)
// Agentic AI              : '#76ABAE'  (teal-blue)
// System Design           : '#948979'  (warm stone)
// DSA                     : '#93B1A6'  (sage green)
// Mystery / HiddenWorld   : '#F7374F'  (vibrant red)
// Replace ACCENT_COLOR below with the correct value for the series being generated.

const SERIES_ACCENT = '#76ABAE'; // ← REPLACE with correct series accent
const ACCENT_DIM    = 'rgba(118,171,174,0.12)'; // ← update alpha channel value if accent changes

export const COLORS = {
  // Backgrounds
  bg_primary:     '#1D1D1C',              // THE ONLY background — EVERY scene, zero exceptions
  bg_secondary:   '#2C2C2B',              // bento card / tile background
  bg_card:        '#2C2C2B',              // alias for bg_secondary

  // Text (light on dark)
  white:          '#FFFFFF',              // primary text on dark background
  text_primary:   '#FFFFFF',              // body/heading text
  text_muted:     'rgba(255,255,255,0.55)', // secondary/muted labels
  text_caption:   '#FFFFFF',              // subtitle text at BOTTOM
  text_highlight: SERIES_ACCENT,          // key word highlight in captions

  // Grid lines
  grid_line:      'rgba(255,255,255,0.5)', // grid on dark background (50% white)

  // Series accent
  accent:         SERIES_ACCENT,          // primary accent color (series-specific)
  accent_dim:     ACCENT_DIM,             // accent at ~12% opacity for card fills
  accent_mid:     'rgba(118,171,174,0.30)', // accent at 30% for borders/dividers

  // Semantic aliases (for backwards compat with old code)
  deep_black:     '#1D1D1C',              // maps to bg_primary
  cool_silver:    'rgba(255,255,255,0.55)', // maps to text_muted
  vibrant_red:    '#F7374F',              // error/danger (also Mystery series accent)
} as const;
```

**CRITICAL: When generating for a specific series, update `SERIES_ACCENT` and `ACCENT_DIM`
in `timing.ts` to match the series accent from the table above.**

---

## CAPTION FIXED SPECIFICATION (BOTTOM POSITION)

```
x:             540 (center anchor)
y:             1860 (BOTTOM — single line)  |  1836 / 1884 (BOTTOM — two lines, 48px gap)
textAnchor:    "middle"
fontSize:      44
fontWeight:    800
fontFamily:    'Galaxie Copernicus ExtraBold', Georgia, serif
Background:    NONE — zero rect, zero box, zero outline
Key words:     fill={COLORS.text_highlight} (series accent color)
Normal words:  fill={COLORS.text_caption} (#FFFFFF — white)
Max chars/ln:  48
Position:      BOTTOM of canvas — NOT top

Caption zone:  y=1760–1920 (BOTTOM STRIP — reserved, no content elements here)
Content zone:  y=60–1740 (above caption strip, below top edge)
```

**The caption is NOW AT THE BOTTOM. Never place it at y=140 again.**

---

## NON-NEGOTIABLE STYLE RULES

| Rule | Enforcement |
|---|---|
| **Dark background `#1D1D1C` + white grid on EVERY scene** | ABSOLUTE |
| **Font: `'Galaxie Copernicus ExtraBold', Georgia, serif` on EVERY text element** | ABSOLUTE |
| **Caption at BOTTOM (y=1860), white `#FFFFFF`, Galaxie Copernicus ExtraBold** | ABSOLUTE |
| **Caption text: always `#FFFFFF` (white), never dark or transparent** | ABSOLUTE |
| **Content zone y=60–1740 only (caption strip y=1760–1920 reserved at BOTTOM)** | ABSOLUTE |
| **Accent color auto-set from series: Java=#D87656 / AI=#76ABAE / SysDesign=#948979 / DSA=#93B1A6 / Mystery=#F7374F** | ABSOLUTE |
| **Bento card background: `#2C2C2B` (bg_secondary) for all card tiles** | ABSOLUTE |
| No gradients anywhere | ABSOLUTE |
| No glow / blur filters | ABSOLUTE |
| No emojis | ABSOLUTE |
| No pure black (#000) or old paper white (#F5F0E8) backgrounds | ABSOLUTE |
| All text ≥ 32px | ABSOLUTE |
| **No 3D animations — strictly 2D SVG + spring() only** | ABSOLUTE |
| **No @react-three/fiber, @remotion/three, or three.js** | ABSOLUTE |
| No CSS transitions/animations | ABSOLUTE |
| No overlapping elements | ABSOLUTE |
| SVG icons only (no emoji icons) | ABSOLUTE |
| **Every content scene has ≥ 1 thematic SVG illustration** | ABSOLUTE |
| **Illustrations must match series topic (train/AI/etc.)** | ABSOLUTE |
| Audio in Sequence from={150} | ABSOLUTE |
| premountFor={30} on all Sequences | ABSOLUTE |
| Colors only from COLORS object | ABSOLUTE |
| **Scene count = CSV phrase groups exactly (no extras)** | ABSOLUTE |
| **Run `npm run build` after every day — 0 errors required** | ABSOLUTE |
| **No pencil-art or paper-texture style — dark Claude-style only** | ABSOLUTE |

---

## LAYOUT SAFE ZONES

```
y=0    ← canvas top
y=60   ← content zone begins
y=60–1740 ← full content zone (1680px usable height)
y=1740 ← bottom content boundary (stop all content here)
y=1760 ← caption zone begins (BOTTOM STRIP)
y=1836 ← caption first line (two-line mode)
y=1860 ← caption baseline — single line
y=1884 ← caption second line (two-line mode)
y=1920 ← canvas bottom

x=0    ← canvas left
x=60   ← content left margin
x=1020 ← content right margin
x=1080 ← canvas right
Usable width: 960px

Zone A:  y=60–200   (section label / series badge)
Zone B:  y=220–500  (main headline — H1, large text)
Zone C:  y=520–1740 (visual content — diagrams, bento cards, illustrations)

Scene01 day counter:
  "DAY N / TOTAL" badge at x=60, y=100 (top-left)
  Progress bar:   x=60, y=120, animated left→right
  Totals:         AI=120, Java=105, HiddenWorld/Mystery=100, SysDesign=120, DSA=120
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
- [ ] Confirm: `DarkBackground` is FIRST SVG child in every scene (NOT PaperBackground)
- [ ] Confirm: Background is `#1D1D1C` (NOT `#F5F0E8` paper — that is OLD/FORBIDDEN)
- [ ] Confirm: White grid lines rendered inside DarkBackground component
- [ ] Confirm: Caption at `y=1860` BOTTOM (NOT top, NOT y=140)
- [ ] Confirm: Caption font = `'Galaxie Copernicus ExtraBold', Georgia, serif`
- [ ] Confirm: Caption text fill = `#FFFFFF` (white — NOT dark, NOT missing)
- [ ] Confirm: ALL text uses `'Galaxie Copernicus ExtraBold', Georgia, serif`
- [ ] Confirm: Accent color = correct series color from SERIES AUTO-DETECTION table
- [ ] Confirm: Card backgrounds use `COLORS.bg_secondary` (#2C2C2B) — bento style
- [ ] Confirm: Every content scene has a thematic SVG illustration (see PART 14B)
- [ ] Confirm: Scene count matches CSV phrase groups exactly
- [ ] Confirm: No gradient, no emoji, no CSS animation anywhere
- [ ] Confirm: No 3D — all animation is 2D SVG + spring() only
- [ ] Confirm: Scene01 shows "DAY N / TOTAL" badge with progress bar
- [ ] Confirm: No pencil style / no paper texture style
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
| **Light/white background instead of dark** | Missing DarkBackground or wrong bg color | Add `<DarkBackground />` as first SVG child; AbsoluteFill `background: COLORS.bg_primary` |
| **Old paper background (#F5F0E8)** | Copied from old code | Replace with `#1D1D1C` everywhere |
| Caption not visible | Dark text on dark background | Use `fill={COLORS.text_caption}` (#FFFFFF) — white on dark |
| Caption at wrong position (top) | Old y=140 positioning | Move to y=1860 (BOTTOM); caption zone y=1760–1920 |
| Content overlapping caption (bottom) | Content extends past y=1740 | Limit all content to y=60–1740 |
| Wrong font family | Using Inter or other font | Use `'Galaxie Copernicus ExtraBold', Georgia, serif` everywhere |
| Gradient visible | Used linearGradient | Remove gradient, use solid fill |
| Text clipped at edge | Content beyond x=60 or x=1020 | Respect left/right margins |
| Wrong accent color for series | Used wrong series color | Look up series from SERIES AUTO-DETECTION table and set accent |
| Wrong audio duration | Read wrong CSV field | Use `End Time (s)` of LAST row |
| Scenes overlap in timeline | `from` values miscalculated | Verify: each scene.from ≥ prev.from + prev.duration |
| **Only text/boxes, no illustrations** | Missing thematic SVG | Add topic-relevant SVG illustration to Zone C (see FIX 12 + PART 14B) |
| **Extra scenes not in the script** | Created scenes without CSV phrases | Count phrase groups; enforce exact match (see FIX 13 + PART 14) |
| **TypeScript errors after generation** | Build not run | Run `npm run build` after every day; fix all errors (see FIX 14 + PART 18) |
