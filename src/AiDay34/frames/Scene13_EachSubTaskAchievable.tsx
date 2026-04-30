/**
 * Scene 13 — Each Sub-Task Achievable
 * "Each sub task is achievable in one step or a small number of steps."
 * CSV: 47.960s → 52.360s | Duration: 132 frames (4.40s)
 *
 * Animation phases:
 *   Phase 1 (frames 0–22):  Label + headline spring in
 *   Phase 2 (frames 20–80): Sub-task check cards stagger in
 *   Phase 3 (frames 78–end): Summary card + check mark reveals
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

const TASKS = [
  { label: 'Search for recent industry data',    steps: '1 step',  delay: 22 },
  { label: 'Read each source, extract stats',    steps: '1–2 steps', delay: 36 },
  { label: 'Identify trends, draft sections',    steps: '2–3 steps', delay: 50 },
  { label: 'Review and finalize',                steps: '1 step',  delay: 64 },
];

export const Scene13_EachSubTaskAchievable: React.FC = () => {
  const frame = useCurrentFrame();
  const fps   = 30;

  const labelEnter = useSpringEntrance(frame, 0);
  const headEnter  = useSpringEntrance(frame, 5);
  const taskEnters = TASKS.map(t => useSpringEntrance(frame, t.delay, fps));

  const checkLens = TASKS.map((_, i) => 28);
  const checkDashes = TASKS.map((_, i) => usePathDraw(frame, TASKS[i].delay + 14, 28, 16));

  const summaryCard = useSpringEntrance(frame, 82);

  const breathe = Math.sin(frame * 0.06) * 3;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s13.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* Zone A */}
        <g transform={`translate(0, ${labelEnter.translateY})`} opacity={labelEnter.opacity}>
          <SectionLabel text="AGENTIC AI · TASK DECOMPOSITION · ACHIEVABILITY" y={140} />
        </g>

        {/* Zone B */}
        <g transform={`translate(0, ${headEnter.translateY})`} opacity={headEnter.opacity}>
          <text x={60} y={264}
            fontFamily={FONT} fontSize={80} fontWeight={800}
            fill={COLORS.white}>
            Each Sub-Task
          </text>
          <text x={60} y={366}
            fontFamily={FONT} fontSize={68} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">
            is Achievable
          </text>
        </g>

        {/* Task check cards */}
        {TASKS.map((task, i) => {
          const cardY = 430 + i * 175;
          return (
            <g key={task.label}
              opacity={taskEnters[i].opacity}
              transform={`translate(0, ${taskEnters[i].translateY})`}>
              <BentoCard x={60} y={cardY} w={960} h={145} accent={i === 0} />
              <rect x={60}  y={cardY} width={6} height={145} rx={3} fill={COLORS.accent} />

              {/* Check circle */}
              <circle cx={138} cy={cardY + 72} r={26}
                fill={COLORS.accent} fillOpacity={0.15}
                stroke={COLORS.accent} strokeWidth={2} />
              {/* Animated check mark path */}
              <path d={`M 125,${cardY + 72} L 134,${cardY + 80} L 151,${cardY + 63}`}
                fill="none" stroke={COLORS.accent} strokeWidth={3} strokeLinecap="round"
                strokeDasharray={checkLens[i]} strokeDashoffset={checkDashes[i]} />

              <text x={186} y={cardY + 58}
                fontFamily={FONT} fontSize={36} fontWeight={800}
                fill={COLORS.white}>
                {task.label}
              </text>
              <text x={186} y={cardY + 102}
                fontFamily={FONT} fontSize={30} fontWeight={800}
                fill={COLORS.accent} fontStyle="italic">
                {task.steps}
              </text>
            </g>
          );
        })}

        {/* Summary card */}
        <g opacity={summaryCard.opacity} transform={`translate(0, ${summaryCard.translateY + breathe})`}>
          <BentoCard x={60} y={1160} w={960} h={130} />
          <rect x={60} y={1160} width={6} height={130} rx={3} fill={COLORS.accent} />
          <text x={540} y={1230} textAnchor="middle"
            fontFamily={FONT} fontSize={44} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">
            manageable
          </text>
          <text x={540} y={1272} textAnchor="middle"
            fontFamily={FONT} fontSize={30} fontWeight={800}
            fill={COLORS.text_muted}>
            within one step or a small number of steps
          </text>
        </g>

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s13.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
