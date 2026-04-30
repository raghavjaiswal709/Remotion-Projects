/**
 * Scene 17 — Which Sub-Tasks Depend on Each Other
 * "and which sub tasks depend on each other's output."
 * CSV: 62.280s → 65.680s | Duration: 102 frames (3.40s)
 *
 * Animation phases:
 *   Phase 1 (frames 0–20):  Label + headline spring in
 *   Phase 2 (frames 18–72): Dependency graph — nodes stagger in + connection arrows
 *   Phase 3 (frames 70–end): Summary card with key insight
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

function usePathDraw(frame: number, start: number, len: number, dur = 16) {
  const p = interpolate(frame, [start, start + dur], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  return len * (1 - p);
}

const NODES = [
  { id: '1', label: 'Search', x: 200, y: 560, delay: 18 },
  { id: '2', label: 'Read',   x: 200, y: 740, delay: 30 },
  { id: '3', label: 'Analyze', x: 540, y: 740, delay: 44 },
  { id: '4', label: 'Finalize', x: 540, y: 920, delay: 60 },
];

export const Scene17_WhichDepend: React.FC = () => {
  const frame = useCurrentFrame();
  const fps   = 30;

  const labelEnter = useSpringEntrance(frame, 0);
  const headEnter  = useSpringEntrance(frame, 5);
  const nodeEnters = NODES.map(n => useSpringEntrance(frame, n.delay, fps));

  const arrow1Len = 100; const arrow1Dash = usePathDraw(frame, 26, arrow1Len);
  const arrow2Len = 200; const arrow2Dash = usePathDraw(frame, 38, arrow2Len);
  const arrow3Len = 200; const arrow3Dash = usePathDraw(frame, 38, arrow3Len);
  const arrow4Len = 100; const arrow4Dash = usePathDraw(frame, 54, arrow4Len);

  const summaryCard = useSpringEntrance(frame, 72);

  const breathe = Math.sin(frame * 0.07) * 3;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s17.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* Zone A */}
        <g transform={`translate(0, ${labelEnter.translateY})`} opacity={labelEnter.opacity}>
          <SectionLabel text="AGENTIC AI · TASK DECOMPOSITION · DEPENDENCIES" y={140} />
        </g>

        {/* Zone B */}
        <g transform={`translate(0, ${headEnter.translateY})`} opacity={headEnter.opacity}>
          <text x={60} y={264}
            fontFamily={FONT} fontSize={80} fontWeight={800}
            fill={COLORS.white}>
            Dependencies
          </text>
          <text x={60} y={360}
            fontFamily={FONT} fontSize={48} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">
            which outputs feed which inputs
          </text>
        </g>

        {/* Dependency arrows (before nodes so they appear behind) */}
        <line x1={200} y1={622} x2={200} y2={680}
          stroke={COLORS.accent} strokeWidth={2.5} markerEnd="url(#arrow)"
          strokeDasharray={arrow1Len} strokeDashoffset={arrow1Dash} />
        <line x1={260} y1={740} x2={480} y2={740}
          stroke={COLORS.accent} strokeWidth={2.5} markerEnd="url(#arrow)"
          strokeDasharray={arrow2Len} strokeDashoffset={arrow2Dash} />
        <line x1={200} y1={800} x2={480} y2={880}
          stroke={COLORS.accent} strokeWidth={2.5} markerEnd="url(#arrow)"
          strokeDasharray={arrow3Len} strokeDashoffset={arrow3Dash} opacity={0.5} />
        <line x1={540} y1={800} x2={540} y2={862}
          stroke={COLORS.accent} strokeWidth={2.5} markerEnd="url(#arrow)"
          strokeDasharray={arrow4Len} strokeDashoffset={arrow4Dash} />

        {/* Nodes */}
        {NODES.map((node, i) => (
          <g key={node.id}
            opacity={nodeEnters[i].opacity}
            transform={`translate(0, ${nodeEnters[i].translateY})`}>
            <rect x={node.x - 130} y={node.y - 42} width={260} height={84} rx={16}
              fill={COLORS.bg_secondary}
              stroke={i < 2 ? COLORS.accent : 'rgba(255,255,255,0.1)'}
              strokeWidth={i < 2 ? 2.5 : 1} />
            <text x={node.x} y={node.y + 12} textAnchor="middle"
              fontFamily={FONT} fontSize={36} fontWeight={800}
              fill={i < 2 ? COLORS.accent : COLORS.white}>
              {node.label}
            </text>
            <text x={node.x} y={node.y - 52} textAnchor="middle"
              fontFamily={FONT} fontSize={22} fontWeight={800}
              fill={COLORS.text_muted}>
              Step {node.id}
            </text>
          </g>
        ))}

        {/* "DEPENDS ON" labels */}
        <g opacity={nodeEnters[1].opacity}>
          <text x={280} y={718}
            fontFamily={FONT} fontSize={22} fontWeight={800}
            fill={COLORS.text_muted} fontStyle="italic">
            needs output from
          </text>
        </g>
        <g opacity={nodeEnters[2].opacity}>
          <text x={560} y={718}
            fontFamily={FONT} fontSize={22} fontWeight={800}
            fill={COLORS.text_muted} fontStyle="italic">
            depends on
          </text>
        </g>

        {/* Summary card */}
        <g opacity={summaryCard.opacity}
          transform={`translate(0, ${summaryCard.translateY + breathe})`}>
          <BentoCard x={60} y={1050} w={960} h={140} />
          <rect x={60} y={1050} width={6} height={140} rx={3} fill={COLORS.accent} />
          <text x={540} y={1108} textAnchor="middle"
            fontFamily={FONT} fontSize={38} fontWeight={800}
            fill={COLORS.white}>
            Dependency order must be respected
          </text>
          <text x={540} y={1154} textAnchor="middle"
            fontFamily={FONT} fontSize={30} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">
            wrong order → wrong results
          </text>
        </g>

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s17.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
