/**
 * Scene 28 — That Atomic Unit Has a Name
 * "That atomic unit has a name."
 * CSV: 74.300s → 84.520s
 * Duration: 307 frames (10.2s)
 *
 * Animation phases:
 *   Phase 1 (0–25): Label + headline reveal
 *   Phase 2 (20–150): Build-up, atom illustration, naming
 *   Phase 3 (140–end): Series branding, tomorrow teaser
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

function usePathDraw(frame: number, start: number, len: number, dur = 25) {
  const p = interpolate(frame, [start, start + dur], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  return len * (1 - p);
}

export const Scene28_AtomicUnitName: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const lbl = useSpringEntrance(frame, 0);
  const h1 = useSpringEntrance(frame, 5);

  // Atom illustration
  const atomE = useSpringEntrance(frame, 18);
  const orbitAngle = frame * 0.04;
  const orbitAngle2 = frame * 0.03 + Math.PI * 0.66;
  const orbitAngle3 = frame * 0.035 + Math.PI * 1.33;
  const orbitR = 120;

  // "STEP" reveal
  const nameReveal = spring({ frame: Math.max(0, frame - 60), fps, config: SPRING_SNAP });
  const nameOp = interpolate(frame, [60, 72], [0, 1], { extrapolateRight: 'clamp' });
  const nameScale = interpolate(nameReveal, [0, 1], [0.6, 1]);

  // Definition card
  const defCard = useSpringEntrance(frame, 80);
  // Structure card
  const structCard = useSpringEntrance(frame, 95);
  // Tomorrow card
  const tomorrowCard = useSpringEntrance(frame, 140);
  // Series badge
  const seriesCard = useSpringEntrance(frame, 170);
  // Day counter
  const dayCard = useSpringEntrance(frame, 190);

  // Fade out at end
  const fadeOut = interpolate(frame, [270, 307], [1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  const breathe = Math.sin(frame * 0.05) * 3;
  const pulse = 1 + Math.sin(frame * 0.07) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s28.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0, opacity: fadeOut }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        <g transform={`translate(0, ${lbl.translateY})`} opacity={lbl.opacity}>
          <SectionLabel text="TRAJECTORY · ATOMIC UNIT" y={160} opacity={0.8} />
        </g>

        <g transform={`translate(0, ${h1.translateY})`} opacity={h1.opacity}>
          <text x={60} y={310} fontFamily={FONT} fontSize={72} fontWeight={800} fill={COLORS.white}>
            That atomic unit
          </text>
          <text x={60} y={400} fontFamily={FONT} fontSize={72} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">
            has a name.
          </text>
        </g>

        {/* Atom illustration */}
        <g opacity={atomE.opacity} transform={`translate(540, ${680 + atomE.translateY})`}>
          {/* Nucleus */}
          <circle cx={0} cy={0} r={28} fill={COLORS.accent} opacity={0.15} />
          <circle cx={0} cy={0} r={16}
            fill={COLORS.accent} opacity={shimmer} />
          {/* Orbit rings */}
          <ellipse cx={0} cy={0} rx={orbitR} ry={orbitR * 0.4}
            fill="none" stroke={COLORS.accent} strokeWidth={1.5} opacity={0.25}
            transform="rotate(-20)" />
          <ellipse cx={0} cy={0} rx={orbitR} ry={orbitR * 0.4}
            fill="none" stroke={COLORS.accent} strokeWidth={1.5} opacity={0.25}
            transform="rotate(40)" />
          <ellipse cx={0} cy={0} rx={orbitR} ry={orbitR * 0.4}
            fill="none" stroke={COLORS.accent} strokeWidth={1.5} opacity={0.25}
            transform="rotate(100)" />
          {/* Orbiting electrons */}
          <circle cx={Math.cos(orbitAngle) * orbitR}
            cy={Math.sin(orbitAngle) * orbitR * 0.4}
            r={6} fill={COLORS.accent} />
          <circle cx={Math.cos(orbitAngle2) * orbitR}
            cy={Math.sin(orbitAngle2) * orbitR * 0.4}
            r={6} fill={COLORS.accent}
            transform="rotate(40, 0, 0)" />
          <circle cx={Math.cos(orbitAngle3) * orbitR}
            cy={Math.sin(orbitAngle3) * orbitR * 0.4}
            r={6} fill={COLORS.accent}
            transform="rotate(100, 0, 0)" />
        </g>

        {/* Big "STEP" name reveal */}
        <g opacity={nameOp} transform={`translate(540, 900) scale(${nameScale})`}
          style={{ transformOrigin: '0px 0px' }}>
          {/* Ghost */}
          <text x={0} y={0} textAnchor="middle"
            fontFamily={FONT} fontSize={200} fontWeight={800}
            fill={COLORS.accent} opacity={0.06}>
            STEP
          </text>
          {/* Main */}
          <text x={0} y={0} textAnchor="middle"
            fontFamily={FONT} fontSize={160} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">
            STEP
          </text>
        </g>

        {/* Definition */}
        <g opacity={defCard.opacity} transform={`translate(0, ${defCard.translateY})`}>
          <BentoCard x={60} y={960} w={960} h={140} accent />
          <text x={540} y={1020} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.white}>
            The smallest indivisible unit of agent behavior
          </text>
          <text x={540} y={1065} textAnchor="middle"
            fontFamily={FONT} fontSize={24} fontWeight={800} fill={COLORS.text_muted}>
            observation in → state update → action out
          </text>
        </g>

        {/* Structure formula */}
        <g opacity={structCard.opacity} transform={`translate(0, ${structCard.translateY})`}>
          <BentoCard x={60} y={1130} w={960} h={100} />
          <text x={540} y={1194} textAnchor="middle"
            fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.accent}>
            stepₜ = (oₜ, sₜ, aₜ)
          </text>
        </g>

        {/* Tomorrow teaser */}
        <g opacity={tomorrowCard.opacity} transform={`translate(0, ${tomorrowCard.translateY})`}>
          <BentoCard x={60} y={1280} w={960} h={140} />
          <text x={100} y={1325}
            fontFamily={FONT} fontSize={22} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.12em">
            TOMORROW — DAY 33
          </text>
          <text x={100} y={1375}
            fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            What Is a Step?
          </text>
          <text x={100} y={1405}
            fontFamily={FONT} fontSize={22} fontWeight={800} fill={COLORS.text_muted}>
            Deep dive into the internal mechanics
          </text>
          {/* Forward arrow */}
          <path d="M 960,1350 L 985,1350 L 975,1340 M 985,1350 L 975,1360"
            fill="none" stroke={COLORS.accent} strokeWidth={2.5} strokeLinecap="round" />
        </g>

        {/* Series badge */}
        <g opacity={seriesCard.opacity} transform={`translate(0, ${seriesCard.translateY})`}>
          <BentoCard x={60} y={1460} w={620} h={80} />
          <text x={100} y={1510}
            fontFamily={FONT} fontSize={22} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.15em">
            AGENTIC AI · FIRST PRINCIPLES
          </text>
        </g>

        {/* Day counter */}
        <g opacity={dayCard.opacity} transform={`translate(0, ${dayCard.translateY})`}>
          <BentoCard x={720} y={1460} w={300} h={80} accent />
          <text x={870} y={1510} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.accent}>
            DAY 32 <tspan fill={COLORS.text_muted}>/ 120</tspan>
          </text>
        </g>

        {/* Floating accent orbs */}
        {[120, 400, 680, 960].map((x, i) => (
          <circle key={i} cx={x} cy={1650 + breathe * (i % 2 === 0 ? 1 : -1)} r={4}
            fill={COLORS.accent} opacity={0.05 * shimmer}
            transform={`scale(${pulse})`} style={{ transformOrigin: `${x}px 1650px` }} />
        ))}

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s28.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
