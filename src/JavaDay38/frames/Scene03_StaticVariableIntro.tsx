/**
 * Scene 03 — Static Variable Intro
 * "Today, we learn the static variable."
 * CSV: 14.720s → 17.960s
 * Duration: 97 frames (3.23s)
 *
 * Theme: Dark (#0D0D0D) + grid + Java accent (#D87656)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–25):  Scene reveal — label and headline spring in
 *   Phase 2 (frames 15–70): Topic title card builds with decorative elements
 *   Phase 3 (frames 60–end): Pulse and glow micro-animations
 */
import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
  Easing,
} from 'remotion';
import { COLORS, SCENE_TIMING, CAPTIONS, FPS, ease } from '../helpers/timing';
import { DarkBackground, GlobalDefs, Caption, BentoCard, SectionLabel } from '../helpers/components';

const FONT = "'Galaxie Copernicus ExtraBold', Georgia, serif";

const SPRING_CONFIG = { damping: 18, stiffness: 180, mass: 0.8 } as const;
const SPRING_SOFT   = { damping: 22, stiffness: 120, mass: 1.0 } as const;
const SPRING_SNAP   = { damping: 12, stiffness: 260, mass: 0.6 } as const;

function useSpringEntrance(frame: number, delayFrames: number, fps = 30) {
  const f = Math.max(0, frame - delayFrames);
  const progress = spring({ frame: f, fps, config: SPRING_CONFIG });
  const opacity  = interpolate(f, [0, 12], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const translateY = interpolate(progress, [0, 1], [32, 0]);
  return { progress, opacity, translateY };
}

function usePathDraw(frame: number, startFrame: number, totalLength: number, durationFrames = 30) {
  const progress = interpolate(frame, [startFrame, startFrame + durationFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  return totalLength * (1 - progress);
}

export const Scene03_StaticVariableIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = FPS;

  // ── Phase 1: Scene reveal ─────────────────────────────────────────────────
  const labelEntrance  = useSpringEntrance(frame, 0);
  const headlineWord1  = useSpringEntrance(frame, 4);
  const headlineWord2  = useSpringEntrance(frame, 10);

  // ── Phase 2: Title card ───────────────────────────────────────────────────
  const mainCard       = useSpringEntrance(frame, 16);
  const keyword        = useSpringEntrance(frame, 24);
  const decorLine1     = usePathDraw(frame, 20, 960, 25);
  const decorLine2     = usePathDraw(frame, 28, 960, 25);
  const subCard        = useSpringEntrance(frame, 34);
  const accentBar      = useSpringEntrance(frame, 40);

  // Border draw
  const borderPerimeter = 2 * (960 + 600);
  const borderDash      = usePathDraw(frame, 18, borderPerimeter, 40);

  // ── Phase 3: Micro-animations ─────────────────────────────────────────────
  const pulse     = 1 + Math.sin(frame * 0.08) * 0.015;
  const breathe   = Math.sin(frame * 0.06) * 4;
  const shimmer   = interpolate(Math.sin(frame * 0.05), [-1, 1], [0.8, 1]);
  const glow      = interpolate(Math.sin(frame * 0.1), [-1, 1], [0.08, 0.15]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s03.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ─────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEntrance.translateY})`} opacity={labelEntrance.opacity}>
          <SectionLabel text="MODULE 2 · NETWORK EXPANSION" y={160} opacity={0.8} />
        </g>

        {/* ── ZONE B — Per-word spring headline ──────────────────────────── */}
        <g transform={`translate(0, ${headlineWord1.translateY})`} opacity={headlineWord1.opacity}>
          <text x={60} y={320}
            fontFamily={FONT} fontSize={96} fontWeight={800} fill={COLORS.white}>
            Today&apos;s Topic
          </text>
        </g>

        {/* ── ZONE C — Large title card ──────────────────────────────────── */}
        {/* Animated border draw card */}
        <g opacity={mainCard.opacity} transform={`translate(0, ${mainCard.translateY})`}>
          {/* Outer glow rect */}
          <rect x={60} y={480} width={960} height={600} rx={24}
            fill={COLORS.accent} fillOpacity={glow} />

          <BentoCard x={60} y={480} w={960} h={600} accent />

          {/* Animated border overlay */}
          <rect x={60} y={480} width={960} height={600} rx={24}
            fill="none"
            stroke={COLORS.accent} strokeWidth={2.5}
            strokeDasharray={borderPerimeter}
            strokeDashoffset={borderDash} />

          {/* Decorative horizontal lines */}
          <line x1={100} y1={540} x2={1000} y2={540}
            stroke={COLORS.accent} strokeWidth={1} opacity={0.15}
            strokeDasharray={960}
            strokeDashoffset={decorLine1} />
          <line x1={100} y1={1040} x2={1000} y2={1040}
            stroke={COLORS.accent} strokeWidth={1} opacity={0.15}
            strokeDasharray={960}
            strokeDashoffset={decorLine2} />
        </g>

        {/* Keyword — "STATIC" large text */}
        <g opacity={keyword.opacity} transform={`translate(0, ${keyword.translateY})`}>
          {/* Ghost text behind */}
          <text x={540} y={740} textAnchor="middle"
            fontFamily={FONT} fontSize={180} fontWeight={800}
            fill={COLORS.accent} opacity={0.06 * shimmer}>
            STATIC
          </text>
          {/* Main keyword */}
          <text x={540} y={740} textAnchor="middle"
            fontFamily={FONT} fontSize={140} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic"
            transform={`scale(${pulse})`}
            style={{ transformOrigin: '540px 700px' }}>
            static
          </text>
        </g>

        {/* "variable" subtitle */}
        <g opacity={headlineWord2.opacity} transform={`translate(0, ${headlineWord2.translateY})`}>
          <text x={540} y={880} textAnchor="middle"
            fontFamily={FONT} fontSize={80} fontWeight={800}
            fill={COLORS.white}>
            Variable
          </text>
        </g>

        {/* Accent line below keyword */}
        <g opacity={accentBar.opacity}>
          <rect x={340} y={920} width={400} height={4} rx={2}
            fill={COLORS.accent} opacity={shimmer} />
        </g>

        {/* Sub-topic card */}
        <g opacity={subCard.opacity} transform={`translate(0, ${subCard.translateY})`}>
          <text x={540} y={1020} textAnchor="middle"
            fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.text_muted}>
            A variable shared across all objects
          </text>
        </g>

        {/* ── Decorative elements ─────────────────────────────────────────── */}
        {/* Java keyword badge */}
        <g opacity={subCard.opacity} transform={`translate(0, ${subCard.translateY})`}>
          <BentoCard x={60} y={1140} w={460} h={200} />
          <rect x={60} y={1140} width={6} height={200} rx={3}
            fill={COLORS.accent} />
          <text x={100} y={1200}
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.accent}>
            JAVA KEYWORD
          </text>
          <text x={100} y={1260}
            fontFamily="'Fira Code', 'Courier New', monospace"
            fontSize={36} fontWeight={500} fill={COLORS.white}>
            static int count;
          </text>
          <text x={100} y={1310}
            fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            Belongs to the class
          </text>
        </g>

        {/* Visual metaphor card */}
        <g opacity={subCard.opacity} transform={`translate(0, ${subCard.translateY})`}>
          <BentoCard x={560} y={1140} w={460} h={200} />
          <text x={600} y={1200}
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.accent}>
            RAILWAY METAPHOR
          </text>
          {/* Small train icon */}
          <rect x={600} y={1230} width={120} height={50} rx={8}
            fill={COLORS.accent} fillOpacity={0.12}
            stroke={COLORS.accent} strokeWidth={1.5} />
          <circle cx={625} cy={1300} r={14}
            fill="none" stroke={COLORS.accent} strokeWidth={2} />
          <circle cx={695} cy={1300} r={14}
            fill="none" stroke={COLORS.accent} strokeWidth={2} />
          <text x={750} y={1270}
            fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            Shared
          </text>
          <text x={750} y={1310}
            fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            counter
          </text>
        </g>

        {/* ── Bottom decorative dots ──────────────────────────────────────── */}
        {[0, 1, 2, 3, 4].map((i) => (
          <circle key={i}
            cx={440 + i * 50} cy={1500 + breathe * (i % 2 === 0 ? 1 : -1)}
            r={6}
            fill={COLORS.accent}
            fillOpacity={0.15 + (i === 2 ? 0.3 : 0)}
          />
        ))}

        {/* ── Floating connector lines ────────────────────────────────────── */}
        <g opacity={0.1 * shimmer}>
          <line x1={60} y1={1580} x2={1020} y2={1580}
            stroke={COLORS.accent} strokeWidth={1} />
        </g>

        {/* Bottom accent card */}
        <g opacity={accentBar.opacity} transform={`translate(0, ${accentBar.translateY})`}>
          <BentoCard x={60} y={1600} w={960} h={120} />
          <text x={540} y={1675} textAnchor="middle"
            fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.text_muted}>
            One value. Every train. The whole network.
          </text>
        </g>

        {/* ── CAPTION ────────────────────────────────────────────────────── */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s03.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
