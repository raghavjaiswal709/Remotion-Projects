/**
 * Scene 05 — Object Class Intro
 * "Today, we learn the object class."
 * CSV: 18.620s → 21.580s
 * Duration: 99 frames (3.3s)
 *
 * Theme: Dark (#0D0D0D) + grid + Java accent (#D87656)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–25):   Label + headline springs, "TODAY" badge
 *   Phase 2 (frames 20–70):  Object class diagram — crown SVG on top, class box below
 *   Phase 3 (frames 60–end): Crown shimmer, floating particles, ring pulse
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
const SPRING_SNAP   = { damping: 12, stiffness: 260, mass: 0.6 } as const;
const SPRING_SOFT   = { damping: 22, stiffness: 120, mass: 1.0 } as const;

function useSpringEntrance(frame: number, delayFrames: number, fps = 30) {
  const f = Math.max(0, frame - delayFrames);
  const progress = spring({ frame: f, fps, config: SPRING_CONFIG });
  const opacity  = interpolate(f, [0, 12], [0, 1], { extrapolateRight: 'clamp' });
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

export const Scene05_ObjectClassIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1 ────────────────────────────────────────────────────────────────
  const labelEntrance = useSpringEntrance(frame, 0);
  const todayBadge    = useSpringEntrance(frame, 4);
  const headlineA     = useSpringEntrance(frame, 8);
  const headlineB     = useSpringEntrance(frame, 14);

  // ── Phase 2 ────────────────────────────────────────────────────────────────
  const crownSvg    = useSpringEntrance(frame, 18);
  const classBoxEnt = useSpringEntrance(frame, 24);
  const methodsEnt  = useSpringEntrance(frame, 34);
  const bottomCard  = useSpringEntrance(frame, 44);

  // ── Crown path draw ────────────────────────────────────────────────────────
  const crownLen = 400;
  const crownDash = usePathDraw(frame, 20, crownLen, 30);

  // ── Border draw ────────────────────────────────────────────────────────────
  const boxPerimeter = 2 * (600 + 400);
  const boxDash = interpolate(frame, [24, 54], [boxPerimeter, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  // ── Phase 3 ────────────────────────────────────────────────────────────────
  const breathe    = Math.sin(frame * 0.06) * 4;
  const crownGlow  = interpolate(Math.sin(frame * 0.08), [-1, 1], [0.7, 1]);
  const pulse      = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer    = interpolate(Math.sin(frame * 0.05), [-1, 1], [0.85, 1]);

  // ── Floating particles ─────────────────────────────────────────────────────
  const particles = [
    { x: 180, y: 500, r: 3, speed: 0.04 },
    { x: 400, y: 480, r: 2, speed: 0.06 },
    { x: 700, y: 510, r: 4, speed: 0.03 },
    { x: 900, y: 490, r: 2.5, speed: 0.05 },
    { x: 300, y: 520, r: 3, speed: 0.07 },
  ];

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s05.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ─────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEntrance.translateY})`} opacity={labelEntrance.opacity}>
          <SectionLabel text="MODULE 2 · OBJECT CLASS" y={120} opacity={0.8} />
        </g>

        {/* ── TODAY badge ─────────────────────────────────────────────────── */}
        <g opacity={todayBadge.opacity} transform={`translate(0, ${todayBadge.translateY})`}>
          <rect x={60} y={160} width={160} height={50} rx={12}
            fill={COLORS.accent} fillOpacity={0.15}
            stroke={COLORS.accent} strokeWidth={1.5} />
          <text x={140} y={194} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent}>
            TODAY
          </text>
        </g>

        {/* ── ZONE B ─────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${headlineA.translateY})`} opacity={headlineA.opacity}>
          <text x={60} y={320} fontFamily={FONT} fontSize={88} fontWeight={800} fill={COLORS.white}>
            The Object
          </text>
        </g>
        <g transform={`translate(0, ${headlineB.translateY})`} opacity={headlineB.opacity}>
          <text x={60} y={420} fontFamily={FONT} fontSize={88} fontWeight={800} fill={COLORS.accent}>
            Class
          </text>
        </g>

        {/* ── Floating particles ──────────────────────────────────────────── */}
        {particles.map((p, i) => (
          <circle key={i}
            cx={p.x} cy={p.y + Math.sin(frame * p.speed + i) * 8}
            r={p.r} fill={COLORS.accent}
            fillOpacity={0.3 * shimmer} />
        ))}

        {/* ── ZONE C — Crown SVG ──────────────────────────────────────────── */}
        <g opacity={crownSvg.opacity} transform={`translate(0, ${crownSvg.translateY})`}>
          <g transform="translate(540, 580)" opacity={crownGlow}>
            {/* Crown shape */}
            <path
              d="M -80,40 L -80,-20 L -40,-40 L 0,0 L 40,-40 L 80,-20 L 80,40 Z"
              fill={COLORS.accent} fillOpacity={0.15}
              stroke={COLORS.accent} strokeWidth={3}
              strokeDasharray={crownLen} strokeDashoffset={crownDash}
              strokeLinecap="round" strokeLinejoin="round" />
            {/* Crown gems */}
            <circle cx={-40} cy={-20} r={6} fill={COLORS.accent} fillOpacity={0.6} />
            <circle cx={0} cy={-15} r={8} fill={COLORS.accent} fillOpacity={0.8} />
            <circle cx={40} cy={-20} r={6} fill={COLORS.accent} fillOpacity={0.6} />
            {/* Crown base */}
            <rect x={-85} y={40} width={170} height={12} rx={4}
              fill={COLORS.accent} fillOpacity={0.3} />
          </g>
        </g>

        {/* ── Object class box ────────────────────────────────────────────── */}
        <g opacity={classBoxEnt.opacity} transform={`translate(0, ${classBoxEnt.translateY})`}>
          {/* Animated border */}
          <rect x={240} y={660} width={600} height={400} rx={20}
            fill="none" stroke={COLORS.accent} strokeWidth={2.5}
            strokeDasharray={boxPerimeter} strokeDashoffset={boxDash} />
          <BentoCard x={240} y={660} w={600} h={400} />
          {/* Header */}
          <rect x={240} y={660} width={600} height={60} rx={20}
            fill={COLORS.accent} fillOpacity={0.12} />
          <text x={540} y={700} textAnchor="middle"
            fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">
            java.lang.Object
          </text>
          {/* Divider */}
          <line x1={280} y1={730} x2={800} y2={730}
            stroke="rgba(255,255,255,0.1)" strokeWidth={1} />
          {/* Methods list */}
          <g opacity={methodsEnt.opacity} transform={`translate(0, ${methodsEnt.translateY})`}>
            {[
              { name: 'toString()', desc: 'readable string' },
              { name: 'equals()', desc: 'compare objects' },
              { name: 'hashCode()', desc: 'numeric code' },
            ].map((m, i) => (
              <g key={i}>
                <circle cx={300} cy={780 + i * 80} r={8}
                  fill={COLORS.accent} fillOpacity={0.6} />
                <text x={320} y={788 + i * 80}
                  fontFamily={FONT} fontSize={32} fontWeight={800}
                  fill={COLORS.white}>
                  {m.name}
                </text>
                <text x={320} y={822 + i * 80}
                  fontFamily={FONT} fontSize={26} fontWeight={800}
                  fill={COLORS.text_muted}>
                  {m.desc}
                </text>
              </g>
            ))}
          </g>
        </g>

        {/* ── Bottom emphasis card ─────────────────────────────────────────── */}
        <g opacity={bottomCard.opacity} transform={`translate(0, ${bottomCard.translateY})`}>
          <BentoCard x={60} y={1120} w={960} h={160} accent />
          <rect x={60} y={1120} width={6} height={160} rx={3} fill={COLORS.accent} />
          <text x={100} y={1190} fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.white}>
            The root of
          </text>
          <text x={370} y={1190} fontFamily={FONT} fontSize={40} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">
            every
          </text>
          <text x={470} y={1190} fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.white}>
            Java class
          </text>
          <text x={100} y={1240} fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.text_muted}>
            Inherited automatically — no extends needed
          </text>
        </g>

        {/* ── Pulse rings ─────────────────────────────────────────────────── */}
        <g transform={`translate(540, ${1440 + breathe})`} opacity={0.2}>
          <circle cx={0} cy={0} r={50} fill="none"
            stroke={COLORS.accent} strokeWidth={2}
            transform={`scale(${pulse})`}
            style={{ transformOrigin: '0px 0px' }} />
          <circle cx={0} cy={0} r={80} fill="none"
            stroke={COLORS.accent} strokeWidth={1} opacity={0.4}
            transform={`scale(${pulse})`}
            style={{ transformOrigin: '0px 0px' }} />
        </g>

        {/* ── Side accents ────────────────────────────────────────────────── */}
        <g opacity={0.15 * shimmer}>
          <circle cx={100} cy={700 + breathe * 0.5} r={24}
            fill="none" stroke={COLORS.accent} strokeWidth={1.5} />
          <circle cx={980} cy={800 + breathe * 0.7} r={18}
            fill="none" stroke={COLORS.accent} strokeWidth={1.5} />
        </g>

        {/* ── CAPTION ─────────────────────────────────────────────────────── */}
        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s05.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
