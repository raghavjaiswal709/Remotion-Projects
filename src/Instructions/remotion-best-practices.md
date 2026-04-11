# Remotion Best Practices — Embedded Reference

> This file consolidates ALL Remotion skills from `.agents/skills/remotion-best-practices/rules/`
> into a single in-codebase reference that both VS Code Copilot Agent and Claude Code can access.
> Referenced by: `.github/copilot-instructions.md` and `CLAUDE.md`

---

## 1. ANIMATIONS (Core Rule)

**All animations MUST be driven by `useCurrentFrame()`. CSS transitions and CSS animations are FORBIDDEN.**

```tsx
import { useCurrentFrame, interpolate } from "remotion";

export const FadeIn = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ✅ Write in seconds, multiply by fps
  const opacity = interpolate(frame, [0, 2 * fps], [0, 1], {
    extrapolateRight: 'clamp',
  });

  return <div style={{ opacity }}>Hello World!</div>;
};
```

**FORBIDDEN:**
```tsx
// ❌ CSS transition — will NOT render correctly
<div style={{ transition: 'opacity 0.5s ease' }}>...</div>

// ❌ CSS animation — will NOT render correctly
<div className="animate-fade-in">...</div>

// ❌ Framer Motion / GSAP / AOS — will cause flickering
<motion.div animate={{ opacity: 1 }}>...</div>
```

---

## 2. INTERPOLATION & EASING

### Linear interpolation
```typescript
import { interpolate } from 'remotion';

// Always add extrapolateRight: 'clamp' to prevent values going out of range
const opacity = interpolate(frame, [0, 100], [0, 1], {
  extrapolateRight: 'clamp',
  extrapolateLeft: 'clamp',
});
```

### Easing with interpolate
```typescript
import { interpolate, Easing } from 'remotion';

// Ease-in-out quad (smooth)
const value = interpolate(frame, [0, 100], [0, 1], {
  easing: Easing.inOut(Easing.quad),
  extrapolateLeft: 'clamp',
  extrapolateRight: 'clamp',
});

// Custom cubic bezier (recommended for UI snappiness)
const snap = interpolate(frame, [0, 100], [0, 1], {
  easing: Easing.bezier(0.22, 1, 0.36, 1),
  extrapolateRight: 'clamp',
});
```

**Available easing convexities:** `Easing.in`, `Easing.out`, `Easing.inOut`
**Available curves:** `Easing.quad`, `Easing.sin`, `Easing.exp`, `Easing.circle`

### Spring animations (natural motion)
```typescript
import { spring, useCurrentFrame, useVideoConfig } from 'remotion';

const frame = useCurrentFrame();
const { fps } = useVideoConfig();

// Smooth, no bounce (best for most reveals)
const scale = spring({ frame, fps, config: { damping: 200 } });

// Snappy (for UI pop-ins)
const popIn = spring({ frame, fps, config: { damping: 20, stiffness: 200 } });

// Bouncy (playful)
const bounce = spring({ frame, fps, config: { damping: 8 } });

// With delay
const delayed = spring({ frame: frame - 20, fps, config: { damping: 200 } });

// With fixed duration
const timed = spring({ frame, fps, config: { damping: 200 }, durationInFrames: 40 });

// Combine with interpolate for custom ranges
const rotation = interpolate(
  spring({ frame, fps }),
  [0, 1],
  [0, 360]
);

// Animate in + out (subtract two springs)
const { durationInFrames } = useVideoConfig();
const inAnim  = spring({ frame, fps });
const outAnim = spring({ frame, fps, durationInFrames: fps, delay: durationInFrames - fps });
const combined = inAnim - outAnim;
```

---

## 3. SEQUENCING

### Basic Sequence
```tsx
import { Sequence } from "remotion";
const { fps } = useVideoConfig();

// Always include premountFor to prevent loading hiccups
<Sequence from={1 * fps} durationInFrames={2 * fps} premountFor={fps}>
  <Title />
</Sequence>
```

