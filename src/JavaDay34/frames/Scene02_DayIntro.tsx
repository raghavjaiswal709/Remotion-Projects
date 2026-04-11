/**
 * Scene02_DayIntro — Day 34
 * "This is Day 34 of learning Java from first principles."
 * CSV: 0.00s → 4.36s
 * Duration: 149 frames (4.97s)
 *
 * Animation phases:
 *   Phase 1 (frames 0–25):  Scene reveal — label slides in, hero number springs up
 *   Phase 2 (frames 20–80): Content build — subtitle, info cards stagger in, progress bar draws
 *   Phase 3 (frames 70–end): Micro-animations — pulse on day number, shimmer on progress, float on icon
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
import { PaperBackground, GlobalDefs, Caption, SectionLabel } from '../helpers/components';

// ─── Spring configs ───────────────────────────────────────────────────────────
const SPRING_CONFIG = { damping: 18, stiffness: 180, mass: 0.8 } as const;
const SPRING_SOFT   = { damping: 22, stiffness: 120, mass: 1.0 } as const;
const SPRING_SNAP   = { damping: 12, stiffness: 260, mass: 0.6 } as const;
const SPRING_HEAVY  = { damping: 28, stiffness: 100, mass: 1.4 } as const;

// ─── Helpers ──────────────────────────────────────────────────────────────────
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

export const Scene02_DayIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1: Scene reveal ──────────────────────────────────────────────────
  const sceneReveal = spring({ frame, fps, config: SPRING_SOFT });
  const labelEntrance = useSpringEntrance(frame, 0);
  const heroNumber = useSpringEntrance(frame, 6);
  const heroSubtitle = useSpringEntrance(frame, 14);

  // ── Phase 2: Content build ─────────────────────────────────────────────────
  const card1 = useSpringEntrance(frame, 26);
  const card2 = useSpringEntrance(frame, 38);
  const card3 = useSpringEntrance(frame, 50);
  const progressBarEntrance = useSpringEntrance(frame, 62);

  // Progress bar draw
  const progressBarWidth = interpolate(frame, [62, 100], [0, 960 * (34 / 105)], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });

  // Counter tick-up
  const dayCounter = useCounter(frame, 8, 34, 35);
  const progressCounter = useCounter(frame, 65, 32, 30);

  // Vertical connector path draw
  const connectorLen = 260;
  const connectorDash = usePathDraw(frame, 40, connectorLen, 30);

  // ── Phase 3: Micro-animations ──────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 3;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  // Train icon float
  const trainFloat = Math.sin(frame * 0.05) * 4;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s02.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_paper }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <PaperBackground />
        <GlobalDefs />

        {/* ── ZONE A — Topic anchor ──────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEntrance.translateY})`} opacity={labelEntrance.opacity}>
          <SectionLabel text="NATIONAL RAILWAY · JAVA OOP" y={120} opacity={0.55} />
        </g>

        {/* ── ZONE B — Hero day number ───────────────────────────────────── */}
        {/* Ghost layer */}
        <g transform={`translate(0, ${heroNumber.translateY})`} opacity={heroNumber.opacity * 0.12}>
          <text
            x={540} y={520}
            textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={360} fontWeight={900}
            fill={COLORS.orange}
          >
            {dayCounter}
          </text>
        </g>

        {/* Main number */}
        <g transform={`translate(0, ${heroNumber.translateY})`} opacity={heroNumber.opacity}>
          <text
            x={540} y={480}
            textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={300} fontWeight={900}
            fill={COLORS.deep_black}
            style={{ transformOrigin: '540px 400px' }}
            transform={`scale(${pulse})`}
          >
            {dayCounter}
          </text>
        </g>

        {/* "DAY" label */}
        <g transform={`translate(0, ${heroNumber.translateY})`} opacity={heroNumber.opacity}>
          <text
            x={540} y={220}
            textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={52} fontWeight={500}
            fill={COLORS.cool_silver}
            letterSpacing="0.2em"
          >
            DAY
          </text>
        </g>

        {/* ── Subtitle ───────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${heroSubtitle.translateY})`} opacity={heroSubtitle.opacity}>
          <text
            x={540} y={580}
            textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={52} fontWeight={700}
            fill={COLORS.orange}
          >
            Covariant Return Type
          </text>
          <text
            x={540} y={640}
            textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={34} fontWeight={400}
            fill={COLORS.cool_silver}
          >
            Learning Java from First Principles
          </text>
        </g>

        {/* ── Divider line ───────────────────────────────────────────────── */}
        <line
          x1={340} y1={690} x2={740} y2={690}
          stroke={COLORS.deep_black} strokeWidth={1} opacity={heroSubtitle.opacity * 0.15}
        />

        {/* ── ZONE C — Info cards ────────────────────────────────────────── */}

        {/* Vertical connector from subtitle to cards */}
        <path
          d="M 540,700 L 540,960"
          fill="none"
          stroke={COLORS.orange}
          strokeWidth={2}
          strokeDasharray={connectorLen}
          strokeDashoffset={connectorDash}
          strokeLinecap="round"
          opacity={0.3}
        />

        {/* Card 1 — Series */}
        <g opacity={card1.opacity} transform={`translate(60, ${780 + card1.translateY})`}>
          <rect
            x={0} y={0} width={440} height={140} rx={16}
            fill={COLORS.orange} fillOpacity={0.06}
            stroke={COLORS.orange} strokeWidth={2}
          />
          <rect x={0} y={0} width={6} height={140} rx={3} fill={COLORS.orange} />
          <text x={32} y={50} fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={500} fill={COLORS.cool_silver}>
            SERIES
          </text>
          <text x={32} y={100} fontFamily="'Inter', sans-serif" fontSize={38} fontWeight={700} fill={COLORS.deep_black}>
            Java OOP
          </text>
        </g>

        {/* Card 2 — Module */}
        <g opacity={card2.opacity} transform={`translate(540, ${780 + card2.translateY})`}>
          <rect
            x={0} y={0} width={440} height={140} rx={16}
            fill={COLORS.sky_blue} fillOpacity={0.06}
            stroke={COLORS.sky_blue} strokeWidth={2}
          />
          <rect x={0} y={0} width={6} height={140} rx={3} fill={COLORS.sky_blue} />
          <text x={32} y={50} fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={500} fill={COLORS.cool_silver}>
            MODULE
          </text>
          <text x={32} y={100} fontFamily="'Inter', sans-serif" fontSize={38} fontWeight={700} fill={COLORS.deep_black}>
            Inheritance
          </text>
        </g>

        {/* Card 3 — Topic with train icon */}
        <g opacity={card3.opacity} transform={`translate(60, ${960 + card3.translateY})`}>
          <rect
            x={0} y={0} width={960} height={160} rx={16}
            fill={COLORS.deep_black} fillOpacity={0.03}
            stroke={COLORS.deep_black} strokeWidth={1} strokeOpacity={0.1}
          />
          <rect x={0} y={0} width={6} height={160} rx={3} fill={COLORS.amber} />

          {/* Train icon SVG */}
          <g transform={`translate(40, ${50 + trainFloat})`} opacity={shimmer}>
            <rect x={0} y={0} width={56} height={40} rx={6} fill={COLORS.orange} fillOpacity={0.15} stroke={COLORS.orange} strokeWidth={1.5} />
            <rect x={8} y={6} width={16} height={14} rx={2} fill={COLORS.orange} fillOpacity={0.3} />
            <rect x={30} y={6} width={16} height={14} rx={2} fill={COLORS.orange} fillOpacity={0.3} />
            <line x1={0} y1={44} x2={56} y2={44} stroke={COLORS.orange} strokeWidth={2} />
            <circle cx={14} cy={48} r={5} fill={COLORS.orange} fillOpacity={0.6} />
            <circle cx={42} cy={48} r={5} fill={COLORS.orange} fillOpacity={0.6} />
          </g>

          <text x={120} y={55} fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={500} fill={COLORS.cool_silver}>
            TODAY'S TOPIC
          </text>
          <text x={120} y={110} fontFamily="'Inter', sans-serif" fontSize={42} fontWeight={800} fill={COLORS.orange}>
            Covariant Return Type
          </text>
        </g>

        {/* ── Progress section ───────────────────────────────────────────── */}
        <g opacity={progressBarEntrance.opacity} transform={`translate(0, ${progressBarEntrance.translateY})`}>
          {/* Progress label */}
          <text
            x={60} y={1220}
            fontFamily="'Inter', sans-serif"
            fontSize={28} fontWeight={500}
            fill={COLORS.cool_silver}
          >
            JOURNEY PROGRESS
          </text>

          {/* Progress percentage */}
          <text
            x={1020} y={1220}
            textAnchor="end"
            fontFamily="'Inter', sans-serif"
            fontSize={36} fontWeight={800}
            fill={COLORS.orange}
            opacity={shimmer}
          >
            {progressCounter}%
          </text>

          {/* Progress bar background */}
          <rect
            x={60} y={1250} width={960} height={16} rx={8}
            fill={COLORS.deep_black} fillOpacity={0.06}
          />

          {/* Progress bar fill */}
          <rect
            x={60} y={1250}
            width={progressBarWidth}
            height={16} rx={8}
            fill={COLORS.orange}
            opacity={0.85}
          />

          {/* Progress bar glow dot at end */}
          {progressBarWidth > 10 && (
            <circle
              cx={60 + progressBarWidth}
              cy={1258}
              r={6}
              fill={COLORS.orange}
              opacity={shimmer * 0.6}
            />
          )}
        </g>

        {/* ── Milestone markers along progress ───────────────────────────── */}
        <g opacity={progressBarEntrance.opacity * 0.5}>
          {[25, 50, 75, 100].map((pct, i) => {
            const xPos = 60 + 960 * (pct / 100);
            return (
              <g key={pct}>
                <line x1={xPos} y1={1250} x2={xPos} y2={1270} stroke={COLORS.deep_black} strokeWidth={1} opacity={0.2} />
                <text
                  x={xPos} y={1298}
                  textAnchor="middle"
                  fontFamily="'Inter', sans-serif"
                  fontSize={22} fontWeight={400}
                  fill={COLORS.cool_silver}
                  opacity={0.5}
                >
                  {pct === 100 ? '105' : `${Math.round(105 * pct / 100)}`}
                </text>
              </g>
            );
          })}
        </g>

        {/* ── Bottom decorative elements ──────────────────────────────────── */}
        <g opacity={card3.opacity * 0.4}>
          {/* Left corner accent */}
          <path d="M 60,1450 L 60,1530 M 60,1450 L 140,1450" fill="none" stroke={COLORS.orange} strokeWidth={2.5} strokeLinecap="round" />
          {/* Right corner accent */}
          <path d="M 1020,1450 L 1020,1530 M 1020,1450 L 940,1450" fill="none" stroke={COLORS.orange} strokeWidth={2.5} strokeLinecap="round" />
        </g>

        {/* ── Floating dots decoration ───────────────────────────────────── */}
        <g opacity={0.12}>
          <circle cx={160} cy={1580 + breathe} r={6} fill={COLORS.orange} />
          <circle cx={340} cy={1620 - breathe * 0.7} r={4} fill={COLORS.sky_blue} />
          <circle cx={540} cy={1560 + breathe * 0.5} r={5} fill={COLORS.amber} />
          <circle cx={740} cy={1600 - breathe * 0.8} r={4} fill={COLORS.orange} />
          <circle cx={920} cy={1570 + breathe * 0.6} r={6} fill={COLORS.sky_blue} />
        </g>

        {/* ── Series badge ───────────────────────────────────────────────── */}
        <g opacity={card1.opacity * 0.35} transform={`translate(0, ${breathe * 0.5})`}>
          <rect x={390} y={1640} width={300} height={48} rx={24} fill={COLORS.orange} fillOpacity={0.08} stroke={COLORS.orange} strokeWidth={1.5} />
          <text
            x={540} y={1672}
            textAnchor="middle"
            fontFamily="'Inter', sans-serif"
            fontSize={24} fontWeight={600}
            fill={COLORS.orange}
            letterSpacing="0.15em"
          >
            FIRST PRINCIPLES
          </text>
        </g>

        {/* ── Caption ────────────────────────────────────────────────────── */}
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
