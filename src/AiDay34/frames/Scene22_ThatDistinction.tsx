/**
 * Scene 22 — That Distinction
 * "That distinction is exactly what we explore next."
 * CSV: 79.850s → 82.280s | Duration: 73 frames (2.43s)
 *
 * Animation phases:
 *   Phase 1 (frames 0–20):  Label + closing headline spring in
 *   Phase 2 (frames 18–56): "DAY 35" forward arrow card builds
 *   Phase 3 (frames 54–end): Floating teaser card + breathe micro-animation
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

export const Scene22_ThatDistinction: React.FC = () => {
  const frame = useCurrentFrame();
  const fps   = 30;

  const labelEnter = useSpringEntrance(frame, 0);
  const headEnter  = useSpringEntrance(frame, 5);
  const badgeEnter = useSpringEntrance(frame, 18, fps, SPRING_SOFT);
  const arrowLen   = 120; const arrowDash = usePathDraw(frame, 28, arrowLen, 16);
  const dayCard    = useSpringEntrance(frame, 36);
  const topicCard  = useSpringEntrance(frame, 48);
  const teaser     = useSpringEntrance(frame, 58);

  const breathe = Math.sin(frame * 0.06) * 5;
  const pulse   = 1 + Math.sin(frame * 0.09) * 0.018;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s22.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* Zone A */}
        <g transform={`translate(0, ${labelEnter.translateY})`} opacity={labelEnter.opacity}>
          <SectionLabel text="AGENTIC AI · TASK DECOMPOSITION · NEXT STOP" y={140} />
        </g>

        {/* Zone B */}
        <g transform={`translate(0, ${headEnter.translateY})`} opacity={headEnter.opacity}>
          <text x={60} y={264}
            fontFamily={FONT} fontSize={72} fontWeight={800}
            fill={COLORS.white}>
            That distinction
          </text>
          <text x={60} y={368}
            fontFamily={FONT} fontSize={60} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">
            we explore next
          </text>
        </g>

        {/* "What is covered today" recap */}
        <g opacity={badgeEnter.opacity} transform={`translate(0, ${badgeEnter.translateY})`}>
          <rect x={60} y={430} width={960} height={130} rx={20}
            fill={COLORS.bg_secondary}
            stroke={COLORS.accent} strokeWidth={2} />
          <rect x={60} y={430} width={6} height={130} rx={3} fill={COLORS.accent} />
          <text x={540} y={488} textAnchor="middle"
            fontFamily={FONT} fontSize={42} fontWeight={800}
            fill={COLORS.white}>
            Today: Task Decomposition
          </text>
          <text x={540} y={538} textAnchor="middle"
            fontFamily={FONT} fontSize={34} fontWeight={800}
            fill={COLORS.text_muted}>
            Breaking goals into achievable sub-tasks
          </text>
        </g>

        {/* Arrow pointing forward */}
        <g>
          <line x1={540} y1={600} x2={540} y2={690}
            stroke={COLORS.accent} strokeWidth={3} strokeLinecap="round"
            strokeDasharray={arrowLen} strokeDashoffset={arrowDash} />
          <polygon points="540,720 514,680 566,680"
            fill={COLORS.accent}
            opacity={interpolate(frame, [40, 50], [0, 1], { extrapolateRight: 'clamp' })} />
        </g>

        {/* DAY 35 forward card */}
        <g opacity={dayCard.opacity} transform={`translate(0, ${dayCard.translateY})`}>
          <rect x={60} y={740} width={960} height={80} rx={16}
            fill={COLORS.accent} fillOpacity={0.15}
            stroke={COLORS.accent} strokeWidth={2} />
          <text x={540} y={793} textAnchor="middle"
            fontFamily={FONT} fontSize={48} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.08em">
            DAY 35
          </text>
        </g>

        {/* Topic card */}
        <g opacity={topicCard.opacity} transform={`translate(0, ${topicCard.translateY})`}>
          <rect x={60} y={840} width={960} height={100} rx={20}
            fill={COLORS.bg_secondary}
            stroke={COLORS.accent} strokeWidth={1.5} />
          <text x={540} y={898} textAnchor="middle"
            fontFamily={FONT} fontSize={52} fontWeight={800}
            fill={COLORS.white}>
            Agent vs. Pipeline
          </text>
        </g>

        {/* Teaser insight */}
        <g opacity={teaser.opacity}
          transform={`translate(0, ${teaser.translateY + breathe})`}>
          <rect x={60} y={970} width={960} height={150} rx={20}
            fill={COLORS.bg_secondary}
            stroke={COLORS.accent} strokeWidth={2} />
          <rect x={60} y={970} width={6} height={150} rx={3} fill={COLORS.accent} />
          <text x={540} y={1030} textAnchor="middle"
            fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.white}>
            Both decompose tasks into steps.
          </text>
          <text x={540} y={1080} textAnchor="middle"
            fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">
            Only one responds to what it finds.
          </text>
        </g>

        {/* Pulsing forward circle decoration */}
        <g transform={`translate(540, 1220)`} opacity={teaser.opacity * 0.5}>
          <circle cx={0} cy={0} r={54}
            fill="none" stroke={COLORS.accent} strokeWidth={2}
            transform={`scale(${pulse})`} />
          <text x={0} y={14} textAnchor="middle"
            fontFamily={FONT} fontSize={40} fontWeight={800}
            fill={COLORS.accent}>
            ›
          </text>
        </g>

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s22.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
