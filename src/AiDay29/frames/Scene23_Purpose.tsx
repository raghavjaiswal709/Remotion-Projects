/**
 * Scene 23 — Purpose
 * "A defined goal to move toward."
 * CSV: 65.480s → 68.600s
 * Duration: 94 frames (3.13s)
 *
 * Animation phases:
 *   Phase 1 (0–20): headline
 *   Phase 2 (14–60): target/bullseye SVG + trajectory arrow
 *   Phase 3 (50–end): micro
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

export const Scene23_Purpose: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const labelEnt = useSpringEntrance(frame, 0);

  // Headline "Defined Goal"
  const w1 = useSpringEntrance(frame, 4);
  const w2 = useSpringEntrance(frame, 10);

  const subEnt = useSpringEntrance(frame, 14);

  // Bullseye
  const CX = 540, CY = 860;
  const rings = [200, 150, 100, 50];
  const ringEnts = rings.map((_, i) => useSpringEntrance(frame, 18 + i * 5));

  // Trajectory arrow from bottom-left to center
  const arrowLen = 400;
  const arrowDash = usePathDraw(frame, 30, arrowLen, 25);

  // Hit marker
  const hitDelay = 52;
  const hitF = Math.max(0, frame - hitDelay);
  const hitSp = spring({ frame: hitF, fps, config: SPRING_SNAP });
  const hitScale = interpolate(hitSp, [0, 1], [3, 1]);
  const hitOp = interpolate(hitSp, [0, 0.3], [0, 1], { extrapolateRight: 'clamp' });

  // Ripple from hit
  const rippleR = interpolate(frame, [hitDelay, hitDelay + 30], [0, 120], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const rippleOp = interpolate(frame, [hitDelay, hitDelay + 30], [0.3, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Cards
  const card1 = useSpringEntrance(frame, 56);
  const card2 = useSpringEntrance(frame, 64);

  const breathe = Math.sin(frame * 0.06) * 3;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s23.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="MODULE 3 · AGENT RUNTIME" y={160} />
        </g>

        <text x={60} y={310} opacity={w1.opacity}
          transform={`translate(0, ${w1.translateY})`}
          fontFamily={FONT} fontSize={96} fontWeight={800}
          fill={COLORS.white}>Defined</text>
        <text x={60} y={420} opacity={w2.opacity}
          transform={`translate(0, ${w2.translateY})`}
          fontFamily={FONT} fontSize={96} fontWeight={800}
          fill={COLORS.accent} fontStyle="italic">Goal</text>

        <g opacity={subEnt.opacity} transform={`translate(0, ${subEnt.translateY})`}>
          <text x={60} y={490} fontFamily={FONT} fontSize={34} fontWeight={800}
            fill={COLORS.text_muted}>A purpose to move toward</text>
        </g>

        {/* Bullseye rings */}
        {rings.map((r, i) => {
          const ent = ringEnts[i];
          const isInner = i === rings.length - 1;
          return (
            <circle key={i} cx={CX} cy={CY} r={r}
              fill={isInner ? COLORS.accent : 'none'}
              fillOpacity={isInner ? 0.12 : 0}
              stroke={COLORS.accent}
              strokeWidth={isInner ? 3 : 1.5}
              opacity={ent.opacity * (isInner ? 1 : 0.3 + i * 0.15)} />
          );
        })}

        {/* Cross-hairs */}
        <line x1={CX - 220} y1={CY} x2={CX + 220} y2={CY}
          stroke={COLORS.accent} strokeWidth={1} opacity={0.15}
          strokeDasharray="8 6" />
        <line x1={CX} y1={CY - 220} x2={CX} y2={CY + 220}
          stroke={COLORS.accent} strokeWidth={1} opacity={0.15}
          strokeDasharray="8 6" />

        {/* Ring labels */}
        {['OUTER', 'MID', 'INNER', 'GOAL'].map((t, i) => {
          const ent = ringEnts[i];
          const r = rings[i];
          return (
            <text key={i} x={CX + r + 12} y={CY - 6} opacity={ent.opacity * 0.5}
              fontFamily={FONT} fontSize={16} fontWeight={800} fill={COLORS.text_muted}>{t}</text>
          );
        })}

        {/* Trajectory arrow */}
        <path d={`M ${CX - 280},${CY + 200} Q ${CX - 100},${CY + 60} ${CX},${CY}`}
          fill="none" stroke={COLORS.accent} strokeWidth={3}
          strokeDasharray={arrowLen} strokeDashoffset={arrowDash}
          strokeLinecap="round" markerEnd="url(#arrow)" />

        {/* Hit marker */}
        <g opacity={hitOp} transform={`translate(${CX}, ${CY}) scale(${hitScale})`}>
          <line x1={-16} y1={-16} x2={16} y2={16} stroke={COLORS.vibrant_red} strokeWidth={4} />
          <line x1={16} y1={-16} x2={-16} y2={16} stroke={COLORS.vibrant_red} strokeWidth={4} />
        </g>

        {/* Ripple */}
        <circle cx={CX} cy={CY} r={rippleR}
          fill="none" stroke={COLORS.accent} strokeWidth={2} opacity={rippleOp} />

        {/* GOAL label at center after hit */}
        <text x={CX} y={CY + 60} textAnchor="middle" opacity={hitOp * 0.9}
          fontFamily={FONT} fontSize={28} fontWeight={800}
          fill={COLORS.accent} letterSpacing="0.15em">TARGET HIT</text>

        {/* Cards */}
        <g opacity={card1.opacity} transform={`translate(0, ${card1.translateY})`}>
          <BentoCard x={60} y={1180} w={460} h={140} accent />
          <rect x={60} y={1180} width={6} height={140} rx={3} fill={COLORS.accent} />
          <text x={100} y={1236} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.accent}>DEFINED GOAL</text>
          <text x={100} y={1276} fontFamily={FONT} fontSize={24} fontWeight={800} fill={COLORS.text_muted}>Clear success criteria</text>
        </g>

        <g opacity={card2.opacity} transform={`translate(0, ${card2.translateY})`}>
          <BentoCard x={560} y={1180} w={460} h={140} />
          <rect x={560} y={1180} width={6} height={140} rx={3} fill={COLORS.white} />
          <text x={600} y={1236} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.white}>THE LOOP KNOWS</text>
          <text x={600} y={1276} fontFamily={FONT} fontSize={24} fontWeight={800} fill={COLORS.text_muted}>When to stop iterating</text>
        </g>

        {/* Bottom summary */}
        <g opacity={card2.opacity} transform={`translate(0, ${card2.translateY})`}>
          <BentoCard x={60} y={1360} w={960} h={100} />
          <text x={540} y={1423} textAnchor="middle"
            fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.white}>
            Purpose gives the loop <tspan fill={COLORS.accent} fontStyle="italic">direction</tspan>
          </text>
        </g>

        {/* Particles */}
        {Array.from({ length: 8 }, (_, i) => {
          const a = (i / 8) * Math.PI * 2 + frame * 0.012;
          const pr = 240 + Math.sin(frame * 0.02 + i) * 20;
          return <circle key={i} cx={CX + Math.cos(a) * pr} cy={CY + Math.sin(a) * pr}
            r={2} fill={COLORS.accent} opacity={0.05 * shimmer} />;
        })}

        <g transform={`translate(540, ${1580 + breathe})`}>
          <circle cx={0} cy={0} r={18} fill={COLORS.accent} opacity={0.03} />
          <circle cx={0} cy={0} r={18} fill="none" stroke={COLORS.accent} strokeWidth={1}
            opacity={0.08} transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} />
        </g>

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s23.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