**Key fact:** Inside a `<Sequence from={60}>`, `useCurrentFrame()` returns 0–N, NOT 60+N.
The frame is always LOCAL to the sequence.

### Series (sequential, non-overlapping)
```tsx
import { Series } from 'remotion';

<Series>
  <Series.Sequence durationInFrames={45}>
    <Intro />
  </Series.Sequence>
  <Series.Sequence durationInFrames={60}>
    <MainContent />
  </Series.Sequence>
  <Series.Sequence durationInFrames={30} offset={-10}>
    {/* Starts 10 frames before previous ends (overlap) */}
    <Outro />
  </Series.Sequence>
</Series>
```

### Nested Sequences
```tsx
<Sequence from={0} durationInFrames={120}>
  <Background />
  <Sequence from={15} durationInFrames={90} layout="none">
    <Title />
  </Sequence>
  <Sequence from={45} durationInFrames={60} layout="none">
    <Subtitle />
  </Sequence>
</Sequence>
```

---

## 4. AUDIO

```tsx
import { Audio, Sequence, staticFile } from 'remotion';
// NOTE: Use Audio from 'remotion', NOT from '@remotion/media'

// Basic audio (starts at composition frame 0)
<Audio src={staticFile("audio.mp3")} />

// Delay audio start (wrap in Sequence)
<Sequence from={fps * 5}>
  <Audio src={staticFile("audio.mp3")} />
</Sequence>

// Remote URL
<Audio src="https://example.com/audio.mp3" />

// Trim audio
const { fps } = useVideoConfig();
<Audio
  src={staticFile("audio.mp3")}
  trimBefore={2 * fps}   // skip first 2 seconds
  trimAfter={10 * fps}   // end at 10-second mark
/>

// Volume (static)
<Audio src={staticFile("audio.mp3")} volume={0.5} />

// Volume (dynamic — fade in)
<Audio
  src={staticFile("audio.mp3")}
  volume={(f) => interpolate(f, [0, fps], [0, 1], { extrapolateRight: 'clamp' })}
/>
// Note: f in volume callback starts at 0 when audio begins, not composition frame

// Mute dynamically
const frame = useCurrentFrame();
<Audio muted={frame >= 2 * fps && frame <= 4 * fps} src={staticFile("audio.mp3")} />

// Loop
<Audio src={staticFile("audio.mp3")} loop />

// Playback speed
<Audio src={staticFile("audio.mp3")} playbackRate={2} />   // 2x speed
<Audio src={staticFile("audio.mp3")} playbackRate={0.5} /> // half speed

// IMPORTANT: staticFile() only works for files in public/
// public/audio/track.mp3 → staticFile('audio/track.mp3') ✅
// src/Instructions/audio/ → NOT accessible via staticFile ❌
```

---

## 5. TRANSITIONS (between scenes)

```tsx
import { TransitionSeries, linearTiming, springTiming } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { slide } from '@remotion/transitions/slide';
import { wipe } from '@remotion/transitions/wipe';
import { flip } from '@remotion/transitions/flip';

<TransitionSeries>
  <TransitionSeries.Sequence durationInFrames={60}>
    <SceneA />
  </TransitionSeries.Sequence>

  {/* Transition — overlaps the adjacent scenes */}
  <TransitionSeries.Transition
    presentation={fade()}
    timing={linearTiming({ durationInFrames: 15 })}
  />

  <TransitionSeries.Sequence durationInFrames={60}>
    <SceneB />
  </TransitionSeries.Sequence>
</TransitionSeries>
```

**Duration calculation with transitions:**
```
Total = sum_of_scene_durations - sum_of_transition_durations
Example: 60 + 60 - 15 = 105 frames (two scenes, one 15-frame transition)
```

**Slide directions:** `"from-left"`, `"from-right"`, `"from-top"`, `"from-bottom"`

**Timing options:**
```tsx
linearTiming({ durationInFrames: 20 })           // constant speed
springTiming({ config: { damping: 200 }, durationInFrames: 25 })  // organic
```

---

