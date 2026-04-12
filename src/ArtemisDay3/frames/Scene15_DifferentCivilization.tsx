/**
 * Scene 15 — DifferentCivilization
 * "The destination is the same, the machine is from a different civilization."
 * CSV: 71.600s → 76.640s
 * Duration: 155 frames (5.17s)
 *
 * Animation phases:
 *   Phase 1 (0–25): Label + headline per-word spring
 *   Phase 2 (20–70): Moon destination node, two era capsules, tech meter
 *   Phase 3 (60–end): Capsule float, pulse, shimmer
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
const SPRING_SNAP = { damping: 12, stiffness: 260, mass: 0.6 } as const;
const SPRING_HEAVY = { damping: 28, stiffness: 100, mass: 1.4 } as const;

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

export const Scene15_DifferentCivilization: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1 — Headline per-word spring ──
  const labelEntrance = useSpringEntrance(frame, 0);
  const words = ['The', 'machine', 'is', 'from', 'a', 'different', 'civilization.'];
  const wordSprings = words.map((_, i) => {
    const f = Math.max(0, frame - i * 5 - 6);
    const sp = spring({ frame: f, fps, config: SPRING_SNAP });
    const ty = interpolate(sp, [0, 1], [24, 0]);
    const op = interpolate(sp, [0, 0.4], [0, 1], { extrapolateRight: 'clamp' });
    return { ty, op };
  });

  const destLine = useSpringEntrance(frame, 4);

  // ── Phase 2 ──
  const moonNode = useSpringEntrance(frame, 14);
  const apollo8 = useSpringEntrance(frame, 22);
  const artemis2 = useSpringEntrance(frame, 32);
  const arrowDraw = useSpringEntrance(frame, 40);
  const card1 = useSpringEntrance(frame, 50);
  const card2 = useSpringEntrance(frame, 58);
  const bottomQuote = useSpringEntrance(frame, 68);

  // Path draws
  const leftArcLen = 250;
  const rightArcLen = 250;
  const leftDash = usePathDraw(frame, 28, leftArcLen, 20);
  const rightDash = usePathDraw(frame, 38, rightArcLen, 20);

  const dividerLen = 700;
  const dividerDash = usePathDraw(frame, 22, dividerLen, 30);

  // ── Phase 3 ──
  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);
  const float1 = Math.sin(frame * 0.05) * 3;
  const float2 = Math.sin(frame * 0.05 + Math.PI) * 3;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s15.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_paper }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <PaperBackground />
        <GlobalDefs />

        {/* Corner accents */}
        <CornerAccents opacity={0.35} />

        {/* Ghost "CIV" watermark */}
        <text x={540} y={1650} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={380} fontWeight={900}
          fill={COLORS.sky_blue} opacity={0.025}>
          CIV
        </text>

        {/* Zone A */}
        <g transform={`translate(0, ${labelEntrance.translateY})`} opacity={labelEntrance.opacity}>
          <SectionLabel text="SAME DESTINATION · NEW MACHINE" y={260} opacity={0.55} />
        </g>

        {/* Zone B — "destination is the same" */}
        <g transform={`translate(0, ${destLine.translateY})`} opacity={destLine.opacity}>
          <text x={60} y={370} fontFamily="'Inter', sans-serif" fontSize={48} fontWeight={600} fill={COLORS.cool_silver}>
            The destination is the same.
          </text>
        </g>

        {/* Per-word headline */}
        {words.map((word, i) => (
          <text key={i}
            x={60 + i * (word === 'civilization.' ? 0 : 0)}
            y={450}
            opacity={wordSprings[i].op}
            transform={`translate(${i === 0 ? 0 : 0}, ${wordSprings[i].ty})`}
            fontFamily="'Inter', sans-serif"
            fontSize={i === 5 || i === 6 ? 64 : 56}
            fontWeight={i === 5 || i === 6 ? 900 : 700}
            fill={i === 5 || i === 6 ? COLORS.sky_blue : COLORS.deep_black}
          >
            {/* Inline layout hack — render as single text with tspans */}
          </text>
        ))}
        {/* Better: single text with tspans */}
        <text x={60} y={460} fontFamily="'Inter', sans-serif" fontSize={56} fontWeight={700} fill={COLORS.deep_black}>
          {words.map((word, i) => (
            <tspan key={i}
              opacity={wordSprings[i].op}
              fill={i >= 5 ? COLORS.sky_blue : COLORS.deep_black}
              fontWeight={i >= 5 ? 900 : 700}
              dy={wordSprings[i].ty * 0.4}
            >
              {word}{i < words.length - 1 ? ' ' : ''}
            </tspan>
          ))}
        </text>

        {/* Zone C — Moon destination at center top */}
        <g opacity={moonNode.opacity} transform={`translate(540, ${600 + moonNode.translateY + breathe})`}>
          <circle cx={0} cy={0} r={55} fill={COLORS.cool_silver} fillOpacity={0.06}
            stroke={COLORS.cool_silver} strokeWidth={2} />
          <circle cx={-10} cy={-8} r={8} fill={COLORS.cool_silver} fillOpacity={0.06} />
          <circle cx={10} cy={5} r={10} fill={COLORS.cool_silver} fillOpacity={0.04} />
          <circle cx={-5} cy={12} r={5} fill={COLORS.cool_silver} fillOpacity={0.06} />
          <text x={0} y={85} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={700} fill={COLORS.cool_silver}>
            THE MOON
          </text>
          <text x={0} y={115} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={22} fontWeight={400} fill={COLORS.cool_silver} opacity={0.5}>
            Same destination
          </text>
        </g>

        {/* Arrow arcs from both capsules to moon */}
        <path d="M 270,850 Q 340,700 485,610"
          fill="none" stroke={COLORS.cool_silver} strokeWidth={2}
          strokeDasharray={leftArcLen} strokeDashoffset={leftDash}
          opacity={0.3} strokeLinecap="round" markerEnd="url(#arrow)"
        />
        <path d="M 810,850 Q 740,700 595,610"
          fill="none" stroke={COLORS.sky_blue} strokeWidth={2}
          strokeDasharray={rightArcLen} strokeDashoffset={rightDash}
          opacity={0.3} strokeLinecap="round" markerEnd="url(#arrow)"
        />

        {/* Vertical divider */}
        <line x1={540} y1={780} x2={540} y2={1480}
          stroke={COLORS.deep_black} strokeWidth={1} opacity={0.08}
          strokeDasharray={dividerLen} strokeDashoffset={dividerDash}
        />

        {/* Apollo 8 capsule (left) */}
        <g opacity={apollo8.opacity} transform={`translate(270, ${900 + apollo8.translateY + float1})`}>
          {/* Simple cone capsule */}
          <polygon points="0,-50 -35,30 35,30" fill="none" stroke={COLORS.cool_silver} strokeWidth={2} />
          <rect x={-35} y={30} width={70} height={20} rx={2} fill="none" stroke={COLORS.cool_silver} strokeWidth={1.5} />
          <text x={0} y={80} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={32} fontWeight={800} fill={COLORS.cool_silver}>
            APOLLO 8
          </text>
          <text x={0} y={115} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={24} fontWeight={500} fill={COLORS.cool_silver} opacity={0.6}>
            1968
          </text>
        </g>

        {/* Artemis II capsule (right) */}
        <g opacity={artemis2.opacity} transform={`translate(810, ${900 + artemis2.translateY + float2})`}>
          {/* Modern capsule — sleeker */}
          <polygon points="0,-60 -40,35 40,35" fill={COLORS.sky_blue} fillOpacity={0.06}
            stroke={COLORS.sky_blue} strokeWidth={2.5} />
          <rect x={-40} y={35} width={80} height={30} rx={4} fill={COLORS.sky_blue} fillOpacity={0.04}
            stroke={COLORS.sky_blue} strokeWidth={1.5} />
          {/* Service module */}
          <rect x={-32} y={65} width={64} height={60} rx={2} fill="none" stroke={COLORS.sky_blue} strokeWidth={1.5} />
          {/* Solar panels */}
          <line x1={-32} y1={95} x2={-70} y2={95} stroke={COLORS.sky_blue} strokeWidth={2} />
          <line x1={32} y1={95} x2={70} y2={95} stroke={COLORS.sky_blue} strokeWidth={2} />
          <text x={0} y={155} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={32} fontWeight={800} fill={COLORS.sky_blue}>
            ARTEMIS II
          </text>
          <text x={0} y={190} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={24} fontWeight={500} fill={COLORS.sky_blue} opacity={0.6}>
            2025
          </text>
        </g>

        {/* Left column — old tech */}
        <g opacity={card1.opacity} transform={`translate(60, ${1130 + card1.translateY})`}>
          <rect x={0} y={0} width={430} height={200} rx={12}
            fill={COLORS.cool_silver} fillOpacity={0.03} stroke={COLORS.cool_silver} strokeWidth={1} />
          <rect x={0} y={0} width={6} height={200} rx={3} fill={COLORS.cool_silver} />
          <text x={30} y={40} fontFamily="'Inter', sans-serif" fontSize={24} fontWeight={700} fill={COLORS.cool_silver}>
            1968 TECHNOLOGY
          </text>
          <text x={30} y={80} fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={500} fill={COLORS.deep_black} opacity={0.6}>
            Analog instruments
          </text>
          <text x={30} y={115} fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={500} fill={COLORS.deep_black} opacity={0.6}>
            Ground-dependent nav
          </text>
          <text x={30} y={150} fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={500} fill={COLORS.deep_black} opacity={0.6}>
            Manual calculations
          </text>
          <text x={30} y={185} fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={500} fill={COLORS.deep_black} opacity={0.6}>
            No abort automation
          </text>
        </g>

        {/* Right column — new tech */}
        <g opacity={card2.opacity} transform={`translate(560, ${1130 + card2.translateY})`}>
          <rect x={0} y={0} width={430} height={200} rx={12}
            fill={COLORS.sky_blue} fillOpacity={0.03} stroke={COLORS.sky_blue} strokeWidth={1.5} />
          <rect x={0} y={0} width={6} height={200} rx={3} fill={COLORS.sky_blue} />
          <text x={30} y={40} fontFamily="'Inter', sans-serif" fontSize={24} fontWeight={700} fill={COLORS.sky_blue}>
            2025 TECHNOLOGY
          </text>
          <text x={30} y={80} fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={500} fill={COLORS.deep_black}>
            Glass cockpit displays
          </text>
          <text x={30} y={115} fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={500} fill={COLORS.deep_black}>
            Autonomous navigation
          </text>
          <text x={30} y={150} fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={500} fill={COLORS.deep_black}>
            Real-time AI monitoring
          </text>
          <text x={30} y={185} fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={500} fill={COLORS.deep_black}>
            Automated abort systems
          </text>
        </g>

        {/* Bottom quote */}
        <g opacity={bottomQuote.opacity} transform={`translate(0, ${bottomQuote.translateY})`}>
          <text x={540} y={1420} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={36} fontWeight={800}
            fill={COLORS.sky_blue} opacity={shimmer}>
            Different Civilization
          </text>
          <text x={540} y={1460} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={24} fontWeight={400}
            fill={COLORS.cool_silver} opacity={0.5}>
            Same moon, unrecognizable spacecraft
          </text>
        </g>

        {/* Divider + bottom note */}
        <Divider y={1780} opacity={0.12} />
        <text x={540} y={1810} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={22} fontWeight={400} fill={COLORS.cool_silver} letterSpacing="0.15em" opacity={0.45}>
          SAME MOON · DIFFERENT CIVILIZATION
        </text>

        {/* Caption */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s15.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
