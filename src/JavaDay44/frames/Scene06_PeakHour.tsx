/**
 * Scene 06 — Peak Hour Variant
 * "Sometimes it also knows whether it is peak hour."
 * CSV: 21.800s → 24.240s
 * Duration: 89 frames (2.97s)
 *
 * Theme: Dark (#0D0D0D) + grid + Java accent (#D87656)
 * Font: Galaxie Copernicus ExtraBold throughout
 *
 * Animation phases:
 *   Phase 1 (frames 0–20): label + headline entrance
 *   Phase 2 (frames 15–60): Clock SVG with animated hands, peak/off-peak comparison
 *   Phase 3 (frames 50–end): Clock tick, glow pulse, breathing
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

export const Scene06_PeakHour: React.FC = () => {
  const frame = useCurrentFrame();
  const fps   = 30;

  // ── Phase 1 ────────────────────────────────────────────────────────────────
  const label    = useSpringEntrance(frame, 0);
  const headline = useSpringEntrance(frame, 4);
  const subline  = useSpringEntrance(frame, 8);

  // ── Phase 2: Clock illustration ────────────────────────────────────────────
  const clockCard = useSpringEntrance(frame, 14);
  const clockRing = usePathDraw(frame, 16, 2 * Math.PI * 140, 25);

  // ── Clock hand rotation ────────────────────────────────────────────────────
  const hourAngle = interpolate(frame, [18, 60], [-30, 210], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.22, 1, 0.36, 1),
  });
  const minuteAngle = interpolate(frame, [18, 55], [0, 360], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    easing: Easing.bezier(0.22, 1, 0.36, 1),
  });

  // ── Comparison cards ───────────────────────────────────────────────────────
  const offPeakCard = useSpringEntrance(frame, 30);
  const peakCard    = useSpringEntrance(frame, 38);
  const methodCard  = useSpringEntrance(frame, 44);
  const detailCard  = useSpringEntrance(frame, 50);

  // ── Phase 3 ────────────────────────────────────────────────────────────────
  const breathe    = Math.sin(frame * 0.06) * 4;
  const pulse      = 1 + Math.sin(frame * 0.08) * 0.018;
  const peakGlow   = interpolate(Math.sin(frame * 0.12), [-1, 1], [0.5, 1]);
  const tickPulse  = Math.sin(frame * 0.5) > 0.8 ? 1 : 0.6;

  const caption = CAPTIONS.find(c => c.from === SCENE_TIMING.s06.from);

  // ── Clock tick marks ──────────────────────────────────────────────────────
  const tickMarks = Array.from({ length: 12 }, (_, i) => {
    const angle = (i * 30 - 90) * Math.PI / 180;
    const inner = 120;
    const outer = 136;
    return {
      x1: 540 + Math.cos(angle) * inner,
      y1: 780 + Math.sin(angle) * inner,
      x2: 540 + Math.cos(angle) * outer,
      y2: 780 + Math.sin(angle) * outer,
      isHour: i % 3 === 0,
    };
  });

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
            fontFamily={FONT} fontSize={80} fontWeight={800}
            fill={COLORS.white}>
            + Peak Hour
          </text>
        </g>
        <g transform={`translate(0, ${subline.translateY})`} opacity={subline.opacity}>
          <text x={60} y={400}
            fontFamily={FONT} fontSize={44} fontWeight={800}
            fill={COLORS.text_muted}>
            Time-of-day <tspan fill={COLORS.accent}>surcharge</tspan> applied
          </text>
        </g>

        {/* ── ZONE C — Clock illustration ────────────────────────────────── */}
        <g opacity={clockCard.opacity} transform={`translate(0, ${clockCard.translateY})`}>
          <BentoCard x={240} y={500} w={600} h={560} accent />

          {/* Clock outer ring with path-draw */}
          <circle cx={540} cy={780} r={140}
            fill="none" stroke={COLORS.accent} strokeWidth={4}
            strokeDasharray={2 * Math.PI * 140}
            strokeDashoffset={clockRing}
            strokeLinecap="round" />

          {/* Clock face background */}
          <circle cx={540} cy={780} r={130}
            fill={COLORS.bg_primary} fillOpacity={0.6} />

          {/* Tick marks */}
          {tickMarks.map((t, i) => (
            <line key={i}
              x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2}
              stroke={t.isHour ? COLORS.accent : COLORS.text_muted}
              strokeWidth={t.isHour ? 3 : 1.5}
              opacity={clockCard.opacity * (t.isHour ? 0.9 : 0.4)} />
          ))}

          {/* Hour markers */}
          {[12, 3, 6, 9].map((num, i) => {
            const angle = ((i * 90) - 90) * Math.PI / 180;
            const r = 106;
            return (
              <text key={num}
                x={540 + Math.cos(angle) * r}
                y={780 + Math.sin(angle) * r + 10}
                textAnchor="middle"
                fontFamily={FONT} fontSize={28} fontWeight={800}
                fill={COLORS.accent} opacity={clockCard.opacity * 0.7}>
                {num}
              </text>
            );
          })}

          {/* Hour hand */}
          <line x1={540} y1={780}
            x2={540 + Math.cos((hourAngle - 90) * Math.PI / 180) * 70}
            y2={780 + Math.sin((hourAngle - 90) * Math.PI / 180) * 70}
            stroke={COLORS.white} strokeWidth={5} strokeLinecap="round" />

          {/* Minute hand */}
          <line x1={540} y1={780}
            x2={540 + Math.cos((minuteAngle - 90) * Math.PI / 180) * 100}
            y2={780 + Math.sin((minuteAngle - 90) * Math.PI / 180) * 100}
            stroke={COLORS.accent} strokeWidth={3} strokeLinecap="round" />

          {/* Center dot */}
          <circle cx={540} cy={780} r={8}
            fill={COLORS.accent} opacity={tickPulse} />

          {/* PEAK badge */}
          <rect x={480} y={940} width={120} height={40} rx={10}
            fill={COLORS.accent} fillOpacity={peakGlow * 0.2}
            stroke={COLORS.accent} strokeWidth={1.5} />
          <text x={540} y={968} textAnchor="middle"
            fontFamily={FONT} fontSize={24} fontWeight={800}
            fill={COLORS.accent} opacity={peakGlow}>
            PEAK
          </text>

          {/* Outer glow ring */}
          <circle cx={540} cy={780} r={155}
            fill="none" stroke={COLORS.accent} strokeWidth={1}
            opacity={peakGlow * 0.2}
            transform={`scale(${pulse})`}
            style={{ transformOrigin: '540px 780px' }} />
        </g>

        {/* ── Comparison cards ───────────────────────────────────────────── */}
        <g opacity={offPeakCard.opacity} transform={`translate(0, ${offPeakCard.translateY})`}>
          <BentoCard x={60} y={1120} w={460} h={160} />
          <circle cx={100} cy={1200} r={16}
            fill="none" stroke={COLORS.text_muted} strokeWidth={2} />
          <text x={140} y={1195}
            fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.text_muted}>
            OFF-PEAK
          </text>
          <text x={140} y={1240}
            fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.text_muted} opacity={0.6}>
            Standard rate
          </text>
        </g>
        <g opacity={peakCard.opacity} transform={`translate(0, ${peakCard.translateY})`}>
          <BentoCard x={560} y={1120} w={460} h={160} accent />
          <circle cx={600} cy={1200} r={16}
            fill={COLORS.accent} fillOpacity={peakGlow * 0.4}
            stroke={COLORS.accent} strokeWidth={2} />
          <text x={640} y={1195}
            fontFamily={FONT} fontSize={36} fontWeight={800}
            fill={COLORS.accent}>
            PEAK HOUR
          </text>
          <text x={640} y={1240}
            fontFamily={FONT} fontSize={32} fontWeight={800}
            fill={COLORS.white}>
            Surcharge applied
          </text>
        </g>

        {/* ── Method signature card ──────────────────────────────────────── */}
        <g opacity={methodCard.opacity} transform={`translate(0, ${methodCard.translateY})`}>
          <BentoCard x={60} y={1320} w={960} h={140} accent />
          <rect x={60} y={1320} width={6} height={140} rx={3} fill={COLORS.accent} />
          <text x={100} y={1405}
            fontFamily={FONT} fontSize={38} fontWeight={800}
            fill={COLORS.white}>
            calculateFare(
            <tspan fill={COLORS.accent} fontStyle="italic">route</tspan>,
            <tspan fill={COLORS.accent} fontStyle="italic"> class</tspan>,
            <tspan fill={COLORS.accent} fontStyle="italic"> isPeak</tspan>)
          </text>
        </g>

        {/* ── Bottom detail ──────────────────────────────────────────────── */}
        <g opacity={detailCard.opacity} transform={`translate(0, ${detailCard.translateY})`}>
          <BentoCard x={60} y={1510} w={960} h={120} />
          <text x={540} y={1585} textAnchor="middle"
            fontFamily={FONT} fontSize={34} fontWeight={800}
            fill={COLORS.text_muted}>
            3 Parameters — <tspan fill={COLORS.accent}>fullest context</tspan> for accurate pricing
          </text>
        </g>

        {/* ── Floating ───────────────────────────────────────────────────── */}
        <g transform={`translate(140, ${1700 + breathe})`}>
          <circle cx={0} cy={0} r={18}
            fill={COLORS.accent} fillOpacity={0.04} />
        </g>
        <g transform={`translate(940, ${1680 + breathe * 0.8})`}>
          <circle cx={0} cy={0} r={22}
            fill={COLORS.accent} fillOpacity={0.05} />
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
            sceneDuration={SCENE_TIMING.s06.duration}
          />
        )}
      </svg>
    </AbsoluteFill>
  );
};