## 6. FONTS

### Google Fonts (recommended)
```tsx
import { loadFont } from "@remotion/google-fonts/Inter";

// Load at module level (outside component)
const { fontFamily } = loadFont("normal", {
  weights: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

export const MyComponent = () => (
  <div style={{ fontFamily, fontSize: 48, fontWeight: "bold" }}>
    Text with Inter font
  </div>
);
```

### Local fonts
```tsx
import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Load multiple weights
await Promise.all([
  loadFont({ family: "Inter", url: staticFile("Inter-Regular.woff2"), weight: "400" }),
  loadFont({ family: "Inter", url: staticFile("Inter-Bold.woff2"), weight: "700" }),
]);

// Wait for font before measuring text
const { fontFamily, waitUntilDone } = loadFont("normal", { weights: ["400"] });
await waitUntilDone();
```

**In this project:** Inter is used via inline `fontFamily="'Inter', system-ui, sans-serif"` on SVG text elements. This works because the system font is available in the render environment.

---

## 7. IMAGES

```tsx
import { Img, staticFile } from "remotion";

// ✅ ALWAYS use <Img> from remotion (not native <img>)
<Img src={staticFile("logo.png")} />

// ❌ NEVER use:
<img src="/logo.png" />           // native img — doesn't wait for load
// CSS background-image           // won't render correctly
// Next.js <Image>                // wrong renderer

// Sizing
<Img
  src={staticFile("photo.png")}
  style={{ width: 500, height: 300, objectFit: "cover" }}
/>

// Dynamic
const frame = useCurrentFrame();
<Img src={staticFile(`frames/frame${frame}.png`)} />

// Get dimensions
import { getImageDimensions } from "remotion";
const { width, height } = await getImageDimensions(staticFile("photo.png"));
```

---

## 8. CAPTIONS (word-level highlighting)

### Using @remotion/captions
```tsx
import { createTikTokStyleCaptions } from '@remotion/captions';
import type { Caption } from '@remotion/captions';

const SWITCH_EVERY_MS = 1200;

const { pages } = useMemo(() => createTikTokStyleCaptions({
  captions,
  combineTokensWithinMilliseconds: SWITCH_EVERY_MS,
}), [captions]);

// Render pages
{pages.map((page, i) => {
  const nextPage = pages[i + 1] ?? null;
  const startFrame = (page.startMs / 1000) * fps;
  const endFrame = Math.min(
    nextPage ? (nextPage.startMs / 1000) * fps : Infinity,
    startFrame + (SWITCH_EVERY_MS / 1000) * fps
  );
  return (
    <Sequence key={i} from={startFrame} durationInFrames={endFrame - startFrame}>
      <CaptionPage page={page} />
    </Sequence>
  );
})}
```

### Word highlighting component
```tsx
import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { TikTokPage } from '@remotion/captions';

const CaptionPage: React.FC<{ page: TikTokPage }> = ({ page }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentTimeMs = (frame / fps) * 1000;
  const absoluteTimeMs = page.startMs + currentTimeMs;

  return (
    <div style={{ fontSize: 80, fontWeight: 'bold' }}>
      {page.tokens.map(token => {
        const isActive = token.fromMs <= absoluteTimeMs && token.toMs > absoluteTimeMs;
        return (
          <span key={token.fromMs} style={{ color: isActive ? '#2563EB' : '#1A1A1A' }}>
            {token.text}
          </span>
        );
      })}
    </div>
  );
};
```

**In this project:** Captions are implemented as SVG `<text>` elements with `<tspan>` for word coloring (see `components.tsx`). This approach avoids HTML layout issues inside SVG-based scenes.

---

## 9. COMPOSITIONS (Root.tsx patterns)

```tsx
import { Composition, Folder } from 'remotion';
import { MyScene } from './MyScene';

export const RemotionRoot = () => (
  <>
    <Folder name="AI-Series">
      <Composition
        id="AiDay27"
        component={Day27Scene}
        durationInFrames={3033}   // calculated from timing.ts
        fps={30}
        width={1080}
        height={1920}
      />
    </Folder>

    <Folder name="Java-Series">
      {/* Java series compositions */}
    </Folder>

    <Folder name="HiddenWorld">
      {/* HiddenWorld compositions */}
    </Folder>
  </>
);
```

