/**
 * Scene 04 — TodayTopic
 * "Today, we look at how the model actually uses that tool."
 * CSV: 14.100s → 17.800s
 * Duration: 128 frames (4.27s)
 *
 * Theme: Dark (#0D0D0D) + grid + AI accent (#76ABAE)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–25):   TODAY badge + headline spring in
 *   Phase 2 (frames 20–80):  Robot hand reaching toward tool icon, flow diagram
 *   Phase 3 (frames 70–end): Glowing connection pulse, breathing elements
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
const SPRING_SNAP   = { damping: 12, stiffness: 260, mass: 0.6 } as const;

function useSpringEntrance(frame: number, delay: number, fps = 30) {
  const f = Math.max(0, frame - delay);
  const progress = spring({ frame: f, fps, config: SPRING_CONFIG });
  const opacity = interpolate(f, [0, 12], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const translateY = interpolate(progress, [0, 1], [32, 0]);
  return { progress, opacity, translateY };
}

function usePathDraw(frame: number, start: number, len: number, dur = 30) {
  const p = interpolate(frame, [start, start + dur], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  return len * (1 - p);
}

export const Scene04_TodayTopic: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1: Reveal ─────────────────────────────────────────────────────────
  const labelEnter = useSpringEntrance(frame, 0);
  const headline1 = useSpringEntrance(frame, 6);
  const headline2 = useSpringEntrance(frame, 12);

  // ── Phase 2: Illustration build ─────────────────────────────────────────────
  const robotEnter = useSpringEntrance(frame, 18);
  const arrowEnter = useSpringEntrance(frame, 28);
  const toolEnter = useSpringEntrance(frame, 36);
  const card1Enter = useSpringEntrance(frame, 44);
  const card2Enter = useSpringEntrance(frame, 54);
  const questionMark = useSpringEntrance(frame, 32);

  // Arrow path draw
  const arrowLen = 300;
  const arrowDash = usePathDraw(frame, 26, arrowLen, 25);

  // Connection ring draw
  const ringLen = 400;
  const ringDash = usePathDraw(frame, 40, ringLen, 30);

  // ── Phase 3: Micro-animations ───────────────────────────────────────────────
  const reachX = interpolate(frame, [20, 60], [0, 30], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  const pulse = 1 + Math.sin(frame * 0.1) * 0.02;
  const breathe = Math.sin(frame * 0.06) * 4;
  const shimmer = interpolate(Math.sin(frame * 0.05), [-1, 1], [0.8, 1]);
  const glowPulse = 0.15 + Math.sin(frame * 0.08) * 0.1;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s04.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEnter.translateY})`} opacity={labelEnter.opacity}>
          <SectionLabel text="TODAY · DAY 28 FOCUS" y={120} opacity={0.8} />
        </g>

        {/* ── ZONE B — Headlines ─────────────────────────────────────────── */}
        <g transform={`translate(0, ${headline1.translateY})`} opacity={headline1.opacity}>
          <text x={60} y={280}
            fontFamily={FONT} fontSize={80} fontWeight={800} fill={COLORS.white}>
            How the Model
          </text>
        </g>
        <g transform={`translate(0, ${headline2.translateY})`} opacity={headline2.opacity}>
          <text x={60} y={380}
            fontFamily={FONT} fontSize={80} fontWeight={800} fill={COLORS.accent}>
            Uses a Tool
          </text>
        </g>

        {/* ── ZONE C — Robot reaching toward tool ───────────────────────── */}

        {/* Robot head (simplified) — left side */}
        <g opacity={robotEnter.opacity}
           transform={`translate(${220 + reachX}, ${700 + robotEnter.translateY + breathe})`}>
          {/* Head */}
          <rect x={-80} y={-100} width={160} height={140} rx={18}
            fill={COLORS.bg_secondary} stroke={COLORS.accent} strokeWidth={2.5} />
          {/* Eyes */}
          <circle cx={-30} cy={-40} r={14} fill="none" stroke={COLORS.accent} strokeWidth={2} />
          <circle cx={-30} cy={-40} r={5} fill={COLORS.accent} opacity={shimmer} />
          <circle cx={30} cy={-40} r={14} fill="none" stroke={COLORS.accent} strokeWidth={2} />
          <circle cx={30} cy={-40} r={5} fill={COLORS.accent} opacity={shimmer} />
          {/* Mouth */}
          <line x1={-20} y1={10} x2={20} y2={10} stroke={COLORS.accent} strokeWidth={2} opacity={0.5} />
          {/* Body outline */}
          <rect x={-100} y={60} width={200} height={180} rx={16}
            fill={COLORS.bg_secondary} stroke={COLORS.accent} strokeWidth={2} />
          {/* Chest indicator */}
          <circle cx={0} cy={130} r={10} fill={COLORS.accent} opacity={glowPulse} />
          {/* Extended arm reaching right */}
          <rect x={100} y={80} width={140} height={36} rx={10}
            fill={COLORS.bg_secondary} stroke={COLORS.accent} strokeWidth={2} />
          {/* Hand circle */}
          <circle cx={250} cy={98} r={18}
            fill={COLORS.bg_secondary} stroke={COLORS.accent} strokeWidth={2} />
          {/* Finger lines */}
          <line x1={260} y1={82} x2={274} y2={76} stroke={COLORS.accent} strokeWidth={2} opacity={0.6} />
          <line x1={268} y1={90} x2={282} y2={88} stroke={COLORS.accent} strokeWidth={2} opacity={0.6} />
          <line x1={268} y1={106} x2={282} y2={108} stroke={COLORS.accent} strokeWidth={2} opacity={0.6} />
        </g>

        {/* Question mark floating above */}
        <g opacity={questionMark.opacity}
           transform={`translate(280, ${560 + questionMark.translateY + breathe * 0.8})`}>
          <text textAnchor="middle"
            fontFamily={FONT} fontSize={72} fontWeight={800}
            fill={COLORS.accent} opacity={0.6 * shimmer}>
            ?
          </text>
        </g>

        {/* Arrow from robot to tool */}
        <path
          d="M 510,750 Q 580,700 650,750"
          fill="none" stroke={COLORS.accent} strokeWidth={3}
          strokeDasharray={arrowLen} strokeDashoffset={arrowDash}
          strokeLinecap="round" markerEnd="url(#arrow)"
        />

        {/* Tool icon — right side (wrench in circle) */}
        <g opacity={toolEnter.opacity}
           transform={`translate(800, ${730 + toolEnter.translateY})`}>
          {/* Outer ring */}
          <circle cx={0} cy={0} r={90} fill="none"
            stroke={COLORS.accent} strokeWidth={3}
            strokeDasharray={ringLen} strokeDashoffset={ringDash}
            transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }}
          />
          {/* Inner glow */}
          <circle cx={0} cy={0} r={70}
            fill={COLORS.accent} opacity={glowPulse * 0.3} />
          {/* Wrench silhouette */}
          <path
            d="M -10,-50 L -10,20 Q -10,35 -20,42 L 20,42 Q 10,35 10,20 L 10,-50
               Q 10,-60 20,-68 L 30,-68 Q 35,-68 35,-60 L 35,-48
               Q 35,-42 30,-42 L 20,-42 Q 10,-42 10,-50 Z"
            fill={COLORS.accent} opacity={0.7}
          />
          {/* Wrench head arc */}
          <path
            d="M -25,-50 Q -40,-65 -40,-85 Q -40,-105 -10,-115 Q 20,-125 40,-105 Q 50,-90 40,-68"
            fill="none" stroke={COLORS.accent} strokeWidth={3} opacity={0.8}
          />
          {/* Tool label */}
          <text x={0} y={130} textAnchor="middle"
            fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">
            tool
          </text>
        </g>

        {/* ── Focus arrow between HOW and explanation ────────────────────── */}
        <path
          d="M 540,980 L 540,1040"
          fill="none" stroke={COLORS.accent} strokeWidth={2.5}
          strokeDasharray={60} strokeDashoffset={usePathDraw(frame, 42, 60, 15)}
          strokeLinecap="round" markerEnd="url(#arrow)"
        />

        {/* ── Explanation cards ─────────────────────────────────────────── */}
        <g opacity={card1Enter.opacity} transform={`translate(0, ${card1Enter.translateY})`}>
          <BentoCard x={60} y={1060} w={960} h={200} accent />
          <rect x={60} y={1060} width={6} height={200} rx={3} fill={COLORS.accent} />
          <text x={100} y={1150}
            fontFamily={FONT} fontSize={42} fontWeight={800} fill={COLORS.white}>
            Not execution — communication
          </text>
          <text x={100} y={1210}
            fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.text_muted}>
            The model speaks, something else acts
          </text>
        </g>

        <g opacity={card2Enter.opacity} transform={`translate(0, ${card2Enter.translateY})`}>
          <BentoCard x={60} y={1300} w={960} h={200} />
          <rect x={60} y={1300} width={6} height={200} rx={3} fill={COLORS.accent} opacity={0.6} />
          <text x={100} y={1390}
            fontFamily={FONT} fontSize={42} fontWeight={800} fill={COLORS.white}>
            Tool calling is the protocol
          </text>
          <text x={100} y={1450}
            fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.text_muted}>
            A structured way to request an action
          </text>
        </g>

        {/* ── Floating particles ────────────────────────────────────────── */}
        {[
          { x: 100, y: 550, r: 4 }, { x: 960, y: 540, r: 5 },
          { x: 150, y: 1600, r: 3 }, { x: 900, y: 1620, r: 4 },
          { x: 540, y: 1680, r: 5 },
        ].map((p, i) => (
          <circle key={i}
            cx={p.x} cy={p.y + Math.sin(frame * 0.04 + i * 1.3) * 8}
            r={p.r} fill={COLORS.accent} opacity={0.12 * shimmer}
          />
        ))}

        {/* ── CAPTION ──────────────────────────────────────────────────── */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s04.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
