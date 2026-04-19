/**
 * Scene 01 — Day Intro
 * "This is day 33 of learning agent AI from first principles."
 * CSV: 0.000s → 5.060s
 * Duration: 169 frames (5.6s)
 *
 * Theme: Dark (#0D0D0D) + grid + teal accent (#76ABAE)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–30):   Scene reveal — DAY 33 badge springs up, progress bar animates
 *   Phase 2 (frames 20–90):  Content build — topic cards stagger in, robot head draws
 *   Phase 3 (frames 80–end): Steady-state micro — pulse, breathe, shimmer on elements
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
import { DarkBackground, GlobalDefs, Caption, BentoCard } from '../helpers/components';

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

export const Scene01_DayIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1: Scene reveal ──────────────────────────────────────────────────
  const badgeEntrance = useSpringEntrance(frame, 0);
  const titleEntrance = useSpringEntrance(frame, 8);
  const subtitleEntrance = useSpringEntrance(frame, 16);

  // ── Phase 2: Content build ─────────────────────────────────────────────────
  const card1 = useSpringEntrance(frame, 28);
  const card2 = useSpringEntrance(frame, 40);
  const card3 = useSpringEntrance(frame, 52);
  const progressWidth = interpolate(frame, [10, 60], [0, (33 / 120) * 860], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });

  // Robot head path draw
  const robotHeadPerimeter = 600;
  const robotDash = usePathDraw(frame, 30, robotHeadPerimeter, 40);

  // Day counter
  const dayCount = useCounter(frame, 5, 33, 30);

  // ── Phase 3: Micro-animations ──────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);
  const eyeBlink = frame % 90 > 85 ? 0.1 : 1;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s01.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A — Series badge ────────────────────────────────────── */}
        <g transform={`translate(0, ${badgeEntrance.translateY})`} opacity={badgeEntrance.opacity}>
          <text
            x={60} y={120}
            fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.15em" opacity={0.8}
          >
            AGENTIC AI · FIRST PRINCIPLES
          </text>
        </g>

        {/* ── ZONE B — DAY 33 hero number + topic ──────────────────────── */}
        <g transform={`translate(0, ${titleEntrance.translateY})`} opacity={titleEntrance.opacity}>
          <text
            x={60} y={260}
            fontFamily={FONT} fontSize={48} fontWeight={800}
            fill={COLORS.text_muted}
          >
            DAY
          </text>
          <text
            x={200} y={260}
            fontFamily={FONT} fontSize={48} fontWeight={800}
            fill={COLORS.accent}
          >
            {dayCount}
          </text>
          <text
            x={320} y={260}
            fontFamily={FONT} fontSize={48} fontWeight={800}
            fill={COLORS.text_muted}
          >
            / 120
          </text>
        </g>

        {/* Progress bar */}
        <g opacity={titleEntrance.opacity}>
          <rect x={60} y={285} width={860} height={6} rx={3} fill="rgba(255,255,255,0.08)" />
          <rect x={60} y={285} width={progressWidth} height={6} rx={3} fill={COLORS.accent} opacity={0.9} />
        </g>

        <g transform={`translate(0, ${subtitleEntrance.translateY})`} opacity={subtitleEntrance.opacity}>
          <text
            x={60} y={380}
            fontFamily={FONT} fontSize={88} fontWeight={800}
            fill={COLORS.white}
          >
            What Is
          </text>
          <text
            x={60} y={470}
            fontFamily={FONT} fontSize={88} fontWeight={800}
            fill={COLORS.accent}
            fontStyle="italic"
          >
            a Step?
          </text>
        </g>

        {/* ── ZONE C — Robot head illustration + topic preview cards ──── */}
        {/* Robot head — centered */}
        <g transform={`translate(540, ${780 + breathe})`} opacity={card1.opacity}>
          {/* Head outline */}
          <rect
            x={-120} y={-140} width={240} height={260} rx={32}
            fill="none" stroke={COLORS.accent} strokeWidth={3}
            strokeDasharray={robotHeadPerimeter}
            strokeDashoffset={robotDash}
          />
          {/* Head fill (faint) */}
          <rect
            x={-120} y={-140} width={240} height={260} rx={32}
            fill={COLORS.accent} fillOpacity={0.06 * shimmer}
          />
          {/* Eyes */}
          <circle cx={-50} cy={-30} r={22} fill={COLORS.accent} fillOpacity={0.3} />
          <circle cx={50} cy={-30} r={22} fill={COLORS.accent} fillOpacity={0.3} />
          <circle cx={-50} cy={-30} r={12} fill={COLORS.accent} opacity={eyeBlink} />
          <circle cx={50} cy={-30} r={12} fill={COLORS.accent} opacity={eyeBlink} />
          {/* Mouth / speaker grille */}
          <rect x={-60} y={40} width={120} height={8} rx={4} fill={COLORS.accent} opacity={0.5} />
          <rect x={-45} y={58} width={90} height={6} rx={3} fill={COLORS.accent} opacity={0.35} />
          <rect x={-30} y={74} width={60} height={5} rx={2.5} fill={COLORS.accent} opacity={0.2} />
          {/* Antenna */}
          <line x1={0} y1={-140} x2={0} y2={-190} stroke={COLORS.accent} strokeWidth={3} strokeLinecap="round" />
          <circle cx={0} cy={-195} r={8} fill={COLORS.accent} opacity={pulse} />
          {/* Ear panels */}
          <rect x={-140} y={-80} width={18} height={80} rx={9} fill={COLORS.accent} opacity={0.25} />
          <rect x={122} y={-80} width={18} height={80} rx={9} fill={COLORS.accent} opacity={0.25} />
        </g>

        {/* Topic preview cards */}
        <g opacity={card2.opacity} transform={`translate(0, ${card2.translateY})`}>
          <BentoCard x={60} y={1020} w={460} h={180} accent />
          <text x={100} y={1080} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            TODAY
          </text>
          <text x={100} y={1130} fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.white}>
            The Step
          </text>
          <text x={100} y={1170} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.accent}>
            Atomic unit of execution
          </text>
        </g>

        <g opacity={card3.opacity} transform={`translate(0, ${card3.translateY})`}>
          <BentoCard x={560} y={1020} w={460} h={180} />
          <text x={600} y={1080} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            YESTERDAY
          </text>
          <text x={600} y={1130} fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.white}>
            Trajectory
          </text>
          <text x={600} y={1170} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            Full sequence of steps
          </text>
        </g>

        {/* Bottom accent decoration */}
        <g opacity={card3.opacity}>
          <BentoCard x={60} y={1240} w={960} h={120} />
          <text x={540} y={1315} textAnchor="middle" fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.text_muted}>
            observation in → action out → repeat
          </text>
        </g>

        {/* Floating accent dots */}
        <circle cx={180} cy={1500 + breathe * 1.5} r={6} fill={COLORS.accent} opacity={0.3 * shimmer} />
        <circle cx={540} cy={1540 + breathe * 0.8} r={4} fill={COLORS.accent} opacity={0.25 * shimmer} />
        <circle cx={900} cy={1510 + breathe * 1.2} r={5} fill={COLORS.accent} opacity={0.2 * shimmer} />

        {/* Corner accents */}
        <path d="M 60,60 L 60,140 M 60,60 L 140,60" fill="none" stroke={COLORS.accent} strokeWidth={2.5} strokeLinecap="round" opacity={0.4} />
        <path d="M 1020,60 L 1020,140 M 1020,60 L 940,60" fill="none" stroke={COLORS.accent} strokeWidth={2.5} strokeLinecap="round" opacity={0.4} />

        {/* ── CAPTION ─────────────────────────────────────────────────── */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s01.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
