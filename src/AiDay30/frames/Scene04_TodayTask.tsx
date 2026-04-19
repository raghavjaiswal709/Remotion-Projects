/**
 * Scene 04 — TodayTask
 * "Today, we define the task."
 * CSV: 12.200s → 14.320s
 * Duration: ~84 frames
 *
 * Theme: Dark (#0D0D0D) + grid + AI accent (#76ABAE)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–25):   Section label + "TODAY" hero reveal
 *   Phase 2 (frames 20–80):  Task definition card, target icon, bento detail tiles
 *   Phase 3 (frames 60–end): Target pulse, floating particles, ring shimmer
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
import { DarkBackground, GlobalDefs, Caption, BentoCard, SectionLabel, CornerAccents } from '../helpers/components';

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

export const Scene04_TodayTask: React.FC = () => {
  const frame = useCurrentFrame();
  const fps   = 30;

  // ── Phase 1: Scene reveal ──────────────────────────────────────────────────
  const labelEntrance = useSpringEntrance(frame, 0);
  const heroWord1     = useSpringEntrance(frame, 4);
  const heroWord2     = useSpringEntrance(frame, 10);
  const heroWord3     = useSpringEntrance(frame, 16);

  // ── Phase 2: Content build ─────────────────────────────────────────────────
  const targetIcon  = useSpringEntrance(frame, 22);
  const defCard     = useSpringEntrance(frame, 30);
  const detailCard1 = useSpringEntrance(frame, 42);
  const detailCard2 = useSpringEntrance(frame, 52);
  const cornerAcc   = useSpringEntrance(frame, 55);

  // Target rings path draw
  const ringLen = 520;
  const ring1Dash = usePathDraw(frame, 25, ringLen, 25);
  const ring2Dash = usePathDraw(frame, 30, ringLen, 25);
  const ring3Dash = usePathDraw(frame, 35, ringLen, 25);

  // ── Phase 3: Micro-animations ──────────────────────────────────────────────
  const breathe  = Math.sin(frame * 0.06) * 4;
  const pulse    = 1 + Math.sin(frame * 0.08) * 0.02;
  const shimmer  = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.8, 1]);
  const rotate   = Math.sin(frame * 0.03) * 3;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s04.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A — Section label ────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEntrance.translateY})`} opacity={labelEntrance.opacity}>
          <SectionLabel text="MODULE 6 · TASKS" y={160} opacity={0.8} />
        </g>

        {/* ── ZONE B — Hero headline with per-word spring ───────────────── */}
        <g transform={`translate(0, ${heroWord1.translateY})`} opacity={heroWord1.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={100} fontWeight={800} fill={COLORS.accent}>
            Today
          </text>
        </g>
        <g transform={`translate(0, ${heroWord2.translateY})`} opacity={heroWord2.opacity}>
          <text x={60} y={410} fontFamily={FONT} fontSize={100} fontWeight={800} fill={COLORS.white}>
            We Define
          </text>
        </g>
        <g transform={`translate(0, ${heroWord3.translateY})`} opacity={heroWord3.opacity}>
          <text x={60} y={490} fontFamily={FONT} fontSize={64} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">
            the Task
          </text>
        </g>

        {/* ── ZONE C — Target icon (large, centered) ───────────────────── */}
        <g opacity={targetIcon.opacity} transform={`translate(540, ${720 + targetIcon.translateY}) rotate(${rotate})`}
          style={{ transformOrigin: '0px 0px' }}>
          {/* Outer ring */}
          <circle cx={0} cy={0} r={82} fill="none" stroke={COLORS.accent} strokeWidth={3}
            strokeDasharray={ringLen} strokeDashoffset={ring1Dash} strokeLinecap="round" />
          {/* Middle ring */}
          <circle cx={0} cy={0} r={58} fill="none" stroke={COLORS.accent} strokeWidth={2.5}
            strokeDasharray={ringLen} strokeDashoffset={ring2Dash} strokeLinecap="round"
            opacity={0.7} />
          {/* Inner ring */}
          <circle cx={0} cy={0} r={34} fill="none" stroke={COLORS.accent} strokeWidth={2}
            strokeDasharray={ringLen} strokeDashoffset={ring3Dash} strokeLinecap="round"
            opacity={0.5} />
          {/* Bullseye */}
          <circle cx={0} cy={0} r={12} fill={COLORS.accent}
            transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} />
          {/* Crosshairs */}
          <line x1={-95} y1={0} x2={-15} y2={0} stroke={COLORS.accent} strokeWidth={1.5} opacity={shimmer * 0.6} />
          <line x1={15} y1={0} x2={95} y2={0} stroke={COLORS.accent} strokeWidth={1.5} opacity={shimmer * 0.6} />
          <line x1={0} y1={-95} x2={0} y2={-15} stroke={COLORS.accent} strokeWidth={1.5} opacity={shimmer * 0.6} />
          <line x1={0} y1={15} x2={0} y2={95} stroke={COLORS.accent} strokeWidth={1.5} opacity={shimmer * 0.6} />
        </g>

        {/* Pulse ring around target */}
        <circle cx={540} cy={720}
          r={interpolate(frame, [25, 70], [30, 120], { extrapolateRight: 'clamp' })}
          fill="none" stroke={COLORS.accent} strokeWidth={1}
          opacity={interpolate(frame, [25, 70], [0.4, 0], { extrapolateRight: 'clamp' })}
        />

        {/* ── Definition card ───────────────────────────────────────────── */}
        <g opacity={defCard.opacity} transform={`translate(0, ${defCard.translateY})`}>
          <BentoCard x={60} y={870} w={960} h={180} accent />
          <rect x={60} y={870} width={6} height={180} rx={3} fill={COLORS.accent} />
          <text x={100} y={940} fontFamily={FONT} fontSize={44} fontWeight={800} fill={COLORS.white}>
            A task gives the agent direction
          </text>
          <text x={100} y={990} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            Without a task, the loop runs with no purpose
          </text>
        </g>

        {/* ── Two detail tiles ──────────────────────────────────────────── */}
        <g opacity={detailCard1.opacity} transform={`translate(0, ${detailCard1.translateY})`}>
          <BentoCard x={60} y={1080} w={460} h={240} />
          {/* Clipboard icon */}
          <rect x={100} y={1110} width={60} height={80} rx={8}
            fill="none" stroke={COLORS.accent} strokeWidth={2} />
          <rect x={110} y={1100} width={40} height={16} rx={4}
            fill={COLORS.bg_secondary} stroke={COLORS.accent} strokeWidth={2} />
          <line x1={115} y1={1140} x2={145} y2={1140} stroke={COLORS.text_muted} strokeWidth={2} />
          <line x1={115} y1={1155} x2={140} y2={1155} stroke={COLORS.text_muted} strokeWidth={2} />
          <line x1={115} y1={1170} x2={150} y2={1170} stroke={COLORS.text_muted} strokeWidth={2} />

          <text x={180} y={1150} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent}>
            Goal
          </text>
          <text x={180} y={1195} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            What the agent must
          </text>
          <text x={180} y={1230} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            accomplish
          </text>
        </g>

        <g opacity={detailCard2.opacity} transform={`translate(0, ${detailCard2.translateY})`}>
          <BentoCard x={560} y={1080} w={460} h={240} accent />
          {/* Checkmark icon */}
          <circle cx={620} cy={1160} r={30} fill="none" stroke={COLORS.accent} strokeWidth={2.5} />
          <path d="M 605,1160 L 615,1172 L 638,1148"
            fill="none" stroke={COLORS.accent} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />

          <text x={670} y={1150} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            Structure
          </text>
          <text x={670} y={1195} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            Start, end, and a
          </text>
          <text x={670} y={1230} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            success criterion
          </text>
        </g>

        {/* ── Decorative ────────────────────────────────────────────────── */}
        <g opacity={cornerAcc.opacity}>
          <CornerAccents opacity={0.4} />
        </g>

        {/* Floating particles */}
        <g opacity={interpolate(frame, [50, 65], [0, 0.5], { extrapolateRight: 'clamp' })}>
          <circle cx={200} cy={1450 + breathe} r={3} fill={COLORS.accent} opacity={0.3} />
          <circle cx={880} cy={1500 + breathe * 0.8} r={4} fill={COLORS.accent} opacity={0.25} />
          <circle cx={540} cy={1420 + breathe * 1.2} r={2.5} fill={COLORS.accent} opacity={0.35} />
          <circle cx={350} cy={1550 + breathe * 0.6} r={3.5} fill={COLORS.accent} opacity={0.2} />
        </g>

        {/* ── CAPTION ────────────────────────────────────────────────────── */}
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
