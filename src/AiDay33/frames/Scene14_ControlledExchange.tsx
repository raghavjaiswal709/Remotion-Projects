/**
 * Scene 14 — Controlled Exchange
 * "Each one a small, controlled exchange between the agent and its environment."
 * CSV: 42.660s → 47.600s
 * Duration: 148 frames (4.9s)
 *
 * Theme: Dark (#0D0D0D) + grid + teal accent (#76ABAE)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–25): Label + headline
 *   Phase 2 (frames 20–90): Agent <-> Environment bidirectional exchange diagram
 *   Phase 3 (frames 80–end): Breathing, pulse on exchange arrows
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

export const Scene14_ControlledExchange: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const labelEnt = useSpringEntrance(frame, 0);
  const headA = useSpringEntrance(frame, 6);
  const headB = useSpringEntrance(frame, 12);

  // Agent and Environment boxes
  const agentCard = useSpringEntrance(frame, 20);
  const envCard = useSpringEntrance(frame, 28);

  // Bidirectional arrows
  const arrowDown = usePathDraw(frame, 40, 200, 25);
  const arrowUp = usePathDraw(frame, 50, 200, 25);

  // Labels on arrows
  const obsLabel = useSpringEntrance(frame, 55);
  const actLabel = useSpringEntrance(frame, 60);

  // "Controlled" badge
  const badge = useSpringEntrance(frame, 70);

  // Phase 3
  const breathe = Math.sin(frame * 0.06) * 3;
  const arrowPulse = interpolate(Math.sin(frame * 0.08), [-1, 1], [0.6, 1]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s14.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ZONE A */}
        <g transform={`translate(0, ${labelEnt.translateY})`} opacity={labelEnt.opacity}>
          <SectionLabel text="STEP · EXCHANGE" y={160} />
        </g>

        {/* ZONE B */}
        <g transform={`translate(0, ${headA.translateY})`} opacity={headA.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={72} fontWeight={800} fill={COLORS.white}>
            Controlled Exchange
          </text>
        </g>
        <g transform={`translate(0, ${headB.translateY})`} opacity={headB.opacity}>
          <text x={60} y={380} fontFamily={FONT} fontSize={44} fontWeight={800} fill={COLORS.text_muted}>
            Agent ↔ Environment
          </text>
        </g>

        {/* ZONE C — Agent box (top) */}
        <g opacity={agentCard.opacity} transform={`translate(0, ${agentCard.translateY})`}>
          <BentoCard x={200} y={480} w={680} h={280} accent />
          {/* Robot head */}
          <rect x={460} y={520} width={120} height={90} rx={16} fill="none" stroke={COLORS.accent} strokeWidth={3} />
          <circle cx={490} cy={560} r={12} fill={COLORS.accent} />
          <circle cx={550} cy={560} r={12} fill={COLORS.accent} />
          <rect x={505} y={585} width={30} height={5} rx={2} fill={COLORS.accent} opacity={0.6} />
          {/* Antenna */}
          <line x1={520} y1={520} x2={520} y2={498} stroke={COLORS.accent} strokeWidth={2} />
          <circle cx={520} cy={494} r={5} fill={COLORS.accent} />
          <text x={540} y={720} textAnchor="middle" fontFamily={FONT} fontSize={48} fontWeight={800} fill={COLORS.white}>
            AGENT
          </text>
        </g>

        {/* Bidirectional arrows */}
        {/* Down arrow (Action: agent → environment) */}
        <g opacity={arrowPulse}>
          <path d="M 440,760 L 440,900"
            fill="none" stroke={COLORS.accent} strokeWidth={3}
            strokeDasharray={200} strokeDashoffset={arrowDown}
            strokeLinecap="round" markerEnd="url(#arrow)"
          />
        </g>
        {/* Action label */}
        <g opacity={actLabel.opacity} transform={`translate(0, ${actLabel.translateY * 0.3})`}>
          <text x={400} y={840} textAnchor="end" fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.accent} fontStyle="italic">
            ACTION
          </text>
        </g>

        {/* Up arrow (Observation: environment → agent) */}
        <g opacity={arrowPulse}>
          <path d="M 640,900 L 640,760"
            fill="none" stroke={COLORS.text_muted} strokeWidth={3}
            strokeDasharray={200} strokeDashoffset={arrowUp}
            strokeLinecap="round" markerEnd="url(#arrow)"
          />
        </g>
        {/* Observation label */}
        <g opacity={obsLabel.opacity} transform={`translate(0, ${obsLabel.translateY * 0.3})`}>
          <text x={680} y={840} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            OBSERVATION
          </text>
        </g>

        {/* Environment box (bottom) */}
        <g opacity={envCard.opacity} transform={`translate(0, ${envCard.translateY})`}>
          <BentoCard x={200} y={900} w={680} h={240} />
          {/* Globe/world icon */}
          <circle cx={540} cy={990} r={50} fill="none" stroke={COLORS.text_muted} strokeWidth={2.5} />
          <ellipse cx={540} cy={990} rx={50} ry={20} fill="none" stroke={COLORS.text_muted} strokeWidth={1.5} />
          <ellipse cx={540} cy={990} rx={20} ry={50} fill="none" stroke={COLORS.text_muted} strokeWidth={1.5} />
          <text x={540} y={1100} textAnchor="middle" fontFamily={FONT} fontSize={44} fontWeight={800} fill={COLORS.text_muted}>
            ENVIRONMENT
          </text>
        </g>

        {/* "Controlled" badge */}
        <g opacity={badge.opacity} transform={`translate(0, ${badge.translateY})`}>
          <BentoCard x={60} y={1220} w={960} h={140} accent />
          <rect x={60} y={1220} width={6} height={140} rx={3} fill={COLORS.accent} />
          <text x={100} y={1305} fontFamily={FONT} fontSize={44} fontWeight={800} fill={COLORS.white}>
            Small. Controlled. <tspan fill={COLORS.accent} fontStyle="italic">Bounded.</tspan>
          </text>
        </g>

        {/* Floating dots */}
        <circle cx={160} cy={1500 + breathe} r={4} fill={COLORS.accent} opacity={0.15} />
        <circle cx={920} cy={1550 + breathe * 1.3} r={3} fill={COLORS.accent} opacity={0.12} />

        {/* Corner accents */}
        <path d="M 60,60 L 60,140 M 60,60 L 140,60" fill="none" stroke={COLORS.accent} strokeWidth={2.5} strokeLinecap="round" opacity={0.3} />
        <path d="M 1020,1740 L 1020,1660 M 1020,1740 L 940,1740" fill="none" stroke={COLORS.accent} strokeWidth={2.5} strokeLinecap="round" opacity={0.3} />

        {/* CAPTION */}
        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords} frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s14.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
