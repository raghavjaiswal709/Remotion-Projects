/**
 * Scene 12 — StartStateExample
 * "Start state, no booking exists."
 * CSV: 37.380s → 39.180s
 * Duration: ~77 frames
 *
 * Theme: Dark (#0D0D0D) + grid + AI accent (#76ABAE)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–25):   Label + headline spring entrance
 *   Phase 2 (frames 18–60):  Empty ticket slot, "NO BOOKING" stamp, search icon
 *   Phase 3 (frames 50+):    Dashed border pulse, float particles, shimmer
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

export const Scene12_StartStateExample: React.FC = () => {
  const frame = useCurrentFrame();
  const fps   = 30;

  // ── Phase 1 ────────────────────────────────────────────────────────────────
  const labelEntrance = useSpringEntrance(frame, 0);
  const headlineA     = useSpringEntrance(frame, 5);
  const headlineB     = useSpringEntrance(frame, 10);
  const badgeEntrance = useSpringEntrance(frame, 8);

  // ── Phase 2 ────────────────────────────────────────────────────────────────
  const emptyCard = useSpringEntrance(frame, 18);
  const stampCard = useSpringEntrance(frame, 30);
  const infoCard  = useSpringEntrance(frame, 42);

  // Dashed border draw
  const ticketPerim = 2 * (800 + 400);
  const ticketDash = usePathDraw(frame, 20, ticketPerim, 25);

  // Cross icon draw
  const crossLen = 120;
  const crossDash = usePathDraw(frame, 32, crossLen, 16);

  // ── Phase 3 ────────────────────────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse   = 1 + Math.sin(frame * 0.1) * 0.02;
  const shimmer = interpolate(Math.sin(frame * 0.05), [-1, 1], [0.8, 1]);
  const dashAnim = frame * 0.5;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s12.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEntrance.translateY})`} opacity={labelEntrance.opacity}>
          <SectionLabel text="MODULE 6 · TASK COMPONENT 1" y={160} opacity={0.8} />
        </g>

        {/* ── ZONE B ────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${headlineA.translateY})`} opacity={headlineA.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={88} fontWeight={800} fill={COLORS.white}>
            Start State
          </text>
        </g>
        <g transform={`translate(0, ${headlineB.translateY})`} opacity={headlineB.opacity}>
          <text x={60} y={400} fontFamily={FONT} fontSize={52} fontWeight={800} fill={COLORS.text_muted}>
            Where the world begins
          </text>
        </g>

        {/* ── "START" Badge ──────────────────────────────────────────────── */}
        <g transform={`translate(0, ${badgeEntrance.translateY})`} opacity={badgeEntrance.opacity}>
          <rect x={60} y={440} width={140} height={44} rx={22}
            fill={COLORS.accent} fillOpacity={0.12}
            stroke={COLORS.accent} strokeWidth={1.5} />
          <text x={130} y={469} textAnchor="middle"
            fontFamily={FONT} fontSize={22} fontWeight={800} fill={COLORS.accent}>
            START
          </text>
        </g>

        {/* ── Empty ticket placeholder ───────────────────────────────────── */}
        <g opacity={emptyCard.opacity} transform={`translate(0, ${emptyCard.translateY})`}>
          {/* Dashed border ticket outline */}
          <rect x={140} y={540} width={800} height={400} rx={24}
            fill="none"
            stroke={COLORS.text_muted}
            strokeWidth={2.5}
            strokeDasharray="16 10"
            strokeDashoffset={dashAnim}
            opacity={0.4} />

          {/* Inner empty area */}
          <rect x={160} y={560} width={760} height={360} rx={16}
            fill={COLORS.bg_secondary} opacity={0.3} />

          {/* Perforation dots (left side) */}
          {Array.from({ length: 8 }, (_, i) => (
            <circle key={i}
              cx={160} cy={580 + i * 45} r={4}
              fill={COLORS.bg_primary}
              stroke="rgba(255,255,255,0.1)" strokeWidth={1} />
          ))}

          {/* Placeholder text lines (skeleton loading) */}
          <rect x={220} y={600} width={400} height={20} rx={10}
            fill="rgba(255,255,255,0.06)" />
          <rect x={220} y={640} width={300} height={16} rx={8}
            fill="rgba(255,255,255,0.04)" />
          <rect x={220} y={680} width={350} height={16} rx={8}
            fill="rgba(255,255,255,0.04)" />

          {/* Price placeholder */}
          <rect x={700} y={600} width={180} height={48} rx={12}
            fill="rgba(255,255,255,0.04)" />

          {/* Empty seat icon */}
          <g transform="translate(540, 780)" opacity={0.25}>
            <rect x={-30} y={-16} width={60} height={32} rx={8}
              fill="none" stroke={COLORS.text_muted} strokeWidth={1.5}
              strokeDasharray="6 4" />
            <text x={0} y={8} textAnchor="middle" fontFamily={FONT}
              fontSize={18} fontWeight={800} fill={COLORS.text_muted}>
              --
            </text>
          </g>
        </g>

        {/* ── Large cross / void indicator ───────────────────────────────── */}
        <g opacity={stampCard.opacity} transform={`translate(0, ${stampCard.translateY})`}>
          {/* Red X over the ticket */}
          <line x1={240} y1={620} x2={840} y2={860}
            stroke={COLORS.vibrant_red} strokeWidth={5} strokeLinecap="round"
            strokeDasharray={crossLen} strokeDashoffset={crossDash}
            opacity={0.35} />
          <line x1={840} y1={620} x2={240} y2={860}
            stroke={COLORS.vibrant_red} strokeWidth={5} strokeLinecap="round"
            strokeDasharray={crossLen} strokeDashoffset={crossDash}
            opacity={0.35} />

          {/* "NO BOOKING" stamp */}
          <g transform={`translate(540, 740) rotate(-12) scale(${pulse})`}
            style={{ transformOrigin: '0px 0px' }}>
            <rect x={-160} y={-36} width={320} height={72} rx={8}
              fill="none" stroke={COLORS.vibrant_red} strokeWidth={3} opacity={0.7} />
            <text x={0} y={10} textAnchor="middle"
              fontFamily={FONT} fontSize={36} fontWeight={800}
              fill={COLORS.vibrant_red} opacity={0.8}
              letterSpacing="0.12em">
              NO BOOKING
            </text>
          </g>
        </g>

        {/* ── Info card ──────────────────────────────────────────────────── */}
        <g opacity={infoCard.opacity} transform={`translate(0, ${infoCard.translateY})`}>
          <BentoCard x={60} y={1000} w={960} h={200} accent />
          <rect x={60} y={1000} width={6} height={200} rx={3} fill={COLORS.accent} />

          {/* Empty clipboard icon */}
          <g transform="translate(110, 1100)">
            <rect x={-20} y={-30} width={40} height={50} rx={6}
              fill="none" stroke={COLORS.accent} strokeWidth={2} />
            <rect x={-12} y={-36} width={24} height={10} rx={3}
              fill={COLORS.accent} />
            <line x1={-10} y1={-10} x2={10} y2={-10}
              stroke={COLORS.accent} strokeWidth={1.5} opacity={0.4} />
            <line x1={-10} y1={0} x2={10} y2={0}
              stroke={COLORS.accent} strokeWidth={1.5} opacity={0.4} />
            <line x1={-10} y1={10} x2={10} y2={10}
              stroke={COLORS.accent} strokeWidth={1.5} opacity={0.4} />
          </g>

          <text x={155} y={1080} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            No booking exists
          </text>
          <text x={155} y={1125} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            The world before the agent acts — blank slate
          </text>
          <text x={155} y={1165} fontFamily={FONT} fontSize={26} fontWeight={800} fill={COLORS.accent}>
            This defines where the agent starts
          </text>
        </g>

        {/* ── Secondary explanation card ──────────────────────────────────── */}
        <g opacity={infoCard.opacity * shimmer} transform={`translate(0, ${infoCard.translateY * 0.5})`}>
          <BentoCard x={60} y={1240} w={960} h={140} />
          <text x={100} y={1310} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            Without a start state, the agent cannot measure
          </text>
          <text x={100} y={1350} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.accent}>
            how far it has progressed
          </text>
        </g>

        {/* ── Floating elements ──────────────────────────────────────────── */}
        <g opacity={0.25}>
          <circle cx={180} cy={1500 + breathe} r={3} fill={COLORS.accent} />
          <circle cx={880} cy={1560 + breathe * 0.7} r={2.5} fill={COLORS.accent} />
          <circle cx={540} cy={1620 + breathe * 1.2} r={3} fill={COLORS.accent} />
          <circle cx={350} cy={1680 + breathe * 0.5} r={2} fill={COLORS.accent} opacity={0.3} />
        </g>

        {/* ── CAPTION ────────────────────────────────────────────────────── */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s12.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
