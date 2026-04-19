/**
 * Scene 14 — CriterionExample
 * "Success criterion, cheapest three candidates, shortest layover selected."
 * CSV: 42.640s → 46.560s
 * Duration: ~141 frames
 *
 * Theme: Dark (#0D0D0D) + grid + AI accent (#76ABAE)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–25):   Label + headline spring
 *   Phase 2 (frames 18–80):  Criterion funnel — 3-stage filter diagram
 *   Phase 3 (frames 60+):    Pulse on result, float particles, shimmer
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

export const Scene14_CriterionExample: React.FC = () => {
  const frame = useCurrentFrame();
  const fps   = 30;

  // ── Phase 1 ────────────────────────────────────────────────────────────────
  const labelEntrance = useSpringEntrance(frame, 0);
  const headlineA     = useSpringEntrance(frame, 5);
  const headlineB     = useSpringEntrance(frame, 10);
  const badgeEntrance = useSpringEntrance(frame, 8);

  // ── Phase 2 — Funnel stages ────────────────────────────────────────────────
  const stage1 = useSpringEntrance(frame, 18);
  const stage2 = useSpringEntrance(frame, 32);
  const stage3 = useSpringEntrance(frame, 46);
  const resultCard = useSpringEntrance(frame, 60);

  // Connector arrows
  const arrow1Len = 80;
  const arrow1Dash = usePathDraw(frame, 28, arrow1Len, 14);
  const arrow2Len = 80;
  const arrow2Dash = usePathDraw(frame, 42, arrow2Len, 14);

  // Result ring
  const ringLen = Math.PI * 2 * 36;
  const ringDash = usePathDraw(frame, 56, ringLen, 16);

  // Checkmark
  const checkLen = 50;
  const checkDash = usePathDraw(frame, 62, checkLen, 12);

  // ── Phase 3 ────────────────────────────────────────────────────────────────
  const breathe = Math.sin(frame * 0.06) * 4;
  const pulse   = 1 + Math.sin(frame * 0.08) * 0.02;
  const shimmer = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s14.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${labelEntrance.translateY})`} opacity={labelEntrance.opacity}>
          <SectionLabel text="MODULE 6 · TASK COMPONENT 3" y={160} opacity={0.8} />
        </g>

        {/* ── ZONE B ────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${headlineA.translateY})`} opacity={headlineA.opacity}>
          <text x={60} y={290} fontFamily={FONT} fontSize={72} fontWeight={800} fill={COLORS.white}>
            Success Criterion
          </text>
        </g>
        <g transform={`translate(0, ${headlineB.translateY})`} opacity={headlineB.opacity}>
          <text x={60} y={390} fontFamily={FONT} fontSize={48} fontWeight={800} fill={COLORS.text_muted}>
            How the agent measures completion
          </text>
        </g>

        {/* ── "CRITERION" Badge ──────────────────────────────────────────── */}
        <g transform={`translate(0, ${badgeEntrance.translateY})`} opacity={badgeEntrance.opacity}>
          <rect x={60} y={430} width={180} height={44} rx={22}
            fill={COLORS.accent} fillOpacity={0.12}
            stroke={COLORS.accent} strokeWidth={1.5} />
          <text x={150} y={459} textAnchor="middle"
            fontFamily={FONT} fontSize={20} fontWeight={800} fill={COLORS.accent}>
            CRITERION
          </text>
        </g>

        {/* ── Stage 1 — All flights searched ─────────────────────────────── */}
        <g opacity={stage1.opacity} transform={`translate(0, ${stage1.translateY})`}>
          <BentoCard x={60} y={510} w={960} h={180} />

          {/* Funnel wide top indicator */}
          <polygon points="100,530 980,530 920,670 140,670"
            fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={1} />

          {/* Step number */}
          <circle cx={120} cy={600} r={28}
            fill={COLORS.accent} fillOpacity={0.12}
            stroke={COLORS.accent} strokeWidth={2} />
          <text x={120} y={608} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.accent}>
            1
          </text>

          <text x={165} y={585} fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.white}>
            Search all flights DEL → LHR
          </text>
          <text x={165} y={625} fontFamily={FONT} fontSize={26} fontWeight={800} fill={COLORS.text_muted}>
            Hundreds of results from all airlines
          </text>

          {/* Mini flight icons */}
          {Array.from({ length: 8 }, (_, i) => (
            <g key={i} transform={`translate(${640 + i * 42}, 600)`} opacity={0.3}>
              <path d="M 0,-4 L 8,0 L 0,4 Z" fill={COLORS.text_muted} />
              <rect x={-10} y={-2} width={10} height={4} rx={1} fill={COLORS.text_muted} />
            </g>
          ))}
        </g>

        {/* ── Arrow 1 ────────────────────────────────────────────────────── */}
        <g opacity={stage1.opacity}>
          <path d="M 540,700 L 540,740"
            fill="none" stroke={COLORS.accent} strokeWidth={2.5}
            strokeLinecap="round" markerEnd="url(#arrow)"
            strokeDasharray={arrow1Len} strokeDashoffset={arrow1Dash} />
        </g>

        {/* ── Stage 2 — Filter to 3 cheapest ─────────────────────────────── */}
        <g opacity={stage2.opacity} transform={`translate(0, ${stage2.translateY})`}>
          <BentoCard x={120} y={760} w={840} h={190} accent />

          {/* Step number */}
          <circle cx={180} cy={855} r={28}
            fill={COLORS.accent} fillOpacity={0.12}
            stroke={COLORS.accent} strokeWidth={2} />
          <text x={180} y={863} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.accent}>
            2
          </text>

          <text x={225} y={835} fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.white}>
            Filter: 3 cheapest candidates
          </text>
          <text x={225} y={880} fontFamily={FONT} fontSize={26} fontWeight={800} fill={COLORS.text_muted}>
            Sort by price, take top 3
          </text>

          {/* 3 mini ticket cards */}
          {['$412', '$428', '$455'].map((price, i) => (
            <g key={i} transform={`translate(${640 + i * 110}, 830)`}>
              <rect x={-40} y={-22} width={80} height={44} rx={8}
                fill={COLORS.bg_primary}
                stroke={COLORS.accent} strokeWidth={1.5} />
              <text x={0} y={6} textAnchor="middle"
                fontFamily={FONT} fontSize={20} fontWeight={800} fill={COLORS.accent}>
                {price}
              </text>
            </g>
          ))}
        </g>

        {/* ── Arrow 2 ────────────────────────────────────────────────────── */}
        <g opacity={stage2.opacity}>
          <path d="M 540,960 L 540,1000"
            fill="none" stroke={COLORS.accent} strokeWidth={2.5}
            strokeLinecap="round" markerEnd="url(#arrow)"
            strokeDasharray={arrow2Len} strokeDashoffset={arrow2Dash} />
        </g>

        {/* ── Stage 3 — Select shortest layover ──────────────────────────── */}
        <g opacity={stage3.opacity} transform={`translate(0, ${stage3.translateY})`}>
          <BentoCard x={200} y={1020} w={680} h={190} accent />

          {/* Step number */}
          <circle cx={260} cy={1115} r={28}
            fill={COLORS.accent} fillOpacity={0.12}
            stroke={COLORS.accent} strokeWidth={2} />
          <text x={260} y={1123} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800} fill={COLORS.accent}>
            3
          </text>

          <text x={305} y={1095} fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.white}>
            Select: shortest layover
          </text>
          <text x={305} y={1140} fontFamily={FONT} fontSize={26} fontWeight={800} fill={COLORS.accent}
            fontStyle="italic">
            1h 45m — British Airways — $428
          </text>

          {/* Winner circle indicator */}
          <g transform={`translate(800, 1115) scale(${pulse})`}
            style={{ transformOrigin: '0px 0px' }}>
            <circle cx={0} cy={0} r={28}
              fill={COLORS.accent} fillOpacity={0.1}
              stroke={COLORS.accent} strokeWidth={2.5}
              strokeDasharray={ringLen} strokeDashoffset={ringDash} />
            <path d="M -10,2 L -2,12 L 12,-8"
              fill="none" stroke={COLORS.accent} strokeWidth={3}
              strokeLinecap="round" strokeLinejoin="round"
              strokeDasharray={checkLen} strokeDashoffset={checkDash} />
          </g>
        </g>

        {/* ── Result summary card ────────────────────────────────────────── */}
        <g opacity={resultCard.opacity} transform={`translate(0, ${resultCard.translateY})`}>
          <BentoCard x={60} y={1260} w={960} h={160} />
          <rect x={60} y={1260} width={6} height={160} rx={3} fill={COLORS.accent} />

          {/* Target/bullseye icon */}
          <g transform="translate(110, 1340)">
            <circle cx={0} cy={0} r={20} fill="none" stroke={COLORS.accent} strokeWidth={2} />
            <circle cx={0} cy={0} r={12} fill="none" stroke={COLORS.accent} strokeWidth={1.5} opacity={0.6} />
            <circle cx={0} cy={0} r={4} fill={COLORS.accent} />
          </g>

          <text x={155} y={1320} fontFamily={FONT} fontSize={34} fontWeight={800} fill={COLORS.white}>
            Measurable success criterion applied
          </text>
          <text x={155} y={1365} fontFamily={FONT} fontSize={26} fontWeight={800} fill={COLORS.text_muted}>
            Agent can verify: did it match these exact conditions?
          </text>
          <text x={155} y={1400} fontFamily={FONT} fontSize={24} fontWeight={800} fill={COLORS.accent}>
            Binary: pass or fail — no ambiguity
          </text>
        </g>

        {/* ── Floating particles ──────────────────────────────────────────── */}
        <g opacity={shimmer * 0.25}>
          <circle cx={180} cy={1520 + breathe} r={3} fill={COLORS.accent} />
          <circle cx={900} cy={1580 + breathe * 0.7} r={2.5} fill={COLORS.accent} />
          <circle cx={460} cy={1650 + breathe * 1.1} r={2} fill={COLORS.accent} />
          <circle cx={700} cy={1710 + breathe * 0.5} r={3} fill={COLORS.accent} opacity={0.2} />
        </g>

        {/* ── CAPTION ────────────────────────────────────────────────────── */}
        {caption && (
          <Caption
            text={caption.text}
            keyWords={caption.keyWords}
            frame={frame}
            sceneFrom={0}
            sceneDuration={SCENE_TIMING.s14.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
