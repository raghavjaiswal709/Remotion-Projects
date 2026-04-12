/**
 * Scene 10 — FundamentalQuestion
 * "same fundamental question, can humans survive deep space beyond Earth's magnetic shield long enough to matter?"
 * CSV: 44.340s → 52.660s
 * Duration: 258 frames (8.6s) — longest scene
 *
 * Animation phases:
 *   Phase 1 (0–30): Question mark reveal, section label
 *   Phase 2 (25–120): Earth shield diagram, radiation arrows, survival meter
 *   Phase 3 (100–end): Shield pulse, particle float, survival meter breathes
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
import { PaperBackground, GlobalDefs, Caption, SectionLabel, CornerAccents, Divider } from '../helpers/components';

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

// Radiation arrows
const RADIATION_ARROWS = [
  { x: 850, y: 600, angle: -140 },
  { x: 880, y: 720, angle: -160 },
  { x: 860, y: 840, angle: -150 },
  { x: 840, y: 500, angle: -130 },
  { x: 870, y: 960, angle: -165 },
];

export const Scene10_FundamentalQuestion: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1 ──
  const labelEntrance = useSpringEntrance(frame, 0);
  const questionA = useSpringEntrance(frame, 6);
  const questionB = useSpringEntrance(frame, 12);
  const questionC = useSpringEntrance(frame, 18);

  // ── Phase 2 ──
  const earthSpring = useSpringEntrance(frame, 24);
  const shieldArc = 600;
  const shieldDash = usePathDraw(frame, 28, shieldArc, 35);
  const radSprings = RADIATION_ARROWS.map((_, i) => useSpringEntrance(frame, 40 + i * 8));
  const humanIcon = useSpringEntrance(frame, 60);
  const meterSpring = useSpringEntrance(frame, 72);
  const card1 = useSpringEntrance(frame, 82);
  const card2 = useSpringEntrance(frame, 94);
  const card3 = useSpringEntrance(frame, 106);

  // Survival meter
  const meterValue = useCounter(frame, 80, 100, 60);
  const meterWidth = interpolate(meterValue, [0, 100], [0, 400], { extrapolateRight: 'clamp' });

  // ── Phase 3 ──
  const breathe = Math.sin(frame * 0.05) * 4;
  const pulse = 1 + Math.sin(frame * 0.07) * 0.02;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);
  const shieldPulse = 1 + Math.sin(frame * 0.06) * 0.025;

  // Radiation particles floating
  const particles = Array.from({ length: 15 }, (_, i) => ({
    x: 700 + Math.sin(frame * 0.03 + i * 2) * (50 + i * 8),
    y: 500 + (i * 80) % 500 + Math.cos(frame * 0.04 + i) * 10,
    r: 2 + (i % 3),
    opacity: interpolate(Math.sin(frame * 0.05 + i * 1.5), [-1, 1], [0.05, 0.2]),
  }));

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s10.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_paper }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <PaperBackground />
        <GlobalDefs />
        <CornerAccents color={COLORS.vibrant_red} />

        {/* Ghost question mark */}
        <text x={880} y={520} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={450} fontWeight={900} fill={COLORS.vibrant_red} opacity={0.025}>
          ?
        </text>

        {/* Zone A */}
        <g transform={`translate(0, ${labelEntrance.translateY})`} opacity={labelEntrance.opacity}>
          <SectionLabel text="THE FUNDAMENTAL QUESTION" y={260} opacity={0.55} />
        </g>

        {/* Zone B — Multi-line question */}
        <g transform={`translate(0, ${questionA.translateY})`} opacity={questionA.opacity}>
          <text x={60} y={360} fontFamily="'Inter', sans-serif" fontSize={56} fontWeight={800} fill={COLORS.deep_black}>
            Can Humans Survive
          </text>
        </g>
        <g transform={`translate(0, ${questionB.translateY})`} opacity={questionB.opacity}>
          <text x={60} y={430} fontFamily="'Inter', sans-serif" fontSize={56} fontWeight={800} fill={COLORS.sky_blue}>
            Deep Space?
          </text>
        </g>
        <g transform={`translate(0, ${questionC.translateY})`} opacity={questionC.opacity}>
          <text x={60} y={490} fontFamily="'Inter', sans-serif" fontSize={36} fontWeight={400} fill={COLORS.cool_silver}>
            Beyond Earth's magnetic shield — long enough to matter
          </text>
        </g>

        {/* Zone C — Earth with magnetic shield */}
        <g opacity={earthSpring.opacity} transform={`translate(0, ${earthSpring.translateY})`}>
          {/* Earth */}
          <circle cx={320} cy={760} r={100} fill={COLORS.sky_blue} fillOpacity={0.1} stroke={COLORS.sky_blue} strokeWidth={2.5} />
          <ellipse cx={300} cy={750} rx={40} ry={28} fill={COLORS.green} fillOpacity={0.12} />
          <ellipse cx={340} cy={775} rx={25} ry={18} fill={COLORS.green} fillOpacity={0.08} />
          <text x={320} y={895} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={700} fill={COLORS.deep_black}>
            EARTH
          </text>

          {/* Magnetic shield arc */}
          <path
            d="M 320,610 C 520,610 600,700 600,760 C 600,820 520,910 320,910"
            fill="none"
            stroke={COLORS.sky_blue}
            strokeWidth={3}
            strokeDasharray={shieldArc}
            strokeDashoffset={shieldDash}
            strokeLinecap="round"
            opacity={0.4}
            transform={`scale(${shieldPulse})`}
            style={{ transformOrigin: '320px 760px' }}
          />

          {/* Shield label */}
          <text x={580} y={760} fontFamily="'Inter', sans-serif" fontSize={22} fontWeight={600} fill={COLORS.sky_blue} opacity={earthSpring.opacity * 0.6} letterSpacing="0.08em">
            MAGNETIC
          </text>
          <text x={580} y={788} fontFamily="'Inter', sans-serif" fontSize={22} fontWeight={600} fill={COLORS.sky_blue} opacity={earthSpring.opacity * 0.6} letterSpacing="0.08em">
            SHIELD
          </text>
        </g>

        {/* Radiation arrows hitting shield */}
        {RADIATION_ARROWS.map((arrow, i) => (
          <g key={i} opacity={radSprings[i].opacity}>
            <line
              x1={arrow.x + 40}
              y1={arrow.y}
              x2={arrow.x}
              y2={arrow.y}
              stroke={COLORS.vibrant_red}
              strokeWidth={2}
              opacity={0.4}
              markerEnd="url(#arrow)"
              transform={`rotate(${arrow.angle}, ${arrow.x + 20}, ${arrow.y})`}
            />
            {/* Deflected scatter */}
            <circle
              cx={arrow.x - 10}
              cy={arrow.y}
              r={4}
              fill={COLORS.vibrant_red}
              fillOpacity={0.1 * shimmer}
            />
          </g>
        ))}

        {/* Floating radiation particles beyond shield */}
        {particles.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={p.r} fill={COLORS.vibrant_red} opacity={p.opacity} />
        ))}

        {/* Deep space zone (beyond shield) */}
        <g opacity={humanIcon.opacity * 0.3}>
          <line x1={660} y1={600} x2={660} y2={920} stroke={COLORS.vibrant_red} strokeWidth={1} strokeDasharray="6,6" opacity={0.3} />
          <text x={680} y={595} fontFamily="'Inter', sans-serif" fontSize={20} fontWeight={500} fill={COLORS.vibrant_red} opacity={0.5} letterSpacing="0.1em">
            DEEP SPACE
          </text>
        </g>

        {/* Human figure icon (beyond shield) */}
        <g opacity={humanIcon.opacity} transform={`translate(820, ${750 + humanIcon.translateY + breathe})`}>
          {/* Head */}
          <circle cx={0} cy={-30} r={16} fill="none" stroke={COLORS.deep_black} strokeWidth={2} opacity={0.5} />
          {/* Body */}
          <line x1={0} y1={-14} x2={0} y2={30} stroke={COLORS.deep_black} strokeWidth={2} opacity={0.5} />
          {/* Arms */}
          <line x1={-20} y1={5} x2={20} y2={5} stroke={COLORS.deep_black} strokeWidth={2} opacity={0.5} />
          {/* Legs */}
          <line x1={0} y1={30} x2={-14} y2={55} stroke={COLORS.deep_black} strokeWidth={2} opacity={0.5} />
          <line x1={0} y1={30} x2={14} y2={55} stroke={COLORS.deep_black} strokeWidth={2} opacity={0.5} />
          {/* Question mark */}
          <text x={30} y={-20} fontFamily="'Inter', sans-serif" fontSize={36} fontWeight={900} fill={COLORS.vibrant_red} opacity={0.5 * shimmer}>
            ?
          </text>
        </g>

        {/* Survival meter */}
        <g opacity={meterSpring.opacity} transform={`translate(60, ${1060 + meterSpring.translateY})`}>
          <text x={0} y={0} fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={700} fill={COLORS.deep_black}>
            SURVIVAL READINESS
          </text>
          {/* Track */}
          <rect x={0} y={20} width={960} height={14} rx={7} fill={COLORS.deep_black} opacity={0.06} />
          {/* Fill bar */}
          <rect x={0} y={20} width={meterWidth * (960 / 400)} height={14} rx={7} fill={COLORS.sky_blue} opacity={0.7} />
          {/* Percentage label */}
          <text x={meterWidth * (960 / 400) + 12} y={34} fontFamily="'Inter', sans-serif" fontSize={22} fontWeight={700} fill={COLORS.sky_blue}>
            {meterValue}%
          </text>
          {/* "UNKNOWN" label at bar end */}
          <text x={960} y={0} textAnchor="end" fontFamily="'Inter', sans-serif" fontSize={22} fontWeight={500} fill={COLORS.vibrant_red} opacity={0.5}>
            UNKNOWN THRESHOLD
          </text>
        </g>

        {/* Three challenge cards */}
        <g opacity={card1.opacity} transform={`translate(60, ${1170 + card1.translateY})`}>
          <rect x={0} y={0} width={300} height={110} rx={12} fill={COLORS.vibrant_red} fillOpacity={0.03} stroke={COLORS.vibrant_red} strokeWidth={1.5} />
          <rect x={0} y={0} width={6} height={110} rx={3} fill={COLORS.vibrant_red} />
          <text x={24} y={40} fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={700} fill={COLORS.deep_black}>
            Radiation
          </text>
          <text x={24} y={72} fontFamily="'Inter', sans-serif" fontSize={24} fontWeight={400} fill={COLORS.cool_silver}>
            Solar particle events
          </text>
          <text x={24} y={96} fontFamily="'Inter', sans-serif" fontSize={24} fontWeight={400} fill={COLORS.cool_silver}>
            & cosmic rays
          </text>
        </g>

        <g opacity={card2.opacity} transform={`translate(380, ${1170 + card2.translateY})`}>
          <rect x={0} y={0} width={300} height={110} rx={12} fill={COLORS.orange} fillOpacity={0.03} stroke={COLORS.orange} strokeWidth={1.5} />
          <rect x={0} y={0} width={6} height={110} rx={3} fill={COLORS.orange} />
          <text x={24} y={40} fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={700} fill={COLORS.deep_black}>
            Isolation
          </text>
          <text x={24} y={72} fontFamily="'Inter', sans-serif" fontSize={24} fontWeight={400} fill={COLORS.cool_silver}>
            260,000+ miles from
          </text>
          <text x={24} y={96} fontFamily="'Inter', sans-serif" fontSize={24} fontWeight={400} fill={COLORS.cool_silver}>
            any rescue
          </text>
        </g>

        <g opacity={card3.opacity} transform={`translate(700, ${1170 + card3.translateY})`}>
          <rect x={0} y={0} width={300} height={110} rx={12} fill={COLORS.purple} fillOpacity={0.03} stroke={COLORS.purple} strokeWidth={1.5} />
          <rect x={0} y={0} width={6} height={110} rx={3} fill={COLORS.purple} />
          <text x={24} y={40} fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={700} fill={COLORS.deep_black}>
            Duration
          </text>
          <text x={24} y={72} fontFamily="'Inter', sans-serif" fontSize={24} fontWeight={400} fill={COLORS.cool_silver}>
            10+ days beyond
          </text>
          <text x={24} y={96} fontFamily="'Inter', sans-serif" fontSize={24} fontWeight={400} fill={COLORS.cool_silver}>
            Earth&apos;s protection
          </text>
        </g>

        {/* Bottom question label */}
        <g opacity={card3.opacity * shimmer}>
          <text x={540} y={1430} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={36} fontWeight={700} fill={COLORS.sky_blue}>
            Long enough to matter?
          </text>
          <text x={540} y={1470} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={400} fill={COLORS.cool_silver}>
            Artemis II will find out.
          </text>
        </g>

        {/* Gentle divider */}
        <line x1={200} y1={1520} x2={880} y2={1520} stroke={COLORS.deep_black} strokeWidth={1} opacity={0.06} />

        {/* Bottom summary */}
        <g opacity={card3.opacity * shimmer}>
          <text x={540} y={1580} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={500} fill={COLORS.cool_silver} letterSpacing="0.12em">
            THE SAME QUESTION — 56 YEARS LATER
          </text>
        </g>

        {/* Divider + bottom note */}
        <Divider y={1780} opacity={0.12} />
        <text x={540} y={1810} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={22} fontWeight={400} fill={COLORS.cool_silver} letterSpacing="0.15em" opacity={0.45}>
          RADIATION · ISOLATION · DURATION
        </text>

        {/* Caption */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s10.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
