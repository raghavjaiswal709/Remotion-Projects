/**
 * Scene 02 — Overloading Recap
 * "Last day we learned how method overloading lets one method name serve multiple parameter combinations,"
 * CSV: 6.420s → 12.660s
 * Duration: 204 frames (6.8s)
 *
 * Animation phases:
 *   Phase 1 (frames 0–30): Label + headline spring in
 *   Phase 2 (frames 20–90): Three overloaded method cards stagger in
 *   Phase 3 (frames 80–end): Connector draws, pulse on active card
 */
import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
  Easing,
} from 'remotion';
import { COLORS, SCENE_TIMING, CAPTIONS, ease } from '../helpers/timing';
import { DarkBackground, GlobalDefs, Caption, BentoCard, SectionLabel } from '../helpers/components';

const FONT = "'Galaxie Copernicus ExtraBold', Georgia, serif";

const SPRING_CONFIG = { damping: 18, stiffness: 180, mass: 0.8 } as const;
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

export const Scene02_OverloadingRecap: React.FC = () => {
  const frame = useCurrentFrame();
  const fps   = 30;

  // ── Phase 1: Scene reveal ──────────────────────────────────────────────────
  const labelEntrance   = useSpringEntrance(frame, 0);
  const headlineA       = useSpringEntrance(frame, 6);
  const headlineB       = useSpringEntrance(frame, 12);

  // ── Phase 2: Method cards stagger ──────────────────────────────────────────
  const card1 = useSpringEntrance(frame, 24);
  const card2 = useSpringEntrance(frame, 36);
  const card3 = useSpringEntrance(frame, 48);
  const bracketCard = useSpringEntrance(frame, 60);

  // ── Path draws ─────────────────────────────────────────────────────────────
  const connector1 = usePathDraw(frame, 40, 180, 25);
  const connector2 = usePathDraw(frame, 50, 180, 25);
  const arrowDraw  = usePathDraw(frame, 55, 300, 30);

  // ── Phase 3: Micro-animations ──────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse   = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);
  const glowPulse = interpolate(Math.sin(frame * 0.07), [-1, 1], [0.08, 0.18]);

  // ── Border draw on cards ───────────────────────────────────────────────────
  const cardPerimeter = 2 * (960 + 160);
  const borderDash1 = interpolate(frame, [24, 54], [cardPerimeter, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const borderDash2 = interpolate(frame, [36, 66], [cardPerimeter, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const borderDash3 = interpolate(frame, [48, 78], [cardPerimeter, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s02.from);

  const methods = [
    { name: 'calculateFare(int km)', params: '1 param', y: 560 },
    { name: 'calculateFare(int km, String cls)', params: '2 params', y: 740 },
    { name: 'calculateFare(int km, String cls, boolean ac)', params: '3 params', y: 920 },
  ];
  const entrances = [card1, card2, card3];
  const borders = [borderDash1, borderDash2, borderDash3];

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ───────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEntrance.translateY})`} opacity={labelEntrance.opacity}>
          <SectionLabel text="TICKETING ENGINE · RECAP" y={160} opacity={0.8} />
        </g>

        {/* ── ZONE B — Headline ────────────────────────────────────────── */}
        <g transform={`translate(0, ${headlineA.translateY})`} opacity={headlineA.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={88} fontWeight={800} fill={COLORS.white}>
            Method
          </text>
        </g>
        <g transform={`translate(0, ${headlineB.translateY})`} opacity={headlineB.opacity}>
          <text x={60} y={400} fontFamily={FONT} fontSize={88} fontWeight={800} fill={COLORS.accent} fontStyle="italic">
            Overloading
          </text>
        </g>

        {/* ── ZONE C — Three method signature cards ────────────────────── */}
        {methods.map((m, i) => (
          <g key={i} opacity={entrances[i].opacity} transform={`translate(0, ${entrances[i].translateY})`}>
            {/* Background fill */}
            <BentoCard x={60} y={m.y} w={960} h={140} />
            {/* Animated border draw */}
            <rect x={60} y={m.y} width={960} height={140} rx={20}
              fill="none" stroke={COLORS.accent} strokeWidth={2}
              strokeDasharray={cardPerimeter} strokeDashoffset={borders[i]} />
            {/* Accent left bar */}
            <rect x={60} y={m.y} width={6} height={140} rx={3} fill={COLORS.accent} />
            {/* Method name — monospace */}
            <text x={100} y={m.y + 62}
              fontFamily="'Fira Code', 'Courier New', monospace"
              fontSize={34} fontWeight={500}
              fill={COLORS.white}>
              {m.name}
            </text>
            {/* Param count badge */}
            <rect x={820} y={m.y + 80} width={160} height={40} rx={20}
              fill={COLORS.accent} fillOpacity={0.15} />
            <text x={900} y={m.y + 108} textAnchor="middle"
              fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.accent}>
              {m.params}
            </text>
          </g>
        ))}

        {/* ── Connectors between cards ─────────────────────────────────── */}
        <path d="M 540,700 L 540,740"
          fill="none" stroke={COLORS.accent} strokeWidth={2.5}
          strokeDasharray={180} strokeDashoffset={connector1}
          strokeLinecap="round" />
        <path d="M 540,880 L 540,920"
          fill="none" stroke={COLORS.accent} strokeWidth={2.5}
          strokeDasharray={180} strokeDashoffset={connector2}
          strokeLinecap="round" />

        {/* ── Bracket card: "Same name, different params" ──────────────── */}
        <g opacity={bracketCard.opacity} transform={`translate(0, ${bracketCard.translateY})`}>
          <BentoCard x={60} y={1100} w={960} h={200} accent />
          {/* Curly bracket SVG */}
          <path d="M 120,1130 Q 100,1200 120,1270"
            fill="none" stroke={COLORS.accent} strokeWidth={3}
            strokeDasharray={300} strokeDashoffset={arrowDraw}
            strokeLinecap="round" />
          <text x={180} y={1190}
            fontFamily={FONT} fontSize={44} fontWeight={800} fill={COLORS.white}>
            Same name
          </text>
          <text x={180} y={1250}
            fontFamily={FONT} fontSize={44} fontWeight={800} fill={COLORS.accent} fontStyle="italic">
            different parameters
          </text>
        </g>

        {/* ── Compile-time badge ───────────────────────────────────────── */}
        <g opacity={bracketCard.opacity} transform={`translate(0, ${bracketCard.translateY})`}>
          <BentoCard x={60} y={1340} w={460} h={160} />
          <text x={100} y={1400}
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            RESOLVED AT
          </text>
          <text x={100} y={1450}
            fontFamily={FONT} fontSize={44} fontWeight={800} fill={COLORS.accent}>
            COMPILE TIME
          </text>
        </g>

        {/* ── Floating accents ─────────────────────────────────────────── */}
        <g opacity={bracketCard.opacity}>
          <BentoCard x={560} y={1340} w={460} h={160} />
          <text x={600} y={1400}
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            COMPILER PICKS
          </text>
          <text x={600} y={1450}
            fontFamily={FONT} fontSize={44} fontWeight={800} fill={COLORS.white}>
            Best Match
          </text>
          {/* Pulsing indicator */}
          <circle cx={960} cy={1420 + breathe} r={18}
            fill={COLORS.accent} fillOpacity={glowPulse} />
          <circle cx={960} cy={1420 + breathe} r={18}
            fill="none" stroke={COLORS.accent} strokeWidth={2}
            transform={`scale(${pulse})`}
            style={{ transformOrigin: '960px 1420px' }} />
        </g>

        {/* ── Decorative track line at bottom ──────────────────────────── */}
        <line x1={60} y1={1560} x2={1020} y2={1560}
          stroke={COLORS.accent} strokeWidth={2} opacity={shimmer * 0.3} />
        <line x1={60} y1={1570} x2={1020} y2={1570}
          stroke={COLORS.accent} strokeWidth={2} opacity={shimmer * 0.3} />
        {Array.from({ length: 16 }, (_, i) => (
          <rect key={i} x={80 + i * 60} y={1555} width={30} height={20} rx={2}
            fill={COLORS.text_muted} opacity={0.15 * shimmer} />
        ))}

        {/* ── Floating circles ─────────────────────────────────────────── */}
        <circle cx={900} cy={480 + breathe} r={12}
          fill={COLORS.accent} fillOpacity={0.12 * shimmer} />
        <circle cx={940} cy={500 + breathe * 0.7} r={8}
          fill={COLORS.accent} fillOpacity={0.08 * shimmer} />

        {/* ── Caption ─────────────────────────────────────────────────── */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s02.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
