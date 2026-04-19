/**
 * Scene 07 — SuccessCriterion
 * "and a measurable success criterion."
 * CSV: 21.380s → 23.560s
 * Duration: ~79 frames
 *
 * Theme: Dark (#0D0D0D) + grid + AI accent (#76ABAE)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–25):   Label + headline spring
 *   Phase 2 (frames 20–80):  Measuring gauge illustration + metric cards
 *   Phase 3 (frames 60–end): Needle rotation, pulse rings, particles
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
import { DarkBackground, GlobalDefs, Caption, BentoCard, SectionLabel } from '../helpers/components';

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

export const Scene07_SuccessCriterion: React.FC = () => {
  const frame = useCurrentFrame();
  const fps   = 30;

  // ── Phase 1: Scene reveal ──────────────────────────────────────────────────
  const labelEntrance = useSpringEntrance(frame, 0);
  const headlineA     = useSpringEntrance(frame, 5);
  const headlineB     = useSpringEntrance(frame, 11);

  // ── Phase 2: Content build ─────────────────────────────────────────────────
  const gaugeCard  = useSpringEntrance(frame, 18);
  const card1      = useSpringEntrance(frame, 32);
  const card2      = useSpringEntrance(frame, 44);
  const summCard   = useSpringEntrance(frame, 56);

  // Gauge arc draw
  const arcLen = 400;
  const arcDash = usePathDraw(frame, 22, arcLen, 30);

  // Needle rotation (sweeps from -90 to +30 degrees)
  const needleAngle = interpolate(frame, [25, 55], [-90, 30], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.22, 1, 0.36, 1),
  });

  // Tick marks draw
  const tickLen = 60;
  const tick1Dash = usePathDraw(frame, 28, tickLen, 15);
  const tick2Dash = usePathDraw(frame, 32, tickLen, 15);
  const tick3Dash = usePathDraw(frame, 36, tickLen, 15);
  const tick4Dash = usePathDraw(frame, 40, tickLen, 15);
  const tick5Dash = usePathDraw(frame, 44, tickLen, 15);

  // ── Phase 3: Micro-animations ──────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse   = 1 + Math.sin(frame * 0.08) * 0.015;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  // Needle jitter at end position
  const jitter = frame > 55 ? Math.sin(frame * 0.3) * 1.5 : 0;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s07.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A — Section label ────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEntrance.translateY})`} opacity={labelEntrance.opacity}>
          <SectionLabel text="MODULE 6 · TASK STRUCTURE" y={160} opacity={0.8} />
        </g>

        {/* ── ZONE B — Headline ─────────────────────────────────────────── */}
        <g transform={`translate(0, ${headlineA.translateY})`} opacity={headlineA.opacity}>
          <text x={60} y={280} fontFamily={FONT} fontSize={76} fontWeight={800} fill={COLORS.white}>
            Measurable
          </text>
        </g>
        <g transform={`translate(0, ${headlineB.translateY})`} opacity={headlineB.opacity}>
          <text x={60} y={380} fontFamily={FONT} fontSize={76} fontWeight={800} fill={COLORS.accent}
            fontStyle="italic">
            Success Criterion
          </text>
        </g>

        {/* ── Gauge illustration ─────────────────────────────────────────── */}
        <g opacity={gaugeCard.opacity} transform={`translate(0, ${gaugeCard.translateY})`}>
          <BentoCard x={60} y={440} w={960} h={460} accent />

          {/* Gauge center point */}
          <g transform="translate(540, 720)">
            {/* Gauge arc (semi-circle opening upward) */}
            <path
              d="M -200,0 A 200,200 0 0,1 200,0"
              fill="none" stroke={COLORS.accent} strokeWidth={6}
              strokeDasharray={arcLen} strokeDashoffset={arcDash}
              strokeLinecap="round"
            />

            {/* Background arc track */}
            <path
              d="M -200,0 A 200,200 0 0,1 200,0"
              fill="none" stroke={COLORS.accent} strokeWidth={2} opacity={0.1}
            />

            {/* Tick marks around arc */}
            {[0, 1, 2, 3, 4].map((i) => {
              const angle = -180 + i * 45;
              const rad = (angle * Math.PI) / 180;
              const innerR = 170;
              const outerR = 200;
              const x1 = Math.cos(rad) * innerR;
              const y1 = Math.sin(rad) * innerR;
              const x2 = Math.cos(rad) * outerR;
              const y2 = Math.sin(rad) * outerR;
              const dashArr = [tick1Dash, tick2Dash, tick3Dash, tick4Dash, tick5Dash];
              return (
                <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
                  stroke={COLORS.accent} strokeWidth={2}
                  strokeDasharray={tickLen} strokeDashoffset={dashArr[i]}
                  strokeLinecap="round" />
              );
            })}

            {/* Tick labels */}
            <text x={-210} y={25} textAnchor="middle"
              fontFamily={FONT} fontSize={24} fontWeight={800} fill={COLORS.text_muted}>
              FAIL
            </text>
            <text x={0} y={-210} textAnchor="middle"
              fontFamily={FONT} fontSize={24} fontWeight={800} fill={COLORS.text_muted}>
              OKAY
            </text>
            <text x={210} y={25} textAnchor="middle"
              fontFamily={FONT} fontSize={24} fontWeight={800} fill={COLORS.accent}>
              PASS
            </text>

            {/* Needle */}
            <line x1={0} y1={0} x2={0} y2={-160}
              stroke={COLORS.white} strokeWidth={4} strokeLinecap="round"
              transform={`rotate(${needleAngle + jitter})`}
              style={{ transformOrigin: '0px 0px' }} />

            {/* Center hub */}
            <circle cx={0} cy={0} r={14} fill={COLORS.bg_secondary} stroke={COLORS.accent}
              strokeWidth={3} />
            <circle cx={0} cy={0} r={5} fill={COLORS.accent} />

            {/* Status label */}
            <text x={0} y={60} textAnchor="middle"
              fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent}>
              MEASURABLE
            </text>
          </g>
        </g>

        {/* ── Two metric cards ───────────────────────────────────────────── */}
        <g opacity={card1.opacity} transform={`translate(0, ${card1.translateY})`}>
          <BentoCard x={60} y={940} w={460} h={200} />
          <rect x={60} y={940} width={6} height={200} rx={3} fill={COLORS.accent} />
          {/* Checkmark icon */}
          <circle cx={120} cy={1020} r={24} fill={COLORS.accent} fillOpacity={0.12} />
          <path d="M 108,1020 L 116,1030 L 134,1008"
            fill="none" stroke={COLORS.accent} strokeWidth={3}
            strokeLinecap="round" strokeLinejoin="round" />
          <text x={160} y={1018} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            Binary / Boolean
          </text>
          <text x={100} y={1088} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            Pass or fail — no ambiguity
          </text>
        </g>

        <g opacity={card2.opacity} transform={`translate(0, ${card2.translateY})`}>
          <BentoCard x={560} y={940} w={460} h={200} accent />
          {/* Ruler icon */}
          <rect x={620} y={1000} width={80} height={12} rx={3}
            fill="none" stroke={COLORS.accent} strokeWidth={2} />
          <line x1={630} y1={1000} x2={630} y2={1012} stroke={COLORS.accent} strokeWidth={1.5} />
          <line x1={650} y1={1000} x2={650} y2={1008} stroke={COLORS.accent} strokeWidth={1} />
          <line x1={670} y1={1000} x2={670} y2={1012} stroke={COLORS.accent} strokeWidth={1.5} />
          <line x1={690} y1={1000} x2={690} y2={1008} stroke={COLORS.accent} strokeWidth={1} />
          <text x={620} y={1060} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.accent}>
            Quantifiable
          </text>
          <text x={600} y={1108} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            Counted, timed, or verified
          </text>
        </g>

        {/* ── Summary strip ──────────────────────────────────────────────── */}
        <g opacity={summCard.opacity} transform={`translate(0, ${summCard.translateY})`}>
          <BentoCard x={60} y={1180} w={960} h={130} />
          <text x={540} y={1260} textAnchor="middle"
            fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.white}>
            Without measurement, the agent never knows{' '}
            <tspan fill={COLORS.accent} fontStyle="italic">when to stop</tspan>
          </text>
        </g>

        {/* ── Floating particles ─────────────────────────────────────────── */}
        <g opacity={interpolate(frame, [50, 65], [0, 0.35], { extrapolateRight: 'clamp' })}>
          <circle cx={160} cy={1450 + breathe * 0.7} r={3} fill={COLORS.accent} opacity={0.3} />
          <circle cx={900} cy={1500 + breathe * 1.1} r={4} fill={COLORS.accent} opacity={0.25} />
          <circle cx={500} cy={1550 + breathe * 0.5} r={2.5} fill={COLORS.accent} opacity={0.3} />
          <circle cx={780} cy={1600 + breathe * 0.8} r={3} fill={COLORS.accent} opacity={0.2} />
        </g>

        {/* ── Pulsing success ring ───────────────────────────────────────── */}
        <g opacity={interpolate(frame, [55, 70], [0, 0.3], { extrapolateRight: 'clamp' })}
          transform={`translate(540, ${1650 + breathe})`}>
          <circle cx={0} cy={0} r={30} fill={COLORS.accent} fillOpacity={0.06 * shimmer} />
          <circle cx={0} cy={0} r={30} fill="none" stroke={COLORS.accent} strokeWidth={1.5}
            transform={`scale(${pulse})`} style={{ transformOrigin: '0px 0px' }} />
          <path d="M -10,0 L -3,8 L 12,-8" fill="none" stroke={COLORS.accent}
            strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
        </g>

        {/* ── CAPTION ────────────────────────────────────────────────────── */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s07.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