### Dynamic metadata (calculate duration from audio)
```tsx
import { Composition, CalculateMetadataFunction } from 'remotion';

const calcMeta: CalculateMetadataFunction<{ audioSrc: string }> = async ({ props }) => {
  const { durationInSeconds } = await getAudioDurationInSeconds(props.audioSrc);
  const SCROLL = 150, TAKEAWAY = 120 + 30, OUTRO = 362;
  return {
    durationInFrames: Math.ceil(durationInSeconds * 30) + SCROLL + TAKEAWAY + OUTRO,
  };
};

<Composition
  id="DynamicDay"
  component={DayScene}
  durationInFrames={3000}       // placeholder, overridden by calculateMetadata
  fps={30} width={1080} height={1920}
  defaultProps={{ audioSrc: staticFile('audio/ai28.wav') }}
  calculateMetadata={calcMeta}
/>
```

---

## 10. CHARTS & DATA VISUALIZATION

```tsx
// All animations via useCurrentFrame() — no third-party animation libraries
const frame = useCurrentFrame();
const { fps } = useVideoConfig();

// Bar chart with staggered entrance
const STAGGER = 5;
const bars = data.map((item, i) => {
  const height = spring({ frame, fps, delay: i * STAGGER, config: { damping: 200 } });
  return { ...item, animatedHeight: height * item.value };
});

// Pie chart animation (stroke-dashoffset trick)
const circumference = 2 * Math.PI * radius;
const progress = interpolate(frame, [0, 60], [0, 1], { extrapolateRight: 'clamp' });
const segmentLength = (value / total) * circumference;
const offset = interpolate(progress, [0, 1], [segmentLength, 0]);

<circle
  r={radius} cx={cx} cy={cy}
  fill="none" stroke={color} strokeWidth={strokeWidth}
  strokeDasharray={`${segmentLength} ${circumference}`}
  strokeDashoffset={offset}
  transform={`rotate(-90 ${cx} ${cy})`}  // start from 12 o'clock
/>

// Progress bar
const barWidth = interpolate(frame, [0, 45], [0, maxWidth], {
  extrapolateRight: 'clamp',
  easing: Easing.out(Easing.quad),
});
<rect x={60} y={500} width={barWidth} height={40} rx={8} fill={COLORS.sky_blue} />
```

---

## 11. TEXT ANIMATIONS

### Typewriter effect (use string slicing, NOT per-character opacity)
```tsx
const frame = useCurrentFrame();
const { fps } = useVideoConfig();

// Characters revealed per second
const CHARS_PER_SEC = 40;
const charsVisible = Math.floor((frame / fps) * CHARS_PER_SEC);
const visibleText = fullText.slice(0, charsVisible);

<text>{visibleText}</text>
```

### Staggered word reveal
```tsx
const words = sentence.split(' ');
const STAGGER_FRAMES = 6;

{words.map((word, i) => {
  const wordOpacity = interpolate(
    frame,
    [i * STAGGER_FRAMES, i * STAGGER_FRAMES + 12],
    [0, 1],
    { extrapolateRight: 'clamp', easing: Easing.out(Easing.quad) }
  );
  return (
    <tspan key={i} opacity={wordOpacity} dx={i === 0 ? 0 : '0.25em'}>
      {word}
    </tspan>
  );
})}
```

### Slide-up entrance
```tsx
const slideY = interpolate(frame, [0, 22], [32, 0], {
  extrapolateRight: 'clamp',
  easing: Easing.bezier(0.22, 1, 0.36, 1),
});
const fadeIn = interpolate(frame, [0, 16], [0, 1], { extrapolateRight: 'clamp' });

<text
  transform={`translate(0, ${slideY})`}
  opacity={fadeIn}
>
  {text}
</text>
```

