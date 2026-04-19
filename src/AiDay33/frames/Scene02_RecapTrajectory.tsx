/**
 * Scene 02 — Recap Trajectory
 * "Last day, we learned what a trajectory is."
 * CSV: 5.640s → 8.090s
 * Duration: 82 frames (2.7s)
 *
 * Theme: Dark (#0D0D0D) + grid + teal accent (#76ABAE)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–25):   Section label + headline spring in
 *   Phase 2 (frames 20–60):  Trajectory arrow path-draw, yesterday badge
 *   Phase 3 (frames 50–end): Arrow pulse, floating dots
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

export const Scene02_RecapTrajectory: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;

  // ── Phase 1: Scene reveal ──────────────────────────────────────────────────
  const labelEntrance = useSpringEntrance(frame, 0);
  const headlineA = useSpringEntrance(frame, 6);
  const headlineB = useSpringEntrance(frame, 12);

  // ── Phase 2: Content build ─────────────────────────────────────────────────
  const card1 = useSpringEntrance(frame, 18);
  const card2 = useSpringEntrance(frame, 30);

  // Trajectory arrow (long horizontal path)
  const arrowPath = 800;
  const arrowDash = usePathDraw(frame, 20, arrowPath, 35);

  // Node circles stagger
  const nodes = [0, 1, 2, 3, 4].map(i => {
    const f = Math.max(0, frame - 25 - i * 6);
    const s = spring({ frame: f, fps, config: SPRING_SNAP });
    return { scale: interpolate(s, [0, 1], [0, 1]), opacity: interpolate(f, [0, 8], [0, 1], { extrapolateRight: 'clamp' }) };
  });

  // ── Phase 3: Micro-animations ──────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 3;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.02;
  const shimmer = interpolate(Math.sin(frame * 0.05), [-1, 1], [0.8, 1]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s02.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ──────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEntrance.translateY})`} opacity={labelEntrance.opacity}>
          <SectionLabel text="RECAP · DAY 32" y={160} opacity={0.8} />
        </g>

        {/* ── ZONE B ──────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${headlineA.translateY})`} opacity={headlineA.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={96} fontWeight={800} fill={COLORS.white}>
            Last Day
          </text>
        </g>
        <g transform={`translate(0, ${headlineB.translateY})`} opacity={headlineB.opacity}>
          <text x={60} y={410} fontFamily={FONT} fontSize={56} fontWeight={800} fill={COLORS.accent} fontStyle="italic">
            Trajectory
          </text>
        </g>

        {/* ── ZONE C — Trajectory illustration ────────────────────────── */}
        {/* Main trajectory card */}
        <g opacity={card1.opacity} transform={`translate(0, ${card1.translateY})`}>
          <BentoCard x={60} y={520} w={960} h={500} accent />

          {/* Trajectory arrow path */}
          <path
            d="M 140,770 L 940,770"
            fill="none"
            stroke={COLORS.accent}
            strokeWidth={3}
            strokeDasharray={arrowPath}
            strokeDashoffset={arrowDash}
            strokeLinecap="round"
            markerEnd="url(#arrow)"
          />

          {/* Step nodes along the trajectory */}
          {nodes.map((n, i) => {
            const cx = 180 + i * 180;
            return (
              <g key={i} opacity={n.opacity}>
                <circle
                  cx={cx} cy={770}
                  r={24 * n.scale}
                  fill={COLORS.bg_primary}
                  stroke={COLORS.accent}
                  strokeWidth={2.5}
                />
                <circle
                  cx={cx} cy={770}
                  r={10 * n.scale}
                  fill={COLORS.accent}
                  opacity={0.6}
                />
                <text
                  x={cx} y={720}
                  textAnchor="middle"
                  fontFamily={FONT} fontSize={32} fontWeight={800}
                  fill={COLORS.text_muted}
                  opacity={n.opacity}
                >
                  S{i + 1}
                </text>
              </g>
            );
          })}

          {/* Labels */}
          <text x={140} y={620} fontFamily={FONT} fontSize={44} fontWeight={800} fill={COLORS.white}>
            A Complete Sequence
          </text>
          <text x={140} y={670} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.text_muted}>
            From task start to task end
          </text>

          {/* Start / End markers */}
          <text x={140} y={846} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.accent} opacity={shimmer}>
            START
          </text>
          <text x={890} y={846} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.accent} opacity={shimmer} textAnchor="end">
            END
          </text>
        </g>

        {/* Yesterday summary card */}
        <g opacity={card2.opacity} transform={`translate(0, ${card2.translateY})`}>
          <BentoCard x={60} y={1060} w={960} h={160} />
          <rect x={60} y={1060} width={6} height={160} rx={3} fill={COLORS.accent} />
          <text x={100} y={1118} fontFamily={FONT} fontSize={40} fontWeight={800} fill={COLORS.white}>
            Trajectory = ordered list of (observation, action) pairs
          </text>
          <text x={100} y={1168} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.text_muted}>
            The complete record of what an agent did
          </text>
        </g>

        {/* Floating breathing element */}
        <g transform={`translate(540, ${1400 + breathe})`}>
          <circle cx={0} cy={0} r={40} fill={COLORS.accent} fillOpacity={0.06 * shimmer} />
          <circle cx={0} cy={0} r={40} fill="none" stroke={COLORS.accent} strokeWidth={1.5}
            transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} />
          <circle cx={0} cy={0} r={20} fill={COLORS.accent} fillOpacity={0.12} />
        </g>

        {/* Additional floating dots for visual depth */}
        <circle cx={200} cy={1500 + breathe * 1.3} r={5} fill={COLORS.accent} opacity={0.2 * shimmer} />
        <circle cx={880} cy={1480 + breathe * 0.9} r={4} fill={COLORS.accent} opacity={0.15 * shimmer} />
        <circle cx={350} cy={1550 + breathe * 1.6} r={3} fill={COLORS.accent} opacity={0.18 * shimmer} />
        <circle cx={730} cy={1530 + breathe} r={6} fill={COLORS.accent} opacity={0.12 * shimmer} />

        {/* Corner accents */}
        <path d="M 60,60 L 60,140 M 60,60 L 140,60" fill="none" stroke={COLORS.accent} strokeWidth={2.5} strokeLinecap="round" opacity={0.35} />
        <path d="M 1020,1740 L 1020,1660 M 1020,1740 L 940,1740" fill="none" stroke={COLORS.accent} strokeWidth={2.5} strokeLinecap="round" opacity={0.35} />

        {/* ── CAPTION ─────────────────────────────────────────────────── */}
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
