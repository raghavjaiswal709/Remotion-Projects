/**
 * Scene 27 — Observation In, Action Out
 * "Each step has an observation coming in and an action going out."
 * CSV: 69.900s → 74.300s
 * Duration: 132 frames (4.4s)
 *
 * Animation phases:
 *   Phase 1 (0–20): Label + headline
 *   Phase 2 (15–90): Step structure diagram
 *   Phase 3 (80–end): Micro-animations
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

function usePathDraw(frame: number, start: number, len: number, dur = 25) {
  const p = interpolate(frame, [start, start + dur], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  return len * (1 - p);
}

export const Scene27_ObsInActionOut: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const lbl = useSpringEntrance(frame, 0);
  const h1 = useSpringEntrance(frame, 4);

  // Step box
  const stepBox = useSpringEntrance(frame, 14);
  const stepBorderLen = 2 * (500 + 400);
  const stepBorderDash = usePathDraw(frame, 16, stepBorderLen, 30);

  // Input arrow + label
  const inArrowE = useSpringEntrance(frame, 22);
  const inArrowLen = 200;
  const inArrowDash = usePathDraw(frame, 24, inArrowLen, 15);

  // Output arrow + label
  const outArrowE = useSpringEntrance(frame, 35);
  const outArrowLen = 200;
  const outArrowDash = usePathDraw(frame, 37, outArrowLen, 15);

  // Interior elements
  const stateCard = useSpringEntrance(frame, 30);
  const agentCard = useSpringEntrance(frame, 40);
  const internalArrow1Len = 80;
  const internalArrow1Dash = usePathDraw(frame, 44, internalArrow1Len, 12);

  // Example cards
  const exCards = [0, 1, 2].map(i => useSpringEntrance(frame, 55 + i * 10));

  const summaryE = useSpringEntrance(frame, 85);

  const breathe = Math.sin(frame * 0.06) * 3;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.012;
  const flowDot = interpolate(frame % 40, [0, 40], [0, 1], { extrapolateRight: 'clamp' });

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s27.from);

  // Center positions
  const BOX_X = 290, BOX_Y = 520, BOX_W = 500, BOX_H = 400;

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        <g transform={`translate(0, ${lbl.translateY})`} opacity={lbl.opacity}>
          <SectionLabel text="STEP · STRUCTURE" y={160} opacity={0.8} />
        </g>

        <g transform={`translate(0, ${h1.translateY})`} opacity={h1.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={56} fontWeight={800} fill={COLORS.white}>
            Each step has an
          </text>
          <text x={60} y={380} fontFamily={FONT} fontSize={56} fontWeight={800} fill={COLORS.white}>
            <tspan fill={COLORS.accent} fontStyle="italic">observation</tspan> in, an{' '}
            <tspan fill={COLORS.accent} fontStyle="italic">action</tspan> out
          </text>
        </g>

        {/* Main step box */}
        <g opacity={stepBox.opacity} transform={`translate(0, ${stepBox.translateY})`}>
          <rect x={BOX_X} y={BOX_Y} width={BOX_W} height={BOX_H} rx={24}
            fill={COLORS.bg_secondary}
            stroke={COLORS.accent} strokeWidth={3}
            strokeDasharray={stepBorderLen} strokeDashoffset={stepBorderDash} />
          <text x={BOX_X + BOX_W / 2} y={BOX_Y + 50} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.12em">
            STEP
          </text>
        </g>

        {/* Input: Observation arrow (left side) */}
        <g opacity={inArrowE.opacity}>
          <line x1={90} y1={BOX_Y + BOX_H / 2} x2={BOX_X} y2={BOX_Y + BOX_H / 2}
            stroke={COLORS.accent} strokeWidth={3}
            strokeDasharray={inArrowLen} strokeDashoffset={inArrowDash}
            markerEnd="url(#arrow)" strokeLinecap="round" />
          {/* Flowing dot */}
          <circle cx={90 + (BOX_X - 90) * flowDot}
            cy={BOX_Y + BOX_H / 2} r={5}
            fill={COLORS.accent} opacity={0.7} />
          {/* Label */}
          <text x={90} y={BOX_Y + BOX_H / 2 - 30} textAnchor="start"
            fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.accent}>
            Observation
          </text>
          <text x={90} y={BOX_Y + BOX_H / 2 - 5} textAnchor="start"
            fontFamily={FONT} fontSize={22} fontWeight={800} fill={COLORS.text_muted}>
            (oₜ)
          </text>
        </g>

        {/* Output: Action arrow (right side) */}
        <g opacity={outArrowE.opacity}>
          <line x1={BOX_X + BOX_W} y1={BOX_Y + BOX_H / 2}
            x2={BOX_X + BOX_W + 200} y2={BOX_Y + BOX_H / 2}
            stroke={COLORS.accent} strokeWidth={3}
            strokeDasharray={outArrowLen} strokeDashoffset={outArrowDash}
            markerEnd="url(#arrow)" strokeLinecap="round" />
          <circle cx={BOX_X + BOX_W + 200 * flowDot}
            cy={BOX_Y + BOX_H / 2} r={5}
            fill={COLORS.accent} opacity={0.7} />
          <text x={BOX_X + BOX_W + 200} y={BOX_Y + BOX_H / 2 - 30} textAnchor="end"
            fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.accent}>
            Action
          </text>
          <text x={BOX_X + BOX_W + 200} y={BOX_Y + BOX_H / 2 - 5} textAnchor="end"
            fontFamily={FONT} fontSize={22} fontWeight={800} fill={COLORS.text_muted}>
            (aₜ)
          </text>
        </g>

        {/* Interior: state update + agent reasoning */}
        <g opacity={stateCard.opacity} transform={`translate(0, ${stateCard.translateY})`}>
          <rect x={BOX_X + 30} y={BOX_Y + 80} width={200} height={100} rx={14}
            fill={COLORS.bg_primary} stroke={COLORS.accent} strokeWidth={1.5} />
          <text x={BOX_X + 130} y={BOX_Y + 125} textAnchor="middle"
            fontFamily={FONT} fontSize={20} fontWeight={800} fill={COLORS.text_muted}>
            STATE UPDATE
          </text>
          <text x={BOX_X + 130} y={BOX_Y + 155} textAnchor="middle"
            fontFamily={FONT} fontSize={22} fontWeight={800} fill={COLORS.accent}>
            sₜ₋₁ → sₜ
          </text>
        </g>

        <g opacity={agentCard.opacity} transform={`translate(0, ${agentCard.translateY})`}>
          <rect x={BOX_X + 270} y={BOX_Y + 80} width={200} height={100} rx={14}
            fill={COLORS.bg_primary} stroke={COLORS.accent} strokeWidth={1.5} />
          {/* Robot head */}
          <rect x={BOX_X + 345} y={BOX_Y + 95} width={40} height={30} rx={6}
            fill="none" stroke={COLORS.accent} strokeWidth={1.5} />
          <circle cx={BOX_X + 358} cy={BOX_Y + 108} r={3} fill={COLORS.accent} />
          <circle cx={BOX_X + 372} cy={BOX_Y + 108} r={3} fill={COLORS.accent} />
          <text x={BOX_X + 370} y={BOX_Y + 155} textAnchor="middle"
            fontFamily={FONT} fontSize={18} fontWeight={800} fill={COLORS.text_muted}>
            AGENT DECIDES
          </text>
        </g>

        {/* Internal connector */}
        <line x1={BOX_X + 230} y1={BOX_Y + 130}
          x2={BOX_X + 270} y2={BOX_Y + 130}
          stroke={COLORS.accent} strokeWidth={2}
          strokeDasharray={internalArrow1Len}
          strokeDashoffset={internalArrow1Dash}
          markerEnd="url(#arrow)" strokeLinecap="round" />

        {/* Formula inside box bottom */}
        <g opacity={agentCard.opacity}>
          <text x={BOX_X + BOX_W / 2} y={BOX_Y + BOX_H - 50} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.accent}>
            step(oₜ) → aₜ
          </text>
        </g>

        {/* Examples row */}
        {[
          { obs: '"4 results"', act: 'read(doc_1)' },
          { obs: '"full text"', act: 'summarize()' },
          { obs: '"error: null"', act: 'retry(query)' },
        ].map((ex, i) => {
          const e = exCards[i];
          const cy = 1010 + i * 160;
          return (
            <g key={i} opacity={e.opacity} transform={`translate(0, ${e.translateY})`}>
              <BentoCard x={60} y={cy} w={960} h={130} accent={i === 0} />
              <text x={100} y={cy + 40}
                fontFamily={FONT} fontSize={18} fontWeight={800}
                fill={COLORS.accent} letterSpacing="0.08em">
                EXAMPLE {i + 1}
              </text>
              <text x={100} y={cy + 80}
                fontFamily={FONT} fontSize={24} fontWeight={800} fill={COLORS.text_muted}>
                IN: <tspan fill={COLORS.white}>{ex.obs}</tspan>
              </text>
              <text x={100} y={cy + 110}
                fontFamily={FONT} fontSize={24} fontWeight={800} fill={COLORS.text_muted}>
                OUT: <tspan fill={COLORS.accent}>{ex.act}</tspan>
              </text>
            </g>
          );
        })}

        {/* Summary */}
        <g opacity={summaryE.opacity} transform={`translate(0, ${summaryE.translateY})`}>
          <BentoCard x={60} y={1510} w={960} h={100} accent />
          <text x={540} y={1574} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.white}>
            The <tspan fill={COLORS.accent} fontStyle="italic">step</tspan> is the atomic unit of a trajectory
          </text>
        </g>

        {[200, 540, 880].map((x, i) => (
          <circle key={i} cx={x} cy={1700 + breathe} r={4}
            fill={COLORS.accent} opacity={0.06}
            transform={`scale(${pulse})`} style={{ transformOrigin: `${x}px 1700px` }} />
        ))}

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s27.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
