/**
 * Scene 21 — Is Fixed Sequence
 * "Is a fixed sequence of steps really an agent, or is it something else entirely?"
 * CSV: 74.480s → 79.850s | Duration: 161 frames (5.37s)
 *
 * Animation phases:
 *   Phase 1 (frames 0–22):  Label + headline spring in
 *   Phase 2 (frames 20–80): Two-column comparison: fixed sequence vs adaptive agent
 *   Phase 3 (frames 80–end): "or something else entirely?" insight card + micro-animations
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
import { DarkBackground, GlobalDefs, Caption, SectionLabel } from '../helpers/components';

const FONT = "'Galaxie Copernicus ExtraBold', Georgia, serif";
const SPRING_CONFIG = { damping: 18, stiffness: 180, mass: 0.8 };
const SPRING_SOFT   = { damping: 22, stiffness: 120, mass: 1.0 } as const;

function useSpringEntrance(frame: number, delay: number, fps = 30, cfg = SPRING_CONFIG) {
  const f = Math.max(0, frame - delay);
  const progress   = spring({ frame: f, fps, config: cfg });
  const opacity    = interpolate(f, [0, 12], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const translateY = interpolate(progress, [0, 1], [32, 0]);
  return { progress, opacity, translateY };
}

function usePathDraw(frame: number, start: number, len: number, dur = 18) {
  const p = interpolate(frame, [start, start + dur], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  return len * (1 - p);
}

const FIXED_PROPS = ['Step 1 → hardcoded', 'Step 2 → hardcoded', 'Step 3 → hardcoded'];
const AGENT_PROPS = ['Decides at runtime', 'Reacts to observations', 'Variable step count'];

export const Scene21_IsFixedSequence: React.FC = () => {
  const frame = useCurrentFrame();
  const fps   = 30;

  const labelEnter   = useSpringEntrance(frame, 0);
  const headEnter    = useSpringEntrance(frame, 5);
  const leftTitle    = useSpringEntrance(frame, 20);
  const fixedCards   = FIXED_PROPS.map((_, i) => useSpringEntrance(frame, 32 + i * 12));
  const rightTitle   = useSpringEntrance(frame, 32);
  const agentCards   = AGENT_PROPS.map((_, i) => useSpringEntrance(frame, 44 + i * 12));
  const vsEnter      = useSpringEntrance(frame, 52, fps, SPRING_SOFT);
  const insightCard  = useSpringEntrance(frame, 88);
  const connLen      = 100;
  const conn1Dash    = usePathDraw(frame, 32, connLen, 14);
  const conn2Dash    = usePathDraw(frame, 56, connLen, 14);
  const conn3Dash    = usePathDraw(frame, 80, connLen, 14);

  const breathe = Math.sin(frame * 0.05) * 4;
  const pulse   = 1 + Math.sin(frame * 0.08) * 0.015;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s21.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* Zone A */}
        <g transform={`translate(0, ${labelEnter.translateY})`} opacity={labelEnter.opacity}>
          <SectionLabel text="AGENTIC AI · TASK DECOMPOSITION · DEFINITION" y={140} />
        </g>

        {/* Zone B */}
        <g transform={`translate(0, ${headEnter.translateY})`} opacity={headEnter.opacity}>
          <text x={60} y={256}
            fontFamily={FONT} fontSize={64} fontWeight={800}
            fill={COLORS.white}>
            Fixed sequence of steps —
          </text>
          <text x={60} y={344}
            fontFamily={FONT} fontSize={60} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">
            is it really an agent?
          </text>
        </g>

        {/* Left column header — FIXED SEQUENCE */}
        <g opacity={leftTitle.opacity} transform={`translate(0, ${leftTitle.translateY})`}>
          <rect x={60} y={408} width={430} height={64} rx={14}
            fill="rgba(255,100,80,0.15)"
            stroke="rgba(255,100,80,0.5)" strokeWidth={2} />
          <text x={275} y={450} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800}
            fill="rgba(255,100,80,0.9)" letterSpacing="0.06em">
            FIXED SEQUENCE
          </text>
        </g>

        {FIXED_PROPS.map((item, i) => (
          <g key={item}
            opacity={fixedCards[i].opacity}
            transform={`translate(0, ${fixedCards[i].translateY})`}>
            <rect x={60} y={496 + i * 110} width={430} height={90} rx={16}
              fill={COLORS.bg_secondary}
              stroke="rgba(255,100,80,0.3)" strokeWidth={1.5} />
            <text x={275} y={550 + i * 110} textAnchor="middle"
              fontFamily={FONT} fontSize={32} fontWeight={800}
              fill={COLORS.text_muted}>
              {item}
            </text>
          </g>
        ))}

        {/* VS divider */}
        <g transform={`translate(540, ${620 + breathe})`}
          opacity={vsEnter.opacity}>
          <circle cx={0} cy={0} r={46}
            fill={COLORS.bg_secondary}
            stroke={COLORS.accent} strokeWidth={2} />
          <text x={0} y={16} textAnchor="middle"
            fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.accent}>
            VS
          </text>
        </g>

        {/* Right column header — TRUE AGENT */}
        <g opacity={rightTitle.opacity} transform={`translate(0, ${rightTitle.translateY})`}>
          <rect x={590} y={408} width={430} height={64} rx={14}
            fill={COLORS.accent} fillOpacity={0.15}
            stroke={COLORS.accent} strokeWidth={2} />
          <text x={805} y={450} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.06em">
            TRUE AGENT
          </text>
        </g>

        {AGENT_PROPS.map((item, i) => (
          <g key={item}
            opacity={agentCards[i].opacity}
            transform={`translate(0, ${agentCards[i].translateY})`}>
            <rect x={590} y={496 + i * 110} width={430} height={90} rx={16}
              fill={COLORS.bg_secondary}
              stroke={COLORS.accent} strokeWidth={1.5} />
            <rect x={590} y={496 + i * 110} width={6} height={90} rx={3}
              fill={COLORS.accent} />
            <text x={805} y={550 + i * 110} textAnchor="middle"
              fontFamily={FONT} fontSize={32} fontWeight={800}
              fill={COLORS.white}>
              {item}
            </text>
          </g>
        ))}

        {/* Insight card */}
        <g opacity={insightCard.opacity}
          transform={`translate(0, ${insightCard.translateY + breathe})`}>
          <rect x={60} y={860} width={960} height={150} rx={20}
            fill={COLORS.bg_secondary}
            stroke={COLORS.accent} strokeWidth={2} />
          <rect x={60} y={860} width={6} height={150} rx={3} fill={COLORS.accent} />
          <text x={540} y={920} textAnchor="middle"
            fontFamily={FONT} fontSize={42} fontWeight={800}
            fill={COLORS.white}>
            Or is it something else entirely?
          </text>
          <text x={540} y={978} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">
            That distinction changes everything
          </text>
        </g>

        {/* Pulsing decorative element */}
        <g transform={`translate(540, 1100)`} opacity={insightCard.opacity * 0.6}>
          <circle cx={0} cy={0} r={50}
            fill="none" stroke={COLORS.accent} strokeWidth={2}
            transform={`scale(${pulse})`} />
          <circle cx={0} cy={0} r={30}
            fill={COLORS.accent} fillOpacity={0.1} />
          <text x={0} y={12} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent}>
            ?
          </text>
        </g>

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s21.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
