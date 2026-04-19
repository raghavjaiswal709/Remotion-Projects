/**
 * Scene 18 — NoCriterionLost
 * "There is no criterion. The agent has no way to know when it is done."
 * CSV: 54.900s → 59.520s
 * Duration: ~147 frames
 *
 * Theme: Dark (#0D0D0D) + grid + AI accent (#76ABAE)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–25):   Label + headline spring
 *   Phase 2 (frames 20–80):  Broken gauge, lost agent robot
 *   Phase 3 (frames 70+):    Drifting particles, pulse, confusion orbit
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

export const Scene18_NoCriterionLost: React.FC = () => {
  const frame = useCurrentFrame();
  const fps   = 30;

  // ── Phase 1 ────────────────────────────────────────────────────────────────
  const labelE   = useSpringEntrance(frame, 0);
  const headA    = useSpringEntrance(frame, 5);
  const headB    = useSpringEntrance(frame, 10);

  // ── Phase 2 ────────────────────────────────────────────────────────────────
  const gaugeCard = useSpringEntrance(frame, 20);
  const robotCard = useSpringEntrance(frame, 34);
  const resultCard = useSpringEntrance(frame, 46);
  const bottomCard = useSpringEntrance(frame, 58);

  // Gauge needle wobble — never settles
  const needleAngle = -45 + Math.sin(frame * 0.14) * 45; // swings -90..0 range

  // Broken gauge arc dash
  const arcLen = 200;
  const arcDash = usePathDraw(frame, 24, arcLen, 20);

  // Strike-through X on "CRITERION"
  const xLen = 160;
  const xDash = usePathDraw(frame, 30, xLen, 15);

  // ── Phase 3 ────────────────────────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 4;
  const confusionOrbit = frame * 2.4;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.02;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.8, 1]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s18.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelE.translateY})`} opacity={labelE.opacity}>
          <SectionLabel text="COUNTER-EXAMPLE · MISSING CRITERION" y={160} opacity={0.8} />
        </g>

        {/* ── ZONE B ────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${headA.translateY})`} opacity={headA.opacity}>
          <text x={60} y={300} fontFamily={FONT} fontSize={72} fontWeight={800} fill={COLORS.white}>
            No Criterion
          </text>
        </g>
        <g transform={`translate(0, ${headB.translateY})`} opacity={headB.opacity}>
          <text x={60} y={380} fontFamily={FONT} fontSize={42} fontWeight={800} fill={COLORS.vibrant_red}>
            Agent cannot determine success or failure
          </text>
        </g>

        {/* ── Broken Gauge Card ──────────────────────────────────────────── */}
        <g opacity={gaugeCard.opacity} transform={`translate(0, ${gaugeCard.translateY})`}>
          <BentoCard x={60} y={440} w={500} h={440} />
          <rect x={60} y={440} width={6} height={440} rx={3} fill={COLORS.vibrant_red} />

          <text x={100} y={490} fontFamily={FONT} fontSize={26} fontWeight={800}
            fill={COLORS.vibrant_red} letterSpacing="0.12em">
            CRITERION
          </text>

          {/* Strike-through X on "CRITERION" */}
          <line x1={88} y1={478} x2={290} y2={478}
            stroke={COLORS.vibrant_red} strokeWidth={3}
            strokeDasharray={xLen} strokeDashoffset={xDash}
            strokeLinecap="round" />

          {/* Large broken gauge */}
          <g transform="translate(310, 680)">
            {/* Gauge arc background */}
            <path d="M -120,0 A 120,120 0 0,1 120,0"
              fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={14}
              strokeLinecap="round" />

            {/* Gauge arc (partial, broken) */}
            <path d="M -120,0 A 120,120 0 0,1 120,0"
              fill="none" stroke={COLORS.vibrant_red} strokeWidth={14}
              strokeDasharray={arcLen} strokeDashoffset={arcDash}
              strokeLinecap="round" opacity={0.4} />

            {/* Tick marks */}
            {[0, 1, 2, 3, 4, 5, 6].map((i) => {
              const angle = -180 + i * 30;
              const rad = (angle * Math.PI) / 180;
              return (
                <line key={i}
                  x1={Math.cos(rad) * 100} y1={Math.sin(rad) * 100}
                  x2={Math.cos(rad) * 115} y2={Math.sin(rad) * 115}
                  stroke="rgba(255,255,255,0.15)" strokeWidth={2} />
              );
            })}

            {/* Needle that wobbles — never settles */}
            <g transform={`rotate(${needleAngle})`} style={{ transformOrigin: '0px 0px' }}>
              <line x1={0} y1={0} x2={0} y2={-90}
                stroke={COLORS.vibrant_red} strokeWidth={3.5}
                strokeLinecap="round" />
              <circle cx={0} cy={-90} r={5} fill={COLORS.vibrant_red} />
            </g>

            {/* Center dot */}
            <circle cx={0} cy={0} r={8} fill={COLORS.vibrant_red} />

            {/* Labels */}
            <text x={-110} y={30} fontFamily={FONT} fontSize={18} fontWeight={800}
              fill={COLORS.text_muted}>FAIL</text>
            <text x={60} y={30} fontFamily={FONT} fontSize={18} fontWeight={800}
              fill={COLORS.text_muted}>PASS</text>

            {/* "???" below needle */}
            <text x={0} y={60} textAnchor="middle"
              fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.vibrant_red}>
              ???
            </text>
          </g>

          <text x={100} y={820} fontFamily={FONT} fontSize={24} fontWeight={800} fill={COLORS.text_muted}>
            No measurable threshold
          </text>
          <text x={100} y={850} fontFamily={FONT} fontSize={24} fontWeight={800} fill={COLORS.text_muted}>
            Needle never stops moving
          </text>
        </g>

        {/* ── Robot lost card ────────────────────────────────────────────── */}
        <g opacity={robotCard.opacity} transform={`translate(0, ${robotCard.translateY})`}>
          <BentoCard x={600} y={440} w={420} h={440} accent />

          <text x={640} y={490} fontFamily={FONT} fontSize={26} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.12em">
            AGENT STATE
          </text>

          {/* Robot silhouette — lost/confused */}
          <g transform={`translate(810, 680) scale(${pulse})`}
            style={{ transformOrigin: '0px 0px' }}>
            {/* Head */}
            <rect x={-40} y={-80} width={80} height={70} rx={12}
              fill={COLORS.bg_primary} stroke={COLORS.accent} strokeWidth={2} />
            {/* Eyes — X marks (confused) */}
            <g opacity={shimmer}>
              <line x1={-18} y1={-54} x2={-6} y2={-42}
                stroke={COLORS.vibrant_red} strokeWidth={3} strokeLinecap="round" />
              <line x1={-6} y1={-54} x2={-18} y2={-42}
                stroke={COLORS.vibrant_red} strokeWidth={3} strokeLinecap="round" />
              <line x1={6} y1={-54} x2={18} y2={-42}
                stroke={COLORS.vibrant_red} strokeWidth={3} strokeLinecap="round" />
              <line x1={18} y1={-54} x2={6} y2={-42}
                stroke={COLORS.vibrant_red} strokeWidth={3} strokeLinecap="round" />
            </g>
            {/* Body */}
            <rect x={-50} y={-4} width={100} height={90} rx={10}
              fill={COLORS.bg_primary} stroke={COLORS.accent} strokeWidth={2} />
            {/* Antennae */}
            <line x1={0} y1={-80} x2={0} y2={-100}
              stroke={COLORS.accent} strokeWidth={2} />
            <circle cx={0} cy={-104} r={5} fill={COLORS.accent} />

            {/* Confusion orbiting question marks */}
            {[0, 1, 2].map(i => {
              const a = ((confusionOrbit + i * 120) * Math.PI) / 180;
              return (
                <text key={i}
                  x={Math.cos(a) * 65} y={-48 + Math.sin(a) * 25}
                  textAnchor="middle" fontFamily={FONT}
                  fontSize={24} fontWeight={800} fill={COLORS.vibrant_red}
                  opacity={0.6}>
                  ?
                </text>
              );
            })}
          </g>

          <text x={640} y={810} fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.white}>
            "Am I done?"
          </text>
          <text x={640} y={848} fontFamily={FONT} fontSize={24} fontWeight={800} fill={COLORS.text_muted}>
            No criterion to check against
          </text>
        </g>

        {/* ── Result bar ─────────────────────────────────────────────────── */}
        <g opacity={resultCard.opacity} transform={`translate(0, ${resultCard.translateY})`}>
          <BentoCard x={60} y={920} w={960} h={160} />
          <rect x={60} y={920} width={960} height={160} rx={20}
            fill="none" stroke={COLORS.vibrant_red} strokeWidth={1.5}
            strokeDasharray="12,8" opacity={0.4} />

          {/* Three status blocks — all "???" */}
          {['Cheapest?', 'Shortest?', 'Best?'].map((label, i) => {
            const bx = 120 + i * 300;
            return (
              <g key={i}>
                <rect x={bx} y={950} width={220} height={100} rx={10}
                  fill={COLORS.bg_primary} stroke="rgba(255,255,255,0.06)" strokeWidth={1} />
                <text x={bx + 110} y={995} textAnchor="middle"
                  fontFamily={FONT} fontSize={32} fontWeight={800} fill={COLORS.vibrant_red}>
                  ???
                </text>
                <text x={bx + 110} y={1030} textAnchor="middle"
                  fontFamily={FONT} fontSize={20} fontWeight={800} fill={COLORS.text_muted}>
                  {label}
                </text>
              </g>
            );
          })}
        </g>

        {/* ── Bottom insight card ─────────────────────────────────────────── */}
        <g opacity={bottomCard.opacity} transform={`translate(0, ${bottomCard.translateY})`}>
          <BentoCard x={60} y={1120} w={960} h={220} />

          {/* Warning triangle */}
          <g transform="translate(130, 1230)">
            <polygon points="0,-30 28,20 -28,20"
              fill="none" stroke={COLORS.vibrant_red} strokeWidth={2.5}
              strokeLinejoin="round" />
            <text x={0} y={12} textAnchor="middle"
              fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.vibrant_red}>
              !
            </text>
          </g>

          <text x={180} y={1210} fontFamily={FONT} fontSize={36} fontWeight={800} fill={COLORS.white}>
            Without criterion: no halt
          </text>
          <text x={180} y={1254} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            The agent loops forever — searching, comparing,
          </text>
          <text x={180} y={1290} fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.text_muted}>
            re-searching — but never confirming "done"
          </text>
        </g>

        {/* ── Drifting particles ──────────────────────────────────────────── */}
        <g opacity={shimmer * 0.2}>
          <circle cx={180} cy={1420 + breathe} r={3} fill={COLORS.vibrant_red} />
          <circle cx={880} cy={1500 + breathe * 0.9} r={2} fill={COLORS.accent} />
          <circle cx={540} cy={1580 + breathe * 1.1} r={2.5} fill={COLORS.vibrant_red} />
          <circle cx={360} cy={1660 + breathe * 0.7} r={2} fill={COLORS.accent} />
          <circle cx={720} cy={1700 + breathe * 1.3} r={3} fill={COLORS.vibrant_red} opacity={0.4} />
        </g>

        {/* ── CAPTION ────────────────────────────────────────────────────── */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s18.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
