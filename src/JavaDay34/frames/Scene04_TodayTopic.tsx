/**
 * Scene04_TodayTopic — Day 34
 * "Today, we are looking at covariant return type."
 * CSV: 12.68s → 16.20s
 * Duration: 124 frames (4.13s)
 *
 * Animation phases:
 *   Phase 1 (frames 0–25):  Label + headline spring entrance
 *   Phase 2 (frames 20–80): Hero text "COVARIANT" typewriter, supporting cards build
 *   Phase 3 (frames 70–end): Pulse on hero text, floating decorative elements
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

const SPRING_CONFIG = { damping: 18, stiffness: 180, mass: 0.8 } as const;
const SPRING_SOFT   = { damping: 22, stiffness: 120, mass: 1.0 } as const;
const SPRING_SNAP   = { damping: 12, stiffness: 260, mass: 0.6 } as const;

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

export const Scene04_TodayTopic: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1: Scene reveal ──────────────────────────────────────────────────
  const labelEntrance = useSpringEntrance(frame, 0);
  const todayLabel = useSpringEntrance(frame, 6);
  const heroWord1 = useSpringEntrance(frame, 12);
  const heroWord2 = useSpringEntrance(frame, 18);

  // ── Phase 2: Content build ─────────────────────────────────────────────────
  const definitionCard = useSpringEntrance(frame, 28);
  const conceptCard1 = useSpringEntrance(frame, 40);
  const conceptCard2 = useSpringEntrance(frame, 52);
  const arrowEntrance = useSpringEntrance(frame, 44);

  // Typewriter for "COVARIANT"
  const typewriterText = "COVARIANT";
  const charsVisible = Math.floor(
    interpolate(frame, [14, 14 + typewriterText.length * 2], [0, typewriterText.length], {
      extrapolateRight: 'clamp',
    })
  );
  const displayText = typewriterText.slice(0, charsVisible);
  const cursorOpacity = Math.sin(frame * 0.3) > 0 ? 1 : 0;

  // Underline draw
  const underlineLen = 600;
  const underlineDash = usePathDraw(frame, 24, underlineLen, 20);

  // Arrow connector from hero to definition
  const arrowLen = 140;
  const arrowDash = usePathDraw(frame, 35, arrowLen, 20);

  // Border draw on definition card
  const defPerimeter = 2 * (960 + 160);
  const defBorderDash = interpolate(frame, [28, 58], [defPerimeter, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });

  // ── Phase 3: Micro-animations ──────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 3;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.02;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s04.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_paper }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <PaperBackground />
        <GlobalDefs />

        {/* ── ZONE A — Label ─────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEntrance.translateY})`} opacity={labelEntrance.opacity}>
          <SectionLabel text="TODAY'S TOPIC · INHERITANCE" y={120} opacity={0.55} />
        </g>

        {/* ── "TODAY" badge ───────────────────────────────────────────────── */}
        <g transform={`translate(0, ${todayLabel.translateY})`} opacity={todayLabel.opacity}>
          <rect x={60} y={190} width={160} height={52} rx={26}
            fill={COLORS.orange} fillOpacity={0.1}
            stroke={COLORS.orange} strokeWidth={2}
          />
          <text x={140} y={224} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={700} fill={COLORS.orange}>
            TODAY
          </text>
        </g>

        {/* ── ZONE B — Hero text: "COVARIANT" ────────────────────────────── */}
        {/* Ghost background layer */}
        <g opacity={heroWord1.opacity * 0.08}>
          <text
            x={540} y={500}
            textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={160} fontWeight={900}
            fill={COLORS.orange}
          >
            COVARIANT
          </text>
        </g>

        {/* Typewriter hero text */}
        <g transform={`translate(0, ${heroWord1.translateY})`} opacity={heroWord1.opacity}>
          <text
            x={540} y={460}
            textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={120} fontWeight={900}
            fill={COLORS.deep_black}
            style={{ transformOrigin: '540px 420px' }}
            transform={`scale(${pulse})`}
          >
            {displayText}
          </text>
          {/* Cursor */}
          {charsVisible < typewriterText.length && (
            <rect
              x={540 + (charsVisible - typewriterText.length / 2) * 66}
              y={370}
              width={4} height={90}
              fill={COLORS.orange}
              opacity={cursorOpacity}
            />
          )}
        </g>

        {/* "Return Type" sub-line */}
        <g transform={`translate(0, ${heroWord2.translateY})`} opacity={heroWord2.opacity}>
          <text
            x={540} y={560}
            textAnchor="middle"
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={64} fontWeight={600}
            fill={COLORS.orange}
          >
            Return Type
          </text>
        </g>

        {/* ── Underline draw ─────────────────────────────────────────────── */}
        <line
          x1={220} y1={590} x2={860} y2={590}
          stroke={COLORS.orange}
          strokeWidth={4}
          strokeDasharray={underlineLen}
          strokeDashoffset={underlineDash}
          strokeLinecap="round"
          opacity={0.5}
        />

        {/* ── Arrow connector ────────────────────────────────────────────── */}
        <path
          d="M 540,610 L 540,710"
          fill="none"
          stroke={COLORS.orange}
          strokeWidth={2}
          strokeDasharray={arrowLen}
          strokeDashoffset={arrowDash}
          strokeLinecap="round"
          markerEnd="url(#arrow)"
          opacity={0.3}
        />

        {/* ── ZONE C — Definition card ───────────────────────────────────── */}
        {/* Border draw */}
        <rect
          x={60} y={730} width={960} height={160} rx={16}
          fill="none"
          stroke={COLORS.sky_blue} strokeWidth={2.5}
          strokeDasharray={defPerimeter}
          strokeDashoffset={defBorderDash}
        />
        <g opacity={definitionCard.opacity} transform={`translate(0, ${definitionCard.translateY})`}>
          <rect x={60} y={730} width={960} height={160} rx={16}
            fill={COLORS.sky_blue} fillOpacity={0.05}
          />
          <rect x={60} y={730} width={8} height={160} rx={4} fill={COLORS.sky_blue} />
          <text x={100} y={790} fontFamily="'Inter', sans-serif" fontSize={30} fontWeight={500} fill={COLORS.cool_silver}>
            DEFINITION
          </text>
          <text x={100} y={845} fontFamily="'Inter', sans-serif" fontSize={36} fontWeight={700} fill={COLORS.deep_black}>
            A child method returns a more specific type
          </text>
        </g>

        {/* ── Concept cards ──────────────────────────────────────────────── */}
        {/* Left: Parent returns Engine */}
        <g opacity={conceptCard1.opacity} transform={`translate(60, ${960 + conceptCard1.translateY})`}>
          <rect x={0} y={0} width={440} height={200} rx={14}
            fill={COLORS.cool_silver} fillOpacity={0.06}
            stroke={COLORS.cool_silver} strokeWidth={1.5}
          />
          <text x={220} y={50} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={500} fill={COLORS.cool_silver} letterSpacing="0.1em">
            PARENT
          </text>
          <text x={220} y={110} textAnchor="middle" fontFamily="'Fira Code', monospace" fontSize={34} fontWeight={700} fill={COLORS.deep_black}>
            Engine
          </text>
          <text x={220} y={160} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={400} fill={COLORS.cool_silver}>
            General type
          </text>
        </g>

        {/* Arrow between cards */}
        <g opacity={arrowEntrance.opacity} transform={`translate(0, ${arrowEntrance.translateY})`}>
          <line x1={520} y1={1060} x2={560} y2={1060}
            stroke={COLORS.orange} strokeWidth={3}
            markerEnd="url(#arrow)"
          />
          <text x={540} y={1040} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={24} fontWeight={600} fill={COLORS.orange}>
            narrows to
          </text>
        </g>

        {/* Right: Child returns MaglevEngine */}
        <g opacity={conceptCard2.opacity} transform={`translate(540, ${960 + conceptCard2.translateY})`}>
          <rect x={0} y={0} width={440} height={200} rx={14}
            fill={COLORS.orange} fillOpacity={0.06}
            stroke={COLORS.orange} strokeWidth={2}
          />
          <text x={220} y={50} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={500} fill={COLORS.orange} letterSpacing="0.1em">
            CHILD
          </text>
          <text x={220} y={110} textAnchor="middle" fontFamily="'Fira Code', monospace" fontSize={34} fontWeight={700} fill={COLORS.orange}>
            MaglevEngine
          </text>
          <text x={220} y={160} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={28} fontWeight={400} fill={COLORS.cool_silver}>
            Specific type
          </text>
        </g>

        {/* ── Decorative floating elements ────────────────────────────────── */}
        <g opacity={0.15}>
          <circle cx={120} cy={1300 + breathe} r={5} fill={COLORS.orange} />
          <circle cx={960} cy={1320 - breathe * 0.8} r={4} fill={COLORS.sky_blue} />
          <circle cx={540} cy={1280 + breathe * 0.6} r={6} fill={COLORS.amber} />
        </g>

        {/* ── Bottom badge ────────────────────────────────────────────────── */}
        <g opacity={definitionCard.opacity * 0.3 * shimmer} transform={`translate(0, ${breathe * 0.5})`}>
          <rect x={340} y={1360} width={400} height={46} rx={23}
            fill={COLORS.orange} fillOpacity={0.06}
            stroke={COLORS.orange} strokeWidth={1.5}
          />
          <text x={540} y={1391} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={24} fontWeight={600} fill={COLORS.orange} letterSpacing="0.12em">
            INHERITANCE MODULE
          </text>
        </g>

        {/* ── IS-A relationship hint ─────────────────────────────────────── */}
        <g opacity={conceptCard2.opacity * shimmer * 0.4}>
          <text x={540} y={1480} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={32} fontWeight={500} fill={COLORS.cool_silver}>
            MaglevEngine IS-A Engine
          </text>
          <line x1={380} y1={1500} x2={700} y2={1500} stroke={COLORS.cool_silver} strokeWidth={1} opacity={0.3} />
        </g>

        {/* ── Decorative train track lines ────────────────────────────────── */}
        <g opacity={conceptCard1.opacity * 0.12}>
          <line x1={60} y1={1580} x2={1020} y2={1580} stroke={COLORS.deep_black} strokeWidth={3} />
          <line x1={60} y1={1590} x2={1020} y2={1590} stroke={COLORS.deep_black} strokeWidth={3} />
          {Array.from({ length: 20 }, (_, i) => (
            <rect
              key={i}
              x={80 + i * 48}
              y={1573}
              width={24}
              height={4}
              rx={1}
              fill={COLORS.deep_black}
              opacity={0.4}
            />
          ))}
        </g>

        {/* ── Caption ────────────────────────────────────────────────────── */}
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
