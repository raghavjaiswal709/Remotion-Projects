/**
 * Scene 02 — Day Intro
 * "This is day 27 of learning Agentic AI from first principles."
 * CSV: 0.000s → 4.720s
 * Duration: 160 frames (5.3s)
 *
 * Theme: Dark (#1D1D1C) + grid + series accent (#76ABAE)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–30):  Section label + day number spring in
 *   Phase 2 (frames 15–80): Headline words spring in staggered, bento cards build
 *   Phase 3 (frames 70–end): Brain/neural illustration pulses, accent ring breathes
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

// ─── Spring presets ───────────────────────────────────────────────────────────
const SPRING_CONFIG = { damping: 18, stiffness: 180, mass: 0.8 } as const;
const SPRING_SOFT = { damping: 22, stiffness: 120, mass: 1.0 } as const;
const SPRING_SNAP = { damping: 12, stiffness: 260, mass: 0.6 } as const;

// ─── Helper: spring-based opacity + translateY entrance ──────────────────────
function useSpringEntrance(frame: number, delayFrames: number, fps = 30) {
  const f = Math.max(0, frame - delayFrames);
  const progress = spring({ frame: f, fps, config: SPRING_CONFIG });
  const opacity = interpolate(f, [0, 12], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const translateY = interpolate(progress, [0, 1], [32, 0]);
  return { progress, opacity, translateY };
}

// ─── Helper: path-draw animation ─────────────────────────────────────────────
function usePathDraw(frame: number, startFrame: number, totalLength: number, durationFrames = 30) {
  const progress = interpolate(frame, [startFrame, startFrame + durationFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  return totalLength * (1 - progress);
}

// ─── Helper: animated counter ────────────────────────────────────────────────
function useCounter(frame: number, startFrame: number, endValue: number, durationFrames = 45) {
  const raw = interpolate(frame, [startFrame, startFrame + durationFrames], [0, endValue], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  return Math.round(raw);
}

export const Scene02_DayIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1: Scene reveal (frames 0–30) ────────────────────────────────────
  const labelEntrance = useSpringEntrance(frame, 0);
  const dayNumberSpring = spring({ frame, fps, config: SPRING_SNAP });
  const dayNumScale = interpolate(dayNumberSpring, [0, 1], [0.6, 1]);
  const dayNumOpacity = interpolate(dayNumberSpring, [0, 0.4], [0, 1], { extrapolateRight: 'clamp' });

  // ── Phase 2: Headlines + cards (stagger 10 frames) ────────────────────────
  const headlineA = useSpringEntrance(frame, 8);
  const headlineB = useSpringEntrance(frame, 16);
  const card1 = useSpringEntrance(frame, 28);
  const card2 = useSpringEntrance(frame, 40);
  const card3 = useSpringEntrance(frame, 52);

  // ── Day counter ────────────────────────────────────────────────────────────
  const dayCount = useCounter(frame, 5, 27, 35);

  // ── Path draw for brain illustration connectors ────────────────────────────
  const brainPathLen = 320;
  const brainDash = usePathDraw(frame, 35, brainPathLen, 30);

  // ── Phase 3: Micro-animations (steady-state) ──────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);
  const ringPulse = 1 + Math.sin(frame * 0.05) * 0.03;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s02.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        {/* ALWAYS FIRST — dark background with grid */}
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A — Topic anchor label ─────────────────────────────────── */}
        <g transform={`translate(0, ${labelEntrance.translateY})`} opacity={labelEntrance.opacity}>
          <SectionLabel text="MODULE 3 · FROM MODEL TO AGENT" y={160} opacity={0.8} />
        </g>

        {/* ── ZONE B — Large day number hero ──────────────────────────────── */}
        <g opacity={dayNumOpacity}
           transform={`translate(540, 360) scale(${dayNumScale})`}
           style={{ transformOrigin: '540px 360px' }}>
          {/* Ghost number behind */}
          <text
            x={0} y={0}
            textAnchor="middle"
            fontFamily={FONT} fontSize={280} fontWeight={800}
            fill={COLORS.accent} opacity={0.06}
          >
            {dayCount}
          </text>
          {/* Main day number */}
          <text
            x={0} y={0}
            textAnchor="middle"
            fontFamily={FONT} fontSize={240} fontWeight={800}
            fill={COLORS.accent}
          >
            {dayCount}
          </text>
        </g>

        {/* "DAY" label above number */}
        <g transform={`translate(0, ${headlineA.translateY})`} opacity={headlineA.opacity}>
          <text
            x={540} y={200}
            textAnchor="middle"
            fontFamily={FONT} fontSize={48} fontWeight={800}
            fill={COLORS.text_muted} letterSpacing="0.2em"
          >
            DAY
          </text>
        </g>

        {/* ── Topic title ─────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${headlineB.translateY})`} opacity={headlineB.opacity}>
          <text
            x={540} y={530}
            textAnchor="middle"
            fontFamily={FONT} fontSize={72} fontWeight={800}
            fill={COLORS.white}
          >
            What Is a Tool?
          </text>
          <text
            x={540} y={600}
            textAnchor="middle"
            fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.accent}
          >
            AGENTIC AI FROM FIRST PRINCIPLES
          </text>
        </g>

        {/* ── ZONE C — Bento cards with journey context ───────────────────── */}

        {/* Card 1: Series progress */}
        <g opacity={card1.opacity} transform={`translate(0, ${card1.translateY})`}>
          <BentoCard x={60} y={680} w={960} h={180} accent />
          <rect x={60} y={680} width={6} height={180} rx={3} fill={COLORS.accent} />
          <text x={100} y={750} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.text_muted}>
            SERIES PROGRESS
          </text>
          <text x={100} y={810} fontFamily={FONT} fontSize={44} fontWeight={800} fill={COLORS.white}>
            Part 27 of 120
          </text>
          {/* Progress bar inside card */}
          <rect x={580} y={760} width={400} height={8} rx={4} fill="rgba(255,255,255,0.08)" />
          <rect x={580} y={760} width={Math.round(400 * (27 / 120))} height={8} rx={4}
            fill={COLORS.accent} opacity={shimmer} />
        </g>

        {/* Card 2: Module info */}
        <g opacity={card2.opacity} transform={`translate(0, ${card2.translateY})`}>
          <BentoCard x={60} y={884} w={460} h={280} />
          <text x={100} y={944} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.accent}>
            MODULE 3
          </text>
          <text x={100} y={1000} fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.white}>
            From Model
          </text>
          <text x={100} y={1054} fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.white}>
            to Agent
          </text>
          {/* Module icon: gear */}
          <circle cx={380} cy={1020} r={60} fill="none" stroke={COLORS.accent} strokeWidth={2}
            opacity={0.3} />
          <circle cx={380} cy={1020} r={40} fill="none" stroke={COLORS.accent} strokeWidth={2}
            opacity={0.5} transform={`rotate(${frame * 0.5}, 380, 1020)`} />
          {/* Gear teeth */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
            const rad = (angle * Math.PI) / 180;
            const x1 = 380 + Math.cos(rad) * 35;
            const y1 = 1020 + Math.sin(rad) * 35;
            const x2 = 380 + Math.cos(rad) * 55;
            const y2 = 1020 + Math.sin(rad) * 55;
            return (
              <line key={angle} x1={x1} y1={y1} x2={x2} y2={y2}
                stroke={COLORS.accent} strokeWidth={3} strokeLinecap="round"
                opacity={0.4}
                transform={`rotate(${frame * 0.5}, 380, 1020)`} />
            );
          })}
        </g>

        {/* Card 3: Yesterday recap */}
        <g opacity={card2.opacity} transform={`translate(0, ${card2.translateY})`}>
          <BentoCard x={560} y={884} w={460} h={280} accent />
          <text x={600} y={944} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.accent}>
            YESTERDAY
          </text>
          <text x={600} y={1000} fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.white}>
            Observations
          </text>
          <text x={600} y={1054} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.text_muted}>
            Day 26
          </text>
          {/* Eye icon for observation */}
          <ellipse cx={880} cy={1000} rx={45} ry={30} fill="none"
            stroke={COLORS.accent} strokeWidth={2.5} opacity={0.6} />
          <circle cx={880} cy={1000} r={14} fill={COLORS.accent} opacity={0.6 * shimmer} />
        </g>

        {/* ── Brain/neural illustration ────────────────────────────────────── */}
        <g opacity={card3.opacity} transform={`translate(0, ${card3.translateY})`}>
          <BentoCard x={60} y={1188} w={960} h={480} />

          {/* Neural network nodes representing agent components */}
          {/* Central brain node */}
          <g transform={`translate(540, ${1428 + breathe})`}>
            <circle cx={0} cy={0} r={64} fill={COLORS.accent} fillOpacity={0.08 * shimmer} />
            <circle cx={0} cy={0} r={64} fill="none" stroke={COLORS.accent} strokeWidth={2.5}
              transform={`scale(${ringPulse})`} style={{ transformOrigin: '0px 0px' }} />
            <circle cx={0} cy={0} r={48} fill="none" stroke={COLORS.accent} strokeWidth={1.5}
              transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} />
            <text x={0} y={8} textAnchor="middle"
              fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent}>
              AI
            </text>
          </g>

          {/* Left tool node */}
          <circle cx={260} cy={1340} r={36} fill={COLORS.bg_secondary}
            stroke={COLORS.accent_mid} strokeWidth={2} />
          <text x={260} y={1348} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.white}>
            T1
          </text>

          {/* Right tool node */}
          <circle cx={820} cy={1340} r={36} fill={COLORS.bg_secondary}
            stroke={COLORS.accent_mid} strokeWidth={2} />
          <text x={820} y={1348} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.white}>
            T2
          </text>

          {/* Bottom tool node */}
          <circle cx={540} cy={1580} r={36} fill={COLORS.bg_secondary}
            stroke={COLORS.accent_mid} strokeWidth={2} />
          <text x={540} y={1588} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.white}>
            T3
          </text>

          {/* Connectors from brain to tools — path draw animation */}
          <path
            d="M 500,1428 C 400,1420 300,1380 260,1376"
            fill="none" stroke={COLORS.accent} strokeWidth={2}
            strokeDasharray={brainPathLen} strokeDashoffset={brainDash}
            strokeLinecap="round" opacity={0.6}
          />
          <path
            d="M 580,1428 C 680,1420 780,1380 820,1376"
            fill="none" stroke={COLORS.accent} strokeWidth={2}
            strokeDasharray={brainPathLen} strokeDashoffset={brainDash}
            strokeLinecap="round" opacity={0.6}
          />
          <path
            d="M 540,1492 L 540,1544"
            fill="none" stroke={COLORS.accent} strokeWidth={2}
            strokeDasharray={brainPathLen} strokeDashoffset={brainDash}
            strokeLinecap="round" opacity={0.6}
          />

          {/* Label */}
          <text x={540} y={1240} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            AGENT + TOOLS
          </text>
        </g>

        {/* ── CAPTION — FIXED AT BOTTOM (y=1860) ─────────────────────────── */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s02.duration}
          />
        )}

      </svg>
    </AbsoluteFill>
  );
};
