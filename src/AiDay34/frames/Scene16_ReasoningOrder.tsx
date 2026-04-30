/**
 * Scene 16 — Reasoning About Order
 * "Reasoning about what the goal requires, what order the sub tasks must follow,"
 * CSV: 57.480s → 62.280s | Duration: 144 frames (4.80s)
 *
 * Animation phases:
 *   Phase 1 (frames 0–22):  Label + headline spring in
 *   Phase 2 (frames 20–90): Three reasoning boxes stagger in with path-draw connectors
 *   Phase 3 (frames 88–end): Ordered chain visual + summary card
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

function useSpringEntrance(frame: number, delay: number, fps = 30) {
  const f = Math.max(0, frame - delay);
  const progress   = spring({ frame: f, fps, config: SPRING_CONFIG });
  const opacity    = interpolate(f, [0, 12], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const translateY = interpolate(progress, [0, 1], [32, 0]);
  return { progress, opacity, translateY };
}

function usePathDraw(frame: number, start: number, len: number, dur = 20) {
  const p = interpolate(frame, [start, start + dur], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  return len * (1 - p);
}

const REASONING = [
  {
    icon: '?',
    title: 'What does the goal require?',
    detail: 'Full market analysis with data, trends, draft',
    delay: 22,
  },
  {
    icon: '#',
    title: 'What order must steps follow?',
    detail: 'Search → Read → Analyze → Write → Review',
    delay: 40,
  },
  {
    icon: '→',
    title: 'Which outputs feed which inputs?',
    detail: 'Each step\'s output is the next step\'s input',
    delay: 58,
  },
];

export const Scene16_ReasoningOrder: React.FC = () => {
  const frame = useCurrentFrame();
  const fps   = 30;

  const labelEnter    = useSpringEntrance(frame, 0);
  const headEnter     = useSpringEntrance(frame, 5);
  const reasonEnters  = REASONING.map(r => useSpringEntrance(frame, r.delay, fps));

  const conn1Len = 64; const conn1Dash = usePathDraw(frame, 46, conn1Len);
  const conn2Len = 64; const conn2Dash = usePathDraw(frame, 64, conn2Len);

  const chainEnter  = useSpringEntrance(frame, 84);
  const summaryCard = useSpringEntrance(frame, 100);

  const breathe = Math.sin(frame * 0.05) * 3;
  const shimmer = interpolate(Math.sin(frame * 0.05), [-1, 1], [0.8, 1]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s16.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* Zone A */}
        <g transform={`translate(0, ${labelEnter.translateY})`} opacity={labelEnter.opacity}>
          <SectionLabel text="AGENTIC AI · TASK DECOMPOSITION · REASONING" y={140} />
        </g>

        {/* Zone B */}
        <g transform={`translate(0, ${headEnter.translateY})`} opacity={headEnter.opacity}>
          <text x={60} y={264}
            fontFamily={FONT} fontSize={80} fontWeight={800}
            fill={COLORS.white}>
            Reasoning
          </text>
          <text x={60} y={360}
            fontFamily={FONT} fontSize={52} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">
            what, what order, which depend
          </text>
        </g>

        {/* Reasoning boxes */}
        {REASONING.map((r, i) => (
          <g key={r.title}
            opacity={reasonEnters[i].opacity}
            transform={`translate(0, ${reasonEnters[i].translateY})`}>
            <BentoCard x={60} y={410 + i * 195} w={960} h={165} accent={i === 1} />
            <rect x={60} y={410 + i * 195} width={6} height={165} rx={3} fill={COLORS.accent} />

            {/* Icon circle */}
            <circle cx={128} cy={410 + i * 195 + 82} r={34}
              fill={COLORS.accent} fillOpacity={0.15}
              stroke={COLORS.accent} strokeWidth={2} />
            <text x={128} y={410 + i * 195 + 90} textAnchor="middle"
              fontFamily={FONT} fontSize={36} fontWeight={800}
              fill={COLORS.accent}>
              {r.icon}
            </text>

            <text x={186} y={410 + i * 195 + 64}
              fontFamily={FONT} fontSize={36} fontWeight={800}
              fill={COLORS.white}>
              {r.title}
            </text>
            <text x={186} y={410 + i * 195 + 108}
              fontFamily={FONT} fontSize={30} fontWeight={800}
              fill={COLORS.text_muted}>
              {r.detail}
            </text>
          </g>
        ))}

        {/* Vertical connectors */}
        <line x1={128} y1={577} x2={128} y2={609}
          stroke={COLORS.accent} strokeWidth={2} markerEnd="url(#arrow)"
          strokeDasharray={conn1Len} strokeDashoffset={conn1Dash} opacity={0.5} />
        <line x1={128} y1={772} x2={128} y2={804}
          stroke={COLORS.accent} strokeWidth={2} markerEnd="url(#arrow)"
          strokeDasharray={conn2Len} strokeDashoffset={conn2Dash} opacity={0.5} />

        {/* Chain visual */}
        <g opacity={chainEnter.opacity * shimmer}
          transform={`translate(0, ${breathe})`}>
          <BentoCard x={60} y={1205} w={960} h={100} />
          <rect x={60} y={1205} width={6} height={100} rx={3} fill={COLORS.accent} />
          <text x={540} y={1263} textAnchor="middle"
            fontFamily={FONT} fontSize={38} fontWeight={800}
            fill={COLORS.white} fontStyle="italic">
            Planning = reasoning about constraints
          </text>
        </g>

        {/* Summary card */}
        <g opacity={summaryCard.opacity} transform={`translate(0, ${summaryCard.translateY})`}>
          <BentoCard x={60} y={1360} w={960} h={100} />
          <text x={540} y={1418} textAnchor="middle"
            fontFamily={FONT} fontSize={34} fontWeight={800}
            fill={COLORS.text_muted}>
            This reasoning happens automatically at the start
          </text>
        </g>

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s16.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
