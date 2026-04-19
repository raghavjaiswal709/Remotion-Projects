/**
 * Scene 19 — SystemLayers
 * "The planner, the halt condition, the evaluator,"
 * CSV: 59.800s → 62.640s
 * Duration: ~94 frames
 *
 * Theme: Dark (#0D0D0D) + grid + AI accent (#76ABAE)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–25):   Label + headline spring
 *   Phase 2 (frames 18–70):  Three system layer cards stacking vertically
 *   Phase 3 (frames 60+):    Connector path-draws, glow pulses
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

export const Scene19_SystemLayers: React.FC = () => {
  const frame = useCurrentFrame();
  const fps   = 30;

  // ── Phase 1 ────────────────────────────────────────────────────────────────
  const labelE  = useSpringEntrance(frame, 0);
  const headA   = useSpringEntrance(frame, 5);
  const headB   = useSpringEntrance(frame, 10);

  // ── Phase 2 — Three system layer cards ─────────────────────────────────────
  const plannerCard    = useSpringEntrance(frame, 18);
  const haltCard       = useSpringEntrance(frame, 30);
  const evaluatorCard  = useSpringEntrance(frame, 42);
  const summaryCard    = useSpringEntrance(frame, 56);

  // Connector lines between layer cards
  const conn1Len = 120;
  const conn1Dash = usePathDraw(frame, 34, conn1Len, 16);
  const conn2Len = 120;
  const conn2Dash = usePathDraw(frame, 48, conn2Len, 16);

  // Border draw on each card
  const plannerPerim = 2 * (960 + 200);
  const plannerBorderDash = usePathDraw(frame, 20, plannerPerim, 22);
  const haltPerim = 2 * (960 + 200);
  const haltBorderDash = usePathDraw(frame, 32, haltPerim, 22);
  const evalPerim = 2 * (960 + 200);
  const evalBorderDash = usePathDraw(frame, 44, evalPerim, 22);

  // ── Phase 3 ────────────────────────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse   = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  // Layer items data
  const layers = [
    {
      title: 'PLANNER',
      desc: 'Breaks task into sub-steps',
      icon: 'P',
      card: plannerCard,
      y: 480,
      borderDash: plannerBorderDash,
      perim: plannerPerim,
    },
    {
      title: 'HALT CONDITION',
      desc: 'Determines when to stop',
      icon: 'H',
      card: haltCard,
      y: 740,
      borderDash: haltBorderDash,
      perim: haltPerim,
    },
    {
      title: 'EVALUATOR',
      desc: 'Checks success criterion',
      icon: 'E',
      card: evaluatorCard,
      y: 1000,
      borderDash: evalBorderDash,
      perim: evalPerim,
    },
  ];

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s19.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelE.translateY})`} opacity={labelE.opacity}>
          <SectionLabel text="AGENTIC SYSTEM · COMPONENTS" y={160} opacity={0.8} />
        </g>

        {/* ── ZONE B ────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${headA.translateY})`} opacity={headA.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={72} fontWeight={800} fill={COLORS.white}>
            System Layers
          </text>
        </g>
        <g transform={`translate(0, ${headB.translateY})`} opacity={headB.opacity}>
          <text x={60} y={380} fontFamily={FONT} fontSize={42} fontWeight={800} fill={COLORS.accent}
            fontStyle="italic">
            Every layer depends on the task
          </text>
        </g>

        {/* ── Three layer cards ──────────────────────────────────────────── */}
        {layers.map((layer, i) => (
          <g key={i} opacity={layer.card.opacity} transform={`translate(0, ${layer.card.translateY})`}>
            {/* Card fill */}
            <BentoCard x={60} y={layer.y} w={960} h={200} />

            {/* Animated border draw */}
            <rect x={60} y={layer.y} width={960} height={200} rx={20}
              fill="none" stroke={COLORS.accent} strokeWidth={2}
              strokeDasharray={layer.perim} strokeDashoffset={layer.borderDash} />

            {/* Left icon circle */}
            <circle cx={150} cy={layer.y + 100} r={40}
              fill={COLORS.accent} fillOpacity={0.12}
              stroke={COLORS.accent} strokeWidth={2} />
            <text x={150} y={layer.y + 112} textAnchor="middle"
              fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent}>
              {layer.icon}
            </text>

            {/* Title */}
            <text x={220} y={layer.y + 80}
              fontFamily={FONT} fontSize={38} fontWeight={800}
              fill={COLORS.white} letterSpacing="0.05em">
              {layer.title}
            </text>

            {/* Description */}
            <text x={220} y={layer.y + 125}
              fontFamily={FONT} fontSize={28} fontWeight={800}
              fill={COLORS.text_muted}>
              {layer.desc}
            </text>

            {/* Right arrow icon → pointing down to next */}
            {i < 2 && (
              <g transform={`translate(960, ${layer.y + 100})`}>
                <path d="M 0,-12 L 0,12 M -8,4 L 0,12 L 8,4"
                  fill="none" stroke={COLORS.accent} strokeWidth={2}
                  strokeLinecap="round" strokeLinejoin="round" opacity={0.5} />
              </g>
            )}

            {/* Layer number badge */}
            <g transform={`translate(940, ${layer.y + 36})`}>
              <rect x={-20} y={-14} width={40} height={28} rx={14}
                fill={COLORS.accent} fillOpacity={0.15} />
              <text x={0} y={6} textAnchor="middle"
                fontFamily={FONT} fontSize={18} fontWeight={800} fill={COLORS.accent}>
                L{i + 1}
              </text>
            </g>
          </g>
        ))}

        {/* ── Connector lines between cards ──────────────────────────────── */}
        <line x1={540} y1={680} x2={540} y2={740}
          stroke={COLORS.accent} strokeWidth={2.5}
          strokeDasharray={conn1Len} strokeDashoffset={conn1Dash}
          strokeLinecap="round" markerEnd="url(#arrow)" />

        <line x1={540} y1={940} x2={540} y2={1000}
          stroke={COLORS.accent} strokeWidth={2.5}
          strokeDasharray={conn2Len} strokeDashoffset={conn2Dash}
          strokeLinecap="round" markerEnd="url(#arrow)" />

        {/* ── Summary / insight card ─────────────────────────────────────── */}
        <g opacity={summaryCard.opacity} transform={`translate(0, ${summaryCard.translateY})`}>
          <BentoCard x={60} y={1260} w={960} h={280} accent />
          <rect x={60} y={1260} width={6} height={280} rx={3} fill={COLORS.accent} />

          {/* Gear/cog icon */}
          <g transform={`translate(160, 1400) scale(${pulse})`}
            style={{ transformOrigin: '0px 0px' }}>
            {/* Outer gear */}
            <circle cx={0} cy={0} r={36} fill="none"
              stroke={COLORS.accent} strokeWidth={2} />
            {/* Teeth */}
            {[0, 1, 2, 3, 4, 5, 6, 7].map(i => {
              const a = (i * 45 * Math.PI) / 180;
              const x1v = Math.cos(a) * 30;
              const y1v = Math.sin(a) * 30;
              const x2v = Math.cos(a) * 44;
              const y2v = Math.sin(a) * 44;
              return (
                <line key={i} x1={x1v} y1={y1v} x2={x2v} y2={y2v}
                  stroke={COLORS.accent} strokeWidth={6}
                  strokeLinecap="round" />
              );
            })}
            {/* Inner circle */}
            <circle cx={0} cy={0} r={14} fill={COLORS.accent} fillOpacity={0.2}
              stroke={COLORS.accent} strokeWidth={2} />
          </g>

          <text x={230} y={1340} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            All three layers read from
          </text>
          <text x={230} y={1384} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent}
            fontStyle="italic">
            the task definition
          </text>
          <text x={230} y={1430} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            Planner plans toward the end state
          </text>
          <text x={230} y={1465} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            Halt checks against the criterion
          </text>
          <text x={230} y={1500} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            Evaluator scores against success measure
          </text>
        </g>

        {/* ── Floating particles ──────────────────────────────────────────── */}
        <g opacity={shimmer * 0.2}>
          <circle cx={180} cy={1600 + breathe} r={3} fill={COLORS.accent} />
          <circle cx={880} cy={1660 + breathe * 0.8} r={2} fill={COLORS.accent} />
          <circle cx={540} cy={1720 + breathe * 1.1} r={2.5} fill={COLORS.accent} opacity={0.4} />
        </g>

        {/* ── CAPTION ────────────────────────────────────────────────────── */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s19.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
