/**
 * Scene 02 — Recap Yesterday
 * "Last day, we learned what autonomy is,"
 * CSV: 5.340s → 7.740s
 * Duration: 80 frames (2.67s)
 *
 * Animation phases:
 *   Phase 1 (0–20): Label + headline spring
 *   Phase 2 (15–50): Autonomy spectrum card builds
 *   Phase 3 (45–end): Pulse on spectrum indicator
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

export const Scene02_RecapAutonomy: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1 ──
  const labelEntrance = useSpringEntrance(frame, 0);
  const headlineA = useSpringEntrance(frame, 4);
  const headlineB = useSpringEntrance(frame, 8);

  // ── Phase 2 ──
  const card1 = useSpringEntrance(frame, 14);
  const card2 = useSpringEntrance(frame, 22);
  const card3 = useSpringEntrance(frame, 30);

  // Spectrum bar draw
  const spectrumLen = 840;
  const spectrumDash = usePathDraw(frame, 18, spectrumLen, 25);

  // Border draw on main card
  const mainPerimeter = 2 * (960 + 300);
  const mainBorderDash = usePathDraw(frame, 12, mainPerimeter, 30);

  // ── Phase 3 ──
  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);
  const indicatorGlow = 0.3 + Math.sin(frame * 0.1) * 0.2;

  // Robot illustration parts
  const robotFloat = Math.sin(frame * 0.05) * 5;
  const armSwing = Math.sin(frame * 0.07) * 8;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s02.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ── */}
        <g transform={`translate(0, ${labelEntrance.translateY})`} opacity={labelEntrance.opacity}>
          <SectionLabel text="MODULE 5 · TRAJECTORY" y={160} opacity={0.8} />
        </g>

        {/* ── ZONE B ── */}
        <g transform={`translate(0, ${headlineA.translateY})`} opacity={headlineA.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={88} fontWeight={800} fill={COLORS.white}>
            Last Day
          </text>
        </g>
        <g transform={`translate(0, ${headlineB.translateY})`} opacity={headlineB.opacity}>
          <text x={60} y={400} fontFamily={FONT} fontSize={56} fontWeight={800} fontStyle="italic" fill={COLORS.accent}>
            Autonomy
          </text>
        </g>

        {/* ── ZONE C — Autonomy recap ── */}
        {/* Main explanation card */}
        <g opacity={card1.opacity} transform={`translate(0, ${card1.translateY})`}>
          <BentoCard x={60} y={480} w={960} h={300} accent />
          <rect
            x={60} y={480} width={960} height={300} rx={20}
            fill="none" stroke={COLORS.accent} strokeWidth={2}
            strokeDasharray={mainPerimeter}
            strokeDashoffset={mainBorderDash}
          />
          {/* Robot head illustration */}
          <g transform={`translate(160, ${600 + robotFloat})`}>
            {/* Head */}
            <rect x={-50} y={-60} width={100} height={80} rx={16} fill={COLORS.bg_secondary} stroke={COLORS.accent} strokeWidth={2} />
            {/* Eyes */}
            <circle cx={-20} cy={-30} r={8} fill={COLORS.accent} opacity={shimmer} />
            <circle cx={20} cy={-30} r={8} fill={COLORS.accent} opacity={shimmer} />
            {/* Antenna */}
            <line x1={0} y1={-60} x2={0} y2={-85} stroke={COLORS.accent} strokeWidth={2} />
            <circle cx={0} cy={-90} r={5} fill={COLORS.accent} />
            {/* Body */}
            <rect x={-40} y={24} width={80} height={60} rx={10} fill={COLORS.bg_secondary} stroke={COLORS.accent} strokeWidth={1.5} />
            {/* Arms */}
            <line x1={-40} y1={40} x2={-70} y2={60 + armSwing} stroke={COLORS.accent} strokeWidth={2} strokeLinecap="round" />
            <line x1={40} y1={40} x2={70} y2={60 - armSwing} stroke={COLORS.accent} strokeWidth={2} strokeLinecap="round" />
          </g>
          <text x={280} y={570} fontFamily={FONT} fontSize={44} fontWeight={800} fill={COLORS.white}>
            We learned what
          </text>
          <text x={280} y={630} fontFamily={FONT} fontSize={52} fontWeight={800} fontStyle="italic" fill={COLORS.accent}>
            autonomy
          </text>
          <text x={590} y={630} fontFamily={FONT} fontSize={44} fontWeight={800} fill={COLORS.white}>
             means.
          </text>
          <text x={280} y={700} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.text_muted}>
            How much the agent acts on its own.
          </text>
        </g>

        {/* Autonomy spectrum visualization */}
        <g opacity={card2.opacity} transform={`translate(0, ${card2.translateY})`}>
          <BentoCard x={60} y={820} w={960} h={280} />
          <text x={100} y={890} fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.white}>
            Autonomy Spectrum
          </text>

          {/* Spectrum line */}
          <line
            x1={120} y1={960} x2={960} y2={960}
            stroke={COLORS.accent} strokeWidth={4}
            strokeDasharray={spectrumLen}
            strokeDashoffset={spectrumDash}
            strokeLinecap="round"
          />

          {/* Left label — Full Human Control */}
          <text x={120} y={1010} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            FULL CONTROL
          </text>
          <circle cx={120} cy={960} r={10} fill={COLORS.white} opacity={card2.opacity} />

          {/* Right label — Full Independence */}
          <text x={960} y={1010} textAnchor="end" fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.accent}>
            INDEPENDENCE
          </text>
          <circle cx={960} cy={960} r={10} fill={COLORS.accent} opacity={card2.opacity} />

          {/* Middle indicator (pulsing) */}
          <g transform={`translate(540, 960)`}>
            <circle cx={0} cy={0} r={14} fill={COLORS.accent} opacity={indicatorGlow} />
            <circle cx={0} cy={0} r={8} fill={COLORS.accent} />
          </g>

          {/* Tick marks */}
          {[0, 1, 2, 3, 4].map(i => {
            const tx = 120 + i * 210;
            return (
              <line key={i} x1={tx} y1={948} x2={tx} y2={972} stroke="rgba(255,255,255,0.2)" strokeWidth={1} />
            );
          })}
        </g>

        {/* Arrow pointing forward to today */}
        <g opacity={card3.opacity} transform={`translate(0, ${card3.translateY})`}>
          <BentoCard x={60} y={1140} w={960} h={180} accent />
          <text x={100} y={1220} fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.white}>
            Now: What happens when the agent acts?
          </text>
          <text x={100} y={1270} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent}>
            The trajectory — the complete record
          </text>
          {/* Forward arrow */}
          <path
            d="M 920,1230 L 960,1230 L 945,1215 M 960,1230 L 945,1245"
            fill="none" stroke={COLORS.accent} strokeWidth={3} strokeLinecap="round"
            opacity={shimmer}
          />
        </g>

        {/* Floating decorative nodes */}
        {[
          { x: 200, y: 1450, r: 20 },
          { x: 540, y: 1500, r: 28 },
          { x: 880, y: 1460, r: 22 },
        ].map((n, i) => {
          const nf = Math.sin(frame * 0.04 + i * 1.2) * 6;
          return (
            <g key={i} transform={`translate(${n.x}, ${n.y + nf})`} opacity={card3.opacity * 0.4}>
              <circle cx={0} cy={0} r={n.r} fill="none" stroke={COLORS.accent} strokeWidth={1.5}
                transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} />
              <circle cx={0} cy={0} r={n.r * 0.4} fill={COLORS.accent} opacity={0.15} />
            </g>
          );
        })}

        {/* Connecting dashed lines between decoration nodes */}
        <line x1={220} y1={1450} x2={520} y2={1500}
          stroke={COLORS.accent} strokeWidth={1} strokeDasharray="6 8" opacity={card3.opacity * 0.2} />
        <line x1={560} y1={1500} x2={860} y2={1460}
          stroke={COLORS.accent} strokeWidth={1} strokeDasharray="6 8" opacity={card3.opacity * 0.2} />

        {/* ── CAPTION ── */}
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
