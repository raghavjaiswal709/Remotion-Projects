/**
 * Scene 01 — Day Intro
 * "This is day 32 of learning Agentic AI from first principles."
 * CSV: 0.000s → 4.860s
 * Duration: 160 frames (5.33s)
 *
 * Animation phases:
 *   Phase 1 (0–30): Day badge + series label spring in
 *   Phase 2 (20–90): "DAY 32" hero number builds, trajectory preview card
 *   Phase 3 (80–end): Micro-animations — pulse ring, floating nodes
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
const SPRING_SOFT = { damping: 22, stiffness: 120, mass: 1.0 } as const;
const SPRING_SNAP = { damping: 12, stiffness: 260, mass: 0.6 } as const;

function useSpringEntrance(frame: number, delayFrames: number, fps = 30) {
  const f = Math.max(0, frame - delayFrames);
  const progress = spring({ frame: f, fps, config: SPRING_CONFIG });
  const opacity = interpolate(f, [0, 12], [0, 1], { extrapolateRight: 'clamp', easing: ease });
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

  // ── Phase 1: Scene reveal ──
  const labelEntrance = useSpringEntrance(frame, 0);
  const headlineA = useSpringEntrance(frame, 6);
  const headlineB = useSpringEntrance(frame, 12);

  // ── Phase 2: Content build ──
  const card1 = useSpringEntrance(frame, 20);
  const card2 = useSpringEntrance(frame, 32);
  const card3 = useSpringEntrance(frame, 44);
  const dayCounter = useCounter(frame, 10, 32, 35);

  // Progress bar animation
  const progressWidth = interpolate(frame, [15, 60], [0, 960 * (32 / 120)], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });

  // Border draw on hero card
  const heroPerimeter = 2 * (960 + 340);
  const heroBorderDash = usePathDraw(frame, 18, heroPerimeter, 35);

  // ── Phase 3: Micro-animations ──
  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  // Floating trajectory nodes
  const nodeFloat1 = Math.sin(frame * 0.05) * 6;
  const nodeFloat2 = Math.sin(frame * 0.07 + 1) * 5;
  const nodeFloat3 = Math.sin(frame * 0.04 + 2) * 7;

  // Connector path draw
  const connLen = 400;
  const connDash = usePathDraw(frame, 50, connLen, 30);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s01.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A — Series label ── */}
        <g transform={`translate(0, ${labelEntrance.translateY})`} opacity={labelEntrance.opacity}>
          <SectionLabel text="AGENTIC AI · FIRST PRINCIPLES" y={160} opacity={0.8} />
        </g>

        {/* ── ZONE B — DAY 32 hero ── */}
        <g transform={`translate(0, ${headlineA.translateY})`} opacity={headlineA.opacity}>
          {/* Ghost number */}
          <text
            x={540} y={420}
            textAnchor="middle"
            fontFamily={FONT}
            fontSize={320} fontWeight={800}
            fill={COLORS.accent} opacity={0.06}
          >
            {dayCounter}
          </text>
          {/* Main day number */}
          <text
            x={540} y={400}
            textAnchor="middle"
            fontFamily={FONT}
            fontSize={240} fontWeight={800}
            fill={COLORS.white}
          >
            DAY {dayCounter}
          </text>
        </g>

        <g transform={`translate(0, ${headlineB.translateY})`} opacity={headlineB.opacity}>
          <text
            x={540} y={480}
            textAnchor="middle"
            fontFamily={FONT}
            fontSize={40} fontWeight={800}
            fill={COLORS.text_muted}
            letterSpacing="0.12em"
          >
            OF 120 · AGENTIC AI
          </text>
          {/* Progress bar track */}
          <rect x={60} y={510} width={960} height={8} rx={4} fill="rgba(255,255,255,0.08)" />
          {/* Progress bar fill */}
          <rect x={60} y={510} width={progressWidth} height={8} rx={4} fill={COLORS.accent} opacity={0.9} />
        </g>

        {/* ── ZONE C — Topic preview cards ── */}
        {/* Hero card with border draw */}
        <g opacity={card1.opacity} transform={`translate(0, ${card1.translateY})`}>
          <BentoCard x={60} y={580} w={960} h={340} accent />
          <rect
            x={60} y={580} width={960} height={340} rx={20}
            fill="none" stroke={COLORS.accent} strokeWidth={2.5}
            strokeDasharray={heroPerimeter}
            strokeDashoffset={heroBorderDash}
          />
          <text x={100} y={660} fontFamily={FONT} fontSize={56} fontWeight={800} fill={COLORS.white}>
            What Is a
          </text>
          <text x={100} y={740} fontFamily={FONT} fontSize={84} fontWeight={800} fontStyle="italic" fill={COLORS.accent}>
            Trajectory?
          </text>
          {/* Decorative path inside card */}
          <path
            d="M 640,640 L 720,680 L 800,660 L 880,720 L 960,700"
            fill="none" stroke={COLORS.accent} strokeWidth={3}
            strokeDasharray={connLen}
            strokeDashoffset={connDash}
            strokeLinecap="round"
            opacity={0.6}
          />
          {/* Nodes along the path */}
          <g transform={`translate(640, ${640 + nodeFloat1})`}>
            <circle cx={0} cy={0} r={8} fill={COLORS.accent} />
          </g>
          <g transform={`translate(800, ${660 + nodeFloat2})`}>
            <circle cx={0} cy={0} r={8} fill={COLORS.accent} />
          </g>
          <g transform={`translate(960, ${700 + nodeFloat3})`}>
            <circle cx={0} cy={0} r={8} fill={COLORS.accent} />
          </g>
          <text x={100} y={870} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.text_muted}>
            The complete record of an agent's journey
          </text>
        </g>

        {/* Two-column cards */}
        <g opacity={card2.opacity} transform={`translate(0, ${card2.translateY})`}>
          <BentoCard x={60} y={960} w={460} h={260} />
          <text x={100} y={1040} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent}>
            YESTERDAY
          </text>
          <text x={100} y={1090} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            Day 31 — Autonomy
          </text>
          <text x={100} y={1140} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            Independence vs control
          </text>
          {/* Autonomy spectrum mini bar */}
          <rect x={100} y={1170} width={380} height={6} rx={3} fill="rgba(255,255,255,0.1)" />
          <rect x={100} y={1170} width={190} height={6} rx={3} fill={COLORS.accent} opacity={0.5} />
        </g>

        <g opacity={card3.opacity} transform={`translate(0, ${card3.translateY})`}>
          <BentoCard x={560} y={960} w={460} h={260} accent />
          <text x={600} y={1040} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent}>
            TODAY
          </text>
          <text x={600} y={1090} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.white}>
            Day 32 — Trajectory
          </text>
          <text x={600} y={1140} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            The full record of actions
          </text>
          {/* Trajectory line mini illustration */}
          <path
            d="M 600,1180 L 660,1180 L 720,1170 L 780,1190 L 840,1175 L 900,1185 L 960,1180"
            fill="none" stroke={COLORS.accent} strokeWidth={3} strokeLinecap="round"
            opacity={shimmer}
          />
        </g>

        {/* Large floating trajectory illustration */}
        <g transform={`translate(540, ${1420 + breathe})`} opacity={card3.opacity * 0.7}>
          {/* Central trajectory arc */}
          <path
            d="M -300,0 Q -150,-80 0,-40 Q 150,0 300,-60"
            fill="none" stroke={COLORS.accent} strokeWidth={4}
            strokeDasharray={800}
            strokeDashoffset={usePathDraw(frame, 55, 800, 40)}
            strokeLinecap="round"
          />
          {/* Trajectory node dots */}
          {[-300, -150, 0, 150, 300].map((x, i) => {
            const yOff = [-0, -60, -40, -20, -60][i] || 0;
            const nf = Math.sin(frame * 0.05 + i * 0.8) * 4;
            return (
              <g key={i} transform={`translate(${x}, ${yOff + nf})`}>
                <circle cx={0} cy={0} r={12} fill={COLORS.bg_secondary} stroke={COLORS.accent} strokeWidth={2} />
                <circle cx={0} cy={0} r={5} fill={COLORS.accent} opacity={shimmer} />
              </g>
            );
          })}
        </g>

        {/* Pulse ring decoration */}
        <g transform={`translate(540, ${1650 + breathe})`}>
          <circle cx={0} cy={0} r={40} fill={COLORS.accent} fillOpacity={0.05 * shimmer} />
          <circle
            cx={0} cy={0} r={40}
            fill="none" stroke={COLORS.accent} strokeWidth={1.5}
            transform={`scale(${pulse})`}
            style={{ transformOrigin: '0px 0px' }}
            opacity={0.3}
          />
          <text
            x={0} y={6} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.accent} opacity={0.6}
          >
            32
          </text>
        </g>

        {/* ── CAPTION ── */}
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