---

## 12. TEXT MEASUREMENT (prevent overflow)

```tsx
import { measureText, fitText } from "@remotion/layout-utils";

// Measure text width before rendering
const { width } = measureText({
  text: "Hello World",
  fontFamily: "Inter",
  fontSize: 48,
  fontWeight: "bold",
});

// Fit text to container width (returns optimal fontSize)
const { fontSize } = fitText({
  text: longTitle,
  withinWidth: 960,    // usable width
  fontFamily: "Inter",
  fontWeight: "bold",
});
const cappedSize = Math.min(fontSize, 96);   // cap at 96px

// Check text box overflow
import { fillTextBox } from "@remotion/layout-utils";
const box = fillTextBox({ maxBoxWidth: 900, maxLines: 3 });
for (const word of words) {
  const { exceedsBox } = box.add({ text: word + ' ', fontFamily: 'Inter', fontSize: 40 });
  if (exceedsBox) { /* wrap to new line */ break; }
}
```

---

## 13. PARAMETERS (Zod schema for editable props)

```tsx
import { z } from 'zod';
import { zColor } from '@remotion/zod-types';
import { Composition } from 'remotion';

// Define schema alongside component
export const DaySchema = z.object({
  dayNumber: z.number().min(1).max(120),
  topic: z.string(),
  accentColor: zColor(),
});

// Use in Root.tsx
<Composition
  id="ConfigurableDay"
  component={DayScene}
  durationInFrames={3000}
  fps={30} width={1080} height={1920}
  schema={DaySchema}
  defaultProps={{ dayNumber: 27, topic: "Tools", accentColor: '#2563EB' }}
/>
```

---

## 14. MEASURING DOM NODES

```tsx
import { measureNode } from "@remotion/layout-utils";

// Measure a DOM node's dimensions
const ref = useRef<SVGTextElement>(null);

useEffect(() => {
  if (ref.current) {
    const { width, height } = measureNode(ref.current);
    // Use dimensions for layout calculations
  }
}, []);

<text ref={ref}>{dynamicText}</text>
```

---

## 15. EXTRACT FRAMES (from video)

```tsx
import { extractFrames } from "remotion";

const frames = await extractFrames({
  src: staticFile("video.mp4"),
  timestamps: [0, 1, 2, 3],  // seconds
});
// frames is an array of data URLs
```

---

## 16. COMMON REMOTION PATTERNS FOR THIS PROJECT

### Standard scene file skeleton
```tsx
import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { COLORS, SCENE_TIMING, CAPTIONS, ease } from '../helpers/timing';
import { PaperBackground, GlobalDefs, Caption, SectionLabel } from '../helpers/components';

export const Scene{N}_{Name}: React.FC = () => {
  const frame = useCurrentFrame();  // LOCAL frame (0 = start of this sequence)

  const enter = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: 'clamp',
    easing: ease,  // Easing.bezier(0.22, 1, 0.36, 1)
  });

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s{N}.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_paper }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <PaperBackground />   {/* ALWAYS FIRST */}
        <GlobalDefs />        {/* for arrowhead markers */}

        {/* Zone A: topic anchor — y=80–180 */}
        <SectionLabel text="MODULE · CONCEPT" y={120} opacity={enter * 0.55} />

        {/* Zone B: headline — y=190–440 */}
        {/* Zone C: main visual — y=460–1700 */}

        {/* Caption — FIXED at y=1780, NO BACKGROUND */}
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

### Standard Scene.tsx audio wiring
```tsx
// Audio delayed to frame 150 (after silent scroll animation)
<Sequence from={150} durationInFrames={AUDIO_FRAMES} premountFor={30}>
  <Audio src={staticFile('audio/ai{N}.wav')} startFrom={0} />
</Sequence>

// All content sequences with premountFor
<Sequence from={SCENE_TIMING.s02.from} durationInFrames={SCENE_TIMING.s02.duration} premountFor={30}>
  <Scene02_Name />
</Sequence>
```
