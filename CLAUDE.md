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

## CAPTION FIXED SPECIFICATION

```
x:             540 (center anchor)
y:             1780 (first line), 1828 (second line if wrapping)
textAnchor:    "middle"
fontSize:      38
fontWeight:    700
fontFamily:    'Inter', system-ui, sans-serif
Background:    NONE — zero rect, zero box, zero outline
Key words:     fill={COLORS.text_highlight} (#2563EB)
Normal words:  fill={COLORS.text_caption} (#1A1A1A)
Max chars/ln:  52
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
| Caption at y=1780, no background | ABSOLUTE |
| No CSS transitions/animations | ABSOLUTE |
| No overlapping elements | ABSOLUTE |
| SVG icons only (no emoji icons) | ABSOLUTE |
| Audio in Sequence from={150} | ABSOLUTE |
| premountFor={30} on all Sequences | ABSOLUTE |
| Content above y=1740 only | ABSOLUTE |
| Colors only from COLORS object | ABSOLUTE |

---

## LAYOUT SAFE ZONES

```
y=0    ← canvas top
y=80   ← first element starts here (top padding)
y=80–1740  ← content zone (1660px usable height)
y=1760 ← caption zone begins
y=1780 ← caption baseline (first line)
y=1860 ← bottom boundary
y=1920 ← canvas bottom

x=0    ← canvas left
x=60   ← content left margin
x=1020 ← content right margin
x=1080 ← canvas right
Usable width: 960px
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
- [ ] Confirm: Caption at `y=1780`, no background rect
- [ ] Confirm: No gradient, no emoji, no CSS animation anywhere

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
| Caption overlap with content | Content below y=1740 | Move content up; caption zone is y=1760–1860 |
| Gradient visible | Used linearGradient | Remove gradient, use solid fill |
| Text clipped at edge | Content beyond x=60 or x=1020 | Respect left/right margins |
| Wrong audio duration | Read wrong CSV field | Use `End Time (s)` of LAST row |
| Scenes overlap in timeline | `from` values miscalculated | Verify: each scene.from ≥ prev.from + prev.duration |
