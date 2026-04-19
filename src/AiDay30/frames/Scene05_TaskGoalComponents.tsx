/**
 * Scene 05 — TaskGoalComponents
 * "A task is a goal with three required components."
 * CSV: 15.020s → 18.320s
 * Duration: ~88 frames
 *
 * Theme: Dark (#0D0D0D) + grid + AI accent (#76ABAE)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–25):   Label slide + headline with "three" emphasized
 *   Phase 2 (frames 20–90):  Three component cards staggered reveal + connector paths
 *   Phase 3 (frames 60–end): Counter tick-up, glow pulse on cards, particles
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

function useCounter(frame: number, startFrame: number, endValue: number, durationFrames = 45) {
  const raw = interpolate(frame, [startFrame, startFrame + durationFrames], [0, endValue], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  return Math.round(raw);
}

export const Scene05_TaskGoalComponents: React.FC = () => {
  const frame = useCurrentFrame();
  const fps   = 30;

  // ── Phase 1: Scene reveal ──────────────────────────────────────────────────
  const labelEntrance = useSpringEntrance(frame, 0);
  const headlineA     = useSpringEntrance(frame, 5);
  const headlineB     = useSpringEntrance(frame, 11);

  // ── Phase 2: Content build ─────────────────────────────────────────────────
  const heroNum   = useSpringEntrance(frame, 16);
  const comp1     = useSpringEntrance(frame, 24);
  const comp2     = useSpringEntrance(frame, 36);
  const comp3     = useSpringEntrance(frame, 48);
  const summCard  = useSpringEntrance(frame, 58);

  // Counter for hero "3"
  const counterVal = useCounter(frame, 18, 3, 25);

  // Connectors from "3" to each component
  const conn1Len = 200;
  const conn1Dash = usePathDraw(frame, 30, conn1Len, 20);
  const conn2Dash = usePathDraw(frame, 42, conn1Len, 20);
  const conn3Dash = usePathDraw(frame, 54, conn1Len, 20);

  // Border draw on component cards
  const PERIM = 2 * (960 + 160);
  const border1Dash = usePathDraw(frame, 26, PERIM, 30);
  const border2Dash = usePathDraw(frame, 38, PERIM, 30);
  const border3Dash = usePathDraw(frame, 50, PERIM, 30);

  // ── Phase 3: Micro-animations ──────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse   = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s05.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A — Section label ────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEntrance.translateY})`} opacity={labelEntrance.opacity}>
          <SectionLabel text="TASK · DEFINITION" y={160} opacity={0.8} />
        </g>

        {/* ── ZONE B — Headlines ────────────────────────────────────────── */}
        <g transform={`translate(0, ${headlineA.translateY})`} opacity={headlineA.opacity}>
          <text x={60} y={280} fontFamily={FONT} fontSize={80} fontWeight={800} fill={COLORS.white}>
            A Goal With
          </text>
        </g>
        <g transform={`translate(0, ${headlineB.translateY})`} opacity={headlineB.opacity}>
          <text x={60} y={380} fontFamily={FONT} fontSize={80} fontWeight={800} fill={COLORS.accent}>
            Three Components
          </text>
        </g>

        {/* ── Hero number "3" ───────────────────────────────────────────── */}
        <g opacity={heroNum.opacity} transform={`translate(540, ${510 + heroNum.translateY})`}>
          {/* Ghost number */}
          <text textAnchor="middle" fontFamily={FONT} fontSize={200} fontWeight={800}
            fill={COLORS.accent} opacity={0.08}>
            {counterVal}
          </text>
          {/* Main number */}
          <text textAnchor="middle" fontFamily={FONT} fontSize={160} fontWeight={800}
            fill={COLORS.accent}
            transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }}>
            {counterVal}
          </text>
          <text textAnchor="middle" y={60} fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.text_muted}>
            REQUIRED COMPONENTS
          </text>
        </g>

        {/* ── Connector lines from "3" to cards ─────────────────────────── */}
        <path d="M 420,560 L 300,680" fill="none" stroke={COLORS.accent} strokeWidth={2}
          strokeDasharray={conn1Len} strokeDashoffset={conn1Dash}
          markerEnd="url(#arrow)" strokeLinecap="round" />
        <path d="M 540,580 L 540,680" fill="none" stroke={COLORS.accent} strokeWidth={2}
          strokeDasharray={conn1Len} strokeDashoffset={conn2Dash}
          markerEnd="url(#arrow)" strokeLinecap="round" />
        <path d="M 660,560 L 780,680" fill="none" stroke={COLORS.accent} strokeWidth={2}
          strokeDasharray={conn1Len} strokeDashoffset={conn3Dash}
          markerEnd="url(#arrow)" strokeLinecap="round" />

        {/* ── Component 1: Start State ──────────────────────────────────── */}
        <g opacity={comp1.opacity} transform={`translate(0, ${comp1.translateY})`}>
          <BentoCard x={60} y={700} w={300} h={280} accent />
          {/* Number badge */}
          <circle cx={120} cy={750} r={22} fill={COLORS.accent} opacity={0.15} />
          <text x={120} y={758} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.accent}>
            1
          </text>
          {/* Icon: starting flag */}
          <rect x={170} y={780} width={4} height={60} rx={2} fill={COLORS.accent} />
          <path d="M 174,780 L 220,795 L 174,810" fill={COLORS.accent} opacity={0.6} />
          <text x={100} y={880} fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.white}>
            Start
          </text>
          <text x={100} y={920} fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.accent}>
            State
          </text>
          <text x={100} y={960} fontFamily={FONT} fontSize={24} fontWeight={800} fill={COLORS.text_muted}>
            Where you begin
          </text>
        </g>

        {/* ── Component 2: End State ────────────────────────────────────── */}
        <g opacity={comp2.opacity} transform={`translate(0, ${comp2.translateY})`}>
          <BentoCard x={390} y={700} w={300} h={280} accent />
          <circle cx={450} cy={750} r={22} fill={COLORS.accent} opacity={0.15} />
          <text x={450} y={758} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.accent}>
            2
          </text>
          {/* Icon: finish flag */}
          <rect x={500} y={780} width={4} height={60} rx={2} fill={COLORS.accent} />
          <path d="M 504,780 L 550,795 L 504,810" fill={COLORS.accent} opacity={0.9} />
          <rect x={504} y={780} width={46} height={30} rx={0}
            fill="none" stroke={COLORS.accent} strokeWidth={1.5} />
          <text x={430} y={880} fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.white}>
            End
          </text>
          <text x={430} y={920} fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.accent}>
            State
          </text>
          <text x={430} y={960} fontFamily={FONT} fontSize={24} fontWeight={800} fill={COLORS.text_muted}>
            Where you finish
          </text>
        </g>

        {/* ── Component 3: Success Criterion ────────────────────────────── */}
        <g opacity={comp3.opacity} transform={`translate(0, ${comp3.translateY})`}>
          <BentoCard x={720} y={700} w={300} h={280} accent />
          <circle cx={780} cy={750} r={22} fill={COLORS.accent} opacity={0.15} />
          <text x={780} y={758} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.accent}>
            3
          </text>
          {/* Icon: checkmark in circle */}
          <circle cx={840} cy={810} r={24} fill="none" stroke={COLORS.accent} strokeWidth={2.5} />
          <path d="M 826,810 L 835,822 L 856,798"
            fill="none" stroke={COLORS.accent} strokeWidth={3}
            strokeLinecap="round" strokeLinejoin="round" />
          <text x={760} y={880} fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.white}>
            Success
          </text>
          <text x={760} y={920} fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.accent}>
            Criterion
          </text>
          <text x={760} y={960} fontFamily={FONT} fontSize={24} fontWeight={800} fill={COLORS.text_muted}>
            How you know
          </text>
        </g>

        {/* ── Summary card ──────────────────────────────────────────────── */}
        <g opacity={summCard.opacity} transform={`translate(0, ${summCard.translateY})`}>
          <BentoCard x={60} y={1040} w={960} h={160} />
          <rect x={60} y={1040} width={6} height={160} rx={3} fill={COLORS.accent} />
          <text x={100} y={1110} fontFamily={FONT} fontSize={38} fontWeight={800} fill={COLORS.white}>
            All three define a
          </text>
          <text x={540} y={1110} fontFamily={FONT} fontSize={38} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">
            {' '}complete task
          </text>
          <text x={100} y={1158} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            Remove any one and the agent loses its purpose
          </text>
        </g>

        {/* ── Agent robot illustration ───────────────────────────────────── */}
        <g opacity={interpolate(frame, [55, 70], [0, 0.7], { extrapolateRight: 'clamp' })}
          transform={`translate(540, ${1350 + breathe})`}>
          {/* Robot head */}
          <rect x={-50} y={-50} width={100} height={70} rx={14}
            fill="none" stroke={COLORS.accent} strokeWidth={2} />
          <circle cx={-20} cy={-20} r={8} fill={COLORS.accent} opacity={shimmer} />
          <circle cx={20} cy={-20} r={8} fill={COLORS.accent} opacity={shimmer} />
          <rect x={-15} y={0} width={30} height={3} rx={1.5} fill={COLORS.accent} opacity={0.5} />
          {/* Antenna */}
          <line x1={0} y1={-50} x2={0} y2={-70} stroke={COLORS.accent} strokeWidth={2} />
          <circle cx={0} cy={-75} r={5} fill={COLORS.accent}
            transform={`scale(${pulse})`} style={{ transformOrigin: '0px -75px' }} />
          {/* Body */}
          <rect x={-40} y={25} width={80} height={90} rx={10}
            fill="none" stroke={COLORS.accent} strokeWidth={2} />
          {/* Arms */}
          <line x1={-40} y1={50} x2={-65} y2={80} stroke={COLORS.accent} strokeWidth={2} strokeLinecap="round" />
          <line x1={40} y1={50} x2={65} y2={80} stroke={COLORS.accent} strokeWidth={2} strokeLinecap="round" />
          {/* Clipboard in right hand */}
          <rect x={55} y={70} width={30} height={40} rx={4}
            fill="none" stroke={COLORS.accent} strokeWidth={1.5} />
          <line x1={62} y1={82} x2={78} y2={82} stroke={COLORS.text_muted} strokeWidth={1} />
          <line x1={62} y1={90} x2={78} y2={90} stroke={COLORS.text_muted} strokeWidth={1} />
          <line x1={62} y1={98} x2={75} y2={98} stroke={COLORS.text_muted} strokeWidth={1} />
        </g>

        {/* ── Floating particles ─────────────────────────────────────────── */}
        <g opacity={interpolate(frame, [50, 65], [0, 0.4], { extrapolateRight: 'clamp' })}>
          <circle cx={130} cy={1550 + breathe * 0.7} r={3} fill={COLORS.accent} opacity={0.3} />
          <circle cx={940} cy={1500 + breathe * 1.1} r={4} fill={COLORS.accent} opacity={0.25} />
          <circle cx={300} cy={1620 + breathe * 0.5} r={2.5} fill={COLORS.accent} opacity={0.35} />
        </g>

        {/* ── CAPTION ────────────────────────────────────────────────────── */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s05.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
