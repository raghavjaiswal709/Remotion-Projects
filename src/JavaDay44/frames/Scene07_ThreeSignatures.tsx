/**
 * Scene 07 — Three Method Signatures
 * "In Java, you can write the same method name three times with different parameter signatures."
 * CSV: 24.760s → 29.960s
 * Duration: 178 frames (5.93s)
 *
 * Theme: Dark (#0D0D0D) + grid + Java accent (#D87656)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–25): label + headline spring
 *   Phase 2 (frames 20–100): Three stacked code-style cards build sequentially
 *   Phase 3 (frames 80–end): Connector path-draw between cards, pulsing highlights
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
import { DarkBackground, GlobalDefs, Caption, BentoCard } from '../helpers/components';

const FONT = "'Galaxie Copernicus ExtraBold', Georgia, serif";

const SPRING_CONFIG = { damping: 18, stiffness: 180, mass: 0.8 } as const;
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

function useCounter(frame: number, startFrame: number, endValue: number, durationFrames = 45) {
  const raw = interpolate(frame, [startFrame, startFrame + durationFrames], [0, endValue], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  return Math.round(raw);
}

export const Scene07_ThreeSignatures: React.FC = () => {
  const frame = useCurrentFrame();
  const fps   = 30;

  // ── Phase 1 ────────────────────────────────────────────────────────────────
  const label    = useSpringEntrance(frame, 0);
  const headline = useSpringEntrance(frame, 5);
  const subline  = useSpringEntrance(frame, 10);

  // ── Phase 2: Three method cards ────────────────────────────────────────────
  const card1 = useSpringEntrance(frame, 18);
  const card2 = useSpringEntrance(frame, 30);
  const card3 = useSpringEntrance(frame, 42);

  // ── Version counter ────────────────────────────────────────────────────────
  const versionCount = useCounter(frame, 20, 3, 40);

  // ── Connectors ─────────────────────────────────────────────────────────────
  const conn1 = usePathDraw(frame, 50, 80, 20);
  const conn2 = usePathDraw(frame, 60, 80, 20);

  // ── Info cards ─────────────────────────────────────────────────────────────
  const infoLeft  = useSpringEntrance(frame, 65);
  const infoRight = useSpringEntrance(frame, 72);
  const bottomBar = useSpringEntrance(frame, 80);

  // ── Phase 3 ────────────────────────────────────────────────────────────────
  const breathe   = Math.sin(frame * 0.05) * 4;
  const pulse     = 1 + Math.sin(frame * 0.07) * 0.015;
  const shimmer   = interpolate(Math.sin(frame * 0.04), [-1, 1], [0.85, 1]);
  const highlight = interpolate(Math.sin(frame * 0.1), [-1, 1], [0.5, 1]);

  // ── Border-draw for hero card ──────────────────────────────────────────────
  const heroPerim = 2 * (400 + 200);
  const heroBorder = usePathDraw(frame, 15, heroPerim, 30);

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s07.from);

  return (
    <AbsoluteFill style={{ background: COLORS.bg_primary }}>
      <svg style={{ position: 'absolute', inset: 0 }} width={1080} height={1920}>
        <DarkBackground />
        <GlobalDefs />

        {/* ── ZONE A ─────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${label.translateY})`} opacity={label.opacity}>
          <text x={60} y={160}
            fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent} letterSpacing="0.15em" opacity={0.8}>
            MODULE 3 · METHOD OVERLOADING
          </text>
        </g>

        {/* ── ZONE B ─────────────────────────────────────────────────────── */}
        <g transform={`translate(0, ${headline.translateY})`} opacity={headline.opacity}>
          <text x={60} y={310}
            fontFamily={FONT} fontSize={76} fontWeight={800}
            fill={COLORS.white}>
            Same Name
          </text>
        </g>
        <g transform={`translate(0, ${subline.translateY})`} opacity={subline.opacity}>
          <text x={60} y={400}
            fontFamily={FONT} fontSize={52} fontWeight={800}
            fill={COLORS.accent} fontStyle="italic">
            Three Signatures
          </text>
        </g>

        {/* ── Version counter (hero number) ──────────────────────────────── */}
        <g opacity={card1.opacity}>
          {/* Ghost */}
          <text x={920} y={380} textAnchor="middle"
            fontFamily={FONT} fontSize={200} fontWeight={800}
            fill={COLORS.accent} opacity={0.06}>
            {versionCount}
          </text>
          {/* Main */}
          <text x={920} y={360} textAnchor="middle"
            fontFamily={FONT} fontSize={140} fontWeight={800}
            fill={COLORS.accent}>
            {versionCount}
          </text>
          <text x={920} y={420} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.text_muted}>
            VERSIONS
          </text>
        </g>

        {/* ── ZONE C — Three method cards ────────────────────────────────── */}

        {/* Card 1: calculateFare(route) */}
        <g opacity={card1.opacity} transform={`translate(0, ${card1.translateY})`}>
          <BentoCard x={60} y={500} w={960} h={160} accent />
          <rect x={60} y={500} width={6} height={160} rx={3} fill={COLORS.accent} />
          <circle cx={120} cy={580} r={24}
            fill={COLORS.accent} fillOpacity={0.15}
            stroke={COLORS.accent} strokeWidth={2} />
          <text x={120} y={588} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent}>
            1
          </text>
          <text x={170} y={575}
            fontFamily={FONT} fontSize={38} fontWeight={800}
            fill={COLORS.white}>
            calculateFare(
            <tspan fill={COLORS.accent} fontStyle="italic">route</tspan>)
          </text>
          <text x={170} y={620}
            fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.text_muted}>
            Distance-only pricing
          </text>
        </g>

        {/* Connector 1 → 2 */}
        <path d="M 540,660 L 540,700"
          fill="none" stroke={COLORS.accent} strokeWidth={2}
          strokeDasharray={80} strokeDashoffset={conn1}
          markerEnd="url(#arrow)" />

        {/* Card 2: calculateFare(route, seatClass) */}
        <g opacity={card2.opacity} transform={`translate(0, ${card2.translateY})`}>
          <BentoCard x={60} y={700} w={960} h={160} />
          <rect x={60} y={700} width={6} height={160} rx={3} fill={COLORS.accent} />
          <circle cx={120} cy={780} r={24}
            fill={COLORS.accent} fillOpacity={0.15}
            stroke={COLORS.accent} strokeWidth={2} />
          <text x={120} y={788} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent}>
            2
          </text>
          <text x={170} y={775}
            fontFamily={FONT} fontSize={38} fontWeight={800}
            fill={COLORS.white}>
            calculateFare(
            <tspan fill={COLORS.accent} fontStyle="italic">route</tspan>,
            <tspan fill={COLORS.accent} fontStyle="italic"> seatClass</tspan>)
          </text>
          <text x={170} y={820}
            fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.text_muted}>
            Class-adjusted pricing
          </text>
        </g>

        {/* Connector 2 → 3 */}
        <path d="M 540,860 L 540,900"
          fill="none" stroke={COLORS.accent} strokeWidth={2}
          strokeDasharray={80} strokeDashoffset={conn2}
          markerEnd="url(#arrow)" />

        {/* Card 3: calculateFare(route, seatClass, isPeakHour) — highlighted */}
        <g opacity={card3.opacity} transform={`translate(0, ${card3.translateY})`}>
          {/* Border-draw animation */}
          <rect x={60} y={900} width={960} height={160} rx={20}
            fill={COLORS.bg_secondary}
            stroke={COLORS.accent} strokeWidth={2.5}
            strokeDasharray={heroPerim} strokeDashoffset={heroBorder} />
          <rect x={60} y={900} width={6} height={160} rx={3} fill={COLORS.accent} />
          <circle cx={120} cy={980} r={24}
            fill={COLORS.accent} fillOpacity={highlight * 0.3}
            stroke={COLORS.accent} strokeWidth={2} />
          <text x={120} y={988} textAnchor="middle"
            fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.accent}>
            3
          </text>
          <text x={170} y={970}
            fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.white}>
            calculateFare(
            <tspan fill={COLORS.accent} fontStyle="italic">route</tspan>,
            <tspan fill={COLORS.accent} fontStyle="italic"> class</tspan>,
            <tspan fill={COLORS.accent} fontStyle="italic"> isPeak</tspan>)
          </text>
          <text x={170} y={1020}
            fontFamily={FONT} fontSize={28} fontWeight={800}
            fill={COLORS.text_muted}>
            Full context: route + class + time-of-day
          </text>
        </g>

        {/* ── Info cards ──────────────────────────────────────────────────── */}
        <g opacity={infoLeft.opacity} transform={`translate(0, ${infoLeft.translateY})`}>
          <BentoCard x={60} y={1120} w={460} h={200} />
          <text x={100} y={1195}
            fontFamily={FONT} fontSize={40} fontWeight={800}
            fill={COLORS.accent}>
            Same Name
          </text>
          <text x={100} y={1250}
            fontFamily={FONT} fontSize={34} fontWeight={800}
            fill={COLORS.text_muted}>
            calculateFare()
          </text>
          <text x={100} y={1290}
            fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.text_muted} opacity={0.6}>
            consistent API surface
          </text>
        </g>
        <g opacity={infoRight.opacity} transform={`translate(0, ${infoRight.translateY})`}>
          <BentoCard x={560} y={1120} w={460} h={200} accent />
          <text x={600} y={1195}
            fontFamily={FONT} fontSize={40} fontWeight={800}
            fill={COLORS.white}>
            Different Params
          </text>
          <text x={600} y={1250}
            fontFamily={FONT} fontSize={34} fontWeight={800}
            fill={COLORS.accent}>
            1, 2, or 3 arguments
          </text>
          <text x={600} y={1290}
            fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.text_muted} opacity={0.6}>
            varied data context
          </text>
        </g>

        {/* ── Bottom summary bar ─────────────────────────────────────────── */}
        <g opacity={bottomBar.opacity} transform={`translate(0, ${bottomBar.translateY})`}>
          <BentoCard x={60} y={1380} w={960} h={120} />
          <text x={540} y={1455} textAnchor="middle"
            fontFamily={FONT} fontSize={34} fontWeight={800}
            fill={COLORS.text_muted}>
            Java resolves the correct version by <tspan fill={COLORS.accent} fontStyle="italic">parameter signature</tspan>
          </text>
        </g>

        {/* ── Floating accents ───────────────────────────────────────────── */}
        <g transform={`translate(160, ${1600 + breathe})`}>
          <circle cx={0} cy={0} r={22}
            fill={COLORS.accent} fillOpacity={0.04} />
        </g>
        <g transform={`translate(920, ${1580 + breathe * 0.7})`}>
          <circle cx={0} cy={0} r={28}
            fill={COLORS.accent} fillOpacity={0.05}
            transform={`scale(${pulse})`}
            style={{ transformOrigin: '0px 0px' }} />
        </g>

        {/* ── Divider ────────────────────────────────────────────────────── */}
        <line x1={60} y1={1540} x2={1020} y2={1540}
          stroke="rgba(255,255,255,0.06)" strokeWidth={1}
          opacity={bottomBar.opacity} />

        {/* ── Subtle bottom text ─────────────────────────────────────────── */}
        <g opacity={bottomBar.opacity * shimmer * 0.6}>
          <text x={540} y={1590} textAnchor="middle"
            fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.text_muted}>
            Write once, call with any data you have
          </text>
        </g>

        {/* ── Corner accents ─────────────────────────────────────────────── */}
        <g opacity={label.opacity * 0.35}>
          <path d="M 60,60 L 60,130 M 60,60 L 130,60" fill="none"
            stroke={COLORS.accent} strokeWidth={2.5} strokeLinecap="round" />
          <path d="M 1020,1740 L 1020,1670 M 1020,1740 L 950,1740" fill="none"
            stroke={COLORS.accent} strokeWidth={2.5} strokeLinecap="round" />
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
