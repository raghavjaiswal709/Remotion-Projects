/**
 * Scene 21 — Every Action Every Step
 * "And every action the agent takes, every step, every decision"
 * CSV: 78.667s → 82.833s | Duration: 125 frames
 *
 * Animation phases:
 *   Phase 1 (0–25): Label + headline
 *   Phase 2 (20–90): Chain links, action/step/decision nodes
 *   Phase 3 (80–end): Micro
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

function usePathDraw(frame: number, startFrame: number, totalLength: number, dur = 30) {
  const progress = interpolate(frame, [startFrame, startFrame + dur], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  return totalLength * (1 - progress);
}

export const Scene21_EveryActionEveryStep: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  const label = useSpringEntrance(frame, 0);
  const headA = useSpringEntrance(frame, 5);
  const headB = useSpringEntrance(frame, 11);

  // Three concept nodes
  const node1 = useSpringEntrance(frame, 20);
  const node2 = useSpringEntrance(frame, 34);
  const node3 = useSpringEntrance(frame, 48);

  // Connectors
  const conn1Len = 140;
  const conn1Dash = usePathDraw(frame, 30, conn1Len, 20);
  const conn2Len = 140;
  const conn2Dash = usePathDraw(frame, 44, conn2Len, 20);

  // Chain links in hero area
  const chain1 = useSpringEntrance(frame, 60);
  const chain2 = useSpringEntrance(frame, 68);
  const chain3 = useSpringEntrance(frame, 76);
  const chain4 = useSpringEntrance(frame, 84);

  // bottom card
  const summary = useSpringEntrance(frame, 90);

  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s21.from);

  // Chain link helper
  const chainY = (i: number) => 1120 + i * 100;

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* Zone A */}
        <g transform={`translate(0, ${label.translateY})`} opacity={label.opacity}>
          <SectionLabel text="AUTONOMY · TRACING" y={160} />
        </g>

        {/* Zone B */}
        <g transform={`translate(0, ${headA.translateY})`} opacity={headA.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={72} fontWeight={800}
            fill={COLORS.white}>Every Action</text>
        </g>
        <g transform={`translate(0, ${headB.translateY})`} opacity={headB.opacity}>
          <text x={60} y={400} fontFamily={FONT} fontSize={52} fontWeight={800}
            fill={COLORS.accent}>Every Step, Every Decision</text>
        </g>

        {/* Three concept nodes: ACTION → STEP → DECISION */}
        <g opacity={node1.opacity} transform={`translate(0, ${node1.translateY})`}>
          <BentoCard x={60} y={500} w={280} h={200} accent />
          {/* Gear icon */}
          <circle cx={200} cy={570} r={28} fill="none"
            stroke={COLORS.accent} strokeWidth={2.5} />
          <circle cx={200} cy={570} r={10} fill={COLORS.accent} fillOpacity={0.15} />
          {[0, 60, 120, 180, 240, 300].map(a => (
            <rect key={a} x={196} y={536} width={8} height={12} rx={2}
              fill={COLORS.accent}
              transform={`rotate(${a} 200 570)`} />
          ))}
          <text x={200} y={640} textAnchor="middle" fontFamily={FONT}
            fontSize={34} fontWeight={800} fill={COLORS.accent}>
            ACTION
          </text>
          <text x={200} y={680} textAnchor="middle" fontFamily={FONT}
            fontSize={22} fontWeight={800} fill={COLORS.text_muted}>
            What it does
          </text>
        </g>

        {/* connector 1 */}
        <line x1={340} y1={600} x2={400} y2={600}
          stroke={COLORS.accent} strokeWidth={3}
          strokeDasharray={conn1Len} strokeDashoffset={conn1Dash}
          markerEnd="url(#arrow)" />

        <g opacity={node2.opacity} transform={`translate(0, ${node2.translateY})`}>
          <BentoCard x={400} y={500} w={280} h={200} accent />
          {/* Footprints / steps */}
          <rect x={500} y={550} width={40} height={46} rx={6}
            fill="none" stroke={COLORS.accent} strokeWidth={2} />
          <rect x={520} y={556} width={40} height={46} rx={6}
            fill="none" stroke={COLORS.accent} strokeWidth={2} strokeDasharray="4 3" />
          <text x={540} y={640} textAnchor="middle" fontFamily={FONT}
            fontSize={34} fontWeight={800} fill={COLORS.accent}>
            STEP
          </text>
          <text x={540} y={680} textAnchor="middle" fontFamily={FONT}
            fontSize={22} fontWeight={800} fill={COLORS.text_muted}>
            Each unit of work
          </text>
        </g>

        {/* connector 2 */}
        <line x1={680} y1={600} x2={740} y2={600}
          stroke={COLORS.accent} strokeWidth={3}
          strokeDasharray={conn2Len} strokeDashoffset={conn2Dash}
          markerEnd="url(#arrow)" />

        <g opacity={node3.opacity} transform={`translate(0, ${node3.translateY})`}>
          <BentoCard x={740} y={500} w={280} h={200} accent />
          {/* Diamond decision icon */}
          <polygon points="880,550 920,580 880,610 840,580"
            fill="none" stroke={COLORS.accent} strokeWidth={2.5} />
          <text x={880} y={586} textAnchor="middle" fontFamily={FONT}
            fontSize={16} fontWeight={800} fill={COLORS.accent}>?</text>
          <text x={880} y={640} textAnchor="middle" fontFamily={FONT}
            fontSize={34} fontWeight={800} fill={COLORS.accent}>
            DECISION
          </text>
          <text x={880} y={680} textAnchor="middle" fontFamily={FONT}
            fontSize={22} fontWeight={800} fill={COLORS.text_muted}>
            Choice made
          </text>
        </g>

        {/* Big center arrow pointing down */}
        <g opacity={chain1.opacity}>
          <line x1={540} y1={730} x2={540} y2={800}
            stroke={COLORS.accent} strokeWidth={3} markerEnd="url(#arrow)" />
          <text x={540} y={840} textAnchor="middle" fontFamily={FONT}
            fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            All form a chain
          </text>
        </g>

        {/* Chain visualization — oval links */}
        <g opacity={chain1.opacity} transform={`translate(0, ${chain1.translateY})`}>
          <BentoCard x={160} y={880} w={760} h={460} />
          {/* Chain links */}
          {[0, 1, 2, 3].map(i => {
            const cx = 300 + i * 140;
            const cy = 1080;
            const springs = [chain1, chain2, chain3, chain4];
            const sp = springs[i];
            return (
              <g key={i} opacity={sp.opacity} transform={`translate(0, ${sp.translateY})`}>
                <ellipse cx={cx} cy={cy} rx={50} ry={30}
                  fill="none" stroke={COLORS.accent}
                  strokeWidth={3} transform={`rotate(${i % 2 === 0 ? 0 : 90} ${cx} ${cy})`} />
                <text x={cx} y={cy + 5} textAnchor="middle" fontFamily={FONT}
                  fontSize={18} fontWeight={800} fill={COLORS.white}>
                  {['ACT', 'STEP', 'DECIDE', 'ACT'][i]}
                </text>
              </g>
            );
          })}

          <text x={540} y={1180} textAnchor="middle" fontFamily={FONT}
            fontSize={28} fontWeight={800} fill={COLORS.accent}>
            Linked sequence of recorded behavior
          </text>

          {/* Decorative dots */}
          {[0, 1, 2].map(i => (
            <circle key={i} cx={300 + i * 200} cy={1240}
              r={3 + Math.sin(frame * 0.1 + i) * 1}
              fill={COLORS.accent} fillOpacity={0.15 * shimmer} />
          ))}
        </g>

        {/* Summary card */}
        <g opacity={summary.opacity} transform={`translate(0, ${summary.translateY})`}>
          <BentoCard x={60} y={1380} w={960} h={120} accent />
          <text x={540} y={1450} textAnchor="middle" fontFamily={FONT}
            fontSize={32} fontWeight={800} fill={COLORS.white}>
            Every interaction is{' '}
            <tspan fill={COLORS.accent} fontStyle="italic">traced</tspan>
          </text>
        </g>

        {/* Micro float */}
        <g transform={`translate(540, ${1580 + breathe})`}>
          <circle cx={0} cy={0} r={18} fill={COLORS.accent}
            fillOpacity={0.03 * shimmer} />
          <circle cx={0} cy={0} r={18} fill="none" stroke={COLORS.accent}
            strokeWidth={1} transform={`scale(${pulse})`}
            style={{ transformOrigin: '0px 0px' }} opacity={0.1} />
        </g>

        {caption && (
          <Caption text={caption.text} keyWords={caption.keyWords}
            frame={frame} sceneFrom={0} sceneDuration={SCENE_TIMING.s21.duration} />
        )}
      </svg>
    </AbsoluteFill>
  );
};
