/**
 * Scene 04 — TodayTopic
 * "Today, we name that something else."
 * CSV: 12.980s → 15.400s
 * Duration: 72 frames (2.4s)
 *
 * Animation phases:
 *   Phase 1 (0–20):  Label + headline spring
 *   Phase 2 (15–50): Hero text reveal, bento card
 *   Phase 3 (45–end): Micro-animations
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
import { DarkBackground, GlobalDefs, Caption, SectionLabel, BentoCard } from '../helpers/components';

const FONT = "'Galaxie Copernicus ExtraBold', Georgia, serif";

const SPRING_CONFIG = { damping: 18, stiffness: 180, mass: 0.8 } as const;
const SPRING_SNAP = { damping: 12, stiffness: 260, mass: 0.6 } as const;
const SPRING_SOFT = { damping: 22, stiffness: 120, mass: 1.0 } as const;

function useSpringEntrance(frame: number, delayFrames: number, fps = 30) {
  const f = Math.max(0, frame - delayFrames);
  const progress = spring({ frame: f, fps, config: SPRING_CONFIG });
  const opacity = interpolate(f, [0, 12], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const translateY = interpolate(progress, [0, 1], [32, 0]);
  return { progress, opacity, translateY };
}

function usePathDraw(frame: number, startFrame: number, totalLength: number, durationFrames = 30) {
  const progress = interpolate(frame, [startFrame, startFrame + durationFrames], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  return totalLength * (1 - progress);
}

export const Scene04_TodayTopic: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1 ────────────────────────────────────────────────────────────────
  const labelEnt = useSpringEntrance(frame, 0);
  const h1 = useSpringEntrance(frame, 4);
  const h2 = useSpringEntrance(frame, 8);

  // ── Phase 2 ────────────────────────────────────────────────────────────────
  const heroCard = useSpringEntrance(frame, 14);
  const heroPerim = 2 * (960 + 500);
  const heroDash = usePathDraw(frame, 14, heroPerim, 25);

  // Per-word spring for "that something else"
  const revealWords = ['Today,', 'we', 'name', 'that', 'something', 'else.'];
  const wordSprings = revealWords.map((_, i) => {
    const f = Math.max(0, frame - 18 - i * 4);
    const sp = spring({ frame: f, fps, config: SPRING_SNAP });
    const op = interpolate(sp, [0, 0.4], [0, 1], { extrapolateRight: 'clamp' });
    const ty = interpolate(sp, [0, 1], [24, 0]);
    return { opacity: op, translateY: ty };
  });

  // Bottom accent card
  const bottomCard = useSpringEntrance(frame, 30);
  const bottomPerim = 2 * (960 + 160);
  const bottomDash = usePathDraw(frame, 30, bottomPerim, 25);

  // Arrow path from hero to bottom
  const arrowLen = 150;
  const arrowDash = usePathDraw(frame, 26, arrowLen, 20);

  // ── Phase 3 ────────────────────────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  // Floating particles
  const particles = Array.from({ length: 12 }, (_, i) => {
    const angle = (i / 12) * Math.PI * 2 + frame * 0.015;
    const radius = 320 + Math.sin(frame * 0.025 + i * 0.5) * 50;
    return {
      x: 540 + Math.cos(angle) * radius,
      y: 850 + Math.sin(angle) * radius * 0.45,
      op: 0.1 + Math.sin(frame * 0.04 + i) * 0.06,
      r: 2 + (i % 3),
    };
  });

  // Question mark illustration
  const qScale = spring({ frame: Math.max(0, frame - 20), fps, config: SPRING_SOFT });
  const qScaleVal = interpolate(qScale, [0, 1], [0.5, 1]);

  // Ring around question mark
  const ringCircum = 2 * Math.PI * 90;
  const ringDash = usePathDraw(frame, 22, ringCircum, 25);

  // Glow pulse on highlight word
  const glowOp = interpolate(Math.sin(frame * 0.1), [-1, 1], [0.3, 0.7]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s04.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="MODULE 3 · TOOL USE" y={160} />
        </g>

        {/* ── ZONE B ────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${h1.translateY})`} opacity={h1.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={88} fontWeight={800} fill={COLORS.white}>
            Today
          </text>
        </g>
        <g transform={`translate(0, ${h2.translateY})`} opacity={h2.opacity}>
          <text x={60} y={400} fontFamily={FONT} fontSize={52} fontWeight={800} fill={COLORS.accent}
            fontStyle="italic">
            We name that something else
          </text>
        </g>

        {/* ── ZONE C — Hero concept card ─────────────────────────────────── */}
        <g opacity={heroCard.opacity} transform={`translate(0, ${heroCard.translateY})`}>
          <BentoCard x={60} y={480} w={960} h={500} accent />
          <rect x={60} y={480} width={960} height={500} rx={20}
            fill="none" stroke={COLORS.accent} strokeWidth={2}
            strokeDasharray={heroPerim} strokeDashoffset={heroDash} />

          {/* Per-word reveal */}
          {revealWords.map((word, i) => (
            <text key={i}
              x={540} y={620 + Math.floor(i / 3) * 80}
              textAnchor="middle"
              dx={(i % 3 - 1) * 280}
              fontFamily={FONT} fontSize={56} fontWeight={800}
              fill={word === 'something' || word === 'else.' ? COLORS.accent : COLORS.white}
              fontStyle={word === 'something' || word === 'else.' ? 'italic' : 'normal'}
              opacity={wordSprings[i].opacity}
              transform={`translate(0, ${wordSprings[i].translateY})`}>
              {word}
            </text>
          ))}

          {/* Question mark illustration */}
          <g transform={`translate(540, 830) scale(${qScaleVal})`}
            style={{ transformOrigin: '0px 0px' }}>
            {/* Ring */}
            <circle cx={0} cy={0} r={90} fill="none"
              stroke={COLORS.accent} strokeWidth={2.5}
              strokeDasharray={ringCircum} strokeDashoffset={ringDash} />
            {/* Inner glow */}
            <circle cx={0} cy={0} r={70} fill={COLORS.accent} opacity={glowOp * 0.08} />
            {/* ? symbol */}
            <text x={0} y={24} textAnchor="middle"
              fontFamily={FONT} fontSize={100} fontWeight={800}
              fill={COLORS.accent}>
              ?
            </text>
          </g>
        </g>

        {/* ── Arrow down ─────────────────────────────────────────────────── */}
        <line x1={540} y1={990} x2={540} y2={1090}
          stroke={COLORS.accent} strokeWidth={2.5}
          strokeDasharray={arrowLen} strokeDashoffset={arrowDash}
          markerEnd="url(#arrow)" />

        {/* ── Bottom card ────────────────────────────────────────────────── */}
        <g opacity={bottomCard.opacity} transform={`translate(0, ${bottomCard.translateY})`}>
          <BentoCard x={60} y={1110} w={960} h={160} />
          <rect x={60} y={1110} width={960} height={160} rx={20}
            fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth={1}
            strokeDasharray={bottomPerim} strokeDashoffset={bottomDash} />
          <rect x={60} y={1110} width={6} height={160} rx={3} fill={COLORS.accent} />
          <text x={120} y={1205}
            fontFamily={FONT} fontSize={42} fontWeight={800} fill={COLORS.white}>
            The agent runtime
          </text>
        </g>

        {/* ── Floating particles ─────────────────────────────────────────── */}
        {particles.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={p.r} fill={COLORS.accent} opacity={p.op} />
        ))}

        {/* ── Decorative dots ────────────────────────────────────────────── */}
        <g opacity={0.25}>
          {Array.from({ length: 7 }, (_, i) => (
            <circle key={i}
              cx={180 + i * 120}
              cy={1380 + breathe * (i % 2 === 0 ? 1 : -1)}
              r={3} fill={COLORS.accent} />
          ))}
        </g>

        {/* ── Corner accent ──────────────────────────────────────────────── */}
        <g opacity={0.3 * shimmer}>
          <path d="M 60,1500 L 60,1580 M 60,1500 L 140,1500"
            fill="none" stroke={COLORS.accent} strokeWidth={2} strokeLinecap="round" />
          <path d="M 1020,1500 L 1020,1580 M 1020,1500 L 940,1500"
            fill="none" stroke={COLORS.accent} strokeWidth={2} strokeLinecap="round" />
        </g>

        {/* ── Pulsing ring bottom ────────────────────────────────────────── */}
        <g transform={`translate(540, ${1620 + breathe})`}>
          <circle cx={0} cy={0} r={30} fill={COLORS.accent} opacity={0.06 * shimmer} />
          <circle cx={0} cy={0} r={30} fill="none" stroke={COLORS.accent}
            strokeWidth={1.5} opacity={0.3}
            transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} />
        </g>

        {/* ── CAPTION ───────────────────────────────────────────────────── */}
        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s04.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
