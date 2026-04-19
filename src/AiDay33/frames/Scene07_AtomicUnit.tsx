/**
 * Scene 07 — Atomic Unit
 * "That is the atomic unit of agent execution."
 * CSV: 22.480s → 26.100s
 * Duration: 109 frames (3.6s)
 *
 * Theme: Dark (#0D0D0D) + grid + teal accent (#76ABAE)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–25): Label + headline spring
 *   Phase 2 (frames 20–75): Atom illustration — nucleus + orbiting electrons drawn with path-draw
 *   Phase 3 (frames 65–end): Orbit rotation, pulse on nucleus
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

function useSpringEntrance(frame: number, delayFrames: number, fps = 30) {
  const f = Math.max(0, frame - delayFrames);
  const progress = spring({ frame: f, fps, config: SPRING_CONFIG });
  const opacity  = interpolate(f, [0, 12], [0, 1], { extrapolateRight: 'clamp', easing: ease });
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

export const Scene07_AtomicUnit: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1 ────────────────────────────────────────────────────────────────
  const labelEnt = useSpringEntrance(frame, 0);
  const headA = useSpringEntrance(frame, 6);
  const headB = useSpringEntrance(frame, 12);

  // ── Phase 2 ────────────────────────────────────────────────────────────────
  const atomCard = useSpringEntrance(frame, 18);
  const defCard = useSpringEntrance(frame, 40);

  // Nucleus entrance
  const nucleusEnt = useSpringEntrance(frame, 22);

  // Orbit ellipses (3 rings, staggered)
  const orbitCirc1 = 2 * Math.PI * 160;
  const orbitCirc2 = 2 * Math.PI * 120;
  const orbitCirc3 = 2 * Math.PI * 200;
  const orbitDash1 = usePathDraw(frame, 26, orbitCirc1, 30);
  const orbitDash2 = usePathDraw(frame, 30, orbitCirc2, 30);
  const orbitDash3 = usePathDraw(frame, 34, orbitCirc3, 30);

  // Electron positions
  const electronAngle1 = frame * 0.04;
  const electronAngle2 = frame * 0.035 + Math.PI * 0.6;
  const electronAngle3 = frame * 0.045 + Math.PI * 1.3;

  // ── Phase 3 ────────────────────────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 3;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.03;
  const shimmer = interpolate(Math.sin(frame * 0.05), [-1, 1], [0.85, 1]);

  // Outer ring glow
  const glowPulse = frame > 60 ? interpolate(Math.sin((frame - 60) * 0.1), [-1, 1], [0.05, 0.12]) : 0;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s07.from);

  const cx = 540;
  const cy = 850;

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ──────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="THE STEP · ATOMIC UNIT" y={160} />
        </g>

        {/* ── ZONE B ──────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${headA.translateY})`} opacity={headA.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={96} fontWeight={800} fill={COLORS.white}>
            Atomic
          </text>
        </g>
        <g transform={`translate(0, ${headB.translateY})`} opacity={headB.opacity}>
          <text x={60} y={410} fontFamily={FONT} fontSize={72} fontWeight={800} fill={COLORS.accent} fontStyle="italic">
            Unit of Execution
          </text>
        </g>

        {/* ── ZONE C — Atom illustration ──────────────────────────────── */}
        <g opacity={atomCard.opacity} transform={`translate(0, ${atomCard.translateY})`}>
          <BentoCard x={60} y={480} w={960} h={700} accent />

          {/* Outer glow */}
          <circle cx={cx} cy={cy} r={220} fill={COLORS.accent} fillOpacity={glowPulse} />

          {/* Orbit 1 — horizontal ellipse */}
          <ellipse cx={cx} cy={cy} rx={160} ry={80}
            fill="none" stroke={COLORS.accent} strokeWidth={1.5}
            strokeDasharray={orbitCirc1} strokeDashoffset={orbitDash1}
            opacity={0.5}
          />
          {/* Orbit 2 — tilted */}
          <ellipse cx={cx} cy={cy} rx={120} ry={180}
            fill="none" stroke={COLORS.accent} strokeWidth={1.5}
            strokeDasharray={orbitCirc2} strokeDashoffset={orbitDash2}
            opacity={0.4}
            transform={`rotate(60, ${cx}, ${cy})`}
          />
          {/* Orbit 3 — wide tilted */}
          <ellipse cx={cx} cy={cy} rx={200} ry={100}
            fill="none" stroke={COLORS.accent} strokeWidth={1.5}
            strokeDasharray={orbitCirc3} strokeDashoffset={orbitDash3}
            opacity={0.35}
            transform={`rotate(-30, ${cx}, ${cy})`}
          />

          {/* Electrons */}
          {frame > 30 && (
            <>
              <circle
                cx={cx + Math.cos(electronAngle1) * 160}
                cy={cy + Math.sin(electronAngle1) * 80}
                r={8} fill={COLORS.accent}
              />
              <circle
                cx={cx + Math.cos(electronAngle2) * 120}
                cy={cy + Math.sin(electronAngle2) * 180}
                r={7} fill={COLORS.accent} opacity={0.8}
                transform={`rotate(60, ${cx}, ${cy})`}
              />
              <circle
                cx={cx + Math.cos(electronAngle3) * 200}
                cy={cy + Math.sin(electronAngle3) * 100}
                r={6} fill={COLORS.accent} opacity={0.65}
                transform={`rotate(-30, ${cx}, ${cy})`}
              />
            </>
          )}

          {/* Nucleus */}
          <g opacity={nucleusEnt.opacity} transform={`scale(${pulse})`} style={{ transformOrigin: `${cx}px ${cy}px` }}>
            <circle cx={cx} cy={cy} r={40} fill={COLORS.accent} fillOpacity={0.2} />
            <circle cx={cx} cy={cy} r={40} fill="none" stroke={COLORS.accent} strokeWidth={3} />
            <circle cx={cx} cy={cy} r={18} fill={COLORS.accent} fillOpacity={0.5} />
            {/* Inner core dots */}
            <circle cx={cx - 8} cy={cy - 4} r={6} fill={COLORS.accent} />
            <circle cx={cx + 6} cy={cy + 6} r={5} fill={COLORS.accent} opacity={0.8} />
            <circle cx={cx + 2} cy={cy - 8} r={4} fill={COLORS.white} opacity={0.3} />
          </g>

          {/* "STEP" label inside nucleus */}
          <text x={cx} y={cy + 68} textAnchor="middle" fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.text_muted} opacity={nucleusEnt.opacity}>
            STEP
          </text>
        </g>

        {/* Definition strip */}
        <g opacity={defCard.opacity} transform={`translate(0, ${defCard.translateY})`}>
          <BentoCard x={60} y={1230} w={960} h={200} />
          <rect x={60} y={1230} width={6} height={200} rx={3} fill={COLORS.accent} />
          <text x={100} y={1300} fontFamily={FONT} fontSize={44} fontWeight={800} fill={COLORS.white}>
            Cannot be split further
          </text>
          <text x={100} y={1360} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.text_muted}>
            The smallest meaningful unit of work
          </text>
          <text x={100} y={1405} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.accent} fontStyle="italic">
            in the agent's execution
          </text>
        </g>

        {/* Floating micro-elements */}
        <circle cx={160} cy={1550 + breathe} r={4} fill={COLORS.accent} opacity={0.2 * shimmer} />
        <circle cx={900} cy={1500 + breathe * 1.4} r={3} fill={COLORS.accent} opacity={0.15} />
        <circle cx={540} cy={1600 + breathe * 0.7} r={5} fill={COLORS.accent} opacity={0.12} />

        {/* Corner accents */}
        <path d="M 60,60 L 60,140 M 60,60 L 140,60" fill="none" stroke={COLORS.accent} strokeWidth={2.5} strokeLinecap="round" opacity={0.35} />
        <path d="M 1020,1740 L 1020,1660 M 1020,1740 L 940,1740" fill="none" stroke={COLORS.accent} strokeWidth={2.5} strokeLinecap="round" opacity={0.35} />

        {/* ── CAPTION ─────────────────────────────────────────────────── */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s07.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
