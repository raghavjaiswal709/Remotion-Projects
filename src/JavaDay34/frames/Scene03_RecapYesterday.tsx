/**
 * Scene03_RecapYesterday — Day 34
 * "Last day, we learned how @Override makes the compiler verify that a method override is genuine."
 * CSV: 5.18s → 11.88s
 * Duration: 219 frames (7.3s)
 *
 * Animation phases:
 *   Phase 1 (frames 0–25):  Label + headline spring in
 *   Phase 2 (frames 20–90): Recap cards build with stagger, connector path draws
 *   Phase 3 (frames 80–end): Pulse on checkmark, breathe on cards, shimmer connectors
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

export const Scene03_RecapYesterday: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1: Scene reveal ──────────────────────────────────────────────────
  const labelEntrance = useSpringEntrance(frame, 0);
  const headlineA = useSpringEntrance(frame, 6);
  const headlineB = useSpringEntrance(frame, 14);

  // ── Phase 2: Content build ─────────────────────────────────────────────────
  const recapCard = useSpringEntrance(frame, 24);
  const point1 = useSpringEntrance(frame, 36);
  const point2 = useSpringEntrance(frame, 48);
  const point3 = useSpringEntrance(frame, 60);
  const checkEntrance = useSpringEntrance(frame, 72);

  // Connector from headline to card
  const conn1Len = 180;
  const conn1Dash = usePathDraw(frame, 30, conn1Len, 25);

  // Connector between bullet points
  const conn2Len = 320;
  const conn2Dash = usePathDraw(frame, 50, conn2Len, 30);

  // Border draw on recap card
  const cardPerimeter = 2 * (960 + 200);
  const cardBorderDash = interpolate(frame, [24, 54], [cardPerimeter, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });

  // ── Phase 3: Micro-animations ──────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 3;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);
  const checkPulse = 1 + Math.sin(frame * 0.1) * 0.04;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s03.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_paper }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <PaperBackground />
        <GlobalDefs />

        {/* ── ZONE A — Label ─────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEntrance.translateY})`} opacity={labelEntrance.opacity}>
          <SectionLabel text="RECAP · DAY 33" y={120} opacity={0.55} />
        </g>

        {/* ── ZONE B — Headlines ─────────────────────────────────────────── */}
        <g transform={`translate(0, ${headlineA.translateY})`} opacity={headlineA.opacity}>
          <text
            x={60} y={240}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={72} fontWeight={800}
            fill={COLORS.deep_black}
          >
            Yesterday
          </text>
        </g>
        <g transform={`translate(0, ${headlineB.translateY})`} opacity={headlineB.opacity}>
          <text
            x={60} y={330}
            fontFamily="'Inter', system-ui, sans-serif"
            fontSize={48} fontWeight={600}
            fill={COLORS.orange}
          >
            @Override Annotation
          </text>
        </g>

        {/* ── Connector line from headline to recap card ──────────────────── */}
        <path
          d="M 540,360 L 540,460"
          fill="none"
          stroke={COLORS.orange}
          strokeWidth={2}
          strokeDasharray={conn1Len}
          strokeDashoffset={conn1Dash}
          strokeLinecap="round"
          opacity={0.25}
        />

        {/* ── ZONE C — Recap card ────────────────────────────────────────── */}
        {/* Card border draw animation */}
        <rect
          x={60} y={480} width={960} height={200} rx={16}
          fill="none"
          stroke={COLORS.sky_blue} strokeWidth={2.5}
          strokeDasharray={cardPerimeter}
          strokeDashoffset={cardBorderDash}
        />
        {/* Card fill */}
        <g opacity={recapCard.opacity} transform={`translate(0, ${recapCard.translateY})`}>
          <rect
            x={60} y={480} width={960} height={200} rx={16}
            fill={COLORS.sky_blue} fillOpacity={0.05}
          />
          <rect x={60} y={480} width={8} height={200} rx={4} fill={COLORS.sky_blue} />

          <text x={100} y={540} fontFamily="'Inter', sans-serif" fontSize={32} fontWeight={500} fill={COLORS.cool_silver}>
            KEY CONCEPT
          </text>
          <text x={100} y={600} fontFamily="'Inter', sans-serif" fontSize={42} fontWeight={700} fill={COLORS.deep_black}>
            Compiler-verified overriding
          </text>
          <text x={100} y={650} fontFamily="'Inter', sans-serif" fontSize={34} fontWeight={400} fill={COLORS.cool_silver}>
            @Override ensures your override is genuine
          </text>
        </g>

        {/* ── Vertical connector between bullets ─────────────────────────── */}
        <path
          d="M 90,720 L 90,1040"
          fill="none"
          stroke={COLORS.orange}
          strokeWidth={2}
          strokeDasharray={conn2Len}
          strokeDashoffset={conn2Dash}
          strokeLinecap="round"
          opacity={0.2}
        />

        {/* ── Bullet point 1 ─────────────────────────────────────────────── */}
        <g opacity={point1.opacity} transform={`translate(0, ${point1.translateY})`}>
          <rect x={60} y={740} width={960} height={100} rx={12}
            fill={COLORS.orange} fillOpacity={0.04}
          />
          <circle cx={100} cy={790} r={16} fill={COLORS.orange} fillOpacity={0.15} stroke={COLORS.orange} strokeWidth={2} />
          <text x={100} y={796} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={24} fontWeight={800} fill={COLORS.orange}>
            1
          </text>
          <text x={140} y={798} fontFamily="'Inter', sans-serif" fontSize={36} fontWeight={600} fill={COLORS.deep_black}>
            Catches misspelled method names
          </text>
        </g>

        {/* ── Bullet point 2 ─────────────────────────────────────────────── */}
        <g opacity={point2.opacity} transform={`translate(0, ${point2.translateY})`}>
          <rect x={60} y={860} width={960} height={100} rx={12}
            fill={COLORS.orange} fillOpacity={0.04}
          />
          <circle cx={100} cy={910} r={16} fill={COLORS.orange} fillOpacity={0.15} stroke={COLORS.orange} strokeWidth={2} />
          <text x={100} y={916} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={24} fontWeight={800} fill={COLORS.orange}>
            2
          </text>
          <text x={140} y={918} fontFamily="'Inter', sans-serif" fontSize={36} fontWeight={600} fill={COLORS.deep_black}>
            Catches wrong parameter types
          </text>
        </g>

        {/* ── Bullet point 3 ─────────────────────────────────────────────── */}
        <g opacity={point3.opacity} transform={`translate(0, ${point3.translateY})`}>
          <rect x={60} y={980} width={960} height={100} rx={12}
            fill={COLORS.orange} fillOpacity={0.04}
          />
          <circle cx={100} cy={1030} r={16} fill={COLORS.orange} fillOpacity={0.15} stroke={COLORS.orange} strokeWidth={2} />
          <text x={100} y={1036} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={24} fontWeight={800} fill={COLORS.orange}>
            3
          </text>
          <text x={140} y={1038} fontFamily="'Inter', sans-serif" fontSize={36} fontWeight={600} fill={COLORS.deep_black}>
            Compile-time safety, not runtime
          </text>
        </g>

        {/* ── Checkmark badge ────────────────────────────────────────────── */}
        <g opacity={checkEntrance.opacity} transform={`translate(540, ${1180 + checkEntrance.translateY + breathe})`}>
          <circle
            cx={0} cy={0} r={52}
            fill={COLORS.green} fillOpacity={0.1}
            stroke={COLORS.green} strokeWidth={3}
            transform={`scale(${checkPulse})`}
            style={{ transformOrigin: '0px 0px' }}
          />
          <path
            d="M -20,0 L -6,14 L 22,-12"
            fill="none"
            stroke={COLORS.green}
            strokeWidth={5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <text
            x={0} y={82}
            textAnchor="middle"
            fontFamily="'Inter', sans-serif"
            fontSize={32} fontWeight={600}
            fill={COLORS.green}
          >
            VERIFIED
          </text>
        </g>

        {/* ── "Now moving forward" transition text ───────────────────────── */}
        <g opacity={checkEntrance.opacity * shimmer * 0.5}>
          <text
            x={540} y={1370}
            textAnchor="middle"
            fontFamily="'Inter', sans-serif"
            fontSize={30} fontWeight={500}
            fill={COLORS.cool_silver}
            letterSpacing="0.12em"
          >
            NOW BUILDING ON THIS...
          </text>
          {/* Arrow pointing down */}
          <path
            d="M 540,1400 L 540,1460 M 528,1445 L 540,1460 L 552,1445"
            fill="none"
            stroke={COLORS.cool_silver}
            strokeWidth={2}
            strokeLinecap="round"
            opacity={shimmer * 0.4}
          />
        </g>

        {/* ── Decorative code snippet ────────────────────────────────────── */}
        <g opacity={point3.opacity * 0.3} transform={`translate(0, ${breathe * 0.5})`}>
          <rect x={200} y={1500} width={680} height={120} rx={8}
            fill={COLORS.deep_black} fillOpacity={0.03}
          />
          <rect x={200} y={1500} width={4} height={120} rx={2} fill={COLORS.sky_blue} opacity={0.5} />
          <text x={224} y={1545} fontFamily="'Fira Code', monospace" fontSize={28} fontWeight={400} fill={COLORS.cool_silver} opacity={0.6}>
            @Override
          </text>
          <text x={224} y={1590} fontFamily="'Fira Code', monospace" fontSize={28} fontWeight={400} fill={COLORS.cool_silver} opacity={0.6}>
            Engine getEngine() {'{'} ... {'}'}
          </text>
        </g>

        {/* ── Caption ────────────────────────────────────────────────────── */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s03.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
