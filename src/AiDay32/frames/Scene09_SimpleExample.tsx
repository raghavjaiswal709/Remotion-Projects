/**
 * Scene 09 — Here Is A Simple One
 * "Here is a simple one."
 * CSV: 28.540s → 30.240s
 * Duration: 51 frames (1.7s)
 *
 * Animation phases:
 *   Phase 1 (0–15): Label + headline
 *   Phase 2 (10–35): Introduction card with simple example preview
 *   Phase 3 (30–end): Micro-animations, pulse
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
const SPRING_SNAP = { damping: 12, stiffness: 260, mass: 0.6 } as const;
const SPRING_SOFT = { damping: 22, stiffness: 120, mass: 1.0 } as const;

function useSpringEntrance(frame: number, delayFrames: number, fps = 30) {
  const f = Math.max(0, frame - delayFrames);
  const progress = spring({ frame: f, fps, config: SPRING_CONFIG });
  const opacity = interpolate(f, [0, 12], [0, 1], { extrapolateRight: 'clamp', easing: ease });
  const translateY = interpolate(progress, [0, 1], [32, 0]);
  return { progress, opacity, translateY };
}

function usePathDraw(frame: number, startFrame: number, totalLength: number, durationFrames = 30) {
  const progress = interpolate(frame, [startFrame, startFrame + durationFrames], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  });
  return totalLength * (1 - progress);
}

export const Scene09_SimpleExample: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1 ──
  const labelIn = useSpringEntrance(frame, 0);
  const h1 = useSpringEntrance(frame, 4);
  const h2 = useSpringEntrance(frame, 8);

  // ── Phase 2 ──
  const mainCard = useSpringEntrance(frame, 12);
  const previewCards = [0, 1, 2].map(i => useSpringEntrance(frame, 18 + i * 6));
  const borderLen = 2 * (960 + 400);
  const borderDash = usePathDraw(frame, 12, borderLen, 25);

  // Robot illustration
  const robotIn = useSpringEntrance(frame, 16);

  // ── Phase 3 ──
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);
  const breathe = Math.sin(frame * 0.06) * 4;
  const arrowBob = Math.sin(frame * 0.1) * 6;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s09.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ── */}
        <g transform={`translate(0, ${labelIn.translateY})`} opacity={labelIn.opacity}>
          <SectionLabel text="MODULE 5 · TRAJECTORY EXAMPLE" y={160} opacity={0.8} />
        </g>

        {/* ── ZONE B ── */}
        <g transform={`translate(0, ${h1.translateY})`} opacity={h1.opacity}>
          <text x={60} y={320} fontFamily={FONT} fontSize={96} fontWeight={800} fill={COLORS.white}>
            A Simple
          </text>
        </g>
        <g transform={`translate(0, ${h2.translateY})`} opacity={h2.opacity}>
          <text x={60} y={440} fontFamily={FONT} fontSize={96} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">
            Example
          </text>
        </g>

        {/* ── ZONE C — Main example card ── */}
        <g opacity={mainCard.opacity} transform={`translate(0, ${mainCard.translateY})`}>
          {/* Animated border */}
          <rect x={60} y={520} width={960} height={400} rx={20}
            fill="none" stroke={COLORS.accent} strokeWidth={2.5}
            strokeDasharray={borderLen} strokeDashoffset={borderDash} />
          <rect x={60} y={520} width={960} height={400} rx={20}
            fill={COLORS.bg_secondary} stroke="none" />

          {/* Label */}
          <text x={100} y={580} fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.12em">
            EXAMPLE TRAJECTORY
          </text>

          {/* Description */}
          <text x={100} y={640} fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.white}>
            "Summarize this article"
          </text>
          <text x={100} y={700} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.text_muted}>
            A research assistant agent
          </text>
          <text x={100} y={750} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.text_muted}>
            that finds and summarizes content.
          </text>

          {/* Simple flow preview */}
          <g transform={`translate(100, 800)`}>
            {['Goal', 'Search', 'Read', 'Summary'].map((step, i) => (
              <g key={i}>
                <rect x={i * 220} y={0} width={180} height={48} rx={12}
                  fill={COLORS.accent} fillOpacity={0.08}
                  stroke={COLORS.accent} strokeWidth={1} />
                <text x={i * 220 + 90} y={30} textAnchor="middle"
                  fontFamily={FONT} fontSize={22} fontWeight={800} fill={COLORS.accent}>
                  {step}
                </text>
                {i < 3 && (
                  <line x1={i * 220 + 180} y1={24} x2={i * 220 + 220} y2={24}
                    stroke={COLORS.accent} strokeWidth={1} opacity={0.3}
                    markerEnd="url(#arrow)" />
                )}
              </g>
            ))}
          </g>
        </g>

        {/* ── Robot illustration ── */}
        <g opacity={robotIn.opacity} transform={`translate(540, ${1050 + robotIn.translateY + breathe})`}>
          {/* Robot head */}
          <rect x={-80} y={0} width={160} height={120} rx={20}
            fill={COLORS.bg_secondary} stroke={COLORS.accent} strokeWidth={2} />
          {/* Eyes */}
          <circle cx={-30} cy={50} r={14} fill={COLORS.accent} opacity={0.6} />
          <circle cx={30} cy={50} r={14} fill={COLORS.accent} opacity={0.6} />
          {/* Pupil dots */}
          <circle cx={-26} cy={48} r={5} fill={COLORS.white} />
          <circle cx={34} cy={48} r={5} fill={COLORS.white} />
          {/* Antenna */}
          <line x1={0} y1={0} x2={0} y2={-30}
            stroke={COLORS.accent} strokeWidth={3} strokeLinecap="round" />
          <circle cx={0} cy={-35} r={8} fill={COLORS.accent} opacity={0.4 * shimmer}
            transform={`scale(${pulse})`} style={{ transformOrigin: '0px -35px' }} />
          {/* Mouth */}
          <rect x={-24} y={80} width={48} height={8} rx={4} fill={COLORS.accent} opacity={0.3} />
          {/* Body */}
          <rect x={-100} y={130} width={200} height={160} rx={16}
            fill={COLORS.bg_secondary} stroke={COLORS.accent} strokeWidth={2} />
          {/* Body detail lines */}
          <line x1={-60} y1={170} x2={60} y2={170}
            stroke={COLORS.accent} strokeWidth={1} opacity={0.15} />
          <line x1={-60} y1={210} x2={60} y2={210}
            stroke={COLORS.accent} strokeWidth={1} opacity={0.15} />
          <line x1={-60} y1={250} x2={60} y2={250}
            stroke={COLORS.accent} strokeWidth={1} opacity={0.15} />
          {/* Core dot */}
          <circle cx={0} cy={190} r={16} fill={COLORS.accent} opacity={0.12} />
          <circle cx={0} cy={190} r={8} fill={COLORS.accent} opacity={0.3 * shimmer} />
          {/* Arms */}
          <rect x={-140} y={150} width={30} height={100} rx={8}
            fill={COLORS.bg_secondary} stroke={COLORS.accent} strokeWidth={1.5} />
          <rect x={110} y={150} width={30} height={100} rx={8}
            fill={COLORS.bg_secondary} stroke={COLORS.accent} strokeWidth={1.5} />
        </g>

        {/* ── Preview step cards at bottom ── */}
        {['STEP 1', 'STEP 2', 'STEP 3'].map((step, i) => {
          const pc = previewCards[i];
          const px = 60 + i * 330;
          return (
            <g key={i} opacity={pc.opacity} transform={`translate(0, ${pc.translateY})`}>
              <BentoCard x={px} y={1440} w={300} h={160} accent={i === 0} />
              <text x={px + 150} y={1510} textAnchor="middle"
                fontFamily={FONT} fontSize={32} fontWeight={800}
                fill={i === 0 ? COLORS.accent : COLORS.text_muted}>
                {step}
              </text>
              <text x={px + 150} y={1560} textAnchor="middle"
                fontFamily={FONT} fontSize={24} fontWeight={800} fill={COLORS.text_muted}>
                {i === 0 ? 'Goal given' : i === 1 ? 'Tool used' : 'Result'}
              </text>
            </g>
          );
        })}

        {/* Down arrow pointing to next scenes */}
        <g transform={`translate(540, ${1680 + arrowBob})`} opacity={0.3}>
          <path d="M -10,0 L 0,14 L 10,0" fill="none"
            stroke={COLORS.accent} strokeWidth={2} strokeLinecap="round" />
        </g>

        {/* ── CAPTION ── */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s09.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
